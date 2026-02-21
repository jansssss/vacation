import React from "react";
import { Link } from "react-router-dom";

/**
 * "이어서 읽기" 카드 섹션 — 페이지 간 연속 읽기 유도
 * @param {string} title - 섹션 제목 (기본: "이어서 읽기")
 * @param {Array}  items - [{ badge, title, desc, path }]
 */
const ContinueReading = ({ title = "이어서 읽기", items = [] }) => {
  if (!items.length) return null;

  return (
    <section className="rounded-2xl border border-slate-100 bg-slate-50 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="rounded-xl bg-white border border-slate-100 p-4 hover:border-emerald-300 hover:shadow-sm transition group flex flex-col"
          >
            {item.badge && (
              <span className="text-xs font-semibold text-emerald-600 mb-1">{item.badge}</span>
            )}
            <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-700 leading-snug">
              {item.title}
            </p>
            {item.desc && (
              <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">
                {item.desc}
              </p>
            )}
            <span className="mt-2 text-xs text-emerald-600 font-medium">읽기 →</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ContinueReading;
