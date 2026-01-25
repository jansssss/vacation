import React from "react";
import { SITE_CONFIG } from "../config/siteConfig";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-slate-100 bg-white/80">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-slate-500">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="font-medium text-slate-700">{SITE_CONFIG.brandLine}</div>
          <div>疫꿸퀣??? {SITE_CONFIG.rulesEffectiveDate} 夷???낅쑓??꾨뱜: {SITE_CONFIG.updatedAt}</div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
          <Link to="/about" className="hover:text-slate-700">???뻣</Link>
          <Link to="/contact" className="hover:text-slate-700">?얜챷??/Link>
          <Link to="/privacy" className="hover:text-slate-700">揶쏆뮇??類ｋ궖筌ｌ꼶?곮쳸?밸쵟</Link>
          <Link to="/terms" className="hover:text-slate-700">??곸뒠???</Link>
          <Link to="/disclaimer" className="hover:text-slate-700">筌롫똻肄?/Link>
        </div>
        <div className="mt-3 text-xs text-slate-400">
          ??곸겫?? {SITE_CONFIG.operatorDisplay} 夷??怨뺤뵭筌? {SITE_CONFIG.contactEmail}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          癰???뺥돩??삳뮉 ??곗뺘 ?類ｋ궖 ??볥궗 筌뤴뫗???흭 揶쏆뮆???怨뱀넺???怨뺤뵬 野껉퀗?드첎? ???わ쭪?????됰뮸??덈뼄. 甕곕베履??癒???          ?袁⑤빍筌? 筌ㅼ뮇伊??癒?뼊?? ?온??疫꿸퀗? ??덇땀 獄??袁ⓓ?첎? ?怨룸뼖??亦낅슣???몃빍??
        </p>
      </div>
    </footer>
  );
};

export default Footer;
