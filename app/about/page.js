import Link from 'next/link'

export const metadata = {
  title: '서비스 소개 | e-work.kr',
  description: 'e-work.kr은 연차·퇴직금 등 노무 계산기와 실무 가이드를 무료로 제공하는 정보 사이트입니다. 근로기준법과 고용노동부 기준을 바탕으로 정확한 정보를 제공합니다.',
  alternates: { canonical: 'https://e-work.kr/about' },
}

export default function AboutPage() {
  return (
    <div className="space-y-8">

      {/* 사이트 소개 */}
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">서비스 소개</p>
        <h1 className="text-3xl font-semibold text-slate-900">e-work.kr 소개</h1>
        <p className="text-base text-slate-600 leading-relaxed">
          e-work.kr은 연차·퇴직금·4대보험 등 노무/근로 관련 계산기와 실무 가이드를 무료로 제공하는 정보 사이트입니다.
          근로자와 인사 담당자 모두가 자주 마주치는 질문들을 계산기로 빠르게 해결하고,
          예외 조건과 실무 포인트까지 한 곳에서 확인할 수 있도록 설계했습니다.
        </p>
      </section>

      {/* 운영 목적 */}
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">운영 목적</h2>
        <ul className="space-y-3 text-sm text-slate-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
            <span><strong>계산 결과와 근거를 함께 제공</strong> — 숫자만 보여주는 계산기가 아니라, 그 숫자가 왜 나오는지 법 조문과 함께 설명합니다</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
            <span><strong>예외와 사례까지 포함</strong> — 단순 계산을 넘어, 실무에서 헷갈리는 예외 조건과 자주 발생하는 분쟁 패턴을 정리합니다</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
            <span><strong>분쟁 예방 지원</strong> — 퇴직금·연차 관련 오해에서 비롯되는 불필요한 갈등을 줄이는 데 기여합니다</span>
          </li>
        </ul>
      </section>

      {/* 콘텐츠 기준 */}
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">콘텐츠 작성 기준</h2>
        <ul className="space-y-3 text-sm text-slate-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
            <span><strong>근로기준법·판례·행정해석 기반</strong> — 모든 계산 로직은 현행 법령 조문, 대법원 판례, 고용노동부 행정해석을 근거로 합니다</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
            <span><strong>매년 기준일 업데이트</strong> — 최저임금·보험요율·법령 개정 시 콘텐츠를 갱신하고 업데이트 일자를 표기합니다</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
            <span><strong>오류 제보 환영</strong> — 잘못된 정보나 개선이 필요한 내용을 발견하시면 언제든지 연락 주세요. 확인 후 수정합니다</span>
          </li>
        </ul>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 space-y-1">
          <div><strong>운영자:</strong> e-work.kr</div>
          <div><strong>연락처:</strong> goooods@naver.com</div>
          <div><strong>콘텐츠 기준일:</strong> 2026-01-01 (최저임금 10,030원 기준)</div>
        </div>
      </section>

      {/* 면책 */}
      <section className="rounded-3xl border border-rose-100 bg-rose-50 p-8 shadow-sm space-y-3">
        <h2 className="text-xl font-semibold text-rose-900">면책 사항</h2>
        <p className="text-sm text-rose-800 leading-relaxed">
          이 사이트에서 제공하는 계산 결과와 가이드는 <strong>참고용</strong>입니다.
          개인별 취업규칙·단체협약·특수 사정에 따라 실제 금액이 달라질 수 있으며,
          법적 효력이 있는 최종 판단은 반드시 <strong>공인노무사 또는 고용노동부</strong>에 확인하시기 바랍니다.
        </p>
        <Link href="/disclaimer" className="text-sm text-rose-700 underline underline-offset-2 hover:text-rose-900">
          면책 조항 전문 보기 →
        </Link>
      </section>

      {/* 관련 링크 */}
      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/editorial-policy" className="text-blue-700 font-semibold hover:text-blue-900">콘텐츠 정책 →</Link>
        <Link href="/disclaimer" className="text-blue-700 font-semibold hover:text-blue-900">면책 조항 →</Link>
        <Link href="/contact" className="text-blue-700 font-semibold hover:text-blue-900">문의하기 →</Link>
        <Link href="/guides" className="text-blue-700 font-semibold hover:text-blue-900">실무 가이드 →</Link>
      </div>

    </div>
  )
}
