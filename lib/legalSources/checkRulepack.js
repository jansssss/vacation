// 룰팩 최신성 점검(Phase 3): 룰팩의 legal_sources에 저장된 조문 해시·개정일을 law.go.kr에서
// 다시 조회한 값과 비교해 "변경이 있었는지"만 감지한다.
//
// 설계 원칙 (사용자 확인 사항):
//   1. 이 단계는 "판단"하지 않는다. 변경 여부와 변경 유형만 표시하고, 실제 수정·시행 여부는
//      Phase 4(AI 초안) + 운영자 승인으로 넘긴다.
//   2. 자동 점검 가능한 것은 조문형(law / enforcement_decree / enforcement_rule)뿐이다.
//      판례·행정해석·고시(notice) 등은 조문 해시 비교로 판단할 수 없어 manual_check_required로 남긴다.
//   3. 시행일(effective_date)이 아니라 조문 본문 해시와 개정 공포일(amendment_date)을 비교한다.
//      법 전체 스냅샷 날짜(law_snapshot_effective_date)는 비교 기준으로 쓰지 않는다.

import { getArticleText } from './lawGoKrClient.js'
import { hashLegalText } from './hashText.js'

const AUTO_CHECKABLE_TYPES = new Set(['law', 'enforcement_decree', 'enforcement_rule'])

// 한 개의 legal_source를 점검한다.
async function checkSource(source) {
  const base = {
    law_name: source.law_name ?? null,
    article: source.article ?? null,
    source_type: source.source_type ?? null,
    official_source_id: source.official_source_id ?? null,
  }

  // 자동 점검 불가: 판례/행정해석/고시 등, 또는 MST가 없어 조회 불가
  if (!AUTO_CHECKABLE_TYPES.has(source.source_type) || !source.official_source_id) {
    return {
      ...base,
      status: 'manual_check_required',
      reason:
        !AUTO_CHECKABLE_TYPES.has(source.source_type)
          ? `${source.source_type ?? '유형 미상'}은 조문 해시 비교로 자동 점검할 수 없습니다.`
          : '법령 식별자(MST)가 없어 자동 조회할 수 없습니다.',
    }
  }

  let article
  try {
    article = await getArticleText({ mst: source.official_source_id, articleLabel: source.article })
  } catch (err) {
    return { ...base, status: 'fetch_failed', reason: err?.message ?? String(err) }
  }

  if (!article.text) {
    return { ...base, status: 'fetch_failed', reason: '조문 본문을 추출하지 못했습니다(구조 변경 가능성).' }
  }

  const latestHash = hashLegalText(article.text)
  const storedHash = source.last_verified_text_hash ?? null

  // 변경 감지의 유일한 트리거는 "조문 본문 해시"다. law.go.kr은 조(條) 단위로만 조회되므로
  // 해시도 조 단위이며, 이는 우리가 참조하는 조문이 "실제로 바뀌었는지"에 대한 가장 직접적인 증거다.
  //
  // 주의: amendment_date를 트리거로 쓰지 않는다. 우리는 legal_sources를 항(項) 단위로도 저장하는데
  // (예: 제19조제1항 vs 제19조제2항), API가 주는 개정일은 조 전체 기준이라 granularity가 어긋난다.
  // (예: 제1항 개정일 2014 < 조 전체 최신 개정일 2024 를 "새 개정"으로 오탐) 따라서 개정일은
  // 참고 정보로만 노출하고, 실제 변경 판단은 해시로만 한다. 항 하나만 바뀌어도 같은 조를 참조하는
  // 모든 소스가 함께 flag되는데, 이는 누락(under-flag)이 아니라 과다 알림(over-flag)이라 안전하다.
  const textChanged = storedHash != null && latestHash !== storedHash

  const latest = {
    hash: latestHash,
    // 아래는 조 전체 기준의 참고값(항 단위 stored.amendment_date와 직접 비교 금지)
    article_latest_amendment_date: article.latestAmendmentDate,
    all_amendment_dates: article.amendmentDates,
    law_snapshot_effective_date: article.lawSnapshotEffectiveDate,
    article_title: article.title,
  }
  const stored = { hash: storedHash, amendment_date: source.amendment_date ?? null }

  if (storedHash == null) {
    // 이전 해시가 없으면 비교 불가 — 이번에 기준값을 확보한 것으로 보고 확인 필요로 표시
    return { ...base, status: 'baseline_missing', reason: '저장된 기준 해시가 없어 비교할 수 없습니다.', stored, latest }
  }

  if (textChanged) {
    return { ...base, status: 'changed', reason: '조문 본문 변경(해시 불일치)', stored, latest }
  }

  return { ...base, status: 'up_to_date', stored, latest }
}

// 룰팩 content 전체를 점검한다. onProgress(current, total, label)로 진행률을 흘려보낼 수 있다.
export async function checkRulepack(rulepackContent, { onProgress } = {}) {
  const rules = rulepackContent?.rules ?? []
  const tasks = []
  for (const rule of rules) {
    for (const source of rule.legal_sources ?? []) {
      tasks.push({ rule, source })
    }
  }

  const results = []
  let done = 0
  for (const { rule, source } of tasks) {
    const label = `${rule.id} · ${source.law_name ?? ''} ${source.article ?? ''}`.trim()
    if (onProgress) onProgress(done, tasks.length, label)
    const result = await checkSource(source)
    results.push({ rule_id: rule.id, rule_title: rule.title, ...result })
    done += 1
  }
  if (onProgress) onProgress(done, tasks.length, '완료')

  const summary = results.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1
      return acc
    },
    {}
  )

  // 근거가 아직 하나도 없는 규칙(판례/행정발표형 등, legal_sources 미보유)도 별도로 알린다.
  const rulesWithoutSources = rules.filter((r) => !(r.legal_sources?.length > 0)).map((r) => r.id)

  return {
    checked_at: new Date().toISOString(),
    rulepack_version: rulepackContent?.meta?.version ?? null,
    total_sources: tasks.length,
    summary,
    needs_attention: results.some((r) => r.status === 'changed' || r.status === 'fetch_failed'),
    results,
    rules_without_sources: rulesWithoutSources,
  }
}
