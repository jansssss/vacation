import React, { useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import CalculatorTemplate from "../components/CalculatorTemplate";
import { calculateSeverancePay } from "../lib/calculators/severancePay";
import { formatCurrency, formatNumber } from "../lib/formatters";
import { RULES_2026 } from "../config/rules/2026";
import { RETIREMENT_BUCKETS } from "../data/retirementBuckets";

const RetirementCalculator = () => {
  const [searchParams] = useSearchParams();
  const [avgMonthlyWage, setAvgMonthlyWage] = useState(Number(searchParams.get("salary")) || 3000000);
  const [years, setYears] = useState(Number(searchParams.get("years")) || 3);
  const [months, setMonths] = useState(Number(searchParams.get("months")) || 0);

  const result = useMemo(() => {
    return calculateSeverancePay({ avgMonthlyWage, years, months });
  }, [avgMonthlyWage, years, months]);

  const summaryLines = result && !result.error
    ? [
        `예상 퇴직금: ${formatCurrency(result.pay)}`,
        `근속기간: ${years}년 ${months}개월 (환산 ${formatNumber(result.serviceYears)}년)`,
        `평균임금 산정 기간: 최근 ${result.averageWagePeriodMonths}개월 기준`,
      ]
    : [
        "평균임금과 근속기간을 입력하면 예상 퇴직금을 계산합니다.",
        "정기상여/연장수당 포함 여부를 급여대장에서 확인하세요.",
        "법적 판단이 필요한 경우 전문가 상담을 권장합니다.",
      ];

  const steps = [
    `최근 ${RULES_2026.severancePay.averageWagePeriodMonths}개월 평균임금 입력`,
    `근속기간 ${years}년 ${months}개월을 연 단위로 환산`,
    `평균임금 × 근속연수로 예상 퇴직금 계산`,
  ];

  const exceptions = [
    "1년 미만 근속자의 지급 요건은 계약 형태에 따라 달라질 수 있습니다.",
    "상여금/연장수당이 최근 3개월에 포함되었는지 확인이 필요합니다.",
    "퇴직 직전 급여 변동이 있으면 평균임금 산정에 영향을 줍니다.",
    "휴직/휴업 기간은 평균임금 산정 제외 여부를 따로 확인해야 합니다.",
    "퇴직연금 가입 사업장은 지급 방식이 다를 수 있습니다.",
  ];

  const cases = [
    "사례 1) 최근 3개월 평균임금 3,200,000원, 근속 4년: 예상 퇴직금 12,800,000원. 상여/연장수당 포함 여부를 급여대장에서 확인.",
    "사례 2) 근속 11개월 퇴사: 원칙적으로 퇴직금 대상에서 제외될 수 있으나 계약 형태/판례 확인 필요.",
    "사례 3) 퇴직 직전 2개월 급여가 10% 인상된 경우: 평균임금 계산 기준이 달라져 예상액이 증가할 수 있음.",
  ];

  const faqs = [
    {
      question: "퇴직금은 언제 지급해야 하나요?",
      answer: "통상 퇴직일로부터 14일 이내 지급이 원칙이나 회사 사정에 따라 협의할 수 있습니다.",
    },
    {
      question: "평균임금 산정에 상여금이 포함되나요?",
      answer: "최근 3개월 내 정기상여가 있다면 포함될 수 있어 급여대장을 확인해야 합니다.",
    },
    {
      question: "연장수당도 평균임금에 포함되나요?",
      answer: "정기적으로 지급되는 연장수당은 평균임금에 반영될 수 있습니다.",
    },
    {
      question: "1년 미만 근속자는 퇴직금을 받을 수 없나요?",
      answer: "일반적으로 1년 이상 근속이 기준이지만 예외가 있을 수 있어 확인이 필요합니다.",
    },
    {
      question: "퇴직 직전 급여가 크게 변동되면 어떻게 되나요?",
      answer: "평균임금 산정 기간 내 변동이 반영되므로 계산 결과가 달라질 수 있습니다.",
    },
    {
      question: "평균임금 산정 기간은 어떻게 계산하나요?",
      answer: "통상 퇴직일 이전 3개월의 임금을 기준으로 합니다.",
    },
    {
      question: "퇴직연금(DB/DC) 가입 시 계산이 다른가요?",
      answer: "지급 방식과 계산 기준이 다를 수 있어 제도별 안내를 확인해야 합니다.",
    },
    {
      question: "무급휴직 기간이 평균임금에 포함되나요?",
      answer: "휴직 기간 제외 여부는 규정과 해석에 따라 다를 수 있습니다.",
    },
    {
      question: "퇴직금 계산 결과와 실제 지급액 차이가 있을 수 있나요?",
      answer: "임금 항목 포함 여부와 근속 산정 기준에 따라 차이가 발생할 수 있습니다.",
    },
    {
      question: "계산 결과를 문서로 제출해도 되나요?",
      answer: "내부 참고용으로 활용하고, 공식 산정은 인사팀 검토가 필요합니다.",
    },
  ];

  const sources = [
    "근로기준법상 퇴직급여 산정 기준(요약 적용)",
    `기준일: ${RULES_2026.effectiveDate} / 업데이트: ${RULES_2026.updatedAt}`,
    "평균임금 포함 항목은 급여대장과 사내 규정으로 확인 필요",
  ];

  const keyPoints = [
    "최근 3개월 평균임금을 기준으로 산정합니다.",
    "근속기간(년/개월)을 입력해 환산 연수를 계산합니다.",
    "1년 미만 근속자는 지급 요건을 별도 확인해야 합니다.",
  ];

  const inputGuide = [
    "최근 3개월 평균임금(원)을 입력합니다.",
    "근속 연수와 추가 개월을 입력합니다.",
    "상여/연장수당 포함 여부를 급여대장에서 확인합니다.",
  ];

  const quickStats = [
    { label: "기준일", value: RULES_2026.effectiveDate },
    { label: "업데이트", value: RULES_2026.updatedAt },
    { label: "산정 기준", value: `최근 ${RULES_2026.severancePay.averageWagePeriodMonths}개월` },
  ];

  const exampleCalc = {
    title: "예시: 평균임금 3,000,000원 · 근속 3년",
    input: "최근 3개월 평균임금 3,000,000원, 근속 3년 0개월",
    output: "예상 퇴직금: 9,000,000원",
    note: "상여/연장수당 포함 여부에 따라 달라질 수 있습니다.",
  };

  const relatedLinks = [
    { title: "연차 계산기", path: "/calculators/annual-leave" },
    { title: "퇴직연금 운용계산기", path: "/calculators/retirement-pension", featured: true },
    { title: "실수령액 계산기", path: "/calculators/net-salary" },
    { title: "퇴직금 지급 대상 판단 기준", path: "/guides/severance-pay-eligibility" },
    { title: "평균임금 산정 시 포함/제외 항목", path: "/guides/severance-pay-average-wage" },
    { title: "퇴직금 정산 서류 체크리스트", path: "/guides/severance-pay-docs" },
    { title: "연차 기본 규칙 한 장 요약", path: "/guides/annual-leave-basics" },
    { title: "무급휴직이 연차/퇴직금에 미치는 영향", path: "/guides/unpaid-leave-impact" },
    { title: "급여명세서 읽는 법", path: "/guides/payroll-slip-reading" },
    { title: "연차수당 정산 시 흔한 오류", path: "/guides/annual-leave-encashment" },
    { title: "계산기 허브로 이동", path: "/calculators" },
  ];

  const trust = {
    checklist: [
      "최근 3개월 급여대장 및 근태 기록 확보",
      "정기상여/연장수당 포함 여부 확인",
      "근속기간 산정 기준일 문서화",
      "퇴직연금(DB/DC) 여부와 지급 방식 확인",
      "퇴직금 지급 일정 및 지급 내역 검토",
      "직원 설명 자료(FAQ) 사전 준비",
    ],
    disputePoints: [
      "평균임금 포함 항목에 대한 해석 차이",
      "1년 미만 근속자의 지급 여부",
      "퇴직 직전 급여 변동에 따른 평균임금 산정",
    ],
    notices: [
      "퇴직금 산정은 최근 3개월 평균임금을 기준으로 하며, 포함 항목은 급여대장에서 확인됩니다.",
      "퇴직금 지급 일정은 퇴직일 기준 14일 이내 지급 원칙이나 협의로 조정될 수 있습니다.",
      "퇴직연금(DB/DC) 가입자는 제도별 산정 기준이 다르니 별도 안내를 참고해 주세요.",
    ],
  };

  const breadcrumbs = [
    { label: "홈", path: "/" },
    { label: "계산기", path: "/calculators" },
    { label: "퇴직금 계산기", path: "/calculators/severance-pay" },
  ];

  return (
    <CalculatorTemplate
      seo={{
        title: "퇴직금 계산기",
        description: "평균임금과 근속기간을 입력하면 예상 퇴직금을 단계별로 계산합니다.",
        path: "/calculators/severance-pay",
      }}
      breadcrumbs={breadcrumbs}
      title="퇴직금 계산기"
      description="평균임금과 근속기간을 입력하면 예상 퇴직금을 계산하고, 실무 예외와 FAQ까지 제공합니다."
      updatedAt={RULES_2026.updatedAt}
      summaryLines={summaryLines}
      keyPoints={keyPoints}
      inputGuide={inputGuide}
      quickStats={quickStats}
      exampleCalc={exampleCalc}
      steps={steps}
      exceptions={exceptions}
      cases={cases}
      faqs={faqs}
      sources={sources}
      relatedLinks={relatedLinks}
      trust={trust}
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="text-sm text-slate-600 md:col-span-2">
            최근 3개월 평균임금 (원)
            <input
              type="number"
              value={avgMonthlyWage}
              onChange={(event) => setAvgMonthlyWage(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-right"
              min={0}
            />
          </label>
          <label className="text-sm text-slate-600">
            근속 연수 (년)
            <input
              type="number"
              value={years}
              onChange={(event) => setYears(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-right"
              min={0}
            />
          </label>
          <label className="text-sm text-slate-600">
            추가 근속 (개월)
            <input
              type="number"
              value={months}
              onChange={(event) => setMonths(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-right"
              min={0}
              max={11}
            />
          </label>
        </div>

        {result && result.error && (
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600">
            {result.error}
          </div>
        )}

        {!result.error && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-baseline justify-between">
              <p className="text-sm text-blue-700">예상 퇴직금</p>
              <p className="text-2xl font-semibold text-blue-800">
                {formatCurrency(result.pay)}
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>근속기간 환산</span>
                <span>{formatNumber(result.serviceYears)}년</span>
              </div>
              <div className="flex justify-between">
                <span>평균임금 기준</span>
                <span>최근 {result.averageWagePeriodMonths}개월</span>
              </div>
            </div>
          </div>
        )}

        <section className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-indigo-900">퇴직금 다음 단계 계산</p>
              <p className="text-sm text-indigo-800">
                퇴직연금 운용계산기에서 은퇴 시점 적립금, 월 연금, 부족분 대안을 이어서 확인할 수 있습니다.
              </p>
            </div>
            <Link
              to="/calculators/retirement-pension"
              className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              퇴직연금 운용계산기로 이동
            </Link>
          </div>
        </section>

        <section className="mt-12 space-y-8 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">퇴직금 계산의 핵심 원리</h2>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed">
                퇴직금은 근로자퇴직급여 보장법에 따라 <strong>계속근로기간 1년에 대하여 30일분 이상의 평균임금</strong>을 지급하도록 규정되어 있습니다.
                평균임금은 퇴직 전 3개월간 지급받은 임금 총액을 그 기간의 총 일수로 나눈 금액이며,
                여기에 근속연수를 곱하여 퇴직금을 산정합니다.
              </p>
              <p className="text-slate-700 leading-relaxed mt-4">
                <strong>계속근로기간 1년 미만인 경우</strong>에는 원칙적으로 퇴직금 지급 대상이 아니지만,
                4주간을 평균하여 1주간의 소정근로시간이 15시간 이상이고 계속 근로한 경우에는 예외적으로 지급 대상이 될 수 있습니다.
                또한 정기상여금, 연장근로수당 등이 평균임금 산정에 포함되는지 여부를 반드시 확인해야 합니다.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">실무에서 자주 나오는 사례</h2>
            <div className="space-y-6">
              <div className="rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">사례 1. "11개월 근무 후 퇴사, 퇴직금 못 받나요?"</h3>
                <p className="text-slate-700 leading-relaxed">
                  원칙적으로 1년 미만 근로자는 퇴직금 지급 대상이 아닙니다. 하지만 <strong>주 15시간 이상 계속 근로한 경우</strong>에는 예외가 적용될 수 있습니다.
                  또한 계약서에 "1년 미만이라도 퇴직금을 지급한다"는 내용이 있다면 그에 따라야 합니다.
                  11개월 근무로 퇴직금을 못 받는 경우가 억울하게 느껴질 수 있지만, 이는 법적 기준이므로
                  입사 시 계약 내용과 근로시간을 명확히 확인하는 것이 중요합니다.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">사례 2. "상여금이 평균임금에 포함되나요?"</h3>
                <p className="text-slate-700 leading-relaxed">
                  <strong>정기상여금은 평균임금 산정에 포함</strong>됩니다. 예를 들어 매년 설날과 추석에 지급되는 상여금은
                  퇴직 전 3개월 동안 받은 상여금을 3개월 일수로 나눠 평균임금에 산입해야 합니다.
                  그러나 회사가 임의로 지급하는 일시적 상여금이나 성과급은 포함되지 않을 수 있으므로,
                  급여명세서와 취업규칙을 함께 확인해야 합니다. 상여금 누락으로 인한 퇴직금 정산 분쟁이 매우 많습니다.
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">사례 3. "퇴직 직전 2개월 급여가 오른 경우"</h3>
                <p className="text-slate-700 leading-relaxed">
                  퇴직 전 3개월의 평균임금으로 계산하므로, <strong>퇴직 직전 급여 인상이 퇴직금에 반영</strong>됩니다.
                  예를 들어 월급 300만 원에서 350만 원으로 인상된 경우, 최근 3개월 평균이 높아지므로 퇴직금도 증가합니다.
                  반대로 무급휴직이나 급여 삭감이 있었다면 평균임금이 낮아져 퇴직금이 줄어들 수 있습니다.
                  이러한 이유로 급여 변동 시기와 퇴사 시점을 함께 고려하는 것이 중요합니다.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">자주 묻는 질문 FAQ</h2>
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Q. 퇴직금은 언제까지 지급해야 하나요?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  퇴직금은 <strong>퇴직일로부터 14일 이내에 지급</strong>해야 합니다.
                  다만, 근로자와 사용자 간 합의로 지급 기일을 연장할 수 있습니다.
                  14일을 초과하여 지급하는 경우 지연이자(연 20%)가 발생할 수 있으므로 주의가 필요합니다.
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Q. 평균임금과 통상임금은 어떻게 다른가요?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  평균임금은 퇴직 전 3개월간 받은 총 임금을 총 일수로 나눈 것이고,
                  통상임금은 정기적·일률적·고정적으로 지급되는 임금입니다.
                  퇴직금은 평균임금 기준으로 계산하며, 평균임금이 통상임금보다 낮을 경우 통상임금을 기준으로 계산합니다.
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Q. 무급휴직 기간은 퇴직금에 포함되나요?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  일반 무급휴직 기간은 계속근로기간에서 제외되어 퇴직금 계산 시 포함되지 않습니다.
                  단, 육아휴직은 근로한 것으로 간주되어 계속근로기간에 포함됩니다.
                  휴직 종류에 따라 처리 방식이 다르므로 취업규칙과 노동부 행정해석을 확인해야 합니다.
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Q. 퇴직연금과 퇴직금은 어떻게 다른가요?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  퇴직금은 회사가 퇴사 시 일시금으로 지급하는 방식이고,
                  퇴직연금은 회사가 매년 일정 금액을 금융기관에 적립하여 근로자가 퇴직 후 연금 또는 일시금으로 받는 방식입니다.
                  퇴직연금 가입 사업장은 퇴직연금 규약에 따라 지급 방식이 달라질 수 있습니다.
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-5">
                <h3 className="text-base font-semibold text-slate-900 mb-2">Q. 계약직도 퇴직금을 받을 수 있나요?</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  계약직도 1년 이상 계속 근로했다면 퇴직금을 받을 수 있습니다.
                  계약 기간이 1년 미만이더라도 계약이 반복 갱신되어 실제 근로 기간이 1년 이상이면 지급 대상입니다.
                  다만, 주 15시간 미만 근로자는 제외될 수 있으므로 근로계약서를 확인해야 합니다.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">공식 출처 및 참고 자료</h2>
            <ul className="space-y-2 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>근로자퇴직급여 보장법 제8조 (퇴직금 지급)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>근로기준법 제2조 (평균임금의 정의)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>고용노동부 퇴직금 가이드 (www.moel.go.kr)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">•</span>
                <span>대법원 판례 (평균임금 산정 관련)</span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed">
              이 계산기는 참고용이며, 최종 판단은 급여명세서, 근로계약서, 취업규칙, 노무사 상담 등을 통해 확인하시기 바랍니다.
              특히 정기상여금, 연장수당, 휴직 기간 등 복잡한 경우에는 전문가의 검토가 필요합니다.
            </p>
          </div>
        </section>

        {/* 근속기간별 퇴직금 빠른 확인 */}
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-1">근속기간별 퇴직금 빠른 확인</h2>
          <p className="text-sm text-slate-500 mb-4">근속기간을 선택하면 해당 기간 기준 퇴직금 예시를 바로 확인합니다.</p>
          <div className="flex flex-wrap gap-2">
            {RETIREMENT_BUCKETS.map((b) => (
              <Link
                key={b.slug}
                to={b.path}
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-700 hover:border-blue-400 hover:text-blue-700 transition-colors"
              >
                근속 {b.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </CalculatorTemplate>
  );
};

export default RetirementCalculator;
