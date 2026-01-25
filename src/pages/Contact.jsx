import React from "react";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { SITE_CONFIG } from "../config/siteConfig";

const Contact = () => {
  const breadcrumbs = [
    { label: "홈", path: "/" },
    { label: "문의", path: "/contact" },
  ];

  return (
    <div className="space-y-8">
      <Seo
        title="문의하기"
        description="e-work.kr 문의 및 피드백 채널 안내"
        path="/contact"
      />
      <Breadcrumbs items={breadcrumbs} />

      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900">문의하기</h1>
        <p className="text-slate-600 leading-relaxed">
          서비스 이용 중 개선이 필요한 부분이나 오류를 발견하셨다면 아래 연락처로
          알려주세요. 내용 확인 후 순차적으로 반영하겠습니다.
        </p>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-700">
          <p className="font-medium">이메일</p>
          <p className="mt-2">{SITE_CONFIG.contactEmail}</p>
        </div>
        <p className="text-xs text-slate-400">
          광고 문의, 제휴 요청, 콘텐츠 교정 요청은 이메일 제목에 목적을 함께 적어주시면
          더 빠르게 처리할 수 있습니다.
        </p>
      </section>
    </div>
  );
};

export default Contact;
