import React from "react";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { SITE_CONFIG } from "../config/siteConfig";

const PrivacyPolicy = () => {
  const breadcrumbs = [
    { label: "홈", path: "/" },
    { label: "개인정보처리방침", path: "/privacy" },
  ];

  return (
    <div className="space-y-8">
      <Seo
        title="개인정보처리방침"
        description="e-work.kr 개인정보 처리 기준 및 이용자 권리 안내"
        path="/privacy"
      />
      <Breadcrumbs items={breadcrumbs} />

      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-6 text-slate-600 leading-relaxed">
        <h1 className="text-3xl font-semibold text-slate-900">개인정보처리방침</h1>
        <p>
          {SITE_CONFIG.operatorName}(이하 “운영자”)는 이용자의 개인정보를 소중히 보호하며,
          「개인정보 보호법」 등 관련 법령을 준수합니다. 본 방침은 e-work.kr 서비스에서
          어떤 정보를 수집하고 어떻게 이용·보관·파기하는지 안내합니다.
        </p>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">1. 수집하는 개인정보 항목</h2>
          <p>
            운영자는 서비스 제공을 위해 최소한의 개인정보만 수집합니다. 현재 e-work.kr은
            회원가입 기능을 제공하지 않으며, 기본적으로 개인정보를 수집하지 않습니다.
            다만 문의 이메일 발송 등 이용자가 자발적으로 제공하는 정보(이메일 주소,
            문의 내용)는 처리 과정에서 수집될 수 있습니다.
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>필수 수집 항목: 문의 시 이메일 주소, 문의 내용</li>
            <li>자동 수집 항목: 접속 로그, 브라우저 정보, IP 주소(서비스 안정성 목적)</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">2. 개인정보의 이용 목적</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>문의 및 요청사항 처리</li>
            <li>서비스 개선을 위한 통계 분석</li>
            <li>오류 대응 및 보안 모니터링</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">3. 보유 및 이용기간</h2>
          <p>
            문의 처리 완료 후 1년간 보관하며, 이후 지체 없이 파기합니다.
            다만 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관할 수 있습니다.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">4. 개인정보의 제3자 제공</h2>
          <p>
            운영자는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.
            법령에 근거한 요청이 있는 경우에만 예외적으로 제공할 수 있습니다.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">5. 처리 위탁 및 국외 이전</h2>
          <p>
            운영자는 서비스 운영을 위해 일부 업무를 외부에 위탁할 수 있습니다.
            위탁 시 관련 법령에 따라 안전하게 관리·감독합니다. 개인정보의 국외 이전이
            발생하는 경우 사전에 공지하고 동의를 받습니다.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">6. 쿠키 및 로그</h2>
          <p>
            서비스 품질 개선과 통계 분석을 위해 쿠키 또는 로그 정보가 사용될 수 있습니다.
            이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나 일부 기능이 제한될
            수 있습니다.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">7. 광고 및 맞춤형 콘텐츠</h2>
          <p>
            e-work.kr은 향후 Google AdSense 등 광고 서비스를 사용할 수 있습니다. 광고 제공자는
            쿠키/식별자를 이용해 맞춤형 광고를 제공하거나 광고 성과를 측정할 수 있습니다.
            이용자는 쿠키 설정을 변경하여 맞춤형 광고를 제한할 수 있습니다.
          </p>
          <p className="text-sm text-slate-500">
            동의가 필요한 지역(EEA/영국/스위스 등)에서는 광고 쿠키 사용 전에 동의를 받습니다.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">8. 이용자의 권리</h2>
          <p>
            이용자는 언제든지 개인정보 열람, 정정, 삭제, 처리 정지를 요청할 수 있습니다.
            요청은 아래 연락처로 접수할 수 있습니다.
          </p>
          <p className="font-medium">연락처: {SITE_CONFIG.contactEmail}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">9. 안전성 확보 조치</h2>
          <p>
            운영자는 개인정보 보호를 위해 접근 통제, 최소 권한 원칙 등 기술적·관리적 보호
            조치를 시행합니다.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">10. 정책 변경</h2>
          <p>
            본 방침이 변경될 경우 사전에 공지하며, 중요한 변경 사항은 사이트를 통해
            안내합니다.
          </p>
          <p className="text-xs text-slate-400">시행일: 2026-01-25</p>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
