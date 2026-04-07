export const metadata = {
  title: '서비스 소개',
  description: 'e-work.kr의 운영 목적과 콘텐츠 기준을 안내합니다.',
}

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-4">e-work.kr 소개</h1>
          <p className="text-slate-600 leading-relaxed">
            e-work.kr은 노무/근로 관련 실무에서 자주 발생하는 질문을 빠르게 해결하기 위해 만든
            계산기와 가이드 허브입니다. 연차, 퇴직금처럼 빈도가 높은 주제를 중심으로
            계산 결과뿐 아니라 예외, 사례, FAQ, 체크리스트까지 함께 제공해
            실무 커뮤니케이션 비용을 줄이는 것을 목표로 합니다.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">운영 목적</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>근로자와 인사 담당자를 위한 실무 도구</strong> — 연차·퇴직금 등 핵심 노무 계산을 빠르게 수행</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>분쟁 예방과 법 준수 지원</strong> — 근로기준법과 판례 기반의 정확한 정보 제공</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>실무 커뮤니케이션 비용 절감</strong> — 예외 사항과 FAQ를 통해 반복 질문 최소화</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">운영자 정보</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            이 사이트는 <strong>공공기관 인사총무팀장 실무 경험을 바탕</strong>으로 운영됩니다.
            10년 이상의 인사 실무 경험을 통해 연차, 퇴직금, 근태 관리 등 현장에서 자주 발생하는 질문과 분쟁 사례를 직접 다뤄왔으며,
            이러한 경험을 토대로 실무자 관점의 콘텐츠를 작성하고 있습니다.
          </p>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600 space-y-2">
            <div><strong>운영자:</strong> 이워크</div>
            <div><strong>연락처:</strong> goooods@naver.com</div>
            <div><strong>기준일:</strong> 2026-01-01</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">콘텐츠 제작 기준</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>근로기준법과 대법원 판례 기반</strong> — 모든 계산 로직은 현행 법령과 판례를 근거로 함</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>익명화·합성 사례</strong> — 특정 기관이나 개인이 식별되지 않도록 가공된 사례만 사용</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>업데이트 일자 명시</strong> — 모든 콘텐츠에 작성일 및 최종 업데이트 일자 표기</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-rose-900">계산 결과의 한계 및 면책 사항</h2>
          <p className="text-sm text-rose-800 leading-relaxed">
            이 사이트에서 제공하는 모든 계산 결과와 정보는 <strong>참고용</strong>입니다.
            실제 적용 시에는 반드시 취업규칙, 고용노동부 행정해석, 노무사 상담을 통해 확인하시기 바랍니다.
          </p>
        </div>
      </section>
    </div>
  )
}
