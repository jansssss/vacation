// 조문형 규칙(법령명+조 번호가 명확한 것들)에 대해 law.go.kr Open API로 실제 조문을 조회해
// legal_sources[]를 채운 룰팩 draft 버전(1.2)을 만든다(이미 있으면 갱신).
//
// 판례/행정발표/요율고시 성격의 규칙(R02,R03,R07,R10,R12,R15)은 API로 조문 하나를 특정할 수
// 없어 이번 배치에서 제외한다(legal_sources 없이 그대로 둠). 나중에 별도 방식으로 처리.
//
// 날짜 필드 3종을 반드시 구분한다 (법률 단위 시행일 ≠ 개별 조문 개정 시행일):
//   - law_snapshot_effective_date : API가 돌려주는 "법령 전체가 현재 어느 시행 버전으로
//     편집돼 있는지"의 스냅샷 날짜. 이 조문이 그날 바뀌었다는 뜻이 아니다. 참고용으로만 저장.
//   - amendment_date              : 조문 본문에 박힌 <개정 YYYY.MM.DD> 표기에서 뽑은 "공포일".
//     텍스트에 실제로 적혀 있는 사실이라 자동 추출해도 안전하다.
//   - amendment_effective_date    : 그 개정이 실제로 "시행"된 날짜(부칙 기준). 공포일과 다를 수
//     있고, 이 API만으로는 신뢰성 있게 뽑을 수 없다 — MANUAL_OVERRIDES로 사람이 확인한 값만
//     넣고, 없으면 null + verified:false로 정직하게 남긴다.
//
// 사용법: node scripts/populate-legal-sources.mjs

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import { searchLaw, getArticleText } from '../lib/legalSources/lawGoKrClient.js'
import { hashLegalText, normalizeLegalText } from '../lib/legalSources/hashText.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
}

const RULE_LEGAL_SOURCES = {
  R01: [
    { lawName: '근로기준법', article: '제93조' },
    { lawName: '근로기준법', article: '제116조' },
  ],
  R04: [{ lawName: '근로기준법', article: '제48조' }],
  R05: [
    { lawName: '근로기준법', article: '제17조' },
    { lawName: '기간제 및 단시간근로자 보호 등에 관한 법률', article: '제17조' },
  ],
  R06: [
    { lawName: '근로기준법', article: '제37조' },
    { lawName: '근로기준법 시행령', article: '제17조' },
    { lawName: '근로기준법', article: '제43조의8' },
  ],
  R08: [{ lawName: '근로기준법', article: '제61조' }],
  R09: [
    { lawName: '근로기준법', article: '제76조의2' },
    { lawName: '근로기준법', article: '제76조의3' },
    { lawName: '근로기준법', article: '제93조' },
  ],
  R11: [{ lawName: '근로기준법 시행령', article: '제7조의2' }],
  // R13a: 육아휴직 — 조 하나에 성격이 다른 두 규정이 섞여 있어 별도 항목으로 분리.
  R13a: [
    {
      lawName: '남녀고용평등과 일·가정 양립 지원에 관한 법률',
      article: '제19조',
      articleDisplay: '제19조제1항',
      note: '육아휴직 대상 자녀 연령 기준(만 8세 이하 또는 초등학교 2학년 이하)',
      manualAmendment: { amendmentDate: '2014-01-14', amendmentEffectiveDate: '2014-01-14' },
    },
    {
      lawName: '남녀고용평등과 일·가정 양립 지원에 관한 법률',
      article: '제19조',
      articleDisplay: '제19조제2항',
      note: '부모 각 3개월 이상 사용ㆍ한부모ㆍ장애아동 부모 6개월 추가 사용 특례',
      manualAmendment: { amendmentDate: '2024-10-22', amendmentEffectiveDate: '2025-02-23' },
    },
  ],
  R13b: [
    {
      lawName: '남녀고용평등과 일·가정 양립 지원에 관한 법률',
      article: '제19조의2',
      articleDisplay: '제19조의2제1항',
      note: '육아기 근로시간 단축 대상 연령을 만 12세 이하 또는 초등학교 6학년 이하로 확대',
      manualAmendment: { amendmentDate: '2024-10-22', amendmentEffectiveDate: '2025-02-23' },
    },
  ],
  R14: [
    { lawName: '노동조합 및 노동관계조정법', article: '제2조' },
    { lawName: '노동조합 및 노동관계조정법', article: '제3조' },
  ],
}

function sourceTypeFor(lawName) {
  if (lawName.includes('시행령')) return 'enforcement_decree'
  if (lawName.includes('시행규칙')) return 'enforcement_rule'
  return 'law'
}

const mstCache = new Map()

async function resolveMst(lawName) {
  if (mstCache.has(lawName)) return mstCache.get(lawName)
  const result = await searchLaw(lawName)
  const exact = result.candidates.find((c) => c.name === lawName) ?? result.candidates[0]
  if (!exact?.mst) {
    throw new Error(`"${lawName}" 법령을 law.go.kr에서 찾지 못했습니다.`)
  }
  mstCache.set(lawName, exact)
  return exact
}

async function main() {
  if (!process.env.LAW_GO_KR_OC) {
    console.error('LAW_GO_KR_OC 환경변수가 없습니다.')
    process.exit(1)
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    console.error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경변수가 없습니다.')
    process.exit(1)
  }
  const admin = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

  const { data: activeVersion, error: activeError } = await admin
    .from('rulepack_versions')
    .select('id, version_label, content')
    .eq('is_active', true)
    .single()

  if (activeError || !activeVersion) {
    console.error('활성 룰팩 버전을 찾지 못했습니다.', activeError?.message)
    process.exit(1)
  }

  console.log(`활성 버전(기반): ${activeVersion.version_label} (id=${activeVersion.id})`)

  const newContent = JSON.parse(JSON.stringify(activeVersion.content))
  const today = new Date().toISOString().slice(0, 10)
  const summary = []

  for (const rule of newContent.rules) {
    const specs = RULE_LEGAL_SOURCES[rule.id]
    if (!specs) continue

    const legalSources = []
    for (const spec of specs) {
      const label = spec.articleDisplay ?? spec.article
      console.log(`  조회 중: ${rule.id} - ${spec.lawName} ${label}`)
      const lawInfo = await resolveMst(spec.lawName)
      const article = await getArticleText({ mst: lawInfo.mst, articleLabel: spec.article })

      if (!article.text) {
        console.warn(`    경고: ${spec.lawName} ${label} 텍스트를 못 가져왔습니다. 건너뜁니다.`)
        continue
      }

      legalSources.push({
        source_type: sourceTypeFor(spec.lawName),
        law_name: spec.lawName,
        official_source_id: lawInfo.mst,
        article: label,
        note: spec.note ?? null,
        amendment_date: spec.manualAmendment?.amendmentDate ?? article.latestAmendmentDate ?? null,
        amendment_effective_date: spec.manualAmendment?.amendmentEffectiveDate ?? null,
        amendment_effective_date_verified: Boolean(spec.manualAmendment),
        law_snapshot_effective_date: article.lawSnapshotEffectiveDate,
        last_checked_at: today,
        last_verified_text_hash: hashLegalText(article.text),
        // 변경 감지 시 AI에 "신구 비교"를 넘기려면 바뀌기 전 원문이 필요하다. 정규화한 조 전체
        // 텍스트를 저장한다(진단 프롬프트에서는 legal_sources 전체가 제외되므로 토큰 영향 없음).
        last_verified_text: normalizeLegalText(article.text),
        source_url: `https://www.law.go.kr/DRF/lawService.do?target=law&MST=${lawInfo.mst}&type=HTML`,
      })
    }

    if (legalSources.length > 0) {
      rule.legal_sources = legalSources
      summary.push({ rule_id: rule.id, sources: legalSources.length })
    }
  }

  newContent.meta.version = '1.2'
  newContent.meta.basis_date = today

  const changeSummary =
    '조문형 규칙(R01,R04,R05,R06,R08,R09,R11,R13a,R13b,R14)에 law.go.kr 실 조문 조회 결과로 ' +
    'legal_sources[] 추가. law_snapshot_effective_date(법 전체 스냅샷)와 amendment_date(조문 개정 ' +
    '공포일), amendment_effective_date(실제 시행일)를 분리해서 저장. R13a/R13b는 운영자가 직접 ' +
    '확인한 시행일(2025-02-23)을 반영함. 판례/행정발표/고시형 규칙은 미포함.'

  const { data: existingDraft } = await admin
    .from('rulepack_versions')
    .select('id')
    .eq('version_label', '1.2')
    .maybeSingle()

  if (existingDraft) {
    const { error: updateError } = await admin
      .from('rulepack_versions')
      .update({ content: newContent, change_summary: changeSummary })
      .eq('id', existingDraft.id)

    if (updateError) {
      console.error('draft 버전 갱신 실패:', updateError.message)
      process.exit(1)
    }
    console.log('\n=== 완료 (기존 draft 버전 1.2 갱신) ===')
    console.log('draft 버전 id:', existingDraft.id)
  } else {
    const { data: inserted, error: insertError } = await admin
      .from('rulepack_versions')
      .insert({
        version_label: '1.2',
        status: 'draft',
        is_active: false,
        content: newContent,
        based_on_version_id: activeVersion.id,
        change_summary: changeSummary,
      })
      .select('id')
      .single()

    if (insertError) {
      console.error('draft 버전 저장 실패:', insertError.message)
      process.exit(1)
    }
    console.log('\n=== 완료 (새 draft 버전 1.2 생성) ===')
    console.log('draft 버전 id:', inserted.id)
  }

  console.log('legal_sources가 채워진 규칙:', JSON.stringify(summary, null, 2))
}

main().catch((err) => {
  console.error('스크립트 실행 중 오류:', err)
  process.exit(1)
})
