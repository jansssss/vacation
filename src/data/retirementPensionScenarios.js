const number = (n) => Math.round(n).toLocaleString("ko-KR");

const SCENARIOS = [
  {
    slug: "conservative",
    label: "안정형",
    annualReturn: 0.035,
    allocation: "원리금보장형 중심",
    monthlyContribution: 300000,
    yearsToRetire: 25,
    title: "퇴직연금 안정형 운용 시뮬레이션",
    description:
      "기대수익률을 낮게 두고 변동성을 줄이는 안정형 운용 기준으로 예상 적립금과 월 연금 수준을 확인합니다.",
  },
  {
    slug: "balanced",
    label: "균형형",
    annualReturn: 0.045,
    allocation: "채권/주식 혼합",
    monthlyContribution: 300000,
    yearsToRetire: 25,
    title: "퇴직연금 균형형 운용 시뮬레이션",
    description:
      "안정성과 수익성을 균형 있게 고려한 운용 기준으로 은퇴 시점 예상 자산과 수령액을 계산합니다.",
  },
  {
    slug: "growth",
    label: "성장형",
    annualReturn: 0.055,
    allocation: "실적배당형 비중 확대",
    monthlyContribution: 300000,
    yearsToRetire: 25,
    title: "퇴직연금 성장형 운용 시뮬레이션",
    description:
      "기대수익률을 높게 가정해 장기 복리 효과를 확인하는 성장형 운용 시나리오입니다.",
  },
];

export const RETIREMENT_PENSION_SCENARIOS = SCENARIOS.map((scenario) => {
  const years = scenario.yearsToRetire;
  const months = years * 12;
  const monthlyRate = Math.pow(1 + scenario.annualReturn, 1 / 12) - 1;
  const fvContrib =
    scenario.monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const principal = fvContrib;
  const payoutMonths = 20 * 12;
  const monthlyPension = principal * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -payoutMonths)));

  return {
    ...scenario,
    path: `/retirement-pension/scenario/${scenario.slug}`,
    expectedBalance: Math.round(principal),
    expectedMonthlyPension: Math.round(monthlyPension),
    summaryLines: [
      `월 ${number(scenario.monthlyContribution)}원, ${years}년 납입 가정`,
      `기대수익률 ${(scenario.annualReturn * 100).toFixed(1)}% 가정`,
      `은퇴 시 예상 적립금 ${number(principal)}원`,
    ],
    faqs: [
      {
        question: `${scenario.label}에서 수익률이 낮아지면 어떻게 되나요?`,
        answer:
          "수익률 하락 시 은퇴 시점 적립금과 월 수령액이 함께 감소합니다. 보수적인 시나리오를 병행 비교하세요.",
      },
      {
        question: "납입액을 먼저 늘리는 것이 좋은가요?",
        answer:
          "동일한 기간이라면 월 납입액 증액이 가장 직접적인 개선 방법입니다. 예산 여력 내에서 우선 검토하세요.",
      },
      {
        question: "이 시뮬레이션을 투자 권유로 봐도 되나요?",
        answer:
          "아니요. 본 결과는 참고용 계산이며 실제 상품 선택은 투자성향, 수수료, 리스크를 함께 검토해야 합니다.",
      },
    ],
  };
});

export const getRetirementPensionScenario = (slug) =>
  RETIREMENT_PENSION_SCENARIOS.find((scenario) => scenario.slug === slug) || null;

