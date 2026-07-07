import OpenAI from 'openai'
import { createSupabaseAdminClient, requireAdminUser } from '../../../lib/supabaseAdmin'
import { extractPdfText } from '../../../lib/pdfExtract'
import { SYSTEM_PROMPT, DIAGNOSIS_RESPONSE_FORMAT, DIAGNOSIS_MODEL, DIAGNOSIS_MAX_TOKENS, buildUserMessage, FALLBACK_RULEPACK } from '../../../lib/diagnosis/prompt'
import { buildReportHtml } from '../../../lib/diagnosis/renderReport'

const FAILED_EXTRACTION_TEXT = '본 문서는 텍스트 추출에 실패했습니다 (스캔본으로 추정). 관리자가 수동으로 텍스트를 입력하기 전까지 이 문서에 대한 판단 근거가 부족합니다.'

// 실제 완성 길이를 미리 알 수 없어 대략적인 자릿수 기준으로 진행률을 근사한다 (한글 위주 JSON 응답 기준 경험치).
const ESTIMATED_TOTAL_CHARS = DIAGNOSIS_MAX_TOKENS * 2
const PROGRESS_THROTTLE_MS = 400

export const maxDuration = 300

// 활성 룰팩 버전을 DB에서 조회한다. 못 찾으면(시딩 전, 장애 등) 코드에 내장된 fallback을 쓴다.
async function getActiveRulepack(admin) {
  const { data, error } = await admin
    .from('rulepack_versions')
    .select('id, version_label, content')
    .eq('is_active', true)
    .maybeSingle()

  if (error || !data) {
    if (error) console.error('[diagnose] 활성 룰팩 버전 조회 실패, fallback 사용', error)
    return { id: null, version_label: FALLBACK_RULEPACK?.meta?.version ?? 'fallback', content: FALLBACK_RULEPACK }
  }

  return data
}

export async function POST(request) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload) => controller.enqueue(encoder.encode(JSON.stringify(payload) + '\n'))
      try {
        await handleDiagnose(request, send)
      } catch (err) {
        console.error('분석 처리 중 예외 발생', err)
        send({ type: 'error', status: 500, error: `분석 처리 중 예외가 발생했습니다: ${err?.message || err}` })
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

async function handleDiagnose(request, send) {
  const adminUser = await requireAdminUser(request)
  if (!adminUser) {
    send({ type: 'error', status: 401, error: '인증이 필요합니다.' })
    return
  }

  let body
  try {
    body = await request.json()
  } catch {
    send({ type: 'error', status: 400, error: '잘못된 요청입니다.' })
    return
  }

  const requestId = body?.requestId
  if (!requestId) {
    send({ type: 'error', status: 400, error: 'requestId가 필요합니다.' })
    return
  }

  const admin = createSupabaseAdminClient()

  const { data: diagnosisRequest, error: fetchError } = await admin
    .from('labor_diagnosis_requests')
    .select('*')
    .eq('id', requestId)
    .single()

  if (fetchError || !diagnosisRequest) {
    send({ type: 'error', status: 404, error: '접수 건을 찾을 수 없습니다.' })
    return
  }

  const rulepack = await getActiveRulepack(admin)

  send({ type: 'progress', phase: 'extracting', progressPct: 5 })

  const existingExtractedText = diagnosisRequest.extracted_text || {}
  const filePaths = diagnosisRequest.file_paths || []

  const documents = []
  const extractedTextResult = {}
  let anyUsable = false

  for (const fileEntry of filePaths) {
    const { path, original_filename: originalFilename } = fileEntry

    const manuallyProvided = typeof existingExtractedText[path] === 'string' && existingExtractedText[path].trim().length > 0
      ? existingExtractedText[path]
      : null

    let text = null

    const { data: fileBlob, error: downloadError } = await admin.storage.from('bank').download(path)

    if (!downloadError && fileBlob) {
      try {
        const buffer = Buffer.from(await fileBlob.arrayBuffer())
        const extraction = await extractPdfText(buffer)
        if (!extraction.isScanned) {
          text = extraction.text
        }
      } catch {
        text = null
      }
    }

    if (!text && manuallyProvided) {
      text = manuallyProvided
    }

    if (text) {
      anyUsable = true
      extractedTextResult[path] = text
      documents.push({ originalFilename, extractedText: text })
    } else {
      extractedTextResult[path] = manuallyProvided || FAILED_EXTRACTION_TEXT
      documents.push({ originalFilename, extractedText: FAILED_EXTRACTION_TEXT })
    }
  }

  if (!anyUsable) {
    await admin
      .from('labor_diagnosis_requests')
      .update({ status: 'extract_failed', extracted_text: extractedTextResult })
      .eq('id', requestId)

    send({ type: 'done', status: 'extract_failed', extractedText: extractedTextResult })
    return
  }

  send({ type: 'progress', phase: 'requesting', progressPct: 12 })

  let content = ''
  let finishReason = null
  const startedAt = Date.now()
  let lastSentAt = 0

  try {
    const openai = new OpenAI()
    const completionStream = await openai.chat.completions.create({
      model: DIAGNOSIS_MODEL,
      max_completion_tokens: DIAGNOSIS_MAX_TOKENS,
      stream: true,
      response_format: DIAGNOSIS_RESPONSE_FORMAT,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: buildUserMessage(
            {
              companyName: diagnosisRequest.company_name,
              industry: diagnosisRequest.industry,
              employeeBand: diagnosisRequest.employee_band,
              lastRevisionYear: diagnosisRequest.last_revision_year,
            },
            documents,
            rulepack.content
          ),
        },
      ],
    })

    for await (const chunk of completionStream) {
      content += chunk.choices?.[0]?.delta?.content || ''
      if (chunk.choices?.[0]?.finish_reason) finishReason = chunk.choices[0].finish_reason

      const now = Date.now()
      if (now - lastSentAt >= PROGRESS_THROTTLE_MS) {
        lastSentAt = now
        const progressPct = Math.min(90, 12 + Math.round((content.length / ESTIMATED_TOTAL_CHARS) * 78))
        send({ type: 'progress', phase: 'generating', chars: content.length, elapsedMs: now - startedAt, progressPct })
      }
    }
  } catch (err) {
    console.error('OpenAI API 호출 실패', err)
    await admin
      .from('labor_diagnosis_requests')
      .update({ extracted_text: extractedTextResult })
      .eq('id', requestId)
    send({ type: 'error', status: 502, error: 'AI 분석 호출 중 오류가 발생했습니다.' })
    return
  }

  console.log(`[diagnose] requestId=${requestId} finishReason=${finishReason} contentLength=${content.length}`)

  if (!content) {
    send({ type: 'error', status: 502, error: 'AI 응답을 해석할 수 없습니다.' })
    return
  }

  if (finishReason === 'length') {
    console.error(`[diagnose] 응답이 max_completion_tokens(${DIAGNOSIS_MAX_TOKENS}) 제한으로 잘림. requestId=${requestId}`)
    send({ type: 'error', status: 502, error: `AI 응답이 최대 길이(${DIAGNOSIS_MAX_TOKENS} 토큰) 제한으로 잘렸습니다. 관리자에게 알려 max_tokens를 늘려야 합니다.` })
    return
  }

  send({ type: 'progress', phase: 'saving', progressPct: 95 })

  let parsed
  try {
    parsed = JSON.parse(content)
  } catch (err) {
    console.error('AI 응답 JSON 파싱 실패. content 미리보기:', content.slice(0, 500))
    send({ type: 'error', status: 502, error: 'AI 응답 JSON 파싱에 실패했습니다. (서버 로그에 원본 응답 일부가 기록됨)' })
    return
  }

  const diagnosisResult = parsed.diagnosis_result
  let reportHtml
  try {
    reportHtml = buildReportHtml(diagnosisResult)
  } catch (err) {
    console.error('리포트 HTML 생성 실패', err)
    send({ type: 'error', status: 500, error: '리포트 생성 중 오류가 발생했습니다.' })
    return
  }

  const { error: updateError } = await admin
    .from('labor_diagnosis_requests')
    .update({
      status: 'analyzed',
      extracted_text: extractedTextResult,
      diagnosis_result: diagnosisResult,
      report_html: reportHtml,
      rulepack_version_id: rulepack.id,
    })
    .eq('id', requestId)

  if (updateError) {
    send({ type: 'error', status: 500, error: '분석 결과 저장 중 오류가 발생했습니다.' })
    return
  }

  send({ type: 'done', status: 'analyzed', diagnosisResult, reportHtml })
}
