import { RULES_2026 } from "./rules/2026";

export const calculatorsRegistry = [
  {
    slug: "annual-leave",
    title: "?怨쀪컧 ?④쑴沅쎿묾?,
    path: "/calculators/annual-leave",
    summary: "??녾텢??疫꿸퀣???깆뱽 ??낆젾??롢늺 ?怨쀪컧 獄쏆뮇源???깅땾????ｍ롨퉪袁⑥쨮 癰귣똻肉т빳?얜빍??",
    updatedAt: RULES_2026.updatedAt,
    category: "???",
  },
  {
    slug: "severance-pay",
    title: "??곸춦疫??④쑴沅쎿묾?,
    path: "/calculators/severance-pay",
    summary: "???뇧?袁㏉닊??域뱀눘?썸묾怨뚯퍢 疫꿸퀣???곗쨮 ??됯맒 ??곸춦疫뀀뜆???④쑴沅??몃빍??",
    updatedAt: RULES_2026.updatedAt,
    category: "??곸춦",
  },
];

export const getCalculatorBySlug = (slug) =>
  calculatorsRegistry.find((calculator) => calculator.slug === slug);
