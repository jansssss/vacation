import LaborCheckForm from './LaborCheckForm'

export const metadata = {
  title: '기업 노무진단 | e-work.kr',
  description:
    '취업규칙 PDF를 업로드하면 근로기준법 등 필수 기재사항을 기준으로 1차 노무 리스크를 점검해드립니다.',
}

export default function LaborCheckPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-2">기업 노무진단</p>
        <h1 className="text-3xl font-semibold text-slate-900">우리 회사 취업규칙, 지금 점검해보세요</h1>
        <p className="text-slate-600 mt-3 leading-relaxed">
          취업규칙 PDF 파일을 업로드하시면, 근로기준법상 필수 기재사항과 최근 개정 이슈를 기준으로
          1차 노무 리스크를 점검한 리포트를 이메일로 보내드립니다.
        </p>
        <div className="flex flex-wrap gap-2 mt-4 text-xs text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1">무료 1차 진단</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">영업일 기준 2~3일 소요</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">PDF 파일만 지원</span>
        </div>
      </section>

      <LaborCheckForm />

      <p className="text-xs text-slate-400 leading-relaxed px-2">
        본 진단은 AI를 활용한 1차 점검 결과이며 법률 자문이 아닙니다. 실제 조치 전 노무사 등 전문가 확인을
        권장합니다. 업로드된 파일은 진단 및 리포트 발송 목적으로만 사용되며, 발송 완료 후 30일이 지나면
        자동으로 삭제됩니다.
      </p>
    </div>
  )
}
