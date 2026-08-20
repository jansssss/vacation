// 계산기 본문은 'use client' 컴포넌트라 metadata 를 내보낼 수 없다.
// 라우트 레이아웃(서버 컴포넌트)에서 페이지별 메타데이터를 준다 —
// 이게 없으면 계산기 5개가 전부 루트 레이아웃의 기본 title/description 을
// 그대로 물려받아 서로 완전히 같은 메타를 갖게 된다(색인 누락 원인).
export const metadata = {
  title: '실수령액 계산기 — 세전 월급에서 4대보험·세금 공제',
  description:
    '세전 급여에서 4대보험과 세금을 반영해 월 실수령액을 계산합니다. 세전 얼마면 실수령이 얼마인지 바로 확인하세요.',
  alternates: { canonical: 'https://e-work.kr/calculators/net-salary' },
}

export default function NetSalaryCalculatorLayout({ children }) {
  return children
}
