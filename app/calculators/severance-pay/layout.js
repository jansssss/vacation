// 계산기 본문은 'use client' 컴포넌트라 metadata 를 내보낼 수 없다.
// 라우트 레이아웃(서버 컴포넌트)에서 페이지별 메타데이터를 준다 —
// 이게 없으면 계산기 5개가 전부 루트 레이아웃의 기본 title/description 을
// 그대로 물려받아 서로 완전히 같은 메타를 갖게 된다(색인 누락 원인).
export const metadata = {
  title: '퇴직금 계산기 — 평균임금·근속기간으로 예상액 계산',
  description:
    '평균임금과 근속 연수·개월 수를 넣으면 예상 퇴직금을 계산합니다. 계속근로기간 1년, 주 15시간이라는 지급 요건도 함께 확인하세요.',
  alternates: { canonical: 'https://e-work.kr/calculators/severance-pay' },
}

export default function SeverancePayCalculatorLayout({ children }) {
  return children
}
