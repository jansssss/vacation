import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { guidesRegistry } from "../config/guidesRegistry";

const GuidesIndex = () => {
  return (
    <div className="space-y-8">
      <Seo
        title="실무 가이드"
        description="연차, 퇴직금 등 실무에서 자주 묻는 주제를 인사총무 관점으로 정리한 가이드 모음입니다."
        path="/guides"
      />

      <div>
        <h1 className="text-3xl font-semibold text-slate-900">실무 가이드</h1>
        <p className="mt-2 text-slate-600">
          계산기에서 다 못 담은 케이스를 가이드로 확장했습니다. 인사팀 공지문 작성에 바로 활용할 수 있는
          기준과 표현을 제공합니다.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {guidesRegistry.map((guide) => (
          <Link
            key={guide.slug}
            to={`/guides/${guide.slug}`}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-xs text-slate-500">업데이트 {guide.updatedAt}</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">{guide.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{guide.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GuidesIndex;
