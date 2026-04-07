import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CalculatorTemplate from "../components/CalculatorTemplate";
import { formatCurrency, formatNumber } from "../lib/formatters";
import { SITE_CONFIG } from "../config/siteConfig";
import { calculateRetirementPension } from "../lib/calculators/retirementPension";

const UPDATED_AT = SITE_CONFIG.updatedAt;

const RetirementPensionCalculator = () => {
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(60);
  const [currentBalance, setCurrentBalance] = useState(20000000);
  const [monthlyContribution, setMonthlyContribution] = useState(300000);
  const [expectedAnnualReturn, setExpectedAnnualReturn] = useState(0.045);
  const [payoutYears, setPayoutYears] = useState(20);
  const [targetMonthlyExpense, setTargetMonthlyExpense] = useState(2500000);

  const result = useMemo(
    () =>
      calculateRetirementPension({
        currentAge,
        retirementAge,
        currentBalance,
        monthlyContribution,
        expectedAnnualReturn,
        payoutYears,
        targetMonthlyExpense,
      }),
    [
      currentAge,
      retirementAge,
      currentBalance,
      monthlyContribution,
      expectedAnnualReturn,
      payoutYears,
      targetMonthlyExpense,
    ]
  );

  const summaryLines = [
    `은퇴까지 ${result.yearsToRetirement}년 기준 예상 적립금 ${formatCurrency(result.expectedRetirementBalance)}`,
    `예상 월 연금 ${formatCurrency(result.expectedMonthlyPension)} (수령 ${payoutYears}년 가정)`,
    `목표생활비 대비 ${formatNumber(result.replacementRate)}% 충족`,
  ];

  const steps = [
    "현재 적립금의 은퇴 시점 미래가치 계산",
    "월 납입액의 적립 미래가치 계산",
    "은퇴 시 총자산을 연금 수령기간으로 나누어 월 수령액 산출",
    "목표생활비 대비 충족률 및 부족액 진단",
  ];

  const scenarios = result.scenarios.map((scenario) => ({
    rate: `${formatNumber(scenario.annualReturn * 100)}%`,
    balance: formatCurrency(scenario.totalBalance),
    monthly: formatCurrency(scenario.monthlyPension),
  }));

  return (
    <CalculatorTemplate
      seo={{
        title: "퇴직연금 운용계산기",
        description:
          "현재 적립금, 월 납입액, 기대수익률로 은퇴 시점 적립금과 예상 월 연금, 부족분 대안을 확인하는 퇴직연금 운용계산기입니다.",
        path: "/calculators/retirement-pension",
      }}
      breadcrumbs={[
        { label: "홈", path: "/" },
        { label: "계산기 허브", path: "/calculators" },
        { label: "퇴직연금 운용계산기", path: "/calculators/retirement-pension" },
      ]}
      title="퇴직연금 운용계산기"
      description="은퇴 시점 예상 적립금과 월 수령액을 계산하고, 목표 생활비가 부족할 때 추가 납입액/은퇴 연기 등 대체 시나리오를 함께 보여줍니다."
      updatedAt={UPDATED_AT}
      summaryLines={summaryLines}
      steps={steps}
      quickStats={[
        { label: "기준 업데이트", value: UPDATED_AT },
        { label: "기본 수익률", value: `${formatNumber(expectedAnnualReturn * 100)}%` },
        { label: "연금 수령기간", value: `${payoutYears}년` },
      ]}
      keyPoints={[
        "입력값 변경 시 예상 적립금/월 연금/충족률이 즉시 갱신됩니다.",
        "부족 시 필요한 월 추가 납입액을 역산해 제시합니다.",
        "수익률 -1%p / 기준 / +1%p 시나리오를 한 화면에서 비교합니다.",
      ]}
      inputGuide={[
        "기대수익률은 장기 평균 가정값으로 입력하세요.",
        "목표생활비는 은퇴 후 월 고정지출 기준으로 입력하세요.",
        "결과는 시뮬레이션 값이며 실제 수익률/세금/수수료에 따라 달라질 수 있습니다.",
      ]}
      faqs={[
        {
          question: "예상 월 연금이 실제 수령액과 다른 이유는 무엇인가요?",
          answer:
            "시장 수익률 변동, 세금, 수수료, 상품 구조, 수령 방식에 따라 실제 금액은 달라질 수 있습니다.",
        },
        {
          question: "목표생활비가 부족하면 먼저 무엇을 조정해야 하나요?",
          answer:
            "일반적으로 월 납입액을 우선 조정하고, 필요하면 은퇴 시점과 수령기간을 함께 조정하는 방식이 현실적입니다.",
        },
        {
          question: "수익률을 높게 입력하면 정확도가 떨어지나요?",
          answer:
            "수익률이 높을수록 변동성과 불확실성이 커집니다. 보수/기준/공격 시나리오를 함께 보는 것을 권장합니다.",
        },
      ]}
      sources={[
        "금융감독원 통합연금포털 및 퇴직연금 안내자료",
        "고용노동부 퇴직연금 제도 안내",
        `기준일: ${UPDATED_AT} (시뮬레이션 목적)`,
      ]}
      relatedLinks={[
        { title: "퇴직금 계산기", path: "/calculators/severance-pay" },
        { title: "연봉 실수령액 계산기", path: "/calculators/net-salary" },
        { title: "연차 계산기", path: "/calculators/annual-leave" },
        { title: "계산기 허브로 이동", path: "/calculators", featured: true },
      ]}
      trust={{
        checklist: [
          "현재 퇴직연금 계좌 잔액(최근 평가금액)",
          "월 평균 납입액(회사+개인 부담 포함)",
          "은퇴 목표 시점과 목표 생활비",
        ],
        disputePoints: [
          "상품별 수수료/보수 반영 방식 차이",
          "원리금보장형/실적배당형 비중에 따른 결과 차이",
          "연금 수령기간 선택에 따른 월수령액 편차",
        ],
        notices: [
          "본 계산 결과는 참고용 시뮬레이션이며 투자 성과를 보장하지 않습니다.",
          "세금, 물가, 수수료, 실제 운용성과에 따라 수령액은 변동될 수 있습니다.",
        ],
      }}
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-700">
            현재 나이
            <input
              type="number"
              min={20}
              max={70}
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-right"
            />
          </label>
          <label className="text-sm text-slate-700">
            은퇴 예정 나이
            <input
              type="number"
              min={40}
              max={80}
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-right"
            />
          </label>
          <label className="text-sm text-slate-700">
            현재 적립금 (원)
            <input
              type="number"
              min={0}
              step={100000}
              value={currentBalance}
              onChange={(e) => setCurrentBalance(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-right"
            />
          </label>
          <label className="text-sm text-slate-700">
            월 납입액 (원)
            <input
              type="number"
              min={0}
              step={10000}
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-right"
            />
          </label>
          <label className="text-sm text-slate-700">
            기대 수익률 (%)
            <input
              type="number"
              min={0}
              max={15}
              step={0.1}
              value={formatNumber(expectedAnnualReturn * 100)}
              onChange={(e) => setExpectedAnnualReturn(Number(e.target.value) / 100)}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-right"
            />
          </label>
          <label className="text-sm text-slate-700">
            목표 생활비 (월, 원)
            <input
              type="number"
              min={0}
              step={100000}
              value={targetMonthlyExpense}
              onChange={(e) => setTargetMonthlyExpense(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-right"
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-600">연금 수령기간</p>
          {[10, 20, 30].map((years) => (
            <button
              key={years}
              type="button"
              onClick={() => setPayoutYears(years)}
              className={`rounded-full px-4 py-1.5 text-sm border transition-colors ${
                payoutYears === years
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-700 border-slate-200 hover:border-blue-400"
              }`}
            >
              {years}년
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 space-y-2">
          <div className="flex justify-between text-sm text-slate-700">
            <span>은퇴 시점 예상 적립금</span>
            <span className="font-semibold">{formatCurrency(result.expectedRetirementBalance)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-700">
            <span>예상 월 연금</span>
            <span className="font-semibold">{formatCurrency(result.expectedMonthlyPension)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-700">
            <span>목표 대비 충족률</span>
            <span className="font-semibold">{formatNumber(result.replacementRate)}%</span>
          </div>
          <div className="border-t border-blue-200 pt-2 flex justify-between text-sm text-slate-700">
            <span>월 부족액</span>
            <span className="font-semibold text-rose-600">{formatCurrency(result.monthlyGap)}</span>
          </div>
        </div>

        <section className="rounded-xl border border-slate-100 bg-white p-5">
          <h3 className="text-base font-semibold text-slate-900 mb-3">부족 시 대체방안</h3>
          <div className="grid gap-3 md:grid-cols-3 text-sm">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-slate-500">추가 납입 필요액(월)</p>
              <p className="mt-1 font-semibold text-slate-900">{formatCurrency(result.additionalContribution)}</p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-slate-500">목표 달성 권장 연기기간</p>
              <p className="mt-1 font-semibold text-slate-900">
                {result.recommendedDelayYears > 0 ? `${result.recommendedDelayYears}년` : "현재 조건 유지 가능"}
              </p>
            </div>
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-slate-500">목표 달성 필요 적립금</p>
              <p className="mt-1 font-semibold text-slate-900">{formatCurrency(result.requiredBalance)}</p>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-100 bg-white p-5">
          <h3 className="text-base font-semibold text-slate-900 mb-3">수익률 시나리오 비교</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="py-2 text-left">기대수익률</th>
                  <th className="py-2 text-right">은퇴시 적립금</th>
                  <th className="py-2 text-right">예상 월연금</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((scenario) => (
                  <tr key={scenario.rate} className="border-b border-slate-100">
                    <td className="py-2 text-slate-700">{scenario.rate}</td>
                    <td className="py-2 text-right text-slate-700">{scenario.balance}</td>
                    <td className="py-2 text-right font-medium text-slate-900">{scenario.monthly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            수익률 1%p 변화만으로 결과가 크게 달라질 수 있으므로 보수/기준/공격 시나리오를 함께 검토하세요.
          </p>
        </section>

        <section className="rounded-xl border border-slate-100 bg-white p-5">
          <h3 className="text-base font-semibold text-slate-900 mb-2">연계 계산기</h3>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/calculators/severance-pay"
              className="rounded-full border border-slate-200 px-4 py-1.5 text-sm text-slate-700 hover:border-blue-400 hover:text-blue-700"
            >
              퇴직금 계산기
            </Link>
            <Link
              to="/calculators"
              className="rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm text-blue-700 hover:bg-blue-100"
            >
              계산기 허브로 이동
            </Link>
          </div>
        </section>

        <section className="rounded-xl border border-slate-100 bg-white p-5">
          <h3 className="text-base font-semibold text-slate-900 mb-2">시나리오 랜딩</h3>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/retirement-pension/scenario/conservative"
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm text-blue-700 hover:border-blue-400"
            >
              안정형
            </Link>
            <Link
              to="/retirement-pension/scenario/balanced"
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm text-blue-700 hover:border-blue-400"
            >
              균형형
            </Link>
            <Link
              to="/retirement-pension/scenario/growth"
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm text-blue-700 hover:border-blue-400"
            >
              성장형
            </Link>
          </div>
        </section>
      </div>
    </CalculatorTemplate>
  );
};

export default RetirementPensionCalculator;
