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

      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-4">e-work.kr 소개</h1>
          <p className="text-slate-600 leading-relaxed">
            e-work.kr은 노무/근로 관련 실무에서 자주 발생하는 질문을 빠르게 해결하기 위해 만든
            계산기와 가이드 허브입니다. 연차, 퇴직금처럼 빈도가 높은 주제를 중심으로
            계산 결과뿐 아니라 예외, 사례, FAQ, 체크리스트까지 함께 제공해
            실무 커뮤니케이션 비용을 줄이는 것을 목표로 합니다.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">운영 목적</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">•</span>
              <span><strong>근로자와 인사 담당자를 위한 실무 도구</strong> - 연차·퇴직금 등 핵심 노무 계산을 빠르게 수행</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">•</span>
              <span><strong>분쟁 예방과 법 준수 지원</strong> - 근로기준법과 판례 기반의 정확한 정보 제공</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">•</span>
              <span><strong>실무 커뮤니케이션 비용 절감</strong> - 예외 사항과 FAQ를 통해 반복 질문 최소화</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">운영자 정보</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            이 사이트는 <strong>공공기관 인사총무팀장 실무 경험을 바탕</strong>으로 운영됩니다.
            10년 이상의 인사 실무 경험을 통해 연차, 퇴직금, 근태 관리 등 현장에서 자주 발생하는 질문과 분쟁 사례를 직접 다뤄왔으며,
            이러한 경험을 토대로 실무자 관점의 콘텐츠를 작성하고 있습니다.
          </p>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600 space-y-2">
            <div><strong>운영자:</strong> {SITE_CONFIG.operatorDisplay}</div>
            <div><strong>연락처:</strong> {SITE_CONFIG.contactEmail}</div>
            <div><strong>기준일:</strong> {SITE_CONFIG.rulesEffectiveDate}</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">콘텐츠 제작 기준</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">•</span>
              <span><strong>근로기준법과 대법원 판례 기반</strong> - 모든 계산 로직은 현행 법령과 판례를 근거로 함</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">•</span>
              <span><strong>익명화·합성 사례</strong> - 특정 기관이나 개인이 식별되지 않도록 가공된 사례만 사용</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">•</span>
              <span><strong>내부 정보 비노출</strong> - 개인정보, 조직 내부 정보는 절대 포함하지 않음</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 mt-1">•</span>
              <span><strong>업데이트 일자 명시</strong> - 모든 콘텐츠에 작성일 및 최종 업데이트 일자 표기</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-rose-900">계산 결과의 한계 및 면책 사항</h2>
          <p className="text-sm text-rose-800 leading-relaxed">
            이 사이트에서 제공하는 모든 계산 결과와 정보는 <strong>참고용</strong>입니다.
            실제 적용 시에는 반드시 다음 사항을 확인하시기 바랍니다:
          </p>
          <ul className="space-y-2 text-sm text-rose-800">
            <li className="flex items-start gap-2">
              <span className="text-rose-600 mt-1">•</span>
              <span><strong>취업규칙 및 단체협약 우선</strong> - 회사의 내부 규정이 법보다 유리한 경우 그에 따름</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 mt-1">•</span>
              <span><strong>고용노동부 행정해석 확인</strong> - 복잡한 사례는 반드시 공식 유권해석 필요</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 mt-1">•</span>
              <span><strong>노무사 상담 권장</strong> - 법적 분쟁 가능성이 있는 경우 전문가 상담 필수</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 mt-1">•</span>
              <span><strong>휴직·휴업 등 예외 사항</strong> - 특수 근무 형태는 별도 검토 필요</span>
            </li>
          </ul>
          <p className="text-sm text-rose-800 leading-relaxed mt-4">
            <strong>최종 판단과 책임은 사용자에게 있으며</strong>, 이 사이트는 정보 제공 목적으로만 운영되고
            법적 자문을 제공하지 않습니다. 계산 결과로 인한 손해에 대해 책임지지 않습니다.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">업데이트 방침</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            근로기준법 개정, 대법원 판례 변경, 고용노동부 유권해석 발표 등 법적 기준이 변경되면
            <strong>최대한 신속하게 콘텐츠를 업데이트</strong>합니다.
            다만, 법 개정 직후 유예 기간이나 세부 시행령이 확정되지 않은 경우에는
            업데이트가 다소 지연될 수 있습니다.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">
            각 계산기와 가이드 페이지 상단에 <strong>기준일과 업데이트 일자</strong>가 표시되므로,
            최신 정보인지 확인 후 활용하시기 바랍니다.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">문의 및 피드백</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            계산 오류, 콘텐츠 개선 제안, 법 개정 반영 요청 등은 아래 채널로 문의하실 수 있습니다:
          </p>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 space-y-2 text-sm text-slate-700">
            <div><strong>이메일:</strong> {SITE_CONFIG.contactEmail}</div>
            <div><strong>응답 시간:</strong> 영업일 기준 3일 이내</div>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            개인적인 법적 자문이나 구체적인 사건 상담은 제공하지 않으며,
            계산기 기능 개선이나 일반적인 실무 질문에 대해서만 답변드립니다.
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;
