import React from "react";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import { calculatorsRegistry } from "../config/calculatorsRegistry";
import { SITE_CONFIG } from "../config/siteConfig";

const Home = () => {
  return (
    <div className="space-y-12">
      <Seo
        title="노무/근로 계산기 허브"
        description="연차, 퇴직금 등 핵심 계산기를 한 곳에 모아 실무 해설과 사례까지 제공하는 e-work.kr입니다."
        path="/"
      />

      <section className="rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-amber-50 p-10 shadow-sm border border-slate-100">
        <div className="max-w-3xl space-y-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">노무/근로 유틸 플랫폼</p>
          <h1 className="text-4xl font-semibold text-slate-900">
            계산기 하나에 해설과 사례까지.
            <span className="block text-slate-600 mt-2">현장 중심의 인사총무 콘텐츠 허브</span>
          </h1>
          <p className="text-slate-600 leading-relaxed">
            {SITE_CONFIG.brandLine} e-work.kr은 연차·퇴직금처럼 자주 묻는 주제를 중심으로, 계산 결과와 함께
            실무 예외·FAQ·공지문 템플릿까지 제공하여 팀 내 커뮤니케이션 비용을 줄입니다.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/calculators"
              className="rounded-full bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              계산기 전체 보기
            </Link>
            <Link
              to="/guides"
              className="rounded-full border border-slate-200 px-6 py-2 text-sm font-medium text-slate-700 hover:bg-white"
            >
              실무 가이드 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">핵심 계산기</h2>
          <Link to="/calculators" className="text-sm text-emerald-700 hover:text-emerald-900">
            더 보기 →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {calculatorsRegistry.map((calculator) => (
            <Link
              key={calculator.slug}
              to={calculator.path}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs font-semibold uppercase text-emerald-600">{calculator.category}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{calculator.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{calculator.summary}</p>
              <p className="mt-4 text-xs text-slate-400">업데이트 {calculator.updatedAt}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 자주 찾는 조건 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">자주 찾는 조건</h2>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-emerald-600 mb-2">연차 — 입사월별</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "3월 입사", path: "/annual-leave/join-month/03" },
                { label: "6월 입사", path: "/annual-leave/join-month/06" },
                { label: "9월 입사", path: "/annual-leave/join-month/09" },
                { label: "1월 입사", path: "/annual-leave/join-month/01" },
              ].map((item) => (
                <Link key={item.path} to={item.path}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:border-emerald-400 hover:text-emerald-700 transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-emerald-600 mb-2">퇴직금 — 근속기간별</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "근속 3년", path: "/retirement/tenure/3y" },
                { label: "근속 5년", path: "/retirement/tenure/5y" },
                { label: "근속 10년", path: "/retirement/tenure/10y" },
                { label: "근속 1년", path: "/retirement/tenure/1y" },
              ].map((item) => (
                <Link key={item.path} to={item.path}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:border-emerald-400 hover:text-emerald-700 transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold text-emerald-600 mb-2">실수령액 — 월급별</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "월급 300만원", path: "/net-salary/300" },
                { label: "월급 350만원", path: "/net-salary/350" },
                { label: "월급 400만원", path: "/net-salary/400" },
                { label: "월급 250만원", path: "/net-salary/250" },
              ].map((item) => (
                <Link key={item.path} to={item.path}
                  className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-700 hover:border-emerald-400 hover:text-emerald-700 transition-colors">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">신뢰 기반 콘텐츠</h3>
          <p className="mt-2 text-sm text-slate-600">
            공공기관 인사총무팀장 관점의 체크리스트와 공지문 예시를 매 계산기에 고정 제공합니다.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">허브-스포크 구조</h3>
          <p className="mt-2 text-sm text-slate-600">
            계산기 → 실무 가이드 → 사례·FAQ로 연결해 검색 유입을 분산합니다.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">노사 갈등 예방 가이드</h3>
          <p className="mt-2 text-sm text-slate-600">
            연차·퇴직금 정산 시 흔한 분쟁 사례와 예방 체크리스트를 함께 제공해 법적 리스크를 줄입니다.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
