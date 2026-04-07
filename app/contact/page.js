export const metadata = {
  title: '문의',
  description: 'e-work.kr 문의 안내입니다.',
}

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-6">
        <h1 className="text-3xl font-semibold text-slate-900">문의하기</h1>
        <p className="text-slate-600 leading-relaxed">
          계산 오류, 콘텐츠 개선 제안, 법 개정 반영 요청 등은 아래로 문의하실 수 있습니다.
          개인적인 법적 자문이나 구체적인 사건 상담은 제공하지 않습니다.
        </p>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-3 text-sm text-slate-700">
          <div><strong>이메일:</strong> goooods@naver.com</div>
          <div><strong>응답 시간:</strong> 영업일 기준 3일 이내</div>
        </div>
      </section>
    </div>
  )
}
