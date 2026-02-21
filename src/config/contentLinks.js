// 가이드 슬러그 → 주제 분류 + 연결 계산기
export const GUIDE_TOPIC_MAP = {
  "annual-leave-basics":        { topic: "annual-leave", calcPath: "/calculators/annual-leave", calcLabel: "연차 계산기" },
  "why-second-year-25-days":    { topic: "annual-leave", calcPath: "/calculators/annual-leave", calcLabel: "연차 계산기" },
  "annual-leave-carryover":     { topic: "annual-leave", calcPath: "/calculators/annual-leave", calcLabel: "연차 계산기" },
  "annual-leave-encashment":    { topic: "annual-leave", calcPath: "/calculators/annual-leave", calcLabel: "연차 계산기" },
  "unpaid-leave-impact":        { topic: "annual-leave", calcPath: "/calculators/annual-leave", calcLabel: "연차 계산기" },
  "first-year-26-days":         { topic: "annual-leave", calcPath: "/calculators/annual-leave", calcLabel: "연차 계산기" },
  "severance-pay-eligibility":  { topic: "retirement",   calcPath: "/calculators/severance-pay", calcLabel: "퇴직금 계산기" },
  "severance-pay-average-wage": { topic: "retirement",   calcPath: "/calculators/severance-pay", calcLabel: "퇴직금 계산기" },
  "severance-pay-docs":         { topic: "retirement",   calcPath: "/calculators/severance-pay", calcLabel: "퇴직금 계산기" },
  "payroll-slip-reading":       { topic: "net-salary",   calcPath: "/calculators/net-salary",    calcLabel: "실수령액 계산기" },
};

// 주제별 관련 가이드 목록 (랜딩 페이지 & 가이드 페이지 하단 "관련 가이드" 용)
export const TOPIC_GUIDES = {
  "annual-leave": [
    { slug: "annual-leave-basics",      title: "연차 발생 기준 총정리",           desc: "1년 미만 월차·이후 연차 발생 기준 완전 정리" },
    { slug: "why-second-year-25-days",  title: "2년차에 연차가 25일인 이유",      desc: "입사 2년차에 연차가 갑자기 늘어나는 이유" },
    { slug: "annual-leave-carryover",   title: "연차 이월과 소멸 기준",           desc: "미사용 연차가 다음 해로 넘어가는 조건" },
    { slug: "annual-leave-encashment",  title: "미사용 연차 수당 지급 기준",      desc: "퇴직 시 남은 연차를 돈으로 받는 기준" },
    { slug: "first-year-26-days",       title: "1년차 연차 최대 26일 되는 경우",  desc: "입사 첫해에 연차가 최대 26일이 되는 조건" },
    { slug: "unpaid-leave-impact",      title: "무급휴가가 연차에 미치는 영향",   desc: "무급휴가·육아휴직이 연차 발생에 미치는 효과" },
  ],
  "retirement": [
    { slug: "severance-pay-eligibility",  title: "퇴직금 지급 요건 완전 정리",   desc: "1년 미만 근무자도 퇴직금 받을 수 있는 조건" },
    { slug: "severance-pay-average-wage", title: "평균임금 계산 방법",            desc: "퇴직금 산정의 핵심인 평균임금 계산 기준" },
    { slug: "severance-pay-docs",         title: "퇴직금 수령 서류 체크리스트",   desc: "퇴직 시 필요한 서류와 절차 한눈에 정리" },
  ],
  "net-salary": [
    { slug: "payroll-slip-reading",  title: "급여명세서 항목별 읽는 법",    desc: "공제 항목별 의미와 계산 방식 완전 이해" },
    { slug: "unpaid-leave-impact",   title: "무급휴가가 급여에 미치는 영향", desc: "무급휴가 사용 시 실수령액이 줄어드는 기준" },
  ],
};
