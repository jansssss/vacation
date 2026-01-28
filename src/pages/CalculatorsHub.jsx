import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { calculatorsRegistry } from "../config/calculatorsRegistry";
import { fetchGuides } from "../lib/api/guides";

const CalculatorsHub = () => {
  const [guideHighlights, setGuideHighlights] = useState([]);
  const [totalGuidesCount, setTotalGuidesCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const loadGuides = async () => {
      try {
        const guides = await fetchGuides();
        setTotalGuidesCount(guides.length);
        setGuideHighlights(guides.slice(0, 4));

        if (guides.length > 0) {
          const mostRecent = guides.reduce((latest, guide) => {
            return new Date(guide.updated_at) > new Date(latest.updated_at) ? guide : latest;
          });
          setLastUpdated(new Date(mostRecent.updated_at).toLocaleDateString('ko-KR'));
        }
      } catch (err) {
        console.error("Failed to load guides:", err);
      }
    };
    loadGuides();
  }, []);

  return (
    <div className="space-y-12">
      <Seo
        title="계산기 허브"
        description="연차, 퇴직금 등 핵심 노무 계산기를 한 곳에서 확인하고 실무 해설까지 제공합니다."
        path="/calculators"
      />

      <section className="rounded-3xl border border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-blue-50 p-10 shadow-sm">
        <div className="max-w-3xl space-y-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">노무/근로 계산기 허브</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">계산기 허브</h1>
          <p className="text-slate-600 leading-relaxed">
            핵심 계산기마다 해설, 예외, 사례, FAQ, 공지문 템플릿을 제공해 실무 대응 시간을 줄입니다.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/guides"
              className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              가이드 함께 보기
            </Link>
            <Link
              to="/board"
              className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              게시판 공지 확인
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "핵심 계산기", value: `${calculatorsRegistry.length}개 운영` },
          { label: "실무 가이드", value: `${totalGuidesCount}개 정리` },
          { label: "업데이트", value: lastUpdated || "-" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">계산기 목록</h2>
          <span className="text-xs text-slate-400">필수 항목만 최소 입력</span>
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
              <h3 className="mt-3 text-xl font-semibold text-slate-900">{calculator.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{calculator.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-slate-50 px-2 py-1">FAQ 포함</span>
                <span className="rounded-full bg-slate-50 px-2 py-1">실무 예외</span>
                <span className="rounded-full bg-slate-50 px-2 py-1">공지문 템플릿</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">운영 기준</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>• 공공기관 인사총무 실무 관점 콘텐츠</li>
            <li>• 익명화/합성 사례만 활용</li>
            <li>• 내부 정보·개인정보 비노출</li>
            <li>• 기준일/업데이트 일자 표기</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">사용 흐름</h3>
          <ol className="mt-3 space-y-2 text-sm text-slate-600 list-decimal list-inside">
            <li>계산기에서 결과 확인</li>
            <li>예외/FAQ로 내부 기준 점검</li>
            <li>가이드에서 상세 케이스 확인</li>
          </ol>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">실무 가이드 하이라이트</h2>
          <Link to="/guides" className="text-sm text-emerald-700 hover:text-emerald-900">
            전체 보기 →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {guideHighlights.map((guide) => (
            <Link
              key={guide.slug}
              to={`/guides/${guide.slug}`}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs text-slate-400">
                업데이트 {new Date(guide.updated_at).toLocaleDateString('ko-KR')}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{guide.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{guide.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">게시판 공지 확인</h3>
          <p className="mt-2 text-sm text-slate-600">
            기준 변경이나 중요한 공지는 게시판에 먼저 공지됩니다.
          </p>
        </div>
        <Link
          to="/board"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          게시판으로 이동
        </Link>
      </section>
    </div>
  );
};

export default CalculatorsHub;