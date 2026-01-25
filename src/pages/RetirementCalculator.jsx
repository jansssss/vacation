import React, { useMemo, useState } from "react";
import CalculatorTemplate from "../components/CalculatorTemplate";
import { calculateSeverancePay } from "../lib/calculators/severancePay";
import { formatCurrency, formatNumber } from "../lib/formatters";
import { RULES_2026 } from "../config/rules/2026";

const RetirementCalculator = () => {
  const [avgMonthlyWage, setAvgMonthlyWage] = useState(3000000);
  const [years, setYears] = useState(3);
  const [months, setMonths] = useState(0);

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

  const relatedLinks = [
    { title: "연차 계산기", path: "/calculators/annual-leave" },
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
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-baseline justify-between">
              <p className="text-sm text-emerald-700">예상 퇴직금</p>
              <p className="text-2xl font-semibold text-emerald-800">
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
      </div>
    </CalculatorTemplate>
  );
};

export default RetirementCalculator;
