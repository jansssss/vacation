import React from "react";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { SITE_CONFIG } from "../config/siteConfig";

const Contact = () => {
  const breadcrumbs = [
    { label: "??, path: "/" },
    { label: "?얜챷??, path: "/contact" },
  ];

  return (
    <div className="space-y-8">
      <Seo
        title="?얜챷???띾┛"
        description="e-work.kr ?얜챷??獄???곕굡獄?筌?쑬瑗???덇땀"
        path="/contact"
      />
      <Breadcrumbs items={breadcrumbs} />

      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-4">
        <h1 className="text-3xl font-semibold text-slate-900">?얜챷???띾┛</h1>
        <p className="text-slate-600 leading-relaxed">
          ??뺥돩????곸뒠 餓?揶쏆뮇苑???袁⑹뒄???봔?브쑴?????살첒??獄쏆뮄猿??뤿??삠늺 ?袁⑥삋 ?怨뺤뵭筌ｌ꼶以?          ???젻雅뚯눘苑?? ??곸뒠 ?類ㅼ뵥 ????뽮컧?怨몄몵嚥?獄쏆꼷???띿퓢??щ빍??
        </p>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-700">
          <p className="font-medium">??李??/p>
          <p className="mt-2">{SITE_CONFIG.contactEmail}</p>
        </div>
        <p className="text-xs text-slate-400">
          ?용쵌???얜챷?? ??쀬몧 ?遺욧퍕, ?꾩꼹?쀯㎘??대Ŋ???遺욧퍕?? ??李????뺛걠??筌뤴뫗?????ｍ뜞 ?怨몃선雅뚯눘?놅쭖?          ????쥓?ㅵ칰?筌ｌ꼶???????됰뮸??덈뼄.
        </p>
      </section>
    </div>
  );
};

export default Contact;
