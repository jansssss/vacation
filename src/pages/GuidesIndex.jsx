import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { fetchGuides } from "../lib/api/guides";

const childcareGuideSlugs = [
  "childcare-leave-support-2026",
  "reduced-hours-support-2026",
  "childcare-support-faq-2026",
  "workload-sharing-support-2026",
];

const GuidesIndex = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGuides = async () => {
      try {
        const data = await fetchGuides();
        setGuides(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadGuides();
  }, []);

  const childcareGuides = useMemo(
    () => guides.filter((guide) => childcareGuideSlugs.includes(guide.slug)),
    [guides]
  );

  const otherGuides = useMemo(
    () => guides.filter((guide) => !childcareGuideSlugs.includes(guide.slug)),
    [guides]
  );

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="text-slate-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Seo
        title="노무 가이드"
        description="계산기로 끝나지 않는 실무형 가이드 모음입니다. 2026 육아지원 특집 가이드도 함께 확인하세요."
        path="/guides"
      />

      <section className="rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-emerald-50 p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">실무 가이드</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">노무 가이드</h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">
          계산기에서 끝나지 않는 예외 조건과 실무 포인트를 정리한 가이드 모음입니다. 이번에는
          <strong> 육아휴직·육아기 단축근무 지원금</strong> 관련 유입과 전환을 강화하기 위해 전용 가이드를 별도로 묶었습니다.
        </p>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">2026 육아지원 특집 가이드</h2>
          <Link
            to="/calculators/childcare-support"
            className="text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            계산기로 바로 가기
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {childcareGuides.map((guide) => (
            <Link
              key={guide.slug}
              to={`/guides/${guide.slug}`}
              className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs text-emerald-700">2026 육아지원 특집</p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">{guide.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{guide.summary}</p>
              <p className="mt-4 text-sm font-semibold text-blue-700">가이드 보기</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold text-slate-900">기존 가이드</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {otherGuides.map((guide) => (
            <Link
              key={guide.slug}
              to={`/guides/${guide.slug}`}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs text-slate-500">
                업데이트 {new Date(guide.updated_at).toLocaleDateString("ko-KR")}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900">{guide.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{guide.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GuidesIndex;
