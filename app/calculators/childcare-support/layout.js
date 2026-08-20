// 계산기 본문은 'use client' 컴포넌트라 metadata 를 내보낼 수 없다.
// 라우트 레이아웃(서버 컴포넌트)에서 페이지별 메타데이터를 준다 —
// 이게 없으면 계산기 5개가 전부 루트 레이아웃의 기본 title/description 을
// 그대로 물려받아 서로 완전히 같은 메타를 갖게 된다(색인 누락 원인).
export const metadata = {
  title: '육아지원금 계산기 — 육아휴직·단축근무 지원금과 회사 부담',
  description:
    '육아휴직과 육아기 단축근무의 사업주 지원금, 근로자 예상 수령액, 회사 순부담을 2026년 기준으로 함께 계산합니다.',
  alternates: { canonical: 'https://e-work.kr/calculators/childcare-support' },
}

export default function ChildcareSupportCalculatorLayout({ children }) {
  return children
}
