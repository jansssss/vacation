import React from "react";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";

const Disclaimer = () => {
  const breadcrumbs = [
    { label: "홈", path: "/" },
    { label: "면책", path: "/disclaimer" },
  ];

  return (
    <div className="space-y-8">
      <Seo
        title="면책 및 고지"
        description="e-work.kr 서비스 이용 시 참고해야 할 면책 조항"
        path="/disclaimer"
      />
      <Breadcrumbs items={breadcrumbs} />

      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-6 text-slate-600 leading-relaxed">
        <h1 className="text-3xl font-semibold text-slate-900">면책 및 고지</h1>
        <p>
          e-work.kr에서 제공하는 계산 결과와 콘텐츠는 일반적인 정보 제공을 목적으로 하며,
          법률 자문이나 공식 해석이 아닙니다. 개별 사업장의 규정과 근로계약, 관련 법령 및
          행정 해석에 따라 결과가 달라질 수 있습니다.
        </p>
        <p>
          사용자는 본 서비스의 정보를 참고자료로 활용해야 하며, 실제 인사·노무 의사결정은
          관련 기관 안내 또는 전문가 검토 후 최종 결정하시기 바랍니다.
        </p>
        <p>
          운영자는 서비스 이용 또는 정보 활용 과정에서 발생하는 직접·간접 손해에 대해
          법률상 허용되는 범위 내에서 책임을 제한합니다.
        </p>
        <p className="text-xs text-slate-400">최종 업데이트: 2026-01-25</p>
      </section>
    </div>
  );
};

export default Disclaimer;
