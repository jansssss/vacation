import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Seo from "../../components/Seo";
import Breadcrumbs from "../../components/Breadcrumbs";
import { buildFaqSchema, buildBreadcrumbSchema } from "../../lib/structuredData";
import { getBucketData, NET_SALARY_BUCKETS } from "../../data/netSalaryBuckets";

const fmt = (n) => Math.round(n).toLocaleString("ko-KR");
const UPDATED_AT = "2026-02-21";

const NetSalaryLanding = () => {
  const { bucket } = useParams();
  const data = getBucketData(bucket);

  if (!data) return <Navigate to="/calculators/net-salary" replace />;

  const breadcrumbs = [
    { label: "홈", path: "/" },
    { label: "실수령액 계산기", path: "/calculators/net-salary" },
    { label: `월급 ${data.label} 실수령액`, path: data.path },
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
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
          실수령액 계산 안내
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 mt-2">{data.title}</h1>
        <p className="text-slate-600 mt-3 leading-relaxed">{data.description}</p>
        <div className="flex flex-wrap gap-2 mt-4 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">기준일 {UPDATED_AT}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">2026년 4대보험료율 적용</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">국세청 간이세액표 기준</span>
        </div>
      </section>

      {/* 요약 3줄 */}
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

      {/* CTA 버튼 (프리셋) */}
      <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6 text-center space-y-3">
        <p className="text-slate-700 text-sm font-medium">내 조건으로 정확하게 계산하고 싶다면?</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {[0, 1, 2].map((deps) => {
            const label = deps === 0 ? "독신(0인)" : deps === 1 ? "부양가족 1인" : "부양가족 2인";
            return (
              <Link
                key={deps}
                to={`/calculators/net-salary?gross=${data.gross}&deps=${deps}`}
                className="inline-block rounded-full bg-emerald-600 text-white px-5 py-2 text-sm font-semibold hover:bg-emerald-700 transition-colors"
              >
                {label}으로 계산하기
              </Link>
            );
          })}
        </div>
        <p className="text-xs text-slate-500">계산기에서 월급과 부양가족 수를 자유롭게 조정할 수 있습니다.</p>
      </section>

      {/* 예시 테이블 */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">부양가족 수별 실수령액 예시</h2>
        <div className="space-y-4">
          {data.examples.map((ex) => (
            <div key={ex.deps} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm">
              <p className="font-semibold text-slate-800 mb-2">{ex.depsLabel} 기준</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-slate-600">
                <span>국민연금</span><span className="text-right">{fmt(ex.breakdown.nationalPension)}원</span>
                <span>건강보험</span><span className="text-right">{fmt(ex.breakdown.healthInsurance)}원</span>
                <span>장기요양</span><span className="text-right">{fmt(ex.breakdown.longTermCare)}원</span>
                <span>고용보험</span><span className="text-right">{fmt(ex.breakdown.employment)}원</span>
                <span>소득세</span><span className="text-right">{fmt(ex.breakdown.incomeTax)}원</span>
                <span>지방소득세</span><span className="text-right">{fmt(ex.breakdown.localTax)}원</span>
                <span className="font-semibold text-slate-800 border-t border-slate-200 pt-1">총 공제</span>
                <span className="text-right font-semibold text-slate-800 border-t border-slate-200 pt-1">{fmt(ex.totalDeduction)}원</span>
                <span className="font-bold text-emerald-700 text-base">실수령액</span>
                <span className="text-right font-bold text-emerald-700 text-base">{fmt(ex.net)}원</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">비과세 식대 20만 원 적용 기준. 실제 공제액은 회사 규정에 따라 다를 수 있습니다.</p>
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
              <a
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:underline"
              >
                {src.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-400">
          이 페이지는 일반적인 안내 목적이며, 정확한 공제액은 급여명세서 또는 국세청 홈택스를 확인하세요.
        </p>
      </section>

      {/* 관련 구간 링크 */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">다른 월급 구간 실수령액</h2>
        <div className="flex flex-wrap gap-2">
          {NET_SALARY_BUCKETS.filter((b) => b.bucket !== data.bucket).map((b) => (
            <Link
              key={b.bucket}
              to={b.path}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-sm text-emerald-700 hover:border-emerald-400 transition-colors"
            >
              월급 {b.label}
            </Link>
          ))}
        </div>
        <div className="mt-4 flex gap-3 flex-wrap text-sm">
          <Link to="/calculators/net-salary" className="text-emerald-700 font-semibold hover:underline">
            → 실수령액 계산기로 이동
          </Link>
          <Link to="/calculators/annual-leave" className="text-slate-600 hover:underline">
            연차 계산기
          </Link>
          <Link to="/calculators/severance-pay" className="text-slate-600 hover:underline">
            퇴직금 계산기
          </Link>
        </div>
      </section>
    </div>
  );
};

export default NetSalaryLanding;
