// 계산기 본문은 'use client' 컴포넌트라 metadata 를 내보낼 수 없다.
// 라우트 레이아웃(서버 컴포넌트)에서 페이지별 메타데이터를 준다 —
// 이게 없으면 계산기 5개가 전부 루트 레이아웃의 기본 title/description 을
// 그대로 물려받아 서로 완전히 같은 메타를 갖게 된다(색인 누락 원인).
export const metadata = {
  title: '연차 계산기 — 입사일 기준 발생일수 계산',
  description:
    '입사일을 기준으로 근로기준법 제60조에 따른 연차 발생일수를 계산합니다. 1년 미만과 1년 이상의 기준이 어떻게 다른지 함께 확인하세요.',
  alternates: { canonical: 'https://e-work.kr/calculators/annual-leave' },
}

export default function AnnualLeaveCalculatorLayout({ children }) {
  return children
}
