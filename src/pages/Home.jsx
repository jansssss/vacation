import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { calculatorsRegistry } from "../config/calculatorsRegistry";
import { SITE_CONFIG } from "../config/siteConfig";

const featuredCalculators = [
  {
    title: "육아휴직·육아기 단축근무 지원금 계산기",
    description:
      "사업주 지원금, 근로자 예상 수령액, 회사 월 순부담까지 한 번에 확인하는 2026 특집 대표 계산기입니다.",
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
    title: "2026 최저임금 점검",
    description: "최저임금 위반 가능성을 빠르게 확인할 신규 계산기 주제입니다.",
    path: "/calculators",
    badge: "다음 확장",
    tone: "from-amber-50 to-white border-amber-100",
  },
];

const Home = () => {
  return (
    <div className="space-y-12">
      <Seo
        title="2026 노무 대응 특집"
        description="육아지원금, 실수령액, 최저임금까지 2026년 바뀐 노무 이슈를 계산기와 가이드로 먼저 점검하세요."
        path="/"
      />

      <section className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-100 via-white to-indigo-50 p-8 shadow-sm md:p-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr),minmax(0,0.8fr)] lg:items-center">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 shadow-sm">
              2026 노무 대응 특집
            </p>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
                바뀐 급여, 최저임금,
                <span className="block text-blue-700">육아지원까지 계산기로 먼저 점검하세요.</span>
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
                {SITE_CONFIG.siteName}은 복잡한 규정을 겁주는 방식 대신, 실제로 바로 써먹을 수 있는 계산기와
                가이드를 제공합니다. 이번 특집의 중심은 <strong>육아휴직·육아기 단축근무 지원금 계산기</strong>입니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/calculators/childcare-support"
                className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                육아지원금 계산기 바로가기
              </Link>
              <Link
                to="/calculators"
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                계산기 전체 보기
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">이번 특집에서 먼저 볼 것</p>
            <div className="mt-5 space-y-4">
              {[
                "육아휴직/단축근무 시 회사가 실제로 얼마나 절감되는지",
                "지원금 즉시지급분과 사후지급분이 어떻게 다른지",
                "실수령액과 최저임금 점검을 어떻게 함께 연결할지",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <span className="mt-0.5 h-2.5 w-2.5 rounded-full bg-blue-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">특집 핵심 계산기</h2>
          <Link to="/calculators" className="text-sm font-medium text-blue-700 hover:text-blue-900">
            계산기 허브 보기
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {featuredCalculators.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={`rounded-[1.75rem] border bg-gradient-to-br p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${item.tone}`}
            >
              <p className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                {item.badge}
              </p>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
              <p className="mt-5 text-sm font-semibold text-blue-700">바로 보기</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "최저임금", text: "2026 월 환산 기준과 수당 포함 여부를 함께 점검합니다." },
          { label: "급여/공제", text: "실수령액 계산기로 세전 급여와 공제 구조를 빠르게 확인합니다." },
          { label: "육아지원", text: "지원금 총액보다 회사 순부담 변화까지 보는 데 초점을 맞춥니다." },
          { label: "퇴직/연금", text: "휴직, 단축근무, 계속근로기간 이슈를 연결해서 봅니다." },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{item.label}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">전체 계산기</h2>
          <span className="text-xs text-slate-400">간단 입력으로 바로 계산</span>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {calculatorsRegistry.map((calculator) => (
            <Link
              key={calculator.slug}
              to={calculator.path}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">
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

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">이번 특집의 기준</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            숫자를 크게 보여주는 것보다, 어떤 요건에서 달라지는지를 함께 설명하는 계산기에 집중합니다.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">대표 수익화 동선</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            검색 유입은 계산기로 받고, 설명형 가이드와 상담 CTA로 이어지는 흐름을 기본으로 잡습니다.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">신뢰 신호</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            기준일, 예외 조건, 참고 목적이라는 사실을 분명하게 표시해 오해 가능성을 줄입니다.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
