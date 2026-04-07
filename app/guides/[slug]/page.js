import Link from 'next/link'
import { notFound } from 'next/navigation'
import { guidesRegistry, getGuideBySlug } from '../../../src/config/guidesRegistry'

export async function generateStaticParams() {
  return guidesRegistry.map((guide) => ({ slug: guide.slug }))
}

export async function generateMetadata({ params }) {
  const guide = getGuideBySlug(params.slug)
  if (!guide) return {}
  return {
    title: guide.title,
    description: guide.summary,
    alternates: { canonical: `https://e-work.kr/guides/${guide.slug}` },
  }
}

function renderSection(section, index) {
  const parts = []

  if (section.heading) {
    parts.push(
      <h2 key={`h-${index}`} className="text-xl font-semibold text-slate-800 mb-3 mt-2">
        {section.heading}
      </h2>
    )
  }

  if (section.content) {
    section.content.split(/\n\n/).forEach((paragraph, pi) => {
      parts.push(
        <p key={`p1-${index}-${pi}`} className="mb-3 text-sm leading-relaxed text-slate-700">
          {paragraph.split('\n').map((line, li) => (
            <span key={li}>{line}{li < paragraph.split('\n').length - 1 && <br />}</span>
          ))}
        </p>
      )
    })
  }

  if (section.bullets?.length) {
    parts.push(
      <ul key={`ul-${index}`} className="list-disc list-inside space-y-1 mb-3 text-sm text-slate-700">
        {section.bullets.map((b, bi) => (
          <li key={bi}>{b}</li>
        ))}
      </ul>
    )
  }

  if (section.content2) {
    section.content2.split(/\n\n/).forEach((paragraph, pi) => {
      parts.push(
        <p key={`p2-${index}-${pi}`} className="mb-3 text-sm leading-relaxed text-slate-700">
          {paragraph.split('\n').map((line, li) => (
            <span key={li}>{line}{li < paragraph.split('\n').length - 1 && <br />}</span>
          ))}
        </p>
      )
    })
  }

  return parts
}

export default function GuidePage({ params }) {
  const guide = getGuideBySlug(params.slug)
  if (!guide) notFound()

  return (
    <div className="space-y-8">
      <nav className="text-xs text-slate-400 flex gap-2">
        <Link href="/" className="hover:text-slate-700">홈</Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-slate-700">가이드</Link>
        <span>/</span>
        <span className="text-slate-600">{guide.title}</span>
      </nav>

      <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">실무 가이드</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">{guide.title}</h1>
        <p className="mt-3 text-slate-600">{guide.summary}</p>
        <p className="mt-4 text-xs text-slate-400">업데이트 {guide.updatedAt}</p>
      </section>

      <div className="space-y-6">
        {guide.sections.map((section, index) => (
          <section key={index} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            {renderSection(section, index)}
          </section>
        ))}
      </div>

      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center space-y-3">
        <p className="text-slate-700 text-sm font-medium">내 조건으로 직접 계산해보세요</p>
        <Link
          href="/calculators"
          className="inline-block rounded-full bg-blue-600 text-white px-8 py-2.5 text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          계산기 바로 사용하기 →
        </Link>
      </section>

      <div className="text-center">
        <Link href="/guides" className="text-sm text-blue-700 hover:text-blue-900">
          ← 가이드 목록으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
