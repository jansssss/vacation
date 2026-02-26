import { RULES_2026 } from "./rules/2026";

export const calculatorsRegistry = [
  {
    slug: "annual-leave",
    title: "연차 계산기",
    path: "/calculators/annual-leave",
    summary: "입사일을 기준으로 연차 발생일수와 사용 기준을 계산합니다.",
    updatedAt: RULES_2026.updatedAt,
    category: "연차",
  },
  {
    slug: "severance-pay",
    title: "퇴직금 계산기",
    path: "/calculators/severance-pay",
    summary: "평균임금과 근속기간을 기반으로 예상 퇴직금을 계산합니다.",
    updatedAt: RULES_2026.updatedAt,
    category: "퇴직",
  },
  {
    slug: "retirement-pension",
    title: "퇴직연금 운용계산기",
    path: "/calculators/retirement-pension",
    summary: "은퇴 시점 적립금과 월 수령액, 부족분 대안을 계산합니다.",
    updatedAt: RULES_2026.updatedAt,
    category: "연금",
  },
  {
    slug: "net-salary",
    title: "실수령액 계산기",
    path: "/calculators/net-salary",
    summary: "세전 급여에서 4대보험과 세금을 반영해 실수령액을 계산합니다.",
    updatedAt: RULES_2026.updatedAt,
    category: "급여",
  },
];

export const getCalculatorBySlug = (slug) =>
  calculatorsRegistry.find((calculator) => calculator.slug === slug);

