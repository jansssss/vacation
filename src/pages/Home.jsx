import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { calculatorsRegistry } from "../config/calculatorsRegistry";
import { SITE_CONFIG } from "../config/siteConfig";

const Home = () => {
  return (
    <div className="space-y-12">
      <Seo
        title="?筌뤾벳??잙??뽨빳???ｌ뫒亦낆렲臾????딅땹"
        description="??⑥れ빵, ??怨몄땋???????堉???ｌ뫒亦낆렲臾얏? ????ㅻ걙??嶺뚮ㅄ維곲뇡???肉???怨댄맟?????濚밸Ŧ?? ??蹂κ텢??濡ル츎 e-work.kr???낅퉵??"
        path="/"
      />

      <section className="rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-amber-50 p-10 shadow-sm border border-slate-100">
        <div className="max-w-3xl space-y-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">?筌뤾벳??잙??뽨빳???ルㅏ堉???????/p>
          <h1 className="text-4xl font-semibold text-slate-900">
            ??ｌ뫒亦낆렲臾???濡る룎????怨댄맟?????濚밸Ŧ??.
            <span className="block text-slate-600 mt-2">?熬곣뫗??繞벿살탳????筌뤾쑨??關鍮뽳쨭 ?袁⑷섰???럹????딅땹</span>
          </h1>
          <p className="text-slate-600 leading-relaxed">
            {SITE_CONFIG.brandLine} e-work.kr?? ??⑥れ빵鸚??怨몄땋?ル?녻뜎?????????좉텭???낅슣??節뉖ご?繞벿살탳???怨쀬Ŧ, ??ｌ뫒亦??롪퍒???? ??節띾쐾
            ??肉????깅뇶鸚룸쁾AQ鸚룸슙??ㅻ쾴??????ロ깵?源놁뒜??먯?? ??蹂κ텢??琉우뿰 ?? ????ｋ걞??????怨력???????繞벿븐뫒????덈펲.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/calculators"
              className="rounded-full bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              ??ｌ뫒亦낆렲臾??熬곣뫕???곌랜??뵳?            </Link>
            <Link
              to="/guides"
              className="rounded-full border border-slate-200 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-white"
            >
              ??肉??띠럾????獄??곌랜??뵳?            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">???堉???ｌ뫒亦낆렲臾?/h2>
          <Link to="/calculators" className="text-sm text-emerald-700 hover:text-emerald-900">
            ???곌랜??뵳???          </Link>
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
              <p className="mt-4 text-xs text-slate-400">???낆몥??袁⑤콦 {calculator.updatedAt}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">??ル뱴??リ옇?↑??袁⑷섰???럹?/h3>
          <p className="mt-2 text-sm text-slate-600">
            ??ㅻ???臾얏? ?筌뤾쑨??關鍮뽳쨭??????㉱???踰?嶺뚳퐢?얍칰類잙뎨???筌? ??ㅻ쾴??????곕뻣??嶺???ｌ뫒亦낆렲臾얏⑥ロ뱺 ??μ쪠????蹂κ텢??紐껊퉵??
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">???딅땹-???덌폌????뚮벣??/h3>
          <p className="mt-2 text-sm text-slate-600">
            ??ｌ뫒亦낆렲臾?????肉??띠럾????獄??????鸚룸쁾AQ????⑤슡????롪틵?????ル‘肉???釉뚯뫒亦??紐껊퉵??
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">??⑹탪??UX 嶺뚣끉裕???/h3>
          <p className="mt-2 text-sm text-slate-600">
            ?곌랜梨뜻룇/FAQ/?????3??????뗭춹??????琉우뿰 UX???곌랜????濡?듆????⑹탪????瑜곷덧 ??뚮벣??먮ご??筌먲퐢沅??紐껊퉵??
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
