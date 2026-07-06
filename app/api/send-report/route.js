import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createSupabaseAdminClient, requireAdminUser } from '../../../lib/supabaseAdmin'

export const maxDuration = 60

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

  if (!diagnosisRequest.report_html) {
    return NextResponse.json({ error: '발송할 리포트가 아직 없습니다. 먼저 분석을 실행해주세요.' }, { status: 400 })
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const fromAddress = process.env.RESEND_FROM_EMAIL || 'e-work.kr <noreply@e-work.kr>'
  let mocked = false

  if (resendApiKey) {
    const resend = new Resend(resendApiKey)
    const { error: sendError } = await resend.emails.send({
      from: fromAddress,
      to: diagnosisRequest.email,
      subject: `[e-work.kr] ${diagnosisRequest.company_name} 노무진단 리포트`,
      html: diagnosisRequest.report_html,
    })

    if (sendError) {
      console.error('Resend 발송 실패', sendError)
      return NextResponse.json({ error: '이메일 발송 중 오류가 발생했습니다.' }, { status: 502 })
    }
  } else {
    mocked = true
    console.warn(`[mock] RESEND_API_KEY 미설정 — ${diagnosisRequest.email} 로 발송을 생략하고 상태만 갱신합니다.`)
  }

  const { error: updateError } = await admin
    .from('labor_diagnosis_requests')
    .update({ status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', requestId)

  if (updateError) {
    return NextResponse.json({ error: '발송 상태 저장 중 오류가 발생했습니다.' }, { status: 500 })
  }

  return NextResponse.json({ status: 'sent', mocked })
}
