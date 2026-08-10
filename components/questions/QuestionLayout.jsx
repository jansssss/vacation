import Link from 'next/link'
import { ArrowRight, Calculator, Clock } from 'lucide-react'
import QuestionToc from './QuestionToc'
import QuestionFaq from './QuestionFaq'
import LaborCheckBanner from '../LaborCheckBanner'
import {
  getQuestionBySlug,
  getNextQuestion,
} from '../../src/config/questionsRegistry'

const BASE = 'https://e-work.kr'

/**
 * 질문형 SEO 페이지 공통 레이아웃.
 *
 * 본문(children)은 각 페이지가 직접 서술하고, 이 컴포넌트는 모든 페이지가
 * 공유해야 하는 것 — 목차, 계산기 연결, 다음 질문 사슬, FAQ, 구조화 데이터 — 만 담당한다.
 */
export default function QuestionLayout({
  slug,
  description,
  tocItems,
  faqs,
  calculator,
  relatedGuides = [],
  relatedQuestions = [],
  sources = [],
  children,
}) {
  const meta = getQuestionBySlug(slug)
  const next = getNextQuestion(slug)
  const url = `${BASE}/questions/${slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: meta.question,
        description,
        url,
        inLanguage: 'ko',
        dateModified: meta.updatedAt,
        publisher: { '@type': 'Organization', name: 'e-work.kr', url: BASE },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: BASE },
          { '@type': 'ListItem', position: 2, name: '노무 질문', item: `${BASE}/questions` },
          { '@type': 'ListItem', position: 3, name: meta.question, item: url },
        ],
      },
    ],
  }

  const relatedQuestionItems = relatedQuestions
    .map(getQuestionBySlug)
    .filter(Boolean)

  return (
    <div className="mx-auto w-full max-w-3xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="flex gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-slate-700">홈</Link>
        <span>/</span>
        <Link href="/questions" className="hover:text-slate-700">노무 질문</Link>
        <span>/</span>
        <span className="text-slate-600">{meta.listTitle}</span>
      </nav>

      <header className="mt-4 mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
          질문 {String(meta.id).padStart(2, '0')} · {meta.keywords.split(',')[0].trim()}
        </p>
        <h1 className="mt-2 text-2xl font-bold leading-snug text-slate-900 md:text-3xl">
          {meta.question}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-slate-600">{description}</p>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <Clock className="h-3.5 w-3.5" />
          <span>최종 업데이트 {meta.updatedAt}</span>
        </div>
      </header>

      <QuestionToc items={tocItems} />

      <article className="mt-2">{children}</article>

      {sources.length > 0 && (
        <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-2 text-xs font-semibold text-slate-700">근거 규정·판례</p>
          <ul className="space-y-1 text-xs leading-relaxed text-slate-500">
            {sources.map((s) => (
              <li key={s}>· {s}</li>
            ))}
          </ul>
        </div>
      )}

      {calculator && (
        <section className="mt-8">
          <Link
            href={calculator.path}
            className="group flex items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 transition hover:border-blue-400 hover:shadow-md"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600">
                <Calculator className="h-4 w-4 text-white" />
              </span>
              <span>
                <span className="block text-sm font-bold text-slate-900">
                  {calculator.label}로 내 조건 계산하기
                </span>
                <span className="mt-0.5 block text-xs text-slate-500">{calculator.description}</span>
              </span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-blue-400 transition-colors group-hover:text-blue-600" />
          </Link>
        </section>
      )}

      {/* ⑥ 질문 사슬 — 하나를 읽으면 바로 다음 궁금증으로 넘어가게 한다 */}
      {next && (
        <section className="mt-8">
          <Link
            href={`/questions/${next.slug}`}
            className="group block rounded-2xl border border-slate-900 bg-slate-900 p-6 transition hover:bg-slate-800"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {meta.loopsBack ? '다시 처음으로' : '다음 질문'}
            </p>
            <p className="mt-2.5 text-base font-bold leading-snug text-white">{next.question}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{next.summary}</p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-300">
              이어서 읽기
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </p>
          </Link>
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-5 text-xl font-bold text-slate-900">자주 묻는 질문</h2>
        <QuestionFaq items={faqs} />
      </section>

      {(relatedQuestionItems.length > 0 || relatedGuides.length > 0) && (
        <section className="mt-10">
          <h2 className="mb-5 text-xl font-bold text-slate-900">함께 보면 좋은 글</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedQuestionItems.map((q) => (
              <Link
                key={q.slug}
                href={`/questions/${q.slug}`}
                className="group block rounded-xl border border-slate-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50"
              >
                <p className="text-[11px] font-semibold text-blue-600">질문</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 group-hover:text-blue-700">
                  {q.question}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{q.summary}</p>
              </Link>
            ))}
            {relatedGuides.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="group block rounded-xl border border-slate-200 p-4 transition-all hover:border-emerald-300 hover:bg-emerald-50"
              >
                <p className="text-[11px] font-semibold text-emerald-600">심화 가이드</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 group-hover:text-emerald-700">
                  {g.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">{g.description}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10">
        <LaborCheckBanner />
      </div>

      <div className="mt-8 text-center">
        <Link href="/questions" className="text-sm text-blue-700 hover:text-blue-900">
          ← 노무 질문 30개 전체 보기
        </Link>
      </div>
    </div>
  )
}
