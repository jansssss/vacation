import { RULES_2026 } from "./rules/2026";

export const guidesRegistry = [
  {
    slug: "annual-leave-basics",
    title: "연차 기본 규칙 한 장 요약",
    summary: "1년 미만/이상 구간을 나눠 연차 발생 구조를 빠르게 정리합니다.",
    updatedAt: RULES_2026.updatedAt,
    sections: [
      {
        heading: "핵심 요약",
        bullets: [
          "입사 후 1년 미만 구간은 매월 1일 발생(출근율 요건 확인)",
          "1년 이상은 기본 15일 + 2년마다 1일 가산(상한 적용)",
          "정확한 산정은 근속기간과 기준일을 함께 확인",
        ],
      },
      {
        heading: "실무 체크 포인트",
        bullets: [
          "휴직/휴업 기간 포함 여부는 사내 규정과 판례 흐름을 함께 확인",
          "연차 발생/사용 기준일을 인사 공지로 명확히 안내",
        ],
      },
    ],
  },
  {
    slug: "annual-leave-carryover",
    title: "연차 이월 기준과 소멸 시점",
    summary: "이월 가능 범위와 소멸 통지 시점을 실무 관점에서 정리합니다.",
    updatedAt: RULES_2026.updatedAt,
    sections: [
      {
        heading: "이월 관리",
        bullets: [
          "이월 허용 여부는 취업규칙/단체협약에 따른 운영이 핵심",
          "연차 촉진제도 운영 시 안내 기록을 남겨 분쟁 리스크를 관리",
        ],
      },
    ],
  },
  {
    slug: "annual-leave-encashment",
    title: "연차수당 정산 시 흔한 오류",
    summary: "미사용 연차수당 계산 시 빠뜨리기 쉬운 요소를 정리합니다.",
    updatedAt: RULES_2026.updatedAt,
    sections: [
      {
        heading: "정산 체크",
        bullets: [
          "통상임금/평균임금 기준 적용 차이를 구분",
          "연차 발생일과 사용기한을 함께 기록",
        ],
      },
    ],
  },
  {
    slug: "severance-pay-eligibility",
    title: "퇴직금 지급 대상 판단 기준",
    summary: "1년 미만, 단시간 근로자 등 경계 사례를 정리합니다.",
    updatedAt: RULES_2026.updatedAt,
    sections: [
      {
        heading: "대상 판단",
        bullets: [
          "근속기간 산정 기준일을 명확히 설정",
          "단시간 근로자는 주 소정근로시간과 계속근로 요건을 함께 확인",
        ],
      },
    ],
  },
  {
    slug: "severance-pay-average-wage",
    title: "평균임금 산정 시 포함/제외 항목",
    summary: "최근 3개월 급여 구성 항목의 포함 여부를 정리합니다.",
    updatedAt: RULES_2026.updatedAt,
    sections: [
      {
        heading: "항목 정리",
        bullets: [
          "정기상여/연장수당 반영 여부를 급여대장과 대조",
          "비과세 항목은 별도 분리해 근거를 남김",
        ],
      },
    ],
  },
  {
    slug: "severance-pay-docs",
    title: "퇴직금 정산 시 필요한 서류 체크리스트",
    summary: "정산 요청부터 지급까지 필요한 내부 서류 흐름을 정리합니다.",
    updatedAt: RULES_2026.updatedAt,
    sections: [
      {
        heading: "준비 서류",
        bullets: [
          "퇴직 의사 확인서 및 인수인계 확인",
          "최근 3개월 급여명세 및 근태 기록",
        ],
      },
    ],
  },
  {
    slug: "payroll-slip-reading",
    title: "급여명세서 읽는 법 (인사팀 버전)",
    summary: "명세서 항목을 빠르게 점검하는 체크 포인트를 제공합니다.",
    updatedAt: RULES_2026.updatedAt,
    sections: [
      {
        heading: "확인 포인트",
        bullets: [
          "고정수당/변동수당 구분 여부",
          "공제 항목 계산식과 기초 금액 확인",
        ],
      },
    ],
  },
  {
    slug: "unpaid-leave-impact",
    title: "무급휴직이 연차/퇴직금에 미치는 영향",
    summary: "휴직 구간이 근속 및 연차 산정에 주는 영향을 설명합니다.",
    updatedAt: RULES_2026.updatedAt,
    sections: [
      {
        heading: "실무 요약",
        bullets: [
          "무급휴직 기간의 근속 인정 여부를 취업규칙과 판례 흐름으로 확인",
          "휴직 복귀 시 연차 기준일을 재확인",
        ],
      },
    ],
  },
];

export const getGuideBySlug = (slug) => guidesRegistry.find((guide) => guide.slug === slug);
