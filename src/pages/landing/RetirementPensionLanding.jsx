import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Seo from "../../components/Seo";
import Breadcrumbs from "../../components/Breadcrumbs";
import ContinueReading from "../../components/ContinueReading";
import { buildBreadcrumbSchema, buildFaqSchema } from "../../lib/structuredData";
import {
  getRetirementPensionScenario,
  RETIREMENT_PENSION_SCENARIOS,
} from "../../data/retirementPensionScenarios";
import { SITE_CONFIG } from "../../config/siteConfig";
import { TOPIC_GUIDES } from "../../config/contentLinks";

const RetirementPensionLanding = () => {
  const { scenario } = useParams();
  const data = getRetirementPensionScenario(scenario);

  if (!data) return <Navigate to="/calculators/retirement-pension" replace />;

  const breadcrumbs = [
    { label: "홈", path: "/" },
    { label: "퇴직연금 운용계산기", path: "/calculators/retirement-pension" },
    { label: `${data.label} 시나리오`, path: data.path },
  ];

  const faqSchema = buildFaqSchema(data.faqs);
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <div className="space-y-8">
      <Seo
        title={data.title}
        description={data.description}
        path={data.path}
        jsonLd={[faqSchema, breadcrumbSchema]}
      />
      <Breadcrumbs items={breadcrumbs} />

      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">퇴직연금 시나리오</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">{data.title}</h1>
        <p className="mt-3 leading-relaxed text-slate-600">{data.description}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">자산배분: {data.allocation}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">
            기준일: {SITE_CONFIG.updatedAt}
          </span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {data.summaryLines.map((line, index) => (
          <div key={index} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="mb-2 text-xs uppercase tracking-wide text-blue-600">핵심 지표 {index + 1}</p>
            <p className="text-sm text-slate-700">{line}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center">
        <p className="text-sm font-medium text-slate-700">본인 값으로 바로 계산하려면</p>
        <Link
          to={`/calculators/retirement-pension`}
          className="mt-3 inline-block rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          퇴직연금 운용계산기에서 계산하기
        </Link>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">예상 결과 (예시)</h2>
        <div className="grid gap-3 md:grid-cols-2 text-sm">
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <p className="text-slate-500">은퇴 시 예상 적립금</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {Math.round(data.expectedBalance).toLocaleString("ko-KR")}원
            </p>
          </div>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4">
            <p className="text-slate-500">20년 수령 가정 월 연금</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {Math.round(data.expectedMonthlyPension).toLocaleString("ko-KR")}원
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">자주 묻는 질문</h2>
        <div className="space-y-4 text-sm text-slate-700">
          {data.faqs.map((faq, index) => (
            <div key={index}>
              <p className="font-semibold text-slate-900">Q. {faq.question}</p>
              <p className="mt-1">A. {faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <ContinueReading
        title="퇴직 관련 가이드 더보기"
        items={TOPIC_GUIDES.retirement.map((guide) => ({
          badge: "가이드",
          title: guide.title,
          desc: guide.desc,
          path: `/guides/${guide.slug}`,
        }))}
      />

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">다른 운용 시나리오</h2>
        <div className="flex flex-wrap gap-2">
          {RETIREMENT_PENSION_SCENARIOS.filter((s) => s.slug !== data.slug).map((s) => (
            <Link
              key={s.slug}
              to={s.path}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm text-blue-700 hover:border-blue-400"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RetirementPensionLanding;

