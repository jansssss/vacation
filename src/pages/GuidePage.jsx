import React from "react";
import { useParams, Link } from "react-router-dom";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { getGuideBySlug } from "../config/guidesRegistry";

const GuidePage = () => {
  const { slug } = useParams();
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">가이드를 찾을 수 없습니다.</h1>
        <p className="mt-2 text-slate-600">요청한 가이드가 없거나 이동되었습니다.</p>
        <Link to="/guides" className="mt-4 inline-block text-emerald-700">
          가이드 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const breadcrumbs = [
    { label: "홈", path: "/" },
    { label: "가이드", path: "/guides" },
    { label: guide.title, path: `/guides/${guide.slug}` },
  ];

  return (
    <div className="space-y-8">
      <Seo title={guide.title} description={guide.summary} path={`/guides/${guide.slug}`} />
      <Breadcrumbs items={breadcrumbs} />

      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">실무 가이드</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">{guide.title}</h1>
        <p className="mt-3 text-slate-600">{guide.summary}</p>
        <p className="mt-4 text-xs text-slate-400">업데이트 {guide.updatedAt}</p>
      </section>

      <div className="space-y-6">
        {guide.sections.map((section) => (
          <section key={section.heading} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{section.heading}</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {section.bullets.map((bullet, index) => (
                <li key={index}>• {bullet}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
};

export default GuidePage;
