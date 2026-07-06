import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createSupabaseAdminClient, requireAdminUser } from '../../../lib/supabaseAdmin'
import { extractPdfText } from '../../../lib/pdfExtract'
import { SYSTEM_PROMPT, DIAGNOSIS_RESPONSE_FORMAT, DIAGNOSIS_MODEL, DIAGNOSIS_MAX_TOKENS, buildUserMessage } from '../../../lib/diagnosis/prompt'
import { buildReportHtml } from '../../../lib/diagnosis/renderReport'

const FAILED_EXTRACTION_TEXT = '본 문서는 텍스트 추출에 실패했습니다 (스캔본으로 추정). 관리자가 수동으로 텍스트를 입력하기 전까지 이 문서에 대한 판단 근거가 부족합니다.'

export const maxDuration = 300

export async function POST(request) {
  try {
    return await handleDiagnose(request)
  } catch (err) {
    console.error('분석 처리 중 예외 발생', err)
    return NextResponse.json({ error: `분석 처리 중 예외가 발생했습니다: ${err?.message || err}` }, { status: 500 })
  }
}

async function handleDiagnose(request) {
  const adminUser = await requireAdminUser(request)
  if (!adminUser) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }

  const requestId = body?.requestId
  if (!requestId) {
    return NextResponse.json({ error: 'requestId가 필요합니다.' }, { status: 400 })
  }

  const admin = createSupabaseAdminClient()

  const { data: diagnosisRequest, error: fetchError } = await admin
    .from('labor_diagnosis_requests')
    .select('*')
    .eq('id', requestId)
    .single()

  if (fetchError || !diagnosisRequest) {
    return NextResponse.json({ error: '접수 건을 찾을 수 없습니다.' }, { status: 404 })
  }

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

    return NextResponse.json({ status: 'extract_failed', extractedText: extractedTextResult })
  }

  let content = ''
  let finishReason = null
  try {
    const openai = new OpenAI()
    const stream = await openai.chat.completions.create({
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
            documents
          ),
        },
      ],
    })

    for await (const chunk of stream) {
      content += chunk.choices?.[0]?.delta?.content || ''
      if (chunk.choices?.[0]?.finish_reason) finishReason = chunk.choices[0].finish_reason
    }
  } catch (err) {
    console.error('OpenAI API 호출 실패', err)
    await admin
      .from('labor_diagnosis_requests')
      .update({ extracted_text: extractedTextResult })
      .eq('id', requestId)
    return NextResponse.json({ error: 'AI 분석 호출 중 오류가 발생했습니다.' }, { status: 502 })
  }

  console.log(`[diagnose] requestId=${requestId} finishReason=${finishReason} contentLength=${content.length}`)

  if (!content) {
    return NextResponse.json({ error: 'AI 응답을 해석할 수 없습니다.' }, { status: 502 })
  }

  if (finishReason === 'length') {
    console.error(`[diagnose] 응답이 max_completion_tokens(${DIAGNOSIS_MAX_TOKENS}) 제한으로 잘림. requestId=${requestId}`)
    return NextResponse.json({ error: `AI 응답이 최대 길이(${DIAGNOSIS_MAX_TOKENS} 토큰) 제한으로 잘렸습니다. 관리자에게 알려 max_tokens를 늘려야 합니다.` }, { status: 502 })
  }

  let parsed
  try {
    parsed = JSON.parse(content)
  } catch (err) {
    console.error('AI 응답 JSON 파싱 실패. content 미리보기:', content.slice(0, 500))
    return NextResponse.json({ error: 'AI 응답 JSON 파싱에 실패했습니다. (서버 로그에 원본 응답 일부가 기록됨)' }, { status: 502 })
  }

  const diagnosisResult = parsed.diagnosis_result
  let reportHtml
  try {
    reportHtml = buildReportHtml(diagnosisResult)
  } catch (err) {
    console.error('리포트 HTML 생성 실패', err)
    return NextResponse.json({ error: '리포트 생성 중 오류가 발생했습니다.' }, { status: 500 })
  }

  const { error: updateError } = await admin
    .from('labor_diagnosis_requests')
    .update({
      status: 'analyzed',
      extracted_text: extractedTextResult,
      diagnosis_result: diagnosisResult,
      report_html: reportHtml,
    })
    .eq('id', requestId)

  if (updateError) {
    return NextResponse.json({ error: '분석 결과 저장 중 오류가 발생했습니다.' }, { status: 500 })
  }

  return NextResponse.json({ status: 'analyzed', diagnosisResult, reportHtml })
}
