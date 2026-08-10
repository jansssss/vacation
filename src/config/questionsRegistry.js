// 질문형 SEO 페이지 색인 (1차 30개)
//
// 본문은 각 페이지 파일(app/questions/<slug>/page.js)에 정적으로 작성한다.
// 이 파일은 허브 목록·사이트맵·질문 사슬(다음 질문) 내비게이션이 공유하는 색인이다.
//
// 설계 원칙
//  - 주제 나열이 아니라 "검색창에 실제로 입력하는 질문" 단위로 페이지를 나눈다.
//  - 각 페이지는 ①즉답 ②실제 사례 ③계산·판단 기준 ④예외 ⑤자주 오해 ⑥다음 질문의
//    고정 골격을 쓰되, 내용은 질문마다 완전히 다르게 쓴다.
//  - 1 → 2 → ... → 30 → 다시 허브로 이어지는 사슬 구조를 만든다.

export const QUESTION_CLUSTERS = [
  {
    id: "annual-leave",
    label: "연차",
    description: "며칠이 생기고, 언제까지 써야 하고, 못 쓰면 얼마를 받는지",
  },
  {
    id: "wage-hours",
    label: "주휴수당·최저임금·근로시간",
    description: "매주·매달 받는 돈이 제대로 계산됐는지 확인하는 기준",
  },
  {
    id: "severance",
    label: "퇴직금",
    description: "받을 수 있는지, 얼마인지, 안 주면 어떻게 하는지",
  },
  {
    id: "unemployment",
    label: "퇴사·실업급여",
    description: "어떻게 그만두느냐에 따라 달라지는 수급 자격",
  },
  {
    id: "dismissal",
    label: "해고·근로계약",
    description: "회사가 그만두라고 했을 때 따져야 하는 것들",
  },
  {
    id: "workplace",
    label: "사업장 규모·육아",
    description: "5인 미만 사업장과 육아 관련 제도의 적용 범위",
  },
];

export const questionsRegistry = [
  // ── 연차 클러스터 ──────────────────────────────────────────────
  {
    id: 1,
    slug: "annual-leave-first-year",
    cluster: "annual-leave",
    question: "입사한 지 1년이 안 됐는데 연차는 몇 개 생기나요?",
    listTitle: "입사 1년 미만 연차 개수",
    summary:
      "1개월 개근마다 1일씩, 입사 1년 전까지 최대 11일. 발생일이 달력 1일이 아닌 이유까지 정리합니다.",
    keywords: "1년 미만 연차, 신입사원 연차, 연차 개수, 입사 첫해 연차",
    updatedAt: "2026-08-10",
    next: "annual-leave-11-plus-15",
  },
  {
    id: 2,
    slug: "annual-leave-11-plus-15",
    cluster: "annual-leave",
    question: "1년 근무하면 연차가 15개 생기는 건가요, 11개에 15개가 더 생기는 건가요?",
    listTitle: "1년 근무 시 연차 11일 + 15일",
    summary:
      "두 연차는 별개로 발생해 최대 26일. 다만 365일만 채우고 퇴사하면 15일은 생기지 않습니다.",
    keywords: "1년 연차 15개, 연차 11개 15개, 연차 26일, 1년 만근 연차",
    updatedAt: "2026-08-10",
    next: "annual-leave-fiscal-year",
  },
  {
    id: 3,
    slug: "annual-leave-fiscal-year",
    cluster: "annual-leave",
    question: "중간에 입사한 직원의 연차는 회계연도 기준으로 어떻게 계산하나요?",
    listTitle: "중도입사자 회계연도 기준 연차",
    summary:
      "1월 1일 일괄 부여 회사의 비례부여 공식과, 퇴직할 때 입사일 기준으로 다시 계산해야 하는 이유.",
    keywords: "중도입사자 연차, 회계연도 연차 계산, 연차 비례부여",
    updatedAt: "2026-08-10",
    next: "annual-leave-payout-on-quit",
  },
  {
    id: 4,
    slug: "annual-leave-payout-on-quit",
    cluster: "annual-leave",
    question: "퇴사할 때 남은 연차는 돈으로 받을 수 있나요?",
    listTitle: "퇴사 시 미사용 연차수당",
    summary:
      "통상임금 기준으로 계산하고 퇴직 후 14일 안에 지급받아야 합니다. 퇴직금과는 계산 기준이 다릅니다.",
    keywords: "퇴사 연차수당, 남은 연차, 미사용 연차수당, 연차수당 계산",
    updatedAt: "2026-08-10",
    next: "annual-leave-promotion-effect",
  },
  {
    id: 5,
    slug: "annual-leave-promotion-effect",
    cluster: "annual-leave",
    question: "회사가 연차사용촉진을 했다면 남은 연차수당을 안 줘도 되나요?",
    listTitle: "연차사용촉진과 수당 면제",
    summary:
      "서면·시기·노무수령 거부까지 전부 지켜야 효력이 생깁니다. 하나라도 빠지면 수당을 지급해야 합니다.",
    keywords: "연차사용촉진, 연차수당 미지급, 연차촉진 절차",
    updatedAt: "2026-08-10",
    next: "weekly-holiday-15-hours",
  },

  // ── 주휴수당·최저임금·근로시간 클러스터 ────────────────────────
  {
    id: 6,
    slug: "weekly-holiday-15-hours",
    cluster: "wage-hours",
    question: "주휴수당은 일주일에 몇 시간 일해야 받을 수 있나요?",
    listTitle: "주휴수당 조건과 주 15시간",
    summary:
      "소정근로시간 주 15시간 이상과 그 주의 소정근로일 개근, 두 조건을 함께 봐야 합니다.",
    keywords: "주휴수당 조건, 주 15시간, 주휴수당 계산",
    updatedAt: "2026-08-10",
    next: "weekly-holiday-under-15-hours",
  },
  {
    id: 7,
    slug: "weekly-holiday-under-15-hours",
    cluster: "wage-hours",
    question: "일주일에 15시간보다 조금 적게 일하면 주휴수당을 못 받나요?",
    listTitle: "주 15시간 미만과 초단시간 근로",
    summary:
      "판단 기준은 '그 주에 몇 시간 일했는지'가 아니라 '4주 평균 소정근로시간'입니다.",
    keywords: "주 15시간 미만 주휴수당, 초단시간 근로자, 4주 평균",
    updatedAt: "2026-08-10",
    next: "weekly-holiday-absence",
  },
  {
    id: 8,
    slug: "weekly-holiday-absence",
    cluster: "wage-hours",
    question: "지각이나 조퇴를 하면 그 주의 주휴수당을 못 받나요?",
    listTitle: "지각·조퇴·결근과 주휴수당",
    summary:
      "지각과 조퇴는 개근을 깨지 않습니다. 주휴수당이 사라지는 것은 결근했을 때뿐입니다.",
    keywords: "지각 주휴수당, 조퇴 주휴수당, 결근 주휴수당",
    updatedAt: "2026-08-10",
    next: "weekly-holiday-part-time",
  },
  {
    id: 9,
    slug: "weekly-holiday-part-time",
    cluster: "wage-hours",
    question: "아르바이트와 계약직도 주휴수당을 받을 수 있나요?",
    listTitle: "알바·계약직 주휴수당",
    summary:
      "고용형태는 요건이 아닙니다. 주휴수당은 5인 미만 사업장에도 그대로 적용됩니다.",
    keywords: "알바 주휴수당, 계약직 주휴수당, 단시간 근로자 주휴",
    updatedAt: "2026-08-10",
    next: "minimum-wage-2026-monthly",
  },
  {
    id: 10,
    slug: "minimum-wage-2026-monthly",
    cluster: "wage-hours",
    question: "2026년 최저임금으로 월급을 계산하면 얼마인가요? 주휴수당도 포함되나요?",
    listTitle: "2026년 최저임금 월 환산액",
    summary:
      "시간급 10,320원, 월 환산 2,156,880원. 209시간에 주휴시간이 이미 들어 있는 구조를 설명합니다.",
    keywords: "2026 최저임금, 최저임금 월급, 209시간, 주휴수당 포함",
    updatedAt: "2026-08-10",
    next: "overtime-pay-over-40-hours",
  },
  {
    id: 11,
    slug: "overtime-pay-over-40-hours",
    cluster: "wage-hours",
    question: "하루 8시간 또는 주 40시간을 넘게 일하면 수당을 얼마나 더 받아야 하나요?",
    listTitle: "연장근로수당 계산",
    summary:
      "통상임금의 50% 가산이 원칙이고, 밤 10시를 넘기면 야간 가산이 따로 붙습니다.",
    keywords: "연장근로수당, 야근수당, 주 40시간 초과, 야간근로 가산",
    updatedAt: "2026-08-10",
    next: "holiday-work-pay",
  },
  {
    id: 12,
    slug: "holiday-work-pay",
    cluster: "wage-hours",
    question: "토요일·일요일이나 공휴일에 일하면 무조건 휴일근로수당을 받을 수 있나요?",
    listTitle: "주말·공휴일 근무와 휴일근로수당",
    summary:
      "'휴일'과 '휴무일'은 다릅니다. 토요일 근무가 휴일근로가 아닐 수 있는 이유를 정리합니다.",
    keywords: "휴일근로수당, 주말근무 수당, 공휴일 근무, 휴무일",
    updatedAt: "2026-08-10",
    next: "severance-one-year",
  },

  // ── 퇴직금 클러스터 ────────────────────────────────────────────
  {
    id: 13,
    slug: "severance-one-year",
    cluster: "severance",
    question: "퇴직금은 정확히 1년을 채워야 받을 수 있나요?",
    listTitle: "퇴직금 1년 요건",
    summary:
      "계속근로기간 1년이 기준이며, 수습·휴직·재계약 기간이 어떻게 합산되는지가 실제 쟁점입니다.",
    keywords: "퇴직금 1년, 퇴직금 지급조건, 계속근로기간",
    updatedAt: "2026-08-10",
    next: "severance-how-to-calculate",
  },
  {
    id: 14,
    slug: "severance-how-to-calculate",
    cluster: "severance",
    question: "내 퇴직금은 어떻게 계산하나요?",
    listTitle: "퇴직금 계산 공식",
    summary:
      "평균임금 × 30일 × (재직일수 ÷ 365). 평균임금이 통상임금보다 낮으면 통상임금으로 올려 계산합니다.",
    keywords: "퇴직금 계산, 퇴직금 계산법, 평균임금, 퇴직금 계산기",
    updatedAt: "2026-08-10",
    next: "severance-bonus-included",
  },
  {
    id: 15,
    slug: "severance-bonus-included",
    cluster: "severance",
    question: "상여금·성과급·연차수당도 퇴직금 계산에 포함되나요?",
    listTitle: "상여금·성과급·연차수당의 산입",
    summary:
      "정기성·일률성·의무성이 판단 기준입니다. 상여금과 연차수당은 12분의 3만 반영하는 이유도 설명합니다.",
    keywords: "퇴직금 상여금 포함, 퇴직금 성과급, 퇴직금 연차수당",
    updatedAt: "2026-08-10",
    next: "severance-part-time",
  },
  {
    id: 16,
    slug: "severance-part-time",
    cluster: "severance",
    question: "아르바이트·계약직·일용직도 1년 일하면 퇴직금을 받을 수 있나요?",
    listTitle: "알바·계약직·일용직 퇴직금",
    summary:
      "명칭이 아니라 실제 근로 형태로 판단합니다. 계약서를 여러 번 쪼갠 경우의 합산 기준도 봅니다.",
    keywords: "알바 퇴직금, 계약직 퇴직금, 일용직 퇴직금, 4주 15시간",
    updatedAt: "2026-08-10",
    next: "severance-unpaid",
  },
  {
    id: 17,
    slug: "severance-unpaid",
    cluster: "severance",
    question: "퇴사했는데 회사가 14일이 지나도 퇴직금을 안 주면 어떻게 해야 하나요?",
    listTitle: "퇴직금 미지급 대응 절차",
    summary:
      "14일이 지나면 지연이자가 붙습니다. 진정과 소액체당금까지 단계별 절차를 정리합니다.",
    keywords: "퇴직금 미지급, 퇴직금 14일, 퇴직금 신고, 지연이자 20%",
    updatedAt: "2026-08-10",
    next: "unemployment-requirements",
  },

  // ── 퇴사·실업급여 클러스터 ─────────────────────────────────────
  {
    id: 18,
    slug: "unemployment-requirements",
    cluster: "unemployment",
    question: "실업급여는 어떤 조건을 충족해야 받을 수 있나요?",
    listTitle: "실업급여 수급 요건",
    summary:
      "피보험단위기간 180일은 재직일수가 아닙니다. 계산 방식이 다른 이유부터 짚습니다.",
    keywords: "실업급여 조건, 실업급여 자격, 피보험단위기간 180일",
    updatedAt: "2026-08-10",
    next: "unemployment-voluntary-resign",
  },
  {
    id: 19,
    slug: "unemployment-voluntary-resign",
    cluster: "unemployment",
    question: "자진퇴사해도 실업급여를 받을 수 있는 경우가 있나요?",
    listTitle: "자진퇴사와 정당한 이직사유",
    summary:
      "임금체불·괴롭힘·통근곤란 등 시행규칙이 정한 사유에 해당하면 수급이 가능합니다.",
    keywords: "자진퇴사 실업급여, 정당한 이직사유, 임금체불 퇴사",
    updatedAt: "2026-08-10",
    next: "unemployment-recommended-resignation",
  },
  {
    id: 20,
    slug: "unemployment-recommended-resignation",
    cluster: "unemployment",
    question: "회사에서 권고사직을 받으면 실업급여를 받을 수 있나요?",
    listTitle: "권고사직과 실업급여",
    summary:
      "가능하지만 이직확인서의 상실코드가 실제 결과를 좌우합니다. 확인 방법과 정정 절차를 봅니다.",
    keywords: "권고사직 실업급여, 이직확인서, 상실코드 23",
    updatedAt: "2026-08-10",
    next: "unemployment-contract-expiry",
  },
  {
    id: 21,
    slug: "unemployment-contract-expiry",
    cluster: "unemployment",
    question: "계약직이 계약기간 만료로 퇴사하면 실업급여를 받을 수 있나요?",
    listTitle: "계약만료와 실업급여",
    summary:
      "회사가 재계약을 제안했는데 근로자가 거절하면 결론이 달라집니다. 그 경계선을 정리합니다.",
    keywords: "계약만료 실업급여, 계약직 실업급여, 재계약 거절",
    updatedAt: "2026-08-10",
    next: "resignation-vs-dismissal",
  },
  {
    id: 22,
    slug: "resignation-vs-dismissal",
    cluster: "unemployment",
    question: "권고사직과 해고는 무엇이 다르고 어느 쪽이 근로자에게 유리한가요?",
    listTitle: "권고사직 vs 해고",
    summary:
      "합의로 끝내느냐 일방적으로 끝내느냐의 차이입니다. 다툴 여지가 남는 쪽은 해고입니다.",
    keywords: "권고사직 해고 차이, 사직서, 부당해고 구제신청",
    updatedAt: "2026-08-10",
    next: "resignation-compensation",
  },
  {
    id: 23,
    slug: "resignation-compensation",
    cluster: "unemployment",
    question: "권고사직을 받아들이면 회사가 위로금을 꼭 줘야 하나요?",
    listTitle: "권고사직 위로금",
    summary:
      "법정 의무는 없습니다. 그럼에도 회사가 위로금을 제시하는 이유와 협상 기준을 설명합니다.",
    keywords: "권고사직 위로금, 권고사직 합의금, 부제소 합의",
    updatedAt: "2026-08-10",
    next: "dismissal-notice-pay",
  },

  // ── 해고·근로계약 클러스터 ─────────────────────────────────────
  {
    id: 24,
    slug: "dismissal-notice-pay",
    cluster: "dismissal",
    question: '회사가 갑자기 "내일부터 나오지 말라"고 하면 해고예고수당을 받을 수 있나요?',
    listTitle: "해고예고수당 30일분",
    summary:
      "30일 전에 예고하지 않았다면 30일분 통상임금을 받습니다. 해고가 정당한지와는 별개입니다.",
    keywords: "해고예고수당, 30일 전 해고통보, 즉시해고",
    updatedAt: "2026-08-10",
    next: "unfair-dismissal-criteria",
  },
  {
    id: 25,
    slug: "unfair-dismissal-criteria",
    cluster: "dismissal",
    question: "회사에서 해고당했는데 부당해고인지 어떻게 판단하나요?",
    listTitle: "부당해고 판단 기준",
    summary:
      "정당한 이유·양정의 적정성·절차 준수 세 가지를 봅니다. 구제신청은 3개월이 지나면 불가능합니다.",
    keywords: "부당해고, 부당해고 기준, 부당해고 구제신청 3개월",
    updatedAt: "2026-08-10",
    next: "no-employment-contract",
  },
  {
    id: 26,
    slug: "no-employment-contract",
    cluster: "dismissal",
    question: "근로계약서를 작성하지 않았거나 회사가 계약서를 주지 않았다면 어떻게 되나요?",
    listTitle: "근로계약서 미작성·미교부",
    summary:
      "계약서가 없어도 근로계약은 성립합니다. 오히려 입증 책임에서 회사가 불리해지는 구조입니다.",
    keywords: "근로계약서 미작성, 근로계약서 미교부, 500만원 벌금",
    updatedAt: "2026-08-10",
    next: "probation-rules",
  },
  {
    id: 27,
    slug: "probation-rules",
    cluster: "dismissal",
    question: "수습기간에는 회사가 마음대로 해고하거나 월급을 적게 줘도 되나요?",
    listTitle: "수습기간 해고와 감액",
    summary:
      "수습도 해고 제한을 받습니다. 최저임금 90% 감액이 아예 안 되는 경우도 정리합니다.",
    keywords: "수습기간 해고, 수습기간 급여, 수습 최저임금 90%",
    updatedAt: "2026-08-10",
    next: "fixed-ot-overtime",
  },
  {
    id: 28,
    slug: "fixed-ot-overtime",
    cluster: "dismissal",
    question: "포괄임금제로 계약했으면 야근을 아무리 해도 추가수당을 받을 수 없나요?",
    listTitle: "포괄임금제와 고정OT",
    summary:
      "약정 시간을 넘긴 부분은 따로 받아야 합니다. 사무직 포괄임금 약정이 무효가 되는 기준도 봅니다.",
    keywords: "포괄임금제, 포괄임금제 야근수당, 고정OT, 공짜야근",
    updatedAt: "2026-08-10",
    next: "under-five-employees",
  },

  // ── 사업장 규모·육아 클러스터 ──────────────────────────────────
  {
    id: 29,
    slug: "under-five-employees",
    cluster: "workplace",
    question: "5인 미만 사업장은 연차·야근수당·해고 규정이 어떻게 다른가요?",
    listTitle: "5인 미만 사업장 적용 제외",
    summary:
      "적용되는 것과 안 되는 것을 표로 갈라 보고, 상시 근로자 수를 세는 방법까지 다룹니다.",
    keywords: "5인 미만 사업장, 5인 미만 연차, 5인 미만 해고, 상시 근로자 수",
    updatedAt: "2026-08-10",
    next: "parental-leave-refusal",
  },
  {
    id: 30,
    slug: "parental-leave-refusal",
    cluster: "workplace",
    question: "육아휴직이나 육아기 근로시간 단축을 회사가 거부할 수 있나요?",
    listTitle: "육아휴직·단축근무 거부",
    summary:
      "육아휴직은 원칙적으로 거부할 수 없습니다. 단축근무의 거부 사유는 2026년 9월 18일부터 축소됩니다.",
    keywords: "육아휴직 거부, 육아기 근로시간 단축, 육아 단축근무",
    updatedAt: "2026-08-10",
    // 사슬의 끝에서 끊지 않고 다시 첫 질문(연차 허브)으로 돌려보낸다.
    next: "annual-leave-first-year",
    loopsBack: true,
  },
];

export const getQuestionBySlug = (slug) =>
  questionsRegistry.find((q) => q.slug === slug);

export const getNextQuestion = (slug) => {
  const current = getQuestionBySlug(slug);
  if (!current) return null;
  return getQuestionBySlug(current.next) ?? null;
};

export const getQuestionsByCluster = (clusterId) =>
  questionsRegistry.filter((q) => q.cluster === clusterId);
