import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Seo from "../../components/Seo";
import Breadcrumbs from "../../components/Breadcrumbs";
import ContinueReading from "../../components/ContinueReading";
import { buildFaqSchema, buildBreadcrumbSchema } from "../../lib/structuredData";
import { getRetirementBucket, RETIREMENT_BUCKETS } from "../../data/retirementBuckets";
import { SITE_CONFIG } from "../../config/siteConfig";
import { TOPIC_GUIDES } from "../../config/contentLinks";

const UPDATED_AT = SITE_CONFIG.updatedAt;
const fmt = (n) => Math.round(n).toLocaleString("ko-KR");

const RetirementLanding = () => {
  const { tenure } = useParams();
  const data = getRetirementBucket(tenure);

  if (!data) return <Navigate to="/calculators/severance-pay" replace />;

  const breadcrumbs = [
    { label: "홈", path: "/" },
    { label: "퇴직금 계산기", path: "/calculators/severance-pay" },
    { label: `근속 ${data.label} 퇴직금`, path: data.path },
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

      {/* Hero */}
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">퇴직금 계산 안내</p>
        <h1 className="text-3xl font-semibold text-slate-900 mt-2">{data.title}</h1>
        <p className="text-slate-600 mt-3 leading-relaxed">{data.description}</p>
        <div className="flex flex-wrap gap-2 mt-4 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">기준일 {UPDATED_AT}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">최근 3개월 평균임금 기준</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">근로기준법 제34조</span>
        </div>
      </section>

      {/* 요약 카드 */}
      <section className="grid gap-4 md:grid-cols-3">
        {data.summaryLines.map((line, i) => (
          <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-start gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {i + 1}
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{line}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center space-y-3">
        <p className="text-slate-700 text-sm font-medium">내 평균임금으로 정확하게 계산하고 싶다면?</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {data.examples.map((ex) => (
            <Link
              key={ex.salary}
              to={`/calculators/severance-pay?salary=${ex.salary}&years=${data.years}&months=${data.months}`}
              className="inline-block rounded-full bg-emerald-600 text-white px-5 py-2 text-sm font-semibold hover:bg-emerald-700 transition-colors"
            >
              월 {ex.salaryLabel}으로 계산하기
            </Link>
          ))}
        </div>
        <p className="text-xs text-slate-500">계산기에서 평균임금과 근속기간을 자유롭게 조정할 수 있습니다.</p>
      </section>

      {/* 예시 테이블 */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">평균임금별 퇴직금 예시</h2>
        <div className="space-y-4">
          {data.examples.map((ex) => (
            <div key={ex.salary} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm">
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-slate-600">
                <span>평균임금(월)</span>
                <span className="text-right font-semibold">{fmt(ex.salary)}원</span>
                <span>근속기간</span>
                <span className="text-right font-semibold">{data.label} ({ex.serviceYears.toFixed(2)}년)</span>
                <span className="font-bold text-emerald-700 text-base border-t border-slate-200 pt-1">예상 퇴직금</span>
                <span className="text-right font-bold text-emerald-700 text-base border-t border-slate-200 pt-1">{fmt(ex.pay)}원</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">상여금·연장수당 미포함 기준. 실제 퇴직금은 급여대장 기준 평균임금으로 산정하세요.</p>
      </section>

      {/* FAQ */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">자주 묻는 질문 (FAQ)</h2>
        <div className="space-y-5 text-sm text-slate-700">
          {data.faqs.map((faq, i) => (
            <div key={i}>
              <p className="font-semibold text-slate-900">Q. {faq.question}</p>
              <p className="mt-1">A. {faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 출처 */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">근거 / 출처</h2>
        <ul className="space-y-2 text-sm text-slate-600">
          {data.sources.map((src, i) => (
            <li key={i}>
              •{" "}
              <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-emerald-700 hover:underline">
                {src.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-400">이 페이지는 일반적인 안내 목적이며, 정확한 퇴직금은 급여대장 및 인사팀을 통해 확인하세요.</p>
      </section>

      {/* 관련 가이드 */}
      <ContinueReading
        title="퇴직금 관련 가이드 더 읽기"
        items={TOPIC_GUIDES["retirement"].map((g) => ({
          badge: "가이드",
          title: g.title,
          desc: g.desc,
          path: `/guides/${g.slug}`,
        }))}
      />

      {/* 다른 근속기간 링크 */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">다른 근속기간 퇴직금 확인</h2>
        <div className="flex flex-wrap gap-2">
          {RETIREMENT_BUCKETS.filter((b) => b.slug !== data.slug).map((b) => (
            <Link
              key={b.slug}
              to={b.path}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm text-emerald-700 hover:border-emerald-400 transition-colors"
            >
              {b.label}
            </Link>
          ))}
        </div>
        <div className="mt-4 flex gap-4 flex-wrap text-sm">
          <Link to="/calculators/severance-pay" className="text-emerald-700 font-semibold hover:underline">
            → 퇴직금 계산기로 이동
          </Link>
          <Link to="/calculators/annual-leave" className="text-slate-600 hover:underline">연차 계산기</Link>
          <Link to="/calculators/net-salary" className="text-slate-600 hover:underline">실수령액 계산기</Link>
          <Link to="/guides" className="text-slate-600 hover:underline">가이드 보기</Link>
        </div>
      </section>
    </div>
  );
};

export default RetirementLanding;
