export const metadata = {
  title: '면책조항',
  description: 'e-work.kr 면책조항입니다.',
}

export default function DisclaimerPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-rose-100 bg-rose-50 p-8 shadow-sm space-y-6">
        <h1 className="text-3xl font-semibold text-rose-900">면책조항</h1>
        <div className="space-y-4 text-sm text-rose-800 leading-relaxed">
          <p>
            e-work.kr이 제공하는 모든 계산 결과와 가이드 내용은 <strong>일반적인 정보 제공 목적</strong>으로만
            제공되며, 법적 자문이나 전문가 상담을 대체하지 않습니다.
          </p>
          <div>
            <h2 className="text-lg font-semibold text-rose-900 mb-2">계산 결과의 한계</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>취업규칙·단체협약이 법령보다 유리한 경우 해당 규정이 우선 적용됩니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>특수 고용 형태(단시간 근로, 파견, 도급 등)는 별도 검토가 필요합니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>법령 개정 시 계산 결과가 달라질 수 있습니다.</span>
              </li>
            </ul>
          </div>
          <p>
            중요한 의사결정이나 법적 분쟁 전에는 반드시 고용노동부 민원마당 또는 공인노무사를 통해
            정확한 안내를 받으시기 바랍니다.
          </p>
          <p className="text-xs text-rose-600">
            최종 판단과 책임은 이용자에게 있으며, 계산 결과 활용으로 인한 손해에 대해 사이트는 책임지지 않습니다.
          </p>
        </div>
      </section>
    </div>
  )
}
