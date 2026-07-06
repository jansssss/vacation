import { NextResponse } from 'next/server'
import { createSupabaseAdminClient, requireAdminUser } from '../../../../lib/supabaseAdmin'

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

  const requestIds = Array.isArray(body?.requestIds) ? body.requestIds.filter(Boolean) : []
  if (requestIds.length === 0) {
    return NextResponse.json({ error: '삭제할 접수 건이 없습니다.' }, { status: 400 })
  }

  const admin = createSupabaseAdminClient()

  const { data: rows, error: fetchError } = await admin
    .from('labor_diagnosis_requests')
    .select('id, file_paths')
    .in('id', requestIds)

  if (fetchError) {
    return NextResponse.json({ error: '접수 건 조회 중 오류가 발생했습니다.' }, { status: 500 })
  }

  const allPaths = (rows || []).flatMap((row) => (row.file_paths || []).map((f) => f.path).filter(Boolean))

  if (allPaths.length > 0) {
    const { error: removeError } = await admin.storage.from('bank').remove(allPaths)
    if (removeError) {
      console.error('Storage 파일 삭제 실패', removeError)
    }
  }

  const { error: deleteError } = await admin
    .from('labor_diagnosis_requests')
    .delete()
    .in('id', requestIds)

  if (deleteError) {
    return NextResponse.json({ error: '접수 건 삭제 중 오류가 발생했습니다.' }, { status: 500 })
  }

  return NextResponse.json({ status: 'deleted', deletedIds: requestIds })
}
