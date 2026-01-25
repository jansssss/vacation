import React from "react";
import { SITE_CONFIG } from "../config/siteConfig";

const Footer = () => {
  return (
    <footer className="border-t border-slate-100 bg-white/80">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-slate-500">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="font-medium text-slate-700">{SITE_CONFIG.brandLine}</div>
          <div>기준일: {SITE_CONFIG.rulesEffectiveDate} · 업데이트: {SITE_CONFIG.updatedAt}</div>
        </div>
        <p className="mt-4 text-xs text-slate-400">
          본 서비스는 일반 정보 제공 목적이며 개별 상황에 따라 결과가 달라질 수 있습니다. 법률 자문이
          아니며, 최종 판단은 관련 기관 안내 및 전문가 상담을 권장합니다.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
