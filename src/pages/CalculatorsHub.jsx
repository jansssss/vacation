import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { calculatorsRegistry } from "../config/calculatorsRegistry";

const CalculatorsHub = () => {
  return (
    <div className="space-y-8">
      <Seo
        title="계산기 허브"
        description="연차, 퇴직금 등 핵심 노무 계산기를 한 곳에서 확인하고 실무 해설까지 제공합니다."
        path="/calculators"
      />

      <div>
        <h1 className="text-3xl font-semibold text-slate-900">계산기 허브</h1>
        <p className="mt-2 text-slate-600">
          핵심 계산기마다 해설, 예외, 사례, FAQ, 공지문 템플릿을 제공해 실무 대응 시간을 줄입니다.
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
              <span>업데이트 {calculator.updatedAt}</span>
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
