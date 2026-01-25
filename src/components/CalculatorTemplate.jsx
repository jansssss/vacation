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
              ?④쑴沅쎿묾???덊닏
            </p>
            <h1 className="text-3xl font-semibold text-slate-900 mt-2">{title}</h1>
            <p className="text-slate-600 mt-3 leading-relaxed">{description}</p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-3 py-1">疫꿸퀣???{updatedAt}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">?⑤벀?ф묾怨? ?紐꾧텢?μ빖龜 ??뿅??온??/span>
            <span className="rounded-full bg-slate-100 px-3 py-1">??ъ구????밴쉐 ???</span>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
        <div className="space-y-8">
          <SectionCard title="?④쑴沅???낆젾">
            {children}
          </SectionCard>

          <SectionCard title="野껉퀗???遺용튋">
            <ul className="space-y-2 text-sm text-slate-700">
              {summaryLines.map((line, index) => (
                <li key={index} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="?④쑴沅??⑥눘??>
            <ol className="space-y-2 text-sm text-slate-700 list-decimal list-inside">
              {steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </SectionCard>

          <SectionCard title="??뿅???됱뇚 (鈺곌퀗援??브쑨由?">
            <ul className="space-y-2 text-sm text-slate-700">
              {exceptions.map((item, index) => (
                <li key={index}>??{item}</li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="??쇱읈 ???">
            <div className="space-y-3 text-sm text-slate-700">
              {cases.map((item, index) => (
                <div key={index} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  {item}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="?癒?폒 ?얠궠??筌욌뜄揆 (FAQ)">
            <div className="space-y-4 text-sm text-slate-700">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <p className="font-semibold text-slate-900">Q. {faq.question}</p>
                  <p className="mt-1">A. {faq.answer}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="域뱀눊援?/ ?곗뮇荑?/ ??낅쑓??꾨뱜">
            <ul className="space-y-2 text-sm text-slate-700">
              {sources.map((source, index) => (
                <li key={index}>??{source}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-400">
              ??볥궗 ?類ｋ궖????곗뺘?怨몄뵥 ??덇땀??흭, ??쇱젫 ?怨몄뒠?? ??毓????욱뇣?? ??깆젟 ??곴퐤???怨뺤뵬 ???わ쭪?????됰뮸??덈뼄.
            </p>
          </SectionCard>
        </div>

        <aside className="space-y-6">
          <SectionCard title="?紐꾧텢?? 筌ｋ똾寃뺟뵳????>
            <ul className="space-y-2 text-sm text-slate-700">
              {trust.checklist.map((item, index) => (
                <li key={index}>??{item}</li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="?브쑴??沃섏눘???????>
            <ul className="space-y-2 text-sm text-slate-700">
              {trust.disputePoints.map((item, index) => (
                <li key={index}>??{item}</li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="?⑤벊?????됰뻻">
            <div className="space-y-2 text-sm text-slate-700">
              {trust.notices.map((item, index) => (
                <p key={index} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                  {item}
                </p>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="?온???袁㏓럡/疫꼲">
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
