import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Seo from "../components/Seo";
import Breadcrumbs from "../components/Breadcrumbs";
import { fetchGuideBySlug } from "../lib/api/guides";

const hasHtml = (value) => /<\/?[a-z][\s\S]*>/i.test(value ?? "");

const escapeHtml = (value) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const textToHtml = (value) => {
  if (!value) return "";
  if (hasHtml(value)) return value;

  const paragraphs = value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`);

  return paragraphs.join("");
};

const ensureHtml = (value) => textToHtml(value ?? "");

const GuidePage = () => {
  const { slug } = useParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGuide = async () => {
      try {
        setLoading(true);
        const data = await fetchGuideBySlug(slug);
        setGuide(data);
      } catch (loadError) {
        setError(loadError.message);
        console.error(loadError);
      } finally {
        setLoading(false);
      }
    };

    loadGuide();
  }, [slug]);

  const formattedDate = useMemo(() => {
    if (!guide?.updated_at) return "";
    return new Date(guide.updated_at).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }, [guide?.updated_at]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center">
        <div className="text-slate-600">불러오는 중...</div>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">
          가이드를 찾을 수 없습니다.
        </h1>
        <p className="mt-2 text-slate-600">
          요청한 가이드가 없거나 이동되었을 수 있습니다.
        </p>
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
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
          실무 가이드
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">{guide.title}</h1>
        <p className="mt-3 text-slate-600">{guide.summary}</p>
        {formattedDate && <p className="mt-4 text-xs text-slate-400">업데이트 {formattedDate}</p>}
      </section>

      <div className="space-y-6">
        {guide.sections?.map((section, sectionIndex) => (
          <section
            key={`section-${sectionIndex}`}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            <div
              className="guide-richtext text-sm text-slate-700"
              dangerouslySetInnerHTML={{ __html: ensureHtml(section.html_content) }}
            />
          </section>
        ))}
      </div>
    </div>
  );
};

export default GuidePage;

