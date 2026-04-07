import Link from 'next/link'
import { guidesRegistry } from '../../src/config/guidesRegistry'

export const metadata = {
  title: '노무 가이드',
  description: '계산기로 끝나지 않는 예외 조건과 실무 포인트를 정리한 가이드 모음입니다. 연차, 퇴직금, 육아지원금 관련 실무 가이드를 확인하세요.',
}

const childcareGuideSlugs = [
  'childcare-leave-support-2026',
  'reduced-hours-support-2026',
  'childcare-support-faq-2026',
  'workload-sharing-support-2026',
]

export default function GuidesPage() {
  const childcareGuides = guidesRegistry.filter((g) => childcareGuideSlugs.includes(g.slug))
  const otherGuides = guidesRegistry.filter((g) => !childcareGuideSlugs.includes(g.slug))

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-emerald-50 p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">실무 가이드</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">노무 가이드</h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">
          계산기에서 끝나지 않는 예외 조건과 실무 포인트를 정리한 가이드 모음입니다. 연차, 퇴직금,{' '}
          <strong>육아휴직·육아기 단축근무 지원금</strong> 관련 실무 가이드를 확인하세요.
        </p>
      </section>

      {childcareGuides.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">2026 육아지원 특집 가이드</h2>
            <Link href="/calculators/childcare-support" className="text-sm font-semibold text-blue-700 hover:text-blue-900">
              계산기로 바로 가기
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {childcareGuides.map((guide) => (
              <Link
                key={guide.slug}
                href={`/guides/${guide.slug}`}
                className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <p className="text-xs text-emerald-700">2026 육아지원 특집</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">{guide.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{guide.summary}</p>
                <p className="mt-4 text-sm font-semibold text-blue-700">가이드 보기 →</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold text-slate-900">실무 가이드</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {otherGuides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <p className="text-xs text-slate-500">업데이트 {guide.updatedAt}</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{guide.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{guide.summary}</p>
              <p className="mt-4 text-sm font-semibold text-blue-700">읽기 →</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
