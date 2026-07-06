import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createSupabaseAdminClient, requireAdminUser } from '../../../lib/supabaseAdmin'
import { extractPdfText } from '../../../lib/pdfExtract'
import { SYSTEM_PROMPT, DIAGNOSIS_OUTPUT_SCHEMA, DIAGNOSIS_MODEL, DIAGNOSIS_MAX_TOKENS, buildUserMessage } from '../../../lib/diagnosis/prompt'

const FAILED_EXTRACTION_TEXT = '본 문서는 텍스트 추출에 실패했습니다 (스캔본으로 추정). 관리자가 수동으로 텍스트를 입력하기 전까지 이 문서에 대한 판단 근거가 부족합니다.'

export const maxDuration = 300

export async function POST(request) {
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

  const anthropic = new Anthropic()

  let finalMessage
  try {
    const stream = anthropic.messages.stream({
      model: DIAGNOSIS_MODEL,
      max_tokens: DIAGNOSIS_MAX_TOKENS,
      thinking: { type: 'adaptive' },
      output_config: {
        effort: 'high',
        format: { type: 'json_schema', schema: DIAGNOSIS_OUTPUT_SCHEMA },
      },
      system: SYSTEM_PROMPT,
      messages: [
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

    finalMessage = await stream.finalMessage()
  } catch (err) {
    console.error('Claude API 호출 실패', err)
    await admin
      .from('labor_diagnosis_requests')
      .update({ extracted_text: extractedTextResult })
      .eq('id', requestId)
    return NextResponse.json({ error: 'AI 분석 호출 중 오류가 발생했습니다.' }, { status: 502 })
  }

  const textBlock = finalMessage.content.find((block) => block.type === 'text')
  if (!textBlock) {
    return NextResponse.json({ error: 'AI 응답을 해석할 수 없습니다.' }, { status: 502 })
  }

  let parsed
  try {
    parsed = JSON.parse(textBlock.text)
  } catch {
    return NextResponse.json({ error: 'AI 응답 JSON 파싱에 실패했습니다.' }, { status: 502 })
  }

  const { error: updateError } = await admin
    .from('labor_diagnosis_requests')
    .update({
      status: 'analyzed',
      extracted_text: extractedTextResult,
      diagnosis_result: parsed.diagnosis_result,
      report_html: parsed.report_html,
    })
    .eq('id', requestId)

  if (updateError) {
    return NextResponse.json({ error: '분석 결과 저장 중 오류가 발생했습니다.' }, { status: 500 })
  }

  return NextResponse.json({ status: 'analyzed', diagnosisResult: parsed.diagnosis_result, reportHtml: parsed.report_html })
}
