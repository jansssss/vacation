'use client'

import { useState } from 'react'
import Link from 'next/link'
import { calculateSeverancePay } from '../../../src/lib/calculators/severancePay'

const fmt = (n) => Math.round(n).toLocaleString('ko-KR')

export default function SeverancePayPage() {
  const [avgMonthlyWage, setAvgMonthlyWage] = useState('')
  const [years, setYears] = useState('')
  const [months, setMonths] = useState('0')
  const [result, setResult] = useState(null)

  const handleCalc = () => {
    const r = calculateSeverancePay({
      avgMonthlyWage: Number(avgMonthlyWage) * 10000,
      years: Number(years),
      months: Number(months),
    })
    setResult(r)
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">퇴직금 계산기</p>
        <h1 className="text-3xl font-semibold text-slate-900">퇴직금 계산기</h1>
        <p className="text-slate-600 mt-3 leading-relaxed">
          퇴직 전 3개월 평균임금과 근속기간을 입력하면 근로자퇴직급여보장법 기준의
          예상 퇴직금을 계산합니다.
        </p>
        <div className="flex flex-wrap gap-2 mt-4 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">2026년 기준</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">1년 이상 근속 시 적용</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">근로자퇴직급여보장법</span>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-5">계산 입력</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">퇴직 전 3개월 평균 월급 (만원)</label>
            <input
              type="number"
              value={avgMonthlyWage}
              onChange={(e) => setAvgMonthlyWage(e.target.value)}
              placeholder="예: 350"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
            />
            <p className="mt-1 text-xs text-slate-400">상여금, 수당 포함한 세전 금액</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">근속 연수</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                placeholder="예: 3"
                min="0"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">추가 개월 수</label>
              <select
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>{i}개월</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleCalc}
            disabled={!avgMonthlyWage || !years || Number(avgMonthlyWage) <= 0 || Number(years) < 0}
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
            <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
              평균임금과 근속기간을 정확히 입력해 주세요.
            </div>
          ) : (
            <>
              <div className="rounded-2xl bg-blue-600 p-6 text-white text-center mb-5">
                <p className="text-sm font-medium opacity-80 mb-1">예상 퇴직금</p>
                <p className="text-4xl font-bold">{fmt(result.pay)}<span className="text-xl ml-1">원</span></p>
                <p className="text-sm opacity-70 mt-1">근속 {result.serviceYears.toFixed(1)}년 기준</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">평균임금 산정 기간</span>
                  <span className="font-medium text-slate-900">{result.averageWagePeriodMonths}개월</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">1년당 지급 일수</span>
                  <span className="font-medium text-slate-900">{result.payDaysPerYear}일분</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">근속 기간</span>
                  <span className="font-medium text-slate-900">{result.serviceYears.toFixed(2)}년</span>
                </div>
                <div className="flex justify-between py-2 font-bold text-base">
                  <span className="text-slate-900">예상 퇴직금</span>
                  <span className="text-blue-700">{fmt(result.pay)}원</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-400">
                퇴직금 = 평균임금 × 30일 × (근속년수). 세금 공제 전 금액입니다.
              </p>
            </>
          )}
        </section>
      )}

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">퇴직금 계산 방식</h2>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" /><span>퇴직금 = 1일 평균임금 × 30일 × 재직연수</span></li>
          <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" /><span>평균임금: 퇴직 직전 3개월간 지급된 임금 총액 ÷ 3개월</span></li>
          <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" /><span>1년 미만 근무자는 법정 퇴직금 대상이 아닙니다</span></li>
          <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" /><span>상여금·수당은 3개월 평균에 포함됩니다</span></li>
          <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" /><span>퇴직 후 14일 이내 지급이 원칙입니다</span></li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">자주 묻는 질문</h2>
        <div className="space-y-4 text-sm text-slate-700">
          <div>
            <p className="font-semibold text-slate-900">Q. 퇴직금은 무조건 받을 수 있나요?</p>
            <p className="mt-1">A. 계속 근로기간이 1년 이상이고 주 15시간 이상 근무한 근로자라면 사업장 규모에 상관없이 퇴직금을 받을 수 있습니다.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Q. 퇴직연금(DC/DB)은 다르게 계산되나요?</p>
            <p className="mt-1">A. DB형은 퇴직 시 점 평균임금 기준으로 계산되며, DC형은 매년 임금의 1/12 이상을 개인 계좌에 적립합니다. 이 계산기는 법정 퇴직금 기준입니다.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Q. 퇴직금에도 세금이 부과되나요?</p>
            <p className="mt-1">A. 네, 퇴직소득세가 부과됩니다. 근속기간에 따라 공제율이 달라지며 장기 근속일수록 세율이 낮아집니다.</p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/calculators" className="text-blue-600 hover:underline">← 계산기 목록으로</Link>
        <Link href="/calculators/retirement-pension" className="text-blue-600 hover:underline">퇴직연금 계산기 →</Link>
        <Link href="/calculators/net-salary" className="text-blue-600 hover:underline">실수령액 계산기 →</Link>
      </div>
    </div>
  )
}
