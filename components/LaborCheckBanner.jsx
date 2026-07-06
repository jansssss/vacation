import Link from 'next/link'

export default function LaborCheckBanner() {
  return (
    <section className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-800 to-blue-900 p-6 md:p-8 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">기업 노무진단</span>
          </div>
          <h2 className="text-base md:text-lg font-bold text-white">우리 회사 취업규칙, 놓친 리스크는 없을까요?</h2>
          <p className="text-slate-400 text-sm mt-1">취업규칙 PDF만 업로드하면 무료로 1차 진단 리포트를 보내드립니다.</p>
        </div>
        <Link
          href="/labor-check"
          className="shrink-0 rounded-full bg-blue-500 px-6 py-2.5 text-sm font-semibold text-white text-center transition hover:bg-blue-400"
        >
          무료 노무진단 받기 →
        </Link>
      </div>
    </section>
  )
}
