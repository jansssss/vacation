export const boardPosts = [
  {
    slug: "welcome",
    title: "e-work 게시판 운영 안내",
    author: "이워크",
    createdAt: "2026-01-25",
    summary: "게시판은 공지와 실무 질문을 정리하는 용도입니다.",
    content: `게시판은 노무/근로 관련 공지와 실무 질문을 정리하기 위한 공간입니다.

- 개인정보 및 민감 정보는 입력하지 마세요.
- 개별 분쟁 사항은 전문가 상담이 필요할 수 있습니다.
- 승인된 자료만 게시됩니다.`,
  },
  {
    slug: "policy-update-2026",
    title: "2026 기준 업데이트 안내",
    author: "이워크",
    createdAt: "2026-01-25",
    summary: "연차/퇴직금 기준일 업데이트 적용 내용을 안내합니다.",
    content: `2026 기준일 업데이트가 반영되었습니다.

- 연차/퇴직금 계산기는 기준일: 2026-01-01
- 규정 변경 시 rules 파일만 수정하도록 구조화되었습니다.

정확한 적용은 각 사업장 규정과 행정 해석을 우선 확인해 주세요.`,
  },
];

export const getBoardPostBySlug = (slug) =>
  boardPosts.find((post) => post.slug === slug);
