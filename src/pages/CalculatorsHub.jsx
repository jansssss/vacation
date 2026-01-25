import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { calculatorsRegistry } from "../config/calculatorsRegistry";

const CalculatorsHub = () => {
  return (
    <div className="space-y-8">
      <Seo
        title="??ｌ뫒亦낆렲臾????딅땹"
        description="??⑥れ빵, ??怨몄땋???????堉??筌뤾벳???ｌ뫒亦낆렲臾얏? ????ㅻ걙????筌먦끉逾???겶???肉???怨댄맟濚밸Ŧ?? ??蹂κ텢??紐껊퉵??"
        path="/calculators"
      />

      <div>
        <h1 className="text-3xl font-semibold text-slate-900">??ｌ뫒亦낆렲臾????딅땹</h1>
        <p className="mt-2 text-slate-600">
          ???堉???ｌ뫒亦낆렲臾얏⑤벡異????怨댄맟, ???깅뇶, ???, FAQ, ??ㅻ쾴??????ロ깵?源놁뒭????蹂κ텢????肉???????蹂?뜟??繞벿븐뫒????덈펲.
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
              <span>???낆몥??袁⑤콦 {calculator.updatedAt}</span>
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
