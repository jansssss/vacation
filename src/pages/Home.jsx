import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { calculatorsRegistry } from "../config/calculatorsRegistry";
import { SITE_CONFIG } from "../config/siteConfig";

const Home = () => {
  return (
    <div className="space-y-12">
      <Seo
        title="?紐꺪?域뱀눖以??④쑴沅쎿묾???덊닏"
        description="?怨쀪컧, ??곸춦疫??????뼎 ?④쑴沅쎿묾怨? ???⑤끃肉?筌뤴뫁釉???뿅???곴퐬?????繹먮슣? ??볥궗??롫뮉 e-work.kr??낅빍??"
        path="/"
      />

      <section className="rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-amber-50 p-10 shadow-sm border border-slate-100">
        <div className="max-w-3xl space-y-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">?紐꺪?域뱀눖以??醫뤿뼢 ???삸??/p>
          <h1 className="text-4xl font-semibold text-slate-900">
            ?④쑴沅쎿묾???롪돌????곴퐬?????繹먮슣?.
            <span className="block text-slate-600 mt-2">?袁⑹삢 餓λ쵐????紐꾧텢?μ빖龜 ?꾩꼹?쀯㎘???덊닏</span>
          </h1>
          <p className="text-slate-600 leading-relaxed">
            {SITE_CONFIG.brandLine} e-work.kr?? ?怨쀪컧夷??곸춦疫뀀뜆荑???癒?폒 ?얠궠??雅뚯눘?ｇ몴?餓λ쵐???곗쨮, ?④쑴沅?野껉퀗??? ??ｍ뜞
            ??뿅???됱뇚夷똅AQ夷뚧⑤벊?????쀫탣?깆슙?댐쭪? ??볥궗??뤿연 ?? ???뚣끇??????곷???쑴???餓κ쑴???덈뼄.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/calculators"
              className="rounded-full bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              ?④쑴沅쎿묾??袁⑷퍥 癰귣떯由?            </Link>
            <Link
              to="/guides"
              className="rounded-full border border-slate-200 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-white"
            >
              ??뿅?揶쎛??諭?癰귣떯由?            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">???뼎 ?④쑴沅쎿묾?/h2>
          <Link to="/calculators" className="text-sm text-emerald-700 hover:text-emerald-900">
            ??癰귣떯由???          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {calculatorsRegistry.map((calculator) => (
            <Link
              key={calculator.slug}
              to={calculator.path}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase text-emerald-600">{calculator.category}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{calculator.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{calculator.summary}</p>
              <p className="mt-4 text-xs text-slate-400">??낅쑓??꾨뱜 {calculator.updatedAt}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">?醫듚?疫꿸퀡而??꾩꼹?쀯㎘?/h3>
          <p className="mt-2 text-sm text-slate-600">
            ?⑤벀?ф묾怨? ?紐꾧텢?μ빖龜?????온?癒?벥 筌ｋ똾寃뺟뵳???紐? ?⑤벊?????됰뻻??筌??④쑴沅쎿묾怨쀫퓠 ?⑥쥙????볥궗??몃빍??
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">??덊닏-??쎈７???닌듼?/h3>
          <p className="mt-2 text-sm text-slate-600">
            ?④쑴沅쎿묾?????뿅?揶쎛??諭??????夷똅AQ嚥??怨뚭퍙??野꺜???醫롮뿯???브쑴沅??몃빍??
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">?용쵌??UX 筌ㅼ뮇???/h3>
          <p className="mt-2 text-sm text-slate-600">
            癰귣챶揆/FAQ/?????3揶????숋쭕??醫???뤿연 UX??癰귣똾???롢늺???용쵌????륁뵡 ?닌듼쒐몴??類ｋ궖??몃빍??
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
