'use client'

import { useState } from 'react'
import Link from 'next/link'
import { calculateAnnualLeave } from '../../../src/lib/calculators/annualLeave'

export default function AnnualLeavePage() {
  const today = new Date().toISOString().slice(0, 10)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState(today)
  const [result, setResult] = useState(null)

  const handleCalc = () => {
    const r = calculateAnnualLeave(startDate, endDate)
    setResult(r)
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">연차 계산기</p>
        <h1 className="text-3xl font-semibold text-slate-900">연차 발생일수 계산기</h1>
        <p className="text-slate-600 mt-3 leading-relaxed">
          입사일과 기준일을 입력하면 근로기준법에 따른 연차 발생일수를 연차별로 계산합니다.
          2026년 회계연도 기준 적용.
        </p>
        <div className="flex flex-wrap gap-2 mt-4 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">2026년 기준</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">회계연도 방식</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">근로기준법 제60조</span>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-5">계산 입력</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">입사일</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">기준일 (오늘 또는 특정일)</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
            />
          </div>
          <button
            onClick={handleCalc}
            disabled={!startDate || !endDate}
            className="w-full rounded-full bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            계산하기
          </button>
        </div>
      </section>

      {result && (
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">계산 결과</h2>
          {result.error ? (
            <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">{result.error}</div>
          ) : (
            <>
              <div className="rounded-2xl bg-blue-600 p-6 text-white text-center mb-5">
                <p className="text-sm font-medium opacity-80 mb-1">총 발생 연차일수</p>
                <p className="text-4xl font-bold">{result.total}<span className="text-xl ml-1">일</span></p>
                <p className="text-sm opacity-70 mt-1">근속 {result.years}년 {Math.round(result.months % 12)}개월</p>
              </div>
              {result.breakdown.length > 0 && (
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-slate-700 mb-3">연도별 발생 내역</p>
                  {result.breakdown.map((item, i) => (
                    <div key={i} className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-medium text-slate-900">{item.days}일</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-2 font-bold text-base">
                    <span className="text-slate-900">합계</span>
                    <span className="text-blue-700">{result.total}일</span>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">연차 계산 방식</h2>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" /><span>1년차(월차): 입사월부터 12월까지 개근 시 월 1일씩 발생 (최대 11일)</span></li>
          <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" /><span>2년차: 전년도 1년 이상 근무 시 15일 발생 (1년차 월차 포함 26일)</span></li>
          <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" /><span>3년차 이상: 15일 기준 + 2년마다 1일 가산 (최대 25일)</span></li>
          <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" /><span>연차 유효기간: 발생일로부터 1년 (회계연도 기준)</span></li>
        </ul>
        <p className="mt-4 text-xs text-slate-400">
          이 계산기는 근로기준법 제60조 기준의 참고용 계산 결과를 제공합니다. 회사 내규나 단체협약에 따라 다를 수 있습니다.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">자주 묻는 질문</h2>
        <div className="space-y-4 text-sm text-slate-700">
          <div>
            <p className="font-semibold text-slate-900">Q. 입사 1년차에 연차가 몇 일 생기나요?</p>
            <p className="mt-1">A. 매월 개근 시 1일씩 발생해 최대 11일입니다. 입사 첫 달은 1일이 아닌 경우 해당 월은 제외됩니다.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Q. 3년차부터 연차가 늘어나나요?</p>
            <p className="mt-1">A. 네, 3년 이상 계속 근무한 경우 최초 1년을 초과하는 계속 근로연수 매 2년에 대하여 1일을 가산합니다. 상한은 25일입니다.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Q. 연차를 사용하지 않으면 어떻게 되나요?</p>
            <p className="mt-1">A. 미사용 연차는 유효기간(1년) 만료 후 연차수당으로 청구할 수 있습니다. 단, 사용자가 사용 촉진 조치를 취한 경우 수당 지급 의무가 면제됩니다.</p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/calculators" className="text-blue-600 hover:underline">← 계산기 목록으로</Link>
        <Link href="/calculators/severance-pay" className="text-blue-600 hover:underline">퇴직금 계산기 →</Link>
        <Link href="/calculators/net-salary" className="text-blue-600 hover:underline">실수령액 계산기 →</Link>
      </div>
    </div>
  )
}
