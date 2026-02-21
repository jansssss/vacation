import { calculateSeverancePay } from "../lib/calculators/severancePay";

const fmtW = (n) => `${Math.round(n / 10000).toLocaleString("ko-KR")}만원`;

// 근속기간 목록: [연, 개월, slug]
const TENURES = [
  { years: 1, months: 0, slug: "1y", label: "1년" },
  { years: 2, months: 0, slug: "2y", label: "2년" },
  { years: 3, months: 0, slug: "3y", label: "3년" },
  { years: 3, months: 6, slug: "3y6m", label: "3년 6개월" },
  { years: 5, months: 0, slug: "5y", label: "5년" },
  { years: 7, months: 0, slug: "7y", label: "7년" },
  { years: 10, months: 0, slug: "10y", label: "10년" },
  { years: 15, months: 0, slug: "15y", label: "15년" },
  { years: 20, months: 0, slug: "20y", label: "20년" },
];

const SALARY_EXAMPLES = [2500000, 3000000, 3500000];

const makeExample = (salary, years, months) => {
  const r = calculateSeverancePay({ avgMonthlyWage: salary, years, months });
  return {
    salary,
    salaryLabel: fmtW(salary),
    pay: r.pay,
    payLabel: fmtW(r.pay),
    serviceYears: r.serviceYears,
  };
};

export const RETIREMENT_BUCKETS = TENURES.map(({ years, months, slug, label }) => {
  const examples = SALARY_EXAMPLES.map((s) => makeExample(s, years, months));
  const refEx = examples[1]; // 300만원 기준

  return {
    slug,
    label,
    years,
    months,
    path: `/retirement/tenure/${slug}`,
    title: `근속 ${label} 퇴직금 계산 (2026년 기준 예시)`,
    description: `근속기간 ${label}의 예상 퇴직금을 평균임금 기준으로 계산합니다. 평균임금 250~350만원 구간 예시와 실무 주의사항, FAQ를 확인하세요.`,
    summaryLines: [
      `평균임금 300만원 기준 예상 퇴직금: ${refEx.payLabel}`,
      `근속기간 ${label} 기준, 평균임금(최근 3개월) × 근속연수로 산정`,
      `정기상여·연장수당 포함 여부에 따라 실제 금액이 달라질 수 있습니다`,
    ],
    examples,
    faqs: [
      {
        question: `근속 ${label} 퇴직금은 얼마인가요?`,
        answer: `평균임금(최근 3개월) 300만원 기준으로 근속 ${label}의 예상 퇴직금은 약 ${refEx.payLabel}입니다. 평균임금에 포함되는 상여금·연장수당 여부에 따라 실제 금액이 달라집니다.`,
      },
      {
        question: "평균임금에 상여금도 포함되나요?",
        answer: "최근 3개월 내 정기상여금이 지급되었다면 포함될 수 있습니다. 급여대장을 확인해 정기상여·연장수당 포함 여부를 반드시 체크하세요.",
      },
      {
        question: "퇴직금은 언제 지급받나요?",
        answer: "퇴직일로부터 14일 이내 지급이 원칙입니다. 당사자 합의 하에 연장할 수 있으나, 14일을 초과하면 지연이자(연 20%)가 발생합니다.",
      },
      {
        question: "퇴직연금(DC형)에 가입된 경우 계산이 다른가요?",
        answer: "DC형 퇴직연금은 매년 사용자가 임금의 1/12 이상을 적립하는 방식으로, 이 계산기와 다를 수 있습니다. DB형이나 법정 퇴직금은 이 계산 방식을 따릅니다.",
      },
      {
        question: "퇴직 직전 급여가 변동되면 어떻게 되나요?",
        answer: "평균임금은 퇴직 직전 3개월 임금 합산으로 계산되므로, 해당 기간에 급여 인상·인하가 있으면 퇴직금이 달라집니다. 퇴직 전 급여 변동이 있었다면 별도 계산이 필요합니다.",
      },
    ],
    sources: [
      { label: "근로기준법 제34조 (퇴직급여)", url: "https://www.law.go.kr/lsSc.do?section=&menuId=1&subMenuId=15&tabMenuId=81&eventGubun=060101&query=%EA%B7%BC%EB%A1%9C%EA%B8%B0%EC%A4%80%EB%B2%95#undefined" },
      { label: "고용노동부 퇴직급여 안내", url: "https://www.moel.go.kr" },
    ],
    relatedSlugs: TENURES.filter((t) => t.slug !== slug).map((t) => t.slug),
  };
});

export const getRetirementBucket = (slug) =>
  RETIREMENT_BUCKETS.find((b) => b.slug === slug) || null;
