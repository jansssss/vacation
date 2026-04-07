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
          setLastUpdated(new Date(mostRecent.updated_at).toLocaleDateString("ko-KR"));
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
        description="육아지원금, 실수령액, 연차, 퇴직금까지 노무 계산기와 가이드를 한 곳에서 확인합니다."
        path="/calculators"
      />

      <section className="rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-emerald-50 p-10 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr),minmax(0,0.8fr)] lg:items-center">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              2026 노무 대응 특집
            </p>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">계산기 허브</h1>
              <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
                기존 계산기 구조는 유지하면서, 2026년 바뀐 급여·최저임금·육아지원 이슈를 더 빠르게 점검할 수 있도록
                특집 흐름을 강화했습니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/calculators/childcare-support"
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                육아지원금 계산기
              </Link>
              <Link
                to="/guides"
                className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                가이드 함께 보기
              </Link>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/80 bg-white/90 p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">왜 이 계산기를 먼저 보나</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <p>육아지원금 계산은 단순 지원금 합계보다 회사 순부담과 지급 시점이 더 중요합니다.</p>
              <p>그래서 이번 허브의 대표 계산기는 육아휴직·육아기 단축근무 지원금 계산기로 배치합니다.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "운영 계산기", value: `${calculatorsRegistry.length}개` },
          { label: "가이드", value: `${totalGuidesCount}개` },
          { label: "최근 업데이트", value: lastUpdated || "-" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[1.75rem] border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">특집 대표 계산기</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">육아휴직·육아기 단축근무 지원금 계산기</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              사업주 지원금, 근로자 예상 수령액, 회사 월 순부담을 한 번에 보여주는 계산기입니다.
            </p>
          </div>
          <Link
            to="/calculators/childcare-support"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            대표 계산기 열기
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">계산기 목록</h2>
          <span className="text-xs text-slate-400">간단 입력으로 바로 계산</span>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {calculatorsRegistry.map((calculator) => (
            <Link
              key={calculator.slug}
              to={calculator.path}
              className={`rounded-2xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                calculator.slug === "childcare-support"
                  ? "border-emerald-100 bg-gradient-to-br from-emerald-50 to-white"
                  : "border-slate-100 bg-white"
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span
                  className={`rounded-full px-3 py-1 ${
                    calculator.slug === "childcare-support"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {calculator.category}
                </span>
                <span>업데이트 {calculator.updatedAt}</span>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">{calculator.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{calculator.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">사용 흐름</h3>
          <ol className="mt-3 list-inside list-decimal space-y-2 text-sm text-slate-600">
            <li>계산기로 먼저 숫자와 조건을 확인합니다.</li>
            <li>예외, FAQ, 가이드로 실제 적용 조건을 좁힙니다.</li>
            <li>게시판 공지에서 최신 변경사항을 다시 점검합니다.</li>
          </ol>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">이번 허브의 기준</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>업데이트 날짜를 노출합니다.</li>
            <li>예상치와 확정액을 구분해 설명합니다.</li>
            <li>특수 사례는 가이드와 함께 보도록 설계합니다.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">최근 가이드</h2>
          <Link to="/guides" className="text-sm text-blue-700 hover:text-blue-900">
            전체 보기
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
                업데이트 {new Date(guide.updated_at).toLocaleDateString("ko-KR")}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{guide.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{guide.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CalculatorsHub;
