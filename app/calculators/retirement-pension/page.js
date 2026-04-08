'use client'

import { useState } from 'react'
import Link from 'next/link'
import { calculateRetirementPension } from '../../../src/lib/calculators/retirementPension'

const fmt = (n) => Math.round(n).toLocaleString('ko-KR')
const fmtM = (n) => (n >= 100000000 ? `${(n / 100000000).toFixed(1)}억` : `${(n / 10000).toFixed(0)}만`)

export default function RetirementPensionPage() {
  const [form, setForm] = useState({
    currentAge: '40',
    retirementAge: '65',
    currentBalance: '5000',
    monthlyContribution: '50',
    expectedAnnualReturn: '5',
    payoutYears: '25',
    targetMonthlyExpense: '200',
  })
  const [result, setResult] = useState(null)

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const handleCalc = () => {
    const r = calculateRetirementPension({
      currentAge: Number(form.currentAge),
      retirementAge: Number(form.retirementAge),
      currentBalance: Number(form.currentBalance) * 10000,
      monthlyContribution: Number(form.monthlyContribution) * 10000,
      expectedAnnualReturn: Number(form.expectedAnnualReturn) / 100,
      payoutYears: Number(form.payoutYears),
      targetMonthlyExpense: Number(form.targetMonthlyExpense) * 10000,
    })
    setResult(r)
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">퇴직연금 계산기</p>
        <h1 className="text-3xl font-semibold text-slate-900">퇴직연금 운용 계산기</h1>
        <p className="text-slate-600 mt-3 leading-relaxed">
          현재 나이·적립금·월 납입액·기대수익률을 입력하면 은퇴 시점 예상 적립금과
          월 수령액, 목표 생활비 대비 부족분을 계산합니다.
        </p>
        <div className="flex flex-wrap gap-2 mt-4 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">복리 계산</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">시나리오 3가지 제공</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">부족분 분석</span>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-5">계산 입력</h2>
        <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
          {[
            { label: '현재 나이', key: 'currentAge', unit: '세', placeholder: '40' },
            { label: '은퇴 예정 나이', key: 'retirementAge', unit: '세', placeholder: '65' },
            { label: '현재 적립금', key: 'currentBalance', unit: '만원', placeholder: '5000' },
            { label: '월 납입액', key: 'monthlyContribution', unit: '만원', placeholder: '50' },
            { label: '기대 연 수익률', key: 'expectedAnnualReturn', unit: '%', placeholder: '5' },
            { label: '수령 기간', key: 'payoutYears', unit: '년', placeholder: '25' },
            { label: '목표 월 생활비', key: 'targetMonthlyExpense', unit: '만원', placeholder: '200' },
          ].map(({ label, key, unit, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{label} ({unit})</label>
              <input
                type="number"
                value={form[key]}
                onChange={set(key)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleCalc}
          className="mt-5 w-full max-w-2xl rounded-full bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          계산하기
        </button>
      </section>

      {result && (
        <>
          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-5">계산 결과</h2>
            <div className="grid gap-4 sm:grid-cols-2 mb-5">
              <div className="rounded-2xl bg-blue-600 p-5 text-white text-center">
                <p className="text-xs font-medium opacity-70 mb-1">은퇴 시 예상 적립금</p>
                <p className="text-3xl font-bold">{fmtM(result.expectedRetirementBalance)}</p>
                <p className="text-xs opacity-70 mt-1">{fmt(result.expectedRetirementBalance)}원</p>
              </div>
              <div className="rounded-2xl bg-slate-800 p-5 text-white text-center">
                <p className="text-xs font-medium opacity-70 mb-1">월 수령 예상액</p>
                <p className="text-3xl font-bold">{fmt(result.expectedMonthlyPension)}<span className="text-base ml-1">원</span></p>
                <p className="text-xs opacity-70 mt-1">목표 대비 {result.replacementRate.toFixed(0)}% 충족</p>
              </div>
            </div>

            {result.monthlyGap > 0 && (
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 mb-4">
                <p className="text-sm font-semibold text-amber-800 mb-1">월 부족분: {fmt(result.monthlyGap)}원</p>
                <p className="text-xs text-amber-700">목표 월 생활비 충족을 위해 월 {fmt(result.additionalContribution)}원 추가 납입이 필요합니다.</p>
                {result.recommendedDelayYears > 0 && (
                  <p className="text-xs text-amber-700 mt-1">또는 은퇴 시기를 {result.recommendedDelayYears}년 늦추면 목표 달성 가능합니다.</p>
                )}
              </div>
            )}

            <div className="space-y-2 text-sm">
              <p className="font-semibold text-slate-700 mb-3">주요 수치</p>
              {[
                ['은퇴까지 남은 기간', `${result.yearsToRetirement}년 (${result.monthsToRetirement}개월)`],
                ['수령 기간', `${Math.round(result.payoutMonths / 12)}년`],
                ['목표 충족률', `${result.replacementRate.toFixed(1)}%`],
                ['필요 적립금 (목표 달성)', `${fmt(result.requiredBalance)}원`],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-medium text-slate-900">{val}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">수익률 시나리오</h2>
            <div className="space-y-2 text-sm">
              {result.scenarios.map((s, i) => (
                <div key={i} className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-600">수익률 {(s.annualReturn * 100).toFixed(0)}% 시나리오</span>
                  <span className="font-medium text-slate-900">월 {fmt(s.monthlyPension)}원</span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">자주 묻는 질문</h2>
        <div className="space-y-4 text-sm text-slate-700">
          <div>
            <p className="font-semibold text-slate-900">Q. DB형과 DC형 중 어느 것이 유리한가요?</p>
            <p className="mt-1">A. DB형은 최종 평균임금 기준으로 지급해 임금 상승이 높을수록 유리합니다. DC형은 운용 수익에 따라 달라지며 이직이 잦거나 투자에 적극적이라면 DC형이 유리할 수 있습니다.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Q. IRP 추가 납입 시 세액공제는?</p>
            <p className="mt-1">A. 연금저축·IRP 합산 연 900만원 한도 내에서 납입액의 13.2~16.5%를 세액공제 받을 수 있습니다. (총급여 5500만원 초과 시 13.2%)</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Q. 수익률 몇 %로 설정하면 적절한가요?</p>
            <p className="mt-1">A. 안정형 포트폴리오는 3~4%, 혼합형은 5~6%, 성장형은 6~8% 수준으로 설정합니다. 장기 평균 인플레이션(2~3%)을 감안한 실질 수익률을 확인하는 것이 좋습니다.</p>
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
