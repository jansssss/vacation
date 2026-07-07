import { createSupabaseAdminClient, requireAdminUser } from '../../../../lib/supabaseAdmin'
import { checkRulepack } from '../../../../lib/legalSources/checkRulepack'
import { generateRuleUpdateProposal } from '../../../../lib/legalSources/updateProposal'
import { normalizeLegalText } from '../../../../lib/legalSources/hashText'

// 변경 감지된 소스로 규칙의 legal_sources를 "새 법령 기준"으로 갱신한 배열을 만든다.
// 승인 시 이 배열을 함께 반영하면, 새 버전은 현행 법령과 일치해 다음 점검에서 다시 변경으로
// 잡히지 않는다(승인=새 기준 확정). 바뀌지 않은 소스는 그대로 둔다.
function refreshLegalSources(rule, changedForRule, today) {
  const changedIndex = new Map(
    changedForRule.map((c) => [`${c.law_name}||${c.article}`, c])
  )
  return (rule.legal_sources ?? []).map((src) => {
    const c = changedIndex.get(`${src.law_name}||${src.article}`)
    if (!c) return src
    return {
      ...src,
      last_verified_text_hash: c.latest?.hash ?? src.last_verified_text_hash,
      last_verified_text: c.new_text != null ? normalizeLegalText(c.new_text) : src.last_verified_text,
      amendment_date: c.latest?.article_latest_amendment_date ?? src.amendment_date,
      law_snapshot_effective_date: c.latest?.law_snapshot_effective_date ?? src.law_snapshot_effective_date,
      last_checked_at: today,
      // 실제 시행일은 자동 확정하지 않는다 — 승인자가 확인해야 하는 값이므로 미검증으로 되돌린다.
      amendment_effective_date_verified: false,
    }
  })
}

// 룰팩 최신성 점검에서 변경이 감지된 규칙에 대해 AI 수정 초안을 생성한다.
// 절대 자동 반영하지 않는다 — 생성된 초안은 rulepack_update_proposals에 저장되고,
// 관리자가 검토·승인해야 새 버전이 만들어진다.
export const maxDuration = 300

const GRADE_RANK = { auto_candidate: 0, admin_review: 1, expert_review: 2 }

export async function POST(request) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload) => controller.enqueue(encoder.encode(JSON.stringify(payload) + '\n'))
      try {
        await handlePropose(request, send)
      } catch (err) {
        console.error('AI 수정안 생성 중 예외 발생', err)
        send({ type: 'error', status: 500, error: `수정안 생성 중 예외가 발생했습니다: ${err?.message || err}` })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8', 'Cache-Control': 'no-cache' },
  })
}

async function handlePropose(request, send) {
  const adminUser = await requireAdminUser(request)
  if (!adminUser) {
    send({ type: 'error', status: 401, error: '인증이 필요합니다.' })
    return
  }

  let body = {}
  try { body = await request.json() } catch {}

  const admin = createSupabaseAdminClient()
  const query = admin.from('rulepack_versions').select('id, version_label, content')
  const { data: version, error } = body?.versionId
    ? await query.eq('id', body.versionId).single()
    : await query.eq('is_active', true).single()

  if (error || !version) {
    send({ type: 'error', status: 404, error: '대상 룰팩 버전을 찾지 못했습니다.' })
    return
  }

  // 1) 최신성 점검으로 변경 감지
  send({ type: 'progress', phase: 'checking', label: '법령 최신성 점검 중…', progressPct: 5 })
  const report = await checkRulepack(version.content, {
    onProgress: (current, total, label) => {
      const pct = total > 0 ? Math.round((current / total) * 40) : 0 // 점검은 전체의 0~40%
      send({ type: 'progress', phase: 'checking', label: `점검 ${label}`, progressPct: 5 + pct })
    },
  })

  const changed = report.results.filter((r) => r.status === 'changed')
  if (changed.length === 0) {
    send({ type: 'done', versionId: version.id, versionLabel: version.version_label, proposals: [], report_summary: report.summary, message: '변경이 감지된 조문이 없습니다. 생성할 수정안이 없습니다.' })
    return
  }

  // 2) 규칙별로 변경 소스를 모아 AI 수정안 생성
  const byRule = new Map()
  for (const c of changed) {
    if (!byRule.has(c.rule_id)) byRule.set(c.rule_id, [])
    byRule.get(c.rule_id).push(c)
  }

  const rulesById = new Map(version.content.rules.map((r) => [r.id, r]))
  const proposals = []
  const ruleIds = [...byRule.keys()]
  const today = new Date().toISOString().slice(0, 10)

  let done = 0
  for (const ruleId of ruleIds) {
    const rule = rulesById.get(ruleId)
    const changedSources = byRule.get(ruleId)
    send({ type: 'progress', phase: 'generating', label: `${ruleId} 수정안 생성 중…`, progressPct: 45 + Math.round((done / ruleIds.length) * 50) })

    if (!rule) {
      proposals.push({ rule_id: ruleId, error: '룰 정의를 찾지 못했습니다.' })
      done += 1
      continue
    }

    try {
      const proposal = await generateRuleUpdateProposal(rule, changedSources)
      proposals.push({
        ...proposal,
        detected_changes: changedSources.map((c) => ({
          law_name: c.law_name, article: c.article, reason: c.reason,
        })),
        // 승인 시 새 버전에 그대로 반영할 "현행 법령 기준" legal_sources
        refreshed_legal_sources: refreshLegalSources(rule, changedSources, today),
      })
    } catch (err) {
      console.error(`[propose] ${ruleId} 수정안 생성 실패`, err)
      proposals.push({ rule_id: ruleId, error: err?.message || '수정안 생성 실패' })
    }
    done += 1
  }

  // 3) 감사 추적용 저장
  send({ type: 'progress', phase: 'saving', label: '저장 중…', progressPct: 97 })
  const valid = proposals.filter((p) => !p.error && p.change_grade)
  const overallGrade = valid.reduce((acc, p) => {
    return GRADE_RANK[p.change_grade] > GRADE_RANK[acc] ? p.change_grade : acc
  }, 'auto_candidate')

  const { data: savedProposal, error: saveError } = await admin
    .from('rulepack_update_proposals')
    .insert({
      base_version_id: version.id,
      status: 'pending',
      overall_grade: valid.length > 0 ? overallGrade : null,
      ai_response: { rule_updates: proposals },
      detected_changes: changed.map((c) => ({ rule_id: c.rule_id, law_name: c.law_name, article: c.article, reason: c.reason })),
      created_by: adminUser.id,
    })
    .select('id')
    .single()

  if (saveError) {
    console.error('[propose] 제안 저장 실패', saveError)
  }

  send({
    type: 'done',
    versionId: version.id,
    versionLabel: version.version_label,
    proposalId: savedProposal?.id ?? null,
    proposals,
    report_summary: report.summary,
  })
}
