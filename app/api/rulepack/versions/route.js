import { NextResponse } from 'next/server'
import { createSupabaseAdminClient, requireAdminUser } from '../../../../lib/supabaseAdmin'

// 룰팩 버전 목록 조회 및 버전 활성화(배포)/롤백.
// - GET  : 버전 메타데이터 목록(콘텐츠 제외 — 큰 JSON은 별도 조회)
// - POST : { action: 'activate', versionId } → 해당 버전을 활성화(나머지는 비활성).
//          롤백도 "과거 버전을 다시 활성화"하는 것이라 같은 엔드포인트를 쓴다.

export async function GET(request) {
  const adminUser = await requireAdminUser(request)
  if (!adminUser) {
    return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  const admin = createSupabaseAdminClient()
  const { searchParams } = new URL(request.url)
  const versionId = searchParams.get('versionId')

  // 특정 버전의 전체 콘텐츠(룰 + legal_sources) 조회
  if (versionId) {
    const { data, error } = await admin
      .from('rulepack_versions')
      .select('id, version_label, status, is_active, content, change_summary, based_on_version_id, approved_at, created_at')
      .eq('id', versionId)
      .single()
    if (error || !data) {
      return NextResponse.json({ error: '버전을 찾지 못했습니다.' }, { status: 404 })
    }
    return NextResponse.json({ version: data })
  }

  // 목록(콘텐츠 제외)
  const { data, error } = await admin
    .from('rulepack_versions')
    .select('id, version_label, status, is_active, change_summary, based_on_version_id, approved_at, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: '버전 목록을 불러오지 못했습니다.' }, { status: 500 })
  }
  return NextResponse.json({ versions: data || [] })
}

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

  const { action, versionId } = body || {}
  if (action !== 'activate' || !versionId) {
    return NextResponse.json({ error: "지원하지 않는 요청입니다. (action='activate', versionId 필요)" }, { status: 400 })
  }

  const admin = createSupabaseAdminClient()

  const { data: target, error: fetchError } = await admin
    .from('rulepack_versions')
    .select('id, version_label, is_active')
    .eq('id', versionId)
    .single()

  if (fetchError || !target) {
    return NextResponse.json({ error: '활성화할 버전을 찾지 못했습니다.' }, { status: 404 })
  }
  if (target.is_active) {
    return NextResponse.json({ ok: true, alreadyActive: true, versionLabel: target.version_label })
  }

  // is_active 부분 유니크 인덱스 때문에 "먼저 전부 비활성화 → 대상만 활성화" 순서로 처리한다.
  const { error: deactivateError } = await admin
    .from('rulepack_versions')
    .update({ is_active: false })
    .eq('is_active', true)

  if (deactivateError) {
    return NextResponse.json({ error: '기존 활성 버전 비활성화에 실패했습니다.' }, { status: 500 })
  }

  const { error: activateError } = await admin
    .from('rulepack_versions')
    .update({ is_active: true, status: 'approved', approved_at: new Date().toISOString() })
    .eq('id', versionId)

  if (activateError) {
    return NextResponse.json({ error: '버전 활성화에 실패했습니다.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, versionLabel: target.version_label })
}
