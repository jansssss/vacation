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
              ??ｌ뫒亦낆렲臾????딅땹
            </p>
            <h1 className="text-3xl font-semibold text-slate-900 mt-2">{title}</h1>
            <p className="text-slate-600 mt-3 leading-relaxed">{description}</p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1">?リ옇????{updatedAt}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">??ㅻ???臾얏? ?筌뤾쑨??關鍮뽳쨭 ??肉???㉱??/span>
            <span className="rounded-full bg-slate-100 px-3 py-1">???援????諛댁뎽 ???</span>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
        <div className="space-y-8">
          <SectionCard title="??ｌ뫒亦????놁졑">
            {children}
          </SectionCard>

          <SectionCard title="?롪퍒?????븐슜??>
            <ul className="space-y-2 text-sm text-slate-700">
              {summaryLines.map((line, index) => (
                <li key={index} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="??ｌ뫒亦???λ닔??>
            <ol className="space-y-2 text-sm text-slate-700 list-decimal list-inside">
              {steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </SectionCard>

          <SectionCard title="??肉????깅뇶 (?브퀗?쀦뤃??釉뚯뫅??">
            <ul className="space-y-2 text-sm text-slate-700">
              {exceptions.map((item, index) => (
                <li key={index}>??{item}</li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="???깆쓧 ???">
            <div className="space-y-3 text-sm text-slate-700">
              {cases.map((item, index) => (
                <div key={index} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  {item}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="???????좉텭??嶺뚯쉶?꾣룇 (FAQ)">
            <div className="space-y-4 text-sm text-slate-700">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <p className="font-semibold text-slate-900">Q. {faq.question}</p>
                  <p className="mt-1">A. {faq.answer}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="?잙??딀뤃?/ ?怨쀫츋??/ ???낆몥??袁⑤콦">
            <ul className="space-y-2 text-sm text-slate-700">
              {sources.map((source, index) => (
                <li key={index}>??{source}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-400">
              ??蹂κ텢 ?筌먲퐢沅????怨쀫틮??⑤챷逾????뉖?????? ???깆젷 ??⑤챷??? ??驪?????깅눂?? ??源놁젧 ??怨댄맍????⑤벡逾?????륁???????곕????덈펲.
            </p>
          </SectionCard>
        </div>

        <aside className="space-y-6">
          <SectionCard title="?筌뤾쑨??? 嶺뚳퐢?얍칰類잙뎨????>
            <ul className="space-y-2 text-sm text-slate-700">
              {trust.checklist.map((item, index) => (
                <li key={index}>??{item}</li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="?釉뚯뫒??亦껋꼷????????>
            <ul className="space-y-2 text-sm text-slate-700">
              {trust.disputePoints.map((item, index) => (
                <li key={index}>??{item}</li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="??ㅻ쾴??????곕뻣">
            <div className="space-y-2 text-sm text-slate-700">
              {trust.notices.map((item, index) => (
                <p key={index} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                  {item}
                </p>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="??㉱???熬곥룗???リ섣?">
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
