'use client'

import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { submitLaborCheck } from './actions'

const EMPLOYEE_BANDS = ['5인 미만', '5~29인', '30~49인', '50~299인', '300인 이상']

const inputBase =
  'w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50'

function SubmitButton({ disabled }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      className="w-full rounded-full bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? '접수 중...' : '무료 노무진단 신청하기 →'}
    </button>
  )
}

export default function LaborCheckForm() {
  const [state, formAction] = useFormState(submitLaborCheck, { status: 'idle' })
  const [fileError, setFileError] = useState('')
  const [agreed, setAgreed] = useState(false)

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    const invalid = files.find((f) => f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf'))
    if (invalid) {
      setFileError(
        `"${invalid.name}"은(는) PDF 파일이 아닙니다. 취업규칙 파일을 PDF로 변환해 업로드해 주세요 (한글: 파일 → 다른 이름으로 저장 → 파일형식 PDF / 워드: 다른 이름으로 저장 → PDF).`
      )
      e.target.value = ''
      return
    }
    setFileError('')
  }

  if (state.status === 'success') {
    return (
      <section className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm text-center">
        <p className="text-lg font-bold text-slate-900 mb-2">접수가 완료되었습니다</p>
        <p className="text-slate-500 text-sm">
          담당자가 취업규칙을 검토한 뒤 영업일 기준 2~3일 내로 이메일로 진단 리포트를 보내드립니다.
        </p>
      </section>
    )
  }

  return (
    <form action={formAction} className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">회사명 *</label>
          <input type="text" name="companyName" required className={inputBase} placeholder="예: (주)이워크" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">이메일 (리포트 수신) *</label>
          <input type="email" name="email" required className={inputBase} placeholder="hr@company.com" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">상시근로자 규모 *</label>
          <select name="employeeBand" required defaultValue="" className={`${inputBase} appearance-none`}>
            <option value="" disabled>
              선택해주세요
            </option>
            {EMPLOYEE_BANDS.map((band) => (
              <option key={band} value={band}>
                {band}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">업종 (선택)</label>
          <input type="text" name="industry" className={inputBase} placeholder="예: 제조업" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">취업규칙 최종 개정연도 (선택)</label>
        <input type="number" name="lastRevisionYear" className={`${inputBase} max-w-[160px]`} placeholder="예: 2022" />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">취업규칙 파일 (PDF) *</label>
        <p className="text-xs text-slate-500 mb-2">
          취업규칙 파일을 PDF로 변환해 업로드해 주세요 (한글: 파일 → 다른 이름으로 저장 → 파일형식 PDF / 워드: 다른 이름으로 저장 → PDF). 파일당 최대 20MB.
        </p>
        <input
          type="file"
          name="files"
          accept="application/pdf,.pdf"
          multiple
          required
          onChange={handleFileChange}
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
        />
        {fileError && <p className="mt-2 text-xs text-red-600 bg-red-50 rounded px-3 py-1.5">{fileError}</p>}
      </div>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id="agree-labor-check"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-3.5 w-3.5 accent-blue-600 shrink-0"
        />
        <label htmlFor="agree-labor-check" className="text-xs text-slate-500 leading-relaxed cursor-pointer">
          개인정보(이메일) 및 첨부파일 수집·이용에 동의합니다. 진단 목적으로만 사용되며, 발송 완료 후 30일이 지나면 첨부파일은 자동 삭제됩니다.
        </label>
      </div>

      {state.status === 'error' && (
        <p className="text-xs text-red-600 bg-red-50 rounded px-3 py-2">{state.message}</p>
      )}

      <SubmitButton disabled={!agreed} />
    </form>
  )
}
