import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { guidesRegistry } from "../config/guidesRegistry";

const GuidesIndex = () => {
  return (
    <div className="space-y-8">
      <Seo
        title="??뿅?揶쎛??諭?
        description="?怨쀪컧, ??곸춦疫?????뿅?癒?퐣 ?癒?폒 ?얠궠??雅뚯눘?ｇ몴??紐꾧텢?μ빖龜 ?온?癒?몵嚥??類ｂ봺??揶쎛??諭?筌뤴뫁???낅빍??"
        path="/guides"
      />

      <div>
        <h1 className="text-3xl font-semibold text-slate-900">??뿅?揶쎛??諭?/h1>
        <p className="mt-2 text-slate-600">
          ?④쑴沅쎿묾怨쀫퓠????筌???? ?냈??곷뮞??揶쎛??諭뜻에??類ㅼ삢??됰뮸??덈뼄. ?紐꾧텢?? ?⑤벊????臾믨쉐??獄쏅뗀以???뽰뒠??????덈뮉
          疫꿸퀣?????쀬겱????볥궗??몃빍??
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {guidesRegistry.map((guide) => (
          <Link
            key={guide.slug}
            to={`/guides/${guide.slug}`}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-xs text-slate-500">??낅쑓??꾨뱜 {guide.updatedAt}</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">{guide.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{guide.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GuidesIndex;
