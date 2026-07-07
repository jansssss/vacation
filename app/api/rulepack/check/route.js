import { createSupabaseAdminClient, requireAdminUser } from '../../../../lib/supabaseAdmin'
import { checkRulepack } from '../../../../lib/legalSources/checkRulepack'

// 룰팩 최신성 점검을 관리자 화면에서 실행한다. law.go.kr 조문을 순차 조회하므로 시간이 걸려
// NDJSON 스트리밍으로 진행률을 흘려보낸다(진단 API와 동일한 패턴).
export const maxDuration = 300

export async function POST(request) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload) => controller.enqueue(encoder.encode(JSON.stringify(payload) + '\n'))
      try {
        await handleCheck(request, send)
      } catch (err) {
        console.error('룰팩 점검 중 예외 발생', err)
        send({ type: 'error', status: 500, error: `점검 중 예외가 발생했습니다: ${err?.message || err}` })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
}

async function handleCheck(request, send) {
  const adminUser = await requireAdminUser(request)
  if (!adminUser) {
    send({ type: 'error', status: 401, error: '인증이 필요합니다.' })
    return
  }

  let body = {}
  try {
    body = await request.json()
  } catch {
    // 본문 없이 호출하면 활성 버전을 점검한다
  }

  const admin = createSupabaseAdminClient()

  const query = admin.from('rulepack_versions').select('id, version_label, content')
  const { data: version, error } = body?.versionId
    ? await query.eq('id', body.versionId).single()
    : await query.eq('is_active', true).single()

  if (error || !version) {
    send({ type: 'error', status: 404, error: '점검할 룰팩 버전을 찾지 못했습니다.' })
    return
  }

  const report = await checkRulepack(version.content, {
    onProgress: (current, total, label) => {
      const progressPct = total > 0 ? Math.round((current / total) * 100) : 100
      send({ type: 'progress', current, total, label, progressPct })
    },
  })

  send({
    type: 'done',
    versionId: version.id,
    versionLabel: version.version_label,
    report,
  })
}
