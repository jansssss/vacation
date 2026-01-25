import React from "react";
import { Link } from "react-router-dom";
import Seo from "./Seo";
import Breadcrumbs from "./Breadcrumbs";
import { buildBreadcrumbSchema, buildFaqSchema } from "../lib/structuredData";

const SectionCard = ({ title, children }) => {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">{title}</h2>
      {children}
    </section>
  );
};

const CalculatorTemplate = ({
  seo,
  breadcrumbs,
  title,
  description,
  updatedAt,
  children,
  summaryLines = [],
  steps = [],
  exceptions = [],
  cases = [],
  faqs = [],
  sources = [],
  relatedLinks = [],
  trust = {
    checklist: [],
    disputePoints: [],
    notices: [],
  },
}) => {
  const faqSchema = buildFaqSchema(faqs);
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);

  return (
    <div className="space-y-8">
      <Seo {...seo} jsonLd={[faqSchema, breadcrumbSchema]} />
      <Breadcrumbs items={breadcrumbs} />

      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              계산기 허브
            </p>
            <h1 className="text-3xl font-semibold text-slate-900 mt-2">{title}</h1>
            <p className="text-slate-600 mt-3 leading-relaxed">{description}</p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1">기준일 {updatedAt}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">공공기관 인사총무 실무 관점</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">익명화/합성 사례</span>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
        <div className="space-y-8">
          <SectionCard title="계산 입력">
            {children}
          </SectionCard>

          <SectionCard title="결과 요약">
            <ul className="space-y-2 text-sm text-slate-700">
              {summaryLines.map((line, index) => (
                <li key={index} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="계산 과정">
            <ol className="space-y-2 text-sm text-slate-700 list-decimal list-inside">
              {steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </SectionCard>

          <SectionCard title="실무 예외 (조건 분기)">
            <ul className="space-y-2 text-sm text-slate-700">
              {exceptions.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="실전 사례">
            <div className="space-y-3 text-sm text-slate-700">
              {cases.map((item, index) => (
                <div key={index} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  {item}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="자주 묻는 질문 (FAQ)">
            <div className="space-y-4 text-sm text-slate-700">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <p className="font-semibold text-slate-900">Q. {faq.question}</p>
                  <p className="mt-1">A. {faq.answer}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="근거 / 출처 / 업데이트">
            <ul className="space-y-2 text-sm text-slate-700">
              {sources.map((source, index) => (
                <li key={index}>• {source}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-400">
              제공 정보는 일반적인 안내이며, 실제 적용은 사업장 내규와 행정 해석에 따라 달라질 수 있습니다.
            </p>
          </SectionCard>
        </div>

        <aside className="space-y-6">
          <SectionCard title="인사팀 체크리스트">
            <ul className="space-y-2 text-sm text-slate-700">
              {trust.checklist.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="분쟁/민원 포인트">
            <ul className="space-y-2 text-sm text-slate-700">
              {trust.disputePoints.map((item, index) => (
                <li key={index}>• {item}</li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="공지문 예시">
            <div className="space-y-2 text-sm text-slate-700">
              {trust.notices.map((item, index) => (
                <p key={index} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                  {item}
                </p>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="관련 도구/글">
            <ul className="space-y-2 text-sm text-slate-700">
              {relatedLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-emerald-700 hover:text-emerald-900">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </SectionCard>
        </aside>
      </div>
    </div>
  );
};

export default CalculatorTemplate;
