import { RULES_2026 } from "./rules/2026";

export const calculatorsRegistry = [
  {
    slug: "annual-leave",
    title: "연차 계산기",
    path: "/calculators/annual-leave",
    summary: "입사일/기준일을 입력하면 연차 발생 일수를 단계별로 보여줍니다.",
    updatedAt: RULES_2026.updatedAt,
    category: "휴가",
  },
  {
    slug: "severance-pay",
    title: "퇴직금 계산기",
    path: "/calculators/severance-pay",
    summary: "평균임금과 근속기간 기준으로 예상 퇴직금을 계산합니다.",
    updatedAt: RULES_2026.updatedAt,
    category: "퇴직",
  },
];

export const getCalculatorBySlug = (slug) =>
  calculatorsRegistry.find((calculator) => calculator.slug === slug);
