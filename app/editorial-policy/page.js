export const metadata = {
  title: '콘텐츠 정책',
  description: 'e-work.kr의 콘텐츠 작성 기준, 정보 출처, 업데이트 방침을 안내합니다.',
}

export default function EditorialPolicyPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 mb-4">콘텐츠 정책</h1>
          <p className="text-slate-600 leading-relaxed">
            e-work.kr은 근로자와 인사 실무자가 신뢰할 수 있는 노무 정보를 제공하기 위해
            다음의 콘텐츠 작성 기준과 운영 정책을 준수합니다.
          </p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">정보 출처 및 근거</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>근로기준법 및 관련 법령</strong> — 모든 계산 로직과 가이드 내용은 현행 근로기준법, 고용보험법, 국민연금법 등을 근거로 합니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>고용노동부 공식 행정해석</strong> — 법령 해석이 필요한 경우 고용노동부 유권해석 및 행정해석을 참고합니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>대법원 판례</strong> — 연차, 퇴직금 등 주요 쟁점은 대법원 판례를 근거로 해석합니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>실무 경험</strong> — 공공기관 인사총무팀장 10년 이상 경험을 바탕으로 현장 관점을 반영합니다.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">작성 기준</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>정확성 우선</strong> — 콘텐츠 작성 시 법적 근거를 먼저 확인하고, 해석이 불분명한 경우 복수 의견을 병기합니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>기준일 명시</strong> — 모든 계산기와 가이드에는 적용 기준일(현행: 2026-01-01)을 명시합니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>익명화 사례</strong> — 실무 사례는 특정 개인이나 기관을 식별할 수 없도록 익명화·합성하여 사용합니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span><strong>광고와 콘텐츠 분리</strong> — 광고 게재 여부가 콘텐츠 내용이나 계산 결과에 영향을 주지 않습니다.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">업데이트 방침</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            근로기준법 개정, 대법원 판례 변경, 고용노동부 유권해석 발표 등 법적 기준이 변경되면
            최대한 신속하게 콘텐츠를 업데이트합니다.
          </p>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>법령 개정 시 — 시행일 기준으로 즉시 반영</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>판례·행정해석 변경 시 — 확인 후 2주 이내 반영</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>계산 오류 신고 시 — 영업일 기준 3일 이내 검토 및 수정</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-rose-900">면책 사항</h2>
          <p className="text-sm text-rose-800 leading-relaxed">
            본 사이트의 모든 계산 결과와 정보는 <strong>일반적인 참고 목적</strong>으로 제공됩니다.
            개인별 상황(취업규칙, 단체협약, 특수 고용 형태 등)에 따라 실제 결과가 달라질 수 있습니다.
            법적 분쟁이나 중요한 의사결정 전에는 반드시 노무사 등 전문가의 상담을 받으시기 바랍니다.
            계산 결과 활용으로 인한 손해에 대해 사이트 운영자는 책임을 지지 않습니다.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">오류 신고 및 문의</h2>
          <p className="text-sm text-slate-700">
            계산 오류, 법령 업데이트 누락, 콘텐츠 개선 제안은 아래로 문의하세요.
          </p>
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
            <div><strong>이메일:</strong> goooods@naver.com</div>
          </div>
        </div>
      </section>
    </div>
  )
}
