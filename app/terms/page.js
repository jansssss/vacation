export const metadata = {
  title: '이용약관',
  description: 'e-work.kr 이용약관입니다.',
}

export default function TermsPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-6">
        <h1 className="text-3xl font-semibold text-slate-900">이용약관</h1>
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">제1조 목적</h2>
            <p>이 약관은 e-work.kr(이하 "사이트")이 제공하는 노무/근로 계산기 및 가이드 서비스의 이용에 관한 사항을 규정합니다.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">제2조 서비스 내용</h2>
            <p>사이트는 연차, 퇴직금, 실수령액, 육아지원금 등 노무/근로 관련 계산기와 실무 가이드를 무료로 제공합니다.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">제3조 면책</h2>
            <p>
              사이트가 제공하는 계산 결과와 정보는 참고용입니다. 계산 결과의 정확성을 보장하지 않으며,
              이를 근거로 한 의사결정이나 법적 행위에 대한 책임은 이용자에게 있습니다.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">제4조 서비스 변경</h2>
            <p>사이트는 서비스 내용을 사전 고지 없이 변경하거나 중단할 수 있습니다.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
