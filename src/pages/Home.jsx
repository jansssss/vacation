import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { calculatorsRegistry } from "../config/calculatorsRegistry";
import { SITE_CONFIG } from "../config/siteConfig";

const featuredCalculators = [
  {
    title: "육아휴직·육아기 단축근무 지원금 계산기",
    description:
      "사업주 지원금, 근로자 예상 수령액, 회사 월 순부담까지 한 번에 확인하는 2026 대표 계산기입니다.",
    path: "/calculators/childcare-support",
    badge: "핵심 특집",
    tone: "from-blue-50 to-indigo-50 border-blue-100",
  },
  {
    title: "2026 실수령액 계산기",
    description: "바뀐 공제 항목과 급여 기준을 점검하고 실수령액을 바로 계산합니다.",
    path: "/calculators/net-salary",
    badge: "급여 점검",
    tone: "from-blue-50 to-white border-blue-100",
  },
  {
    title: "퇴직연금·퇴직금 계산기",
    description: "근속연수와 평균임금으로 퇴직금을 계산하고 DB/DC형 연금 시나리오를 비교합니다.",
    path: "/calculators/retirement-pension",
    badge: "퇴직/연금",
    tone: "from-slate-50 to-white border-slate-200",
  },
];

const popularGuides = [
  {
    slug: "annual-leave-basics",
    title: "연차 발생 기준 총정리",
    desc: "1년 미만 월차부터 2년차 연차까지 한 번에 정리합니다.",
    badge: "연차",
  },
  {
    slug: "childcare-leave-support-2026",
    title: "2026 육아휴직 지원금 정리",
    desc: "사업주 지원금·근로자 급여·사후지급 구조를 한 번에 정리합니다.",
    badge: "육아지원",
  },
  {
    slug: "severance-pay-eligibility",
    title: "퇴직금 지급 요건 총정리",
    desc: "1년 미만·단시간 근로·휴직 구간까지 함께 정리합니다.",
    badge: "퇴직금",
  },
];

const Home = () => {
  return (
    <div className="space-y-14">
      <Seo
        title="2026 노무 대응 특집"
        description="육아지원금, 실수령액, 최저임금까지 2026년 바뀐 노무 이슈를 계산기와 가이드로 먼저 점검하세요."
        path="/"
      />

      {/* ── Hero ── */}
      <section className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-100 via-white to-indigo-50 p-8 shadow-sm md:p-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr),minmax(0,0.8fr)] lg:items-center">
          <div className="space-y-7">
            <p className="inline-flex rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 shadow-sm">
              2026 노무 대응 특집
            </p>

            <div className="space-y-5">
              <h1 className="text-3xl font-bold leading-snug tracking-tight text-slate-900 md:text-[2.5rem]">
                바뀐 급여, 최저임금,
                <span className="mt-1 block text-blue-700">
                  육아지원까지 계산기로 먼저 점검하세요.
                </span>
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-slate-600">
                {SITE_CONFIG.siteName}은 복잡한 규정을 겁주는 방식 대신, 바로 써먹을 수 있는
                계산기와 가이드를 제공합니다.
              </p>
              <p className="max-w-xl text-base leading-relaxed text-slate-600">
                이번 특집의 중심은{" "}
                <strong className="text-slate-800">육아휴직·육아기 단축근무 지원금 계산기</strong>
                입니다.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/calculators/childcare-support"
                className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                육아지원금 계산기 바로가기
              </Link>
              <Link
                to="/calculators"
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                계산기 전체 보기
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              이번 특집에서 먼저 볼 것
            </p>
            <div className="mt-4 space-y-3">
              {[
                "육아휴직/단축근무 시 회사가 실제로 얼마나 절감되는지",
                "지원금 즉시지급분과 사후지급분이 어떻게 다른지",
                "실수령액과 최저임금 점검을 어떻게 함께 연결할지",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-snug text-slate-700"
                >
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 특집 핵심 계산기 ── */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">특집 핵심 계산기</h2>
          <Link to="/calculators" className="text-sm font-medium text-blue-700 hover:text-blue-900">
            전체 보기 →
          </Link>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {featuredCalculators.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={`rounded-2xl border bg-gradient-to-br p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${item.tone}`}
            >
              <p className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                {item.badge}
              </p>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              <p className="mt-5 text-xs font-semibold text-blue-700">바로 보기 →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 주제별 요약 칩 ── */}
      <section className="grid gap-3 md:grid-cols-4">
        {[
          { label: "최저임금", text: "2026 월 환산 기준과 수당 포함 여부를 함께 점검합니다." },
          { label: "급여/공제", text: "실수령액 계산기로 세전 급여와 공제 구조를 빠르게 확인합니다." },
          { label: "육아지원", text: "지원금 총액보다 회사 순부담 변화까지 보는 데 초점을 맞춥니다." },
          { label: "퇴직/연금", text: "휴직, 단축근무, 계속근로기간 이슈를 연결해서 봅니다." },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-blue-600">{item.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.text}</p>
          </div>
        ))}
      </section>

      {/* ── 전체 계산기 ── */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">전체 계산기</h2>
          <span className="text-xs text-slate-400">간단 입력으로 바로 계산</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {calculatorsRegistry.map((calculator) => (
            <Link
              key={calculator.slug}
              to={calculator.path}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                  {calculator.category}
                </span>
                <span>업데이트 {calculator.updatedAt}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-900">{calculator.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{calculator.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 인기 실무 가이드 ── */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">인기 실무 가이드</h2>
          <Link to="/guides" className="text-sm font-medium text-blue-700 hover:text-blue-900">
            가이드 전체 보기 →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {popularGuides.map((g) => (
            <Link
              key={g.slug}
              to={`/guides/${g.slug}`}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {g.badge}
              </span>
              <h3 className="mt-3 text-base font-bold text-slate-900">{g.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{g.desc}</p>
              <p className="mt-4 text-xs font-semibold text-blue-700">읽기 →</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
