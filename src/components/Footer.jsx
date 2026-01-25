import React from "react";
import { SITE_CONFIG } from "../config/siteConfig";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-slate-100 bg-white/80">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-slate-500">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="font-medium text-slate-700">{SITE_CONFIG.brandLine}</div>
          <div>?リ옇???? {SITE_CONFIG.rulesEffectiveDate} 鸚????낆몥??袁⑤콦: {SITE_CONFIG.updatedAt}</div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
          <Link to="/about" className="hover:text-slate-700">???六?/Link>
          <Link to="/contact" className="hover:text-slate-700">??쒖굣??/Link>
          <Link to="/privacy" className="hover:text-slate-700">?띠룇裕??筌먲퐢沅뽫춯節뚭섬?怨?낯?諛몄턃</Link>
          <Link to="/terms" className="hover:text-slate-700">??怨몃뮔???</Link>
          <Link to="/disclaimer" className="hover:text-slate-700">嶺뚮∥?삭굜?/Link>
        </div>
        <div className="mt-3 text-xs text-slate-400">
          ??怨멸껀?? {SITE_CONFIG.operatorDisplay} 鸚???⑤벡逾?춯? {SITE_CONFIG.contactEmail}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          ????類λ룴???노츎 ??怨쀫틮 ?筌먲퐢沅???蹂κ텢 嶺뚮ㅄ維???????띠룇裕????⑤??????⑤벡逾??롪퍒???쒖쾸? ????륁???????곕????덈펲. ?뺢퀡踰좑쭫??????          ?熬곣뫀鍮띸춯? 嶺뚣끉裕뉏펺????堉?? ??㉱???リ옇?? ???뉖? ???熬곣뱭?泥? ??⑤８堉??雅?굝????紐껊퉵??
        </p>
      </div>
    </footer>
  );
};

export default Footer;
