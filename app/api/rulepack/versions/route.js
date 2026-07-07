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

  const { action } = body || {}
  const admin = createSupabaseAdminClient()

  // 승인된 수정안을 반영한 새 draft 버전 생성 (관리자가 UI에서 편집한 최종 content를 그대로 저장)
  if (action === 'create_draft') {
    return createDraft(body, admin, adminUser)
  }

  const { versionId } = body || {}
  if (action !== 'activate' || !versionId) {
    return NextResponse.json({ error: "지원하지 않는 요청입니다. (action='activate'|'create_draft')" }, { status: 400 })
  }

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

async function createDraft(body, admin, adminUser) {
  const { version_label, content, based_on_version_id, change_summary, proposal_id } = body || {}

  if (!version_label || !content || !Array.isArray(content?.rules)) {
    return NextResponse.json({ error: 'version_label과 content(rules 배열 포함)가 필요합니다.' }, { status: 400 })
  }

  const { data: dup } = await admin
    .from('rulepack_versions')
    .select('id')
    .eq('version_label', version_label)
    .maybeSingle()
  if (dup) {
    return NextResponse.json({ error: `버전 라벨 ${version_label}이(가) 이미 존재합니다. 다른 라벨을 지정하세요.` }, { status: 409 })
  }

  const { data: inserted, error: insertError } = await admin
    .from('rulepack_versions')
    .insert({
      version_label,
      status: 'draft',
      is_active: false,
      content,
      based_on_version_id: based_on_version_id ?? null,
      change_summary: change_summary ?? null,
      created_by: adminUser.id,
    })
    .select('id, version_label')
    .single()

  if (insertError) {
    return NextResponse.json({ error: `새 draft 생성 실패: ${insertError.message}` }, { status: 500 })
  }

  // 제안과 연결(감사 추적)
  if (proposal_id) {
    await admin
      .from('rulepack_update_proposals')
      .update({
        status: 'approved',
        resulting_version_id: inserted.id,
        reviewed_by: adminUser.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', proposal_id)
  }

  return NextResponse.json({ ok: true, versionId: inserted.id, versionLabel: inserted.version_label })
}
