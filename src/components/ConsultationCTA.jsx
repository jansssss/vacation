import React, { useState } from "react";
import { supabase } from "../lib/supabase";

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ZapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const GiftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12" />
    <rect x="2" y="7" width="20" height="5" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const TRUST_ITEMS = [
  { icon: <ShieldIcon />, label: "비밀 보장", desc: "개인정보 철저히 보호" },
  { icon: <ZapIcon />, label: "빠른 검토", desc: "영업일 기준 1~2일 내" },
  { icon: <GiftIcon />, label: "완전 무료", desc: "상담 신청비용 없음" },
];

const INQUIRY_TYPES = [
  "연차·휴가",
  "퇴직금·퇴직연금",
  "급여·임금",
  "해고·징계",
  "근로계약",
  "기타",
];

const ConsultationCTA = ({ sourceSlug }) => {
  const [form, setForm] = useState({ name: "", contact: "", type: "", content: "" });
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) {
      setErrorMsg("개인정보 수집·이용에 동의해주세요.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const { error } = await supabase.from("consultation_requests").insert([
        {
          name: form.name.trim(),
          contact: form.contact.trim(),
          inquiry_type: form.type || null,
          content: form.content.trim() || null,
          source_slug: sourceSlug || null,
        },
      ]);
      if (error) throw error;
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg("신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  if (status === "success") {
    return (
      <section className="rounded-3xl bg-gradient-to-br from-slate-800 via-slate-800 to-blue-900 p-10 md:p-14 text-center shadow-xl">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/20 text-blue-300 mx-auto mb-6">
          <CheckCircleIcon />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">신청이 완료되었습니다</h2>
        <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
          내용을 검토한 후 영업일 기준 1~2일 내로<br />남겨주신 연락처로 개별 연락드리겠습니다.
        </p>
      </section>
    );
  }

  const inputBase =
    "w-full rounded-xl bg-white/10 border border-white/15 px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50";

  return (
    <section className="rounded-3xl bg-gradient-to-br from-slate-800 via-slate-800 to-blue-900 p-8 md:p-12 shadow-xl overflow-hidden relative">
      {/* subtle decorative blur */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-600/10 blur-3xl" />

      <div className="relative">
        {/* badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-300">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            무료 상담 신청
          </span>
        </div>

        {/* headline */}
        <div className="text-center mb-8 space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white leading-snug">
            노무·인사 문제,<br className="md:hidden" /> 혼자 고민하지 마세요
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
            연락처를 남겨주시면 검토 후 개별 안내드립니다.<br />
            비용은 전혀 없으며 부담 없이 신청하셔도 됩니다.
          </p>
        </div>

        {/* trust badges */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-10">
          {TRUST_ITEMS.map(({ icon, label, desc }) => (
            <div key={label} className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-2 sm:text-center">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-300">
                {icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* divider */}
        <div className="border-t border-white/10 mb-8" />

        {/* form */}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">
                이름 <span className="text-blue-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="홍길동"
                required
                className={inputBase}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">
                연락처 (전화 또는 이메일) <span className="text-blue-400">*</span>
              </label>
              <input
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="010-0000-0000"
                required
                className={inputBase}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">문의 유형</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className={`${inputBase} appearance-none`}
            >
              <option value="" className="bg-slate-800">유형을 선택해주세요 (선택)</option>
              {INQUIRY_TYPES.map((t) => (
                <option key={t} value={t} className="bg-slate-800">{t}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400">문의 내용 (선택)</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="궁금하신 내용을 간략하게 적어주세요."
              rows={3}
              className={`${inputBase} resize-none`}
            />
          </div>

          {/* 개인정보 동의 */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`h-4 w-4 rounded border transition ${
                  agreed ? "bg-blue-500 border-blue-500" : "bg-white/10 border-white/20 group-hover:border-blue-400/50"
                } flex items-center justify-center`}
              >
                {agreed && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-xs text-slate-400 leading-relaxed">
              상담 신청을 위한 개인정보(이름, 연락처) 수집·이용에 동의합니다.
              수집된 정보는 상담 목적으로만 사용되며, 상담 완료 후 파기됩니다.
            </span>
          </label>

          {errorMsg && (
            <p className="text-xs text-red-400 bg-red-400/10 rounded-lg px-4 py-2">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-full bg-blue-500 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-400 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "신청 중..." : "무료로 상담 신청하기 →"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ConsultationCTA;
