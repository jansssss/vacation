'use client'

import { useState } from 'react'
import Link from 'next/link'
import { calculateChildcareSupport } from '../../../src/lib/calculators/childcareSupport'

const fmt = (n) => Math.round(n).toLocaleString('ko-KR')

export default function ChildcareSupportPage() {
  const [type, setType] = useState('leave')
  const [form, setForm] = useState({
    monthlyWage: '',
    months: '6',
    childAgeMonths: '12',
    useOrder: '1',
    isPrioritySupportCompany: true,
    willRetainForSixMonths: true,
    workloadSharingEnabled: false,
    workloadSharingCoworkers: '1',
    weeklyHoursBefore: '40',
    weeklyHoursAfter: '20',
  })
  const [result, setResult] = useState(null)

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))
  const setCheck = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.checked }))

  const handleCalc = () => {
    const r = calculateChildcareSupport({
      type,
      monthlyWage: Number(form.monthlyWage) * 10000,
      months: Number(form.months),
      childAgeMonths: Number(form.childAgeMonths),
      useOrder: Number(form.useOrder),
      isPrioritySupportCompany: form.isPrioritySupportCompany,
      willRetainForSixMonths: form.willRetainForSixMonths,
      workloadSharingEnabled: form.workloadSharingEnabled,
      workloadSharingCoworkers: Number(form.workloadSharingCoworkers),
      weeklyHoursBefore: Number(form.weeklyHoursBefore),
      weeklyHoursAfter: Number(form.weeklyHoursAfter),
    })
    setResult(r)
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">육아지원금 계산기</p>
        <h1 className="text-3xl font-semibold text-slate-900">육아지원금 계산기</h1>
        <p className="text-slate-600 mt-3 leading-relaxed">
          육아휴직 또는 육아기 근로시간 단축 시 사업주 지원금, 근로자 예상 수령액,
          회사 순부담액을 함께 계산합니다. 2026년 고용보험 기준 적용.
        </p>
        <div className="flex flex-wrap gap-2 mt-4 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">2026년 기준</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">우선지원대상기업 구분</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">고용보험법 기준</span>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-5">계산 입력</h2>
        <div className="space-y-5 max-w-2xl">
          {/* Type */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">지원 유형</p>
            <div className="flex gap-3">
              {[{ v: 'leave', label: '육아휴직' }, { v: 'reduced-hours', label: '육아기 근로시간 단축' }].map(({ v, label }) => (
                <button
                  key={v}
                  onClick={() => setType(v)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition border ${type === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">통상임금 (만원/월)</label>
              <input type="number" value={form.monthlyWage} onChange={set('monthlyWage')}
                placeholder="예: 300"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">사용 기간 (개월)</label>
              <select value={form.months} onChange={set('months')}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => <option key={m} value={m}>{m}개월</option>)}
              </select>
            </div>

            {type === 'leave' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">자녀 나이 (개월)</label>
                <input type="number" value={form.childAgeMonths} onChange={set('childAgeMonths')}
                  placeholder="예: 12"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50" />
              </div>
            )}

            {type === 'reduced-hours' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">단축 전 주 근무시간</label>
                  <input type="number" value={form.weeklyHoursBefore} onChange={set('weeklyHoursBefore')}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">단축 후 주 근무시간</label>
                  <input type="number" value={form.weeklyHoursAfter} onChange={set('weeklyHoursAfter')}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400" />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">사용 순서 (동일 자녀)</label>
              <select value={form.useOrder} onChange={set('useOrder')}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400">
                {[1,2,3,4].map(n => <option key={n} value={n}>{n}번째 사용</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={form.isPrioritySupportCompany} onChange={setCheck('isPrioritySupportCompany')}
                className="h-4 w-4 accent-blue-500 rounded" />
              우선지원대상기업 (중소기업 등)
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={form.willRetainForSixMonths} onChange={setCheck('willRetainForSixMonths')}
                className="h-4 w-4 accent-blue-500 rounded" />
              복직 후 6개월 이상 계속 고용 예정
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={form.workloadSharingEnabled} onChange={setCheck('workloadSharingEnabled')}
                className="h-4 w-4 accent-blue-500 rounded" />
              업무분담 지원금 적용
            </label>
            {form.workloadSharingEnabled && (
              <div className="ml-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">업무분담 인원 수</label>
                <input type="number" value={form.workloadSharingCoworkers} onChange={set('workloadSharingCoworkers')} min="1" max="3"
                  className="w-32 rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-blue-400" />
              </div>
            )}
          </div>

          <button
            onClick={handleCalc}
            disabled={!form.monthlyWage || Number(form.monthlyWage) <= 0}
            className="w-full rounded-full bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            계산하기
          </button>
        </div>
      </section>

      {result && (
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">계산 결과</h2>
          <div className="grid gap-4 sm:grid-cols-3 mb-5">
            <div className="rounded-2xl bg-blue-600 p-4 text-white text-center">
              <p className="text-xs opacity-70 mb-1">근로자 월 수령액</p>
              <p className="text-2xl font-bold">{fmt(result.workerMonthlyTotal)}</p>
              <p className="text-xs opacity-60">원/월</p>
            </div>
            <div className="rounded-2xl bg-emerald-600 p-4 text-white text-center">
              <p className="text-xs opacity-70 mb-1">사업주 월 지원금</p>
              <p className="text-2xl font-bold">{fmt(result.employerMonthlySupport)}</p>
              <p className="text-xs opacity-60">원/월</p>
            </div>
            <div className="rounded-2xl bg-slate-700 p-4 text-white text-center">
              <p className="text-xs opacity-70 mb-1">회사 월 순부담</p>
              <p className="text-2xl font-bold">{fmt(result.companyMonthlyNetCost)}</p>
              <p className="text-xs opacity-60">원/월</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            {[
              ['적용 기간', `${result.eligibleMonths}개월`],
              ['근로자 급여 총수령액', `${fmt(result.workerBenefitTotal)}원`],
              ['사업주 즉시 지원금', `${fmt(result.immediateEmployerSupport)}원`],
              ['사업주 사후 지급분', `${fmt(result.deferredEmployerSupport)}원`],
              ['사업주 총 지원금', `${fmt(result.employerSupportTotal)}원`],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">{label}</span>
                <span className="font-medium text-slate-900">{val}</span>
              </div>
            ))}
          </div>

          {result.flags?.prioritySupportRequired && (
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-3 text-xs text-amber-700">
              우선지원대상기업이 아닌 경우 사업주 지원금은 지급되지 않습니다.
            </div>
          )}
          {result.flags?.retentionPending && (
            <div className="mt-2 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600">
              복직 후 6개월 고용 유지를 미선택하여 사후 지급분(50%)이 제외되었습니다.
            </div>
          )}
        </section>
      )}

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">자주 묻는 질문</h2>
        <div className="space-y-4 text-sm text-slate-700">
          <div>
            <p className="font-semibold text-slate-900">Q. 우선지원대상기업이란?</p>
            <p className="mt-1">A. 고용보험법상 중소기업 등 지원 우선 대상 사업장입니다. 제조업 500인 이하, 서비스업 300인 이하 등 업종별 기준이 다릅니다. 우선지원대상기업에 해당해야 사업주 지원금이 지급됩니다.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Q. 육아휴직 급여는 얼마인가요?</p>
            <p className="mt-1">A. 2026년 기준 처음 3개월은 통상임금의 100% (월 최대 250만원), 다음 3개월은 100% (월 최대 200만원), 이후는 80% (월 최대 160만원)입니다.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Q. 육아기 근로시간 단축 기간은?</p>
            <p className="mt-1">A. 육아휴직 미사용 기간과 합산하여 최대 24개월까지 사용할 수 있습니다. (육아휴직 사용 시 나머지 기간만큼 단축 사용 가능)</p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/calculators" className="text-blue-600 hover:underline">← 계산기 목록으로</Link>
        <Link href="/calculators/annual-leave" className="text-blue-600 hover:underline">연차 계산기 →</Link>
        <Link href="/calculators/net-salary" className="text-blue-600 hover:underline">실수령액 계산기 →</Link>
      </div>
    </div>
  )
}
