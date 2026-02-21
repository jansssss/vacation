import siteConfigJson from "./siteConfig.json";

export const SITE_CONFIG = {
  siteName: "e-work.kr",
  brandLine: "노무/근로 유틸 플랫폼",
  baseUrl: "https://e-work.kr",
  defaultTitle: "e-work.kr | 노무/근로 계산기 허브",
  defaultDescription:
    "연차, 퇴직금 등 노무/근로 계산기를 한 곳에서 확인하고, 실무 FAQ와 사례까지 함께 제공하는 e-work.kr 콘텐츠 허브입니다.",
  defaultImage: "https://e-work.kr/og-image.png",
  updatedAt: siteConfigJson.updatedAt,
  rulesEffectiveDate: siteConfigJson.rulesEffectiveDate,
  operatorName: "이워크",
  operatorDisplay: "이워크 / 이워크",
  contactEmail: "goooods@naver.com",
};
