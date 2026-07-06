'use server'

import { randomUUID } from 'crypto'
import { supabase } from '../../lib/supabase'

const MAX_FILE_SIZE = 20 * 1024 * 1024
const EMPLOYEE_BANDS = ['5인 미만', '5~29인', '30~49인', '50~299인', '300인 이상']

function isPdfFile(file) {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
}

export async function submitLaborCheck(_prevState, formData) {
  const email = (formData.get('email') || '').toString().trim()
  const companyName = (formData.get('companyName') || '').toString().trim()
  const employeeBand = (formData.get('employeeBand') || '').toString().trim()
  const industry = (formData.get('industry') || '').toString().trim()
  const lastRevisionYearRaw = (formData.get('lastRevisionYear') || '').toString().trim()
  const lastRevisionYear = lastRevisionYearRaw ? parseInt(lastRevisionYearRaw, 10) : null

  if (!email || !companyName || !employeeBand) {
    return { status: 'error', message: '이메일, 회사명, 상시근로자 규모는 필수입니다.' }
  }
  if (!EMPLOYEE_BANDS.includes(employeeBand)) {
    return { status: 'error', message: '상시근로자 규모 값이 올바르지 않습니다.' }
  }

  const files = formData.getAll('files').filter((f) => f && typeof f === 'object' && 'arrayBuffer' in f && f.size > 0)
  if (files.length === 0) {
    return { status: 'error', message: '취업규칙 PDF 파일을 최소 1개 이상 첨부해주세요.' }
  }

  for (const file of files) {
    if (!isPdfFile(file)) {
      return {
        status: 'error',
        message: `"${file.name}"은(는) PDF 파일이 아닙니다. 취업규칙 파일을 PDF로 변환해 업로드해 주세요 (한글: 파일 → 다른 이름으로 저장 → 파일형식 PDF / 워드: 다른 이름으로 저장 → PDF).`,
      }
    }
    if (file.size > MAX_FILE_SIZE) {
      return { status: 'error', message: `"${file.name}" 파일이 20MB를 초과합니다.` }
    }
  }

  if (!supabase) {
    return { status: 'error', message: '서버 설정 오류로 접수할 수 없습니다. 잠시 후 다시 시도해주세요.' }
  }

  const requestId = randomUUID()
  const filePaths = []

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const safeName = file.name.replace(/[^\w.\-가-힣 ]/g, '_')
    const path = `labor-check/${requestId}/${safeName}`

    const { error: uploadError } = await supabase.storage
      .from('bank')
      .upload(path, buffer, { contentType: 'application/pdf', upsert: false })

    if (uploadError) {
      return { status: 'error', message: '파일 업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }
    }

    filePaths.push({ path, original_filename: file.name })
  }

  const { error: insertError } = await supabase.from('labor_diagnosis_requests').insert([{
    id: requestId,
    email,
    company_name: companyName,
    employee_band: employeeBand,
    industry: industry || null,
    last_revision_year: Number.isFinite(lastRevisionYear) ? lastRevisionYear : null,
    file_paths: filePaths,
    status: 'received',
  }])

  if (insertError) {
    return { status: 'error', message: '접수 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }
  }

  return { status: 'success' }
}
