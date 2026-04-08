'use client'

import { useState } from 'react'
import Link from 'next/link'
import { calculateNetSalary } from '../../../src/lib/calculators/netSalary'

const fmt = (n) => Math.round(n).toLocaleString('ko-KR')

export default function NetSalaryPage() {
  const [gross, setGross] = useState('')
  const [dependents, setDependents] = useState('1')
  const [result, setResult] = useState(null)

  const handleCalc = () => {
    const r = calculateNetSalary({ gross: Number(gross) * 10000, dependents: Number(dependents) })
    setResult(r)
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">실수령액 계산기</p>
        <h1 className="text-3xl font-semibold text-slate-900">급여 실수령액 계산기</h1>
        <p className="text-slate-600 mt-3 leading-relaxed">
          세전 급여를 입력하면 국민연금·건강보험·장기요양·고용보험·소득세·지방세를 공제한
          실수령액을 즉시 계산합니다. 2026년 4대보험 요율 기준.
        </p>
        <div className="flex flex-wrap gap-2 mt-4 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">2026년 기준</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">비과세 식대 20만원 포함</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">간이세액표 근사</span>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-5">계산 입력</h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">세전 월급 (만원)</label>
            <input
              type="number"
              value={gross}
              onChange={(e) => setGross(e.target.value)}
              placeholder="예: 350"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">부양가족 수 (본인 포함)</label>
            <select
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-400"
            >
              <option value="0">0명 (독신, 공제 없음)</option>
              <option value="1">1명 (본인만)</option>
              <option value="2">2명 (배우자 또는 자녀 1명)</option>
              <option value="3">3명 이상</option>
            </select>
          </div>
          <button
            onClick={handleCalc}
            disabled={!gross || Number(gross) <= 0}
            className="w-full rounded-full bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            계산하기
          </button>
        </div>
      </section>

      {result && (
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">계산 결과</h2>
          <div className="rounded-2xl bg-blue-600 p-6 text-white text-center mb-5">
            <p className="text-sm font-medium opacity-80 mb-1">실수령액 (월)</p>
            <p className="text-4xl font-bold">{fmt(result.net)}<span className="text-xl ml-1">원</span></p>
            <p className="text-sm opacity-70 mt-1">세전 {fmt(result.gross)}원에서 {fmt(result.totalDeduction)}원 공제</p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-slate-700 mb-3">공제 내역</p>
            {[
              ['국민연금 (4.5%)', result.nationalPension],
              ['건강보험 (3.545%)', result.healthInsurance],
              ['장기요양보험', result.longTermCare],
              ['고용보험 (0.9%)', result.employment],
              ['소득세 (간이세액)', result.incomeTax],
              ['지방소득세 (소득세 10%)', result.localTax],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-600">{label}</span>
                <span className="font-medium text-slate-900">{fmt(val)}원</span>
              </div>
            ))}
            <div className="flex justify-between py-2 font-semibold">
              <span className="text-slate-700">총 공제액</span>
              <span className="text-red-600">{fmt(result.totalDeduction)}원</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-base">
              <span className="text-slate-900">실수령액</span>
              <span className="text-blue-700">{fmt(result.net)}원</span>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">계산 방식 안내</h2>
        <ul className="space-y-2 text-sm text-slate-700">
          <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" /><span>국민연금: 월 급여 × 4.5% (근로자 부담)</span></li>
          <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" /><span>건강보험: 월 급여 × 3.545% (근로자 부담)</span></li>
          <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" /><span>장기요양: 건강보험료 × 12.95%</span></li>
          <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" /><span>고용보험: 월 급여 × 0.9% (근로자 부담)</span></li>
          <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" /><span>소득세: 국세청 근로소득 간이세액표 근사값 (비과세 식대 20만원 차감 후 계산)</span></li>
          <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" /><span>지방소득세: 소득세 × 10%</span></li>
        </ul>
        <p className="mt-4 text-xs text-slate-400">
          이 계산기는 2026년 기준 근사값을 제공합니다. 정확한 세액은 국세청 홈택스 간이세액표를 기준으로 달라질 수 있습니다.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">자주 묻는 질문</h2>
        <div className="space-y-4 text-sm text-slate-700">
          <div>
            <p className="font-semibold text-slate-900">Q. 실수령액이 생각보다 적은 이유는?</p>
            <p className="mt-1">A. 국민연금, 건강보험, 고용보험, 장기요양보험의 근로자 부담분과 소득세·지방소득세가 모두 공제됩니다. 세전 350만원 기준 약 40~50만원 내외가 공제됩니다.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Q. 부양가족 수란?</p>
            <p className="mt-1">A. 간이세액표상 부양가족 공제를 위한 인원입니다. 본인만 1명, 배우자 또는 자녀가 있으면 2명으로 입력합니다. 부양가족이 많을수록 소득세가 줄어듭니다.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900">Q. 비과세 식대가 뭔가요?</p>
            <p className="mt-1">A. 월 20만원 이하의 식대는 소득세 과세 대상에서 제외됩니다. 이 계산기는 기본적으로 20만원의 비과세 식대를 적용합니다.</p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/calculators" className="text-blue-600 hover:underline">← 계산기 목록으로</Link>
        <Link href="/calculators/severance-pay" className="text-blue-600 hover:underline">퇴직금 계산기 →</Link>
        <Link href="/calculators/annual-leave" className="text-blue-600 hover:underline">연차 계산기 →</Link>
      </div>
    </div>
  )
}
