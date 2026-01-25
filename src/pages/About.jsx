import React from "react";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { SITE_CONFIG } from "../config/siteConfig";

const About = () => {
  const breadcrumbs = [
    { label: "홈", path: "/" },
    { label: "소개", path: "/about" },
  ];

  return (
    <div className="space-y-8">
      <Seo
        title="서비스 소개"
        description="e-work.kr의 운영 목적과 콘텐츠 기준을 안내합니다."
        path="/about"
      />
      <Breadcrumbs items={breadcrumbs} />

      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900">e-work.kr 소개</h1>
        <p className="text-slate-600 leading-relaxed">
          e-work.kr은 노무/근로 관련 실무에서 자주 발생하는 질문을 빠르게 해결하기 위해 만든
          계산기와 가이드 허브입니다. 연차, 퇴직금처럼 빈도가 높은 주제를 중심으로
          계산 결과뿐 아니라 예외, 사례, FAQ, 체크리스트까지 함께 제공해
          실무 커뮤니케이션 비용을 줄이는 것을 목표로 합니다.
        </p>
        <p className="text-slate-600 leading-relaxed">
          모든 콘텐츠는 공공기관 인사총무 실무 관점을 기반으로 작성하되,
          특정 기관이나 개인이 식별되지 않도록 익명화·합성 사례로 구성합니다.
          내부 정보 및 개인정보는 다루지 않으며, 실제 적용 시에는 각 사업장의
          규정과 행정 해석을 우선 확인할 것을 권장합니다.
        </p>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-600 space-y-2">
          <div>운영자: {SITE_CONFIG.operatorDisplay}</div>
          <div>연락처: {SITE_CONFIG.contactEmail}</div>
          <div>기준일: {SITE_CONFIG.rulesEffectiveDate}</div>
        </div>
      </section>
    </div>
  );
};

export default About;
