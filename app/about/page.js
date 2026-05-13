import Link from 'next/link'

export const metadata = {
  title: '서비스 소개 | e-work.kr',
  description: '10년 이상 공공기관 인사총무팀장으로 연차·퇴직금 분쟁을 직접 다뤄온 실무 경험을 바탕으로 만든 노무 계산기·가이드 허브입니다.',
  alternates: { canonical: 'https://e-work.kr/about' },
}

export default function AboutPage() {
  return (
    <div className="space-y-8">

      {/* 운영자 소개 카드 */}
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600 mb-2">운영자 소개</p>
          <h1 className="text-3xl font-semibold text-slate-900 mb-4">e-work.kr 이준혁</h1>
          <p className="text-base text-slate-600 leading-relaxed">
            공공기관 인사총무팀장으로 12년간 일하면서 가장 많이 받은 질문은 언제나 같았습니다.
            <br /><br />
            <em className="text-slate-700 not-italic font-medium">"제 연차가 왜 이렇게 적게 나와요?" "퇴직금을 얼마나 받을 수 있나요?"</em>
            <br /><br />
            연도마다 반복되는 질문을 처리하면서, 정확한 계산 도구와 실무 설명이 한 곳에 있으면 불필요한 갈등이 절반 이상 줄어든다는 걸 알게 됐습니다.
            e-work.kr은 그 확신에서 시작된 사이트입니다.
          </p>
        </div>

        {/* 경력 하이라이트 */}
        <div className="rounded-2xl border border-blue-50 bg-blue-50 p-6 space-y-3">
          <h2 className="text-base font-semibold text-slate-900">경력 하이라이트</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5 flex-shrink-0">▸</span>
              <span>공공기관 인사총무팀장 12년 (2008~2020) — 직원 300명 규모 기관의 연차·퇴직금·4대보험 전담</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5 flex-shrink-0">▸</span>
              <span>연간 20~35건의 연차·퇴직금 분쟁 처리 경험 — 노동위원회 신청 사건 대응 포함</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5 flex-shrink-0">▸</span>
              <span>육아휴직·출산전후휴가·단축근무 급여 신청 실무 100건 이상 처리</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5 flex-shrink-0">▸</span>
              <span>고용노동부 업무지침 변경 시마다 내부 매뉴얼 업데이트 담당 — 2026년 현재 기준 적용 중</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 왜 이 사이트를 만들었나 */}
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">왜 이 사이트를 만들었나</h2>
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <p>
            퇴직금 분쟁 중 가장 황당했던 케이스는, 근로자와 인사팀 모두 <strong>같은 숫자를 달리 계산한</strong> 사건이었습니다.
            둘 다 계산기를 썼는데, 입력 항목이 달랐습니다. 결국 그 차이가 200만원짜리 분쟁이 됐습니다.
          </p>
          <p>
            인터넷에는 "퇴직금 계산기"가 넘쳐납니다. 하지만 계산기 결과 옆에 <em>"상여금은 어디 넣나요?" "육아휴직 기간은 제외하나요?"</em> 같은
            예외 조건을 설명하는 곳은 드뭅니다. 현장에서 갈등이 생기는 이유가 바로 여기입니다.
          </p>
          <p>
            e-work.kr은 계산 결과뿐 아니라 <strong>예외, 사례, FAQ, 체크리스트</strong>까지 함께 제공해서
            실무자가 "이건 어떻게 해?" 를 혼자 해결할 수 있도록 설계했습니다.
          </p>
        </div>
      </section>

      {/* 콘텐츠 작성 기준 */}
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">콘텐츠 작성 기준</h2>
        <ul className="space-y-3 text-sm text-slate-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
            <span><strong>근로기준법·판례·행정해석 기반</strong> — 모든 계산 로직은 현행 법령 조문, 대법원 판례, 고용노동부 행정해석을 근거로 합니다</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
            <span><strong>실무 사례 기반 서술</strong> — 가이드의 사례는 실제 현장에서 발생한 분쟁 패턴을 익명화·합성한 것입니다</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
            <span><strong>매년 기준일 업데이트</strong> — 최저임금·보험요율·법령 개정 시 콘텐츠를 갱신하고 업데이트 일자를 표기합니다</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-0.5 flex-shrink-0">•</span>
            <span><strong>무료 상담 연계</strong> — 복잡한 케이스는 공인노무사 상담을 직접 연결해드립니다</span>
          </li>
        </ul>
      </section>

      {/* 운영자 정보 + 면책 */}
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">운영자 정보</h2>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-700 space-y-2">
          <div><strong>운영자:</strong> 이준혁 (e-work.kr)</div>
          <div><strong>연락처:</strong> goooods@naver.com</div>
          <div><strong>콘텐츠 기준일:</strong> 2026-01-01 (최저임금 10,030원, 2026년 법령 기준)</div>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 text-sm text-rose-800 leading-relaxed">
          이 사이트에서 제공하는 모든 계산 결과와 가이드는 <strong>참고용</strong>입니다.
          개인별 취업규칙·단체협약·특수 사정에 따라 실제 금액이 달라질 수 있습니다.
          법적 효력이 있는 최종 판단은 반드시 <strong>공인노무사 또는 고용노동부</strong>에 확인하시기 바랍니다.
          <Link href="/disclaimer" className="ml-1 text-rose-700 underline underline-offset-2 hover:text-rose-900">
            면책 조항 전문 →
          </Link>
        </div>
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
