import React from "react";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { SITE_CONFIG } from "../config/siteConfig";

const Terms = () => {
  const breadcrumbs = [
    { label: "??, path: "/" },
    { label: "?댁슜?쎄?", path: "/terms" },
  ];

  return (
    <div className="space-y-8">
      <Seo
        title="?댁슜?쎄?"
        description="e-work.kr ?쒕퉬???댁슜?쎄?"
        path="/terms"
      />
      <Breadcrumbs items={breadcrumbs} />

      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-6 text-slate-600 leading-relaxed">
        <h1 className="text-3xl font-semibold text-slate-900">?댁슜?쎄?</h1>
        <p>
          蹂??쎄?? {SITE_CONFIG.operatorName}(?댄븯 ?쒖슫?곸옄??媛 ?쒓났?섎뒗 e-work.kr
          ?쒕퉬?ㅼ쓽 ?댁슜 議곌굔 諛??덉감, ?댁쁺?먯? ?댁슜?먯쓽 沅뚮━쨌?섎Т ?깆쓣 洹쒖젙?⑸땲??
        </p>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">1. ?쒕퉬??紐⑹쟻</h2>
          <p>
            e-work.kr? ?몃Т/洹쇰줈 愿??怨꾩궛湲곗? ?뺣낫 ?쒓났???듯빐 ?댁슜?먯쓽 ?몄쓽瑜??뺣뒗
            ?뺣낫???쒕퉬?ㅼ엯?덈떎.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">2. ?쒓났 ?뺣낫???쒓퀎</h2>
          <p>
            ?쒓났?섎뒗 怨꾩궛 寃곌낵 諛?肄섑뀗痢좊뒗 ?쇰컲???덈궡 紐⑹쟻?대ŉ, 踰뺣쪧 ?먮Ц???꾨떃?덈떎.
            ?ㅼ젣 ?곸슜? ?ъ뾽??洹쒖젙 諛?愿??湲곌? ?댁꽍???곗꽑?⑸땲??
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">3. ?댁슜?먯쓽 ?섎Т</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>?쒕퉬???댁슜 ??踰뺣졊 諛?蹂??쎄???以?섑빐???⑸땲??</li>
            <li>??몄쓽 沅뚮━瑜?移⑦빐?섍굅??遺덈쾿쨌?좏빐???뺣낫瑜?寃뚯떆?댁꽌?????⑸땲??</li>
            <li>?쒕퉬???댁쁺??諛⑺빐?섎뒗 ?됱쐞瑜??댁꽌?????⑸땲??</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">4. ??묎텒</h2>
          <p>
            蹂??ъ씠?몄뿉 寃뚯떆??肄섑뀗痢좎쓽 ??묎텒? ?댁쁺?먯뿉寃??덉쑝硫? 臾대떒 蹂듭젣쨌諛고룷瑜?            湲덊빀?덈떎. ?몄슜 ??異쒖쿂 ?쒓린瑜?沅뚯옣?⑸땲??
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">5. ?몃? 留곹겕</h2>
          <p>
            ?몃? ?ъ씠?몃줈 ?곌껐?섎뒗 留곹겕媛 ?ы븿?????덉쑝硫? ?대떦 ?ъ씠?몄쓽 肄섑뀗痢좎?
            媛쒖씤?뺣낫 泥섎━????댁꽌???댁쁺?먭? 梨낆엫吏吏 ?딆뒿?덈떎.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">6. ?쒕퉬??蹂寃?諛?以묐떒</h2>
          <p>
            ?댁쁺?먮뒗 ?쒕퉬??媛쒖꽑???꾪빐 ?쇰? 湲곕뒫??蹂寃쏀븯嫄곕굹 以묐떒?????덉쑝硫?
            以묒슂??蹂寃쎌? ?ъ쟾 怨듭??⑸땲??
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">7. 硫댁콉 諛?梨낆엫 ?쒗븳</h2>
          <p>
            ?댁쁺?먮뒗 ?쒕퉬???쒓났怨?愿?⑦븯??踰뺣졊???덉슜?섎뒗 踰붿쐞 ?댁뿉??梨낆엫???쒗븳?⑸땲??
            ?댁슜?먭? 蹂??쒕퉬?ㅼ쓽 ?뺣낫瑜??쒖슜?섏뿬 諛쒖깮??吏곸젒쨌媛꾩젒 ?먰빐?????            ?댁쁺?먮뒗 梨낆엫??吏吏 ?딆뒿?덈떎.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">8. 遺꾩웳 ?닿껐</h2>
          <p>
            蹂??쎄?怨?愿?⑦븳 遺꾩웳? ??쒕?援?踰뺣졊??以嫄곕쾿?쇰줈 ?섎ŉ,
            愿??踰뺤썝? 誘쇱궗?뚯넚踰뺤뿉 ?곕쫭?덈떎.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">9. 臾몄쓽</h2>
          <p>?댁슜?쎄??????臾몄쓽???꾨옒 ?곕씫泥섎줈 媛?ν빀?덈떎.</p>
          <p className="font-medium">?곕씫泥? {SITE_CONFIG.contactEmail}</p>
        </div>

        <p className="text-xs text-slate-400">?쒗뻾?? 2026-01-25</p>
      </section>
    </div>
  );
};

export default Terms;
