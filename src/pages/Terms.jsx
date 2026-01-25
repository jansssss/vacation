import React from "react";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { SITE_CONFIG } from "../config/siteConfig";

const Terms = () => {
  const breadcrumbs = [
    { label: "홈", path: "/" },
    { label: "이용약관", path: "/terms" },
  ];

  return (
    <div className="space-y-8">
      <Seo
        title="이용약관"
        description="e-work.kr 서비스 이용약관"
        path="/terms"
      />
      <Breadcrumbs items={breadcrumbs} />

      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-6 text-slate-600 leading-relaxed">
        <h1 className="text-3xl font-semibold text-slate-900">이용약관</h1>
        <p>
          본 약관은 {SITE_CONFIG.operatorName}(이하 “운영자”)가 제공하는 e-work.kr 서비스의
          이용 조건 및 절차, 권리·의무 등을 규정합니다.
        </p>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">1. 서비스 목적</h2>
          <p>
            e-work.kr은 노무/근로 관련 계산기와 정보 제공을 통해 이용자의 편의를 돕는
            정보성 서비스입니다.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">2. 제공 정보의 한계</h2>
          <p>
            제공되는 계산 결과 및 콘텐츠는 일반적 안내 목적이며, 법률 자문이 아닙니다.
            실제 적용은 사업장 규정 및 관련 기관 해석을 우선합니다.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">3. 저작권</h2>
          <p>
            본 사이트에 게시된 콘텐츠의 저작권은 운영자에게 있으며, 무단 복제·배포를
            금합니다. 인용 시 출처 표기를 권장합니다.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">4. 서비스 변경 및 중단</h2>
          <p>
            운영자는 서비스 개선을 위해 일부 기능을 변경하거나 중단할 수 있으며,
            중요한 변경은 사전 공지합니다.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">5. 문의</h2>
          <p>이용약관에 대한 문의는 아래 연락처로 가능합니다.</p>
          <p className="font-medium">연락처: {SITE_CONFIG.contactEmail}</p>
        </div>

        <p className="text-xs text-slate-400">시행일: 2026-01-25</p>
      </section>
    </div>
  );
};

export default Terms;
