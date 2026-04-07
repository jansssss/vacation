export const metadata = {
  title: '개인정보처리방침',
  description: 'e-work.kr 개인정보처리방침입니다.',
}

export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm space-y-6">
        <h1 className="text-3xl font-semibold text-slate-900">개인정보처리방침</h1>
        <p className="text-slate-600 leading-relaxed">
          e-work.kr(이하 "사이트")은 개인정보 보호법에 따라 이용자의 개인정보를 보호하고
          이와 관련한 고충을 신속하게 처리하기 위하여 다음과 같이 개인정보처리방침을 수립합니다.
        </p>

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">1. 수집하는 개인정보</h2>
            <p>
              사이트는 별도의 회원가입 없이 이용 가능하며, 계산기 이용 시 입력하는 정보는
              서버에 저장되지 않습니다. 문의 시 이메일 주소를 수집할 수 있습니다.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">2. 쿠키 사용</h2>
            <p>
              구글 애드센스 광고 게재를 위해 쿠키가 사용될 수 있으며,
              브라우저 설정을 통해 쿠키를 거부할 수 있습니다.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">3. 개인정보의 보유 및 이용기간</h2>
            <p>문의를 통해 수집된 이메일 주소는 문의 처리 완료 후 즉시 삭제합니다.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">4. 문의</h2>
            <p>개인정보 관련 문의: goooods@naver.com</p>
          </div>
        </div>
      </section>
    </div>
  )
}
