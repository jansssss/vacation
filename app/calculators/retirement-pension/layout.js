// 계산기 본문은 'use client' 컴포넌트라 metadata 를 내보낼 수 없다.
// 라우트 레이아웃(서버 컴포넌트)에서 페이지별 메타데이터를 준다 —
// 이게 없으면 계산기 5개가 전부 루트 레이아웃의 기본 title/description 을
// 그대로 물려받아 서로 완전히 같은 메타를 갖게 된다(색인 누락 원인).
export const metadata = {
  title: '퇴직연금 계산기 — 은퇴 시점 적립금·월 수령액',
  description:
    '적립 조건을 넣으면 은퇴 시점의 예상 적립금과 월 수령액, 부족분에 대한 대안을 계산합니다.',
  alternates: { canonical: 'https://e-work.kr/calculators/retirement-pension' },
}

export default function RetirementPensionCalculatorLayout({ children }) {
  return children
}
