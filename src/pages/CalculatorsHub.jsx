import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { calculatorsRegistry } from "../config/calculatorsRegistry";

const CalculatorsHub = () => {
  return (
    <div className="space-y-8">
      <Seo
        title="?④쑴沅쎿묾???덊닏"
        description="?怨쀪컧, ??곸춦疫??????뼎 ?紐꺪??④쑴沅쎿묾怨? ???⑤끃肉???類ㅼ뵥??랁???뿅???곴퐬繹먮슣? ??볥궗??몃빍??"
        path="/calculators"
      />

      <div>
        <h1 className="text-3xl font-semibold text-slate-900">?④쑴沅쎿묾???덊닏</h1>
        <p className="mt-2 text-slate-600">
          ???뼎 ?④쑴沅쎿묾怨뺤춳????곴퐬, ??됱뇚, ???, FAQ, ?⑤벊?????쀫탣?깆슦????볥궗????뿅???????볦퍢??餓κ쑴???덈뼄.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {calculatorsRegistry.map((calculator) => (
          <Link
            key={calculator.slug}
            to={calculator.path}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                {calculator.category}
              </span>
              <span>??낅쑓??꾨뱜 {calculator.updatedAt}</span>
            </div>
            <h2 className="mt-3 text-xl font-semibold text-slate-900">{calculator.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{calculator.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CalculatorsHub;
