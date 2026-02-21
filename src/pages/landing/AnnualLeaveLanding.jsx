import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Seo from "../../components/Seo";
import Breadcrumbs from "../../components/Breadcrumbs";
import { buildFaqSchema, buildBreadcrumbSchema } from "../../lib/structuredData";
import { getBucketByMonth, ANNUAL_LEAVE_BUCKETS } from "../../data/annualLeaveBuckets";
import { SITE_CONFIG } from "../../config/siteConfig";

const UPDATED_AT = SITE_CONFIG.updatedAt;

const AnnualLeaveLanding = () => {
  const { month } = useParams();
  const data = getBucketByMonth(month);

  if (!data) return <Navigate to="/calculators/annual-leave" replace />;

  const breadcrumbs = [
    { label: "홈", path: "/" },
    { label: "연차 계산기", path: "/calculators/annual-leave" },
    { label: `${data.label} 연차`, path: data.path },
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
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">연차 발생 안내</p>
        <h1 className="text-3xl font-semibold text-slate-900 mt-2">{data.title}</h1>
        <p className="text-slate-600 mt-3 leading-relaxed">{data.description}</p>
        <div className="flex flex-wrap gap-2 mt-4 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">기준일 {UPDATED_AT}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">회계연도(1~12월) 기준</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">근로기준법 제60조</span>
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
        <p className="text-slate-700 text-sm font-medium">내 입사일로 정확하게 계산하고 싶다면?</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            to={`/calculators/annual-leave?joinDate=${data.joinDateExample}`}
            className="inline-block rounded-full bg-emerald-600 text-white px-5 py-2 text-sm font-semibold hover:bg-emerald-700 transition-colors"
          >
            {data.label} 1일 입사로 계산하기
          </Link>
          <Link
            to={`/calculators/annual-leave?joinDate=${data.joinDateExampleMid}`}
            className="inline-block rounded-full bg-white border border-emerald-300 text-emerald-700 px-5 py-2 text-sm font-semibold hover:bg-emerald-50 transition-colors"
          >
            {data.label} 15일 입사로 계산하기
          </Link>
        </div>
        <p className="text-xs text-slate-500">계산기에서 입사일과 기준일을 자유롭게 조정할 수 있습니다.</p>
      </section>

      {/* 연차 발생 예시 */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">연차 발생 예시</h2>
        <div className="space-y-4">
          {/* 1일 입사 */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-2">사례 1: 2025년 {data.label} 1일 입사</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-slate-600">
              <span>1년차 월차(2025년)</span>
              <span className="text-right font-semibold">{data.firstYearDays}일</span>
              <span>2년차 연차(2026년)</span>
              <span className="text-right font-semibold">{data.secondYearDays}일</span>
              <span className="font-semibold text-slate-800 border-t border-slate-200 pt-1">누적 합계</span>
              <span className="text-right font-semibold text-emerald-700 border-t border-slate-200 pt-1">{data.firstYearDays + data.secondYearDays}일</span>
            </div>
            <p className="text-xs text-slate-400 mt-2">출근율 80% 이상, 비과세 식대 적용 기준</p>
          </div>
          {/* 15일 입사 */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm">
            <p className="font-semibold text-slate-800 mb-2">사례 2: 2025년 {data.label} 15일 입사</p>
            <p className="text-slate-600">입사일이 1일이 아닌 경우, 입사월은 개근으로 인정되지 않아 그 달의 월차가 제외됩니다.</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-slate-600 mt-2">
              <span>1년차 월차(2025년)</span>
              <span className="text-right font-semibold">{Math.max(0, data.firstYearDays - 1)}일</span>
              <span>2년차 연차(2026년)</span>
              <span className="text-right font-semibold">{26 - Math.max(0, data.firstYearDays - 1)}일</span>
              <span className="font-semibold text-slate-800 border-t border-slate-200 pt-1">누적 합계</span>
              <span className="text-right font-semibold text-emerald-700 border-t border-slate-200 pt-1">26일</span>
            </div>
          </div>
        </div>
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
        <p className="mt-3 text-xs text-slate-400">이 페이지는 일반적인 안내 목적이며, 정확한 연차는 내부 규정과 인사팀을 통해 확인하세요.</p>
      </section>

      {/* 다른 입사월 링크 */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">다른 입사월 연차 확인</h2>
        <div className="flex flex-wrap gap-2">
          {ANNUAL_LEAVE_BUCKETS.filter((b) => b.month !== data.month).map((b) => (
            <Link
              key={b.month}
              to={b.path}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm text-emerald-700 hover:border-emerald-400 transition-colors"
            >
              {b.label}
            </Link>
          ))}
        </div>
        <div className="mt-4 flex gap-4 flex-wrap text-sm">
          <Link to="/calculators/annual-leave" className="text-emerald-700 font-semibold hover:underline">
            → 연차 계산기로 이동
          </Link>
          <Link to="/calculators/severance-pay" className="text-slate-600 hover:underline">퇴직금 계산기</Link>
          <Link to="/calculators/net-salary" className="text-slate-600 hover:underline">실수령액 계산기</Link>
          <Link to="/guides" className="text-slate-600 hover:underline">가이드 보기</Link>
        </div>
      </section>
    </div>
  );
};

export default AnnualLeaveLanding;
