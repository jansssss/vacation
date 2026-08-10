import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  QUESTION_CLUSTERS,
  questionsRegistry,
  getQuestionsByCluster,
} from '../../src/config/questionsRegistry'

export const metadata = {
  title: '노무 질문 30 — 근로자가 실제로 검색하는 질문에 답합니다',
  description:
    '연차, 주휴수당, 퇴직금, 실업급여, 해고, 근로계약서까지. 실제로 검색창에 입력되는 질문 30개를 즉답·사례·판단 기준·예외 순서로 정리했습니다.',
  alternates: { canonical: 'https://e-work.kr/questions' },
}

const BASE = 'https://e-work.kr'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '인사노무 질문 30',
  itemListElement: questionsRegistry.map((q) => ({
    '@type': 'ListItem',
    position: q.id,
    name: q.question,
    url: `${BASE}/questions/${q.slug}`,
  })),
}

export default function QuestionsHubPage() {
  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="rounded-[2rem] border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-emerald-50 p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">노무 질문 30</p>
        <h1 className="mt-2 text-3xl font-semibold leading-snug text-slate-900">
          &ldquo;이 경우엔 어떻게 되나요?&rdquo;에
          <span className="block text-blue-700">한 페이지에서 답이 끝나게</span>
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-slate-600">
          주제를 백과사전처럼 나열하는 대신, 실제로 검색창에 입력되는 질문 단위로 페이지를 나눴습니다.
          각 페이지는 <strong>즉답 → 실제 사례 → 계산·판단 기준 → 예외 → 자주 오해하는 부분</strong> 순서로
          이어지고, 마지막에는 자연스럽게 다음 질문으로 연결됩니다.
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-500">
          1번부터 순서대로 읽으면 연차에서 시작해 급여·퇴직금·실업급여·해고를 거쳐 다시 연차로 돌아옵니다.
          궁금한 것 하나만 골라 읽어도 됩니다.
        </p>
        <Link
          href={`/questions/${questionsRegistry[0].slug}`}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          1번 질문부터 읽기
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {QUESTION_CLUSTERS.map((cluster) => {
        const items = getQuestionsByCluster(cluster.id)
        return (
          <section key={cluster.id} className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{cluster.label}</h2>
              <p className="mt-1 text-sm text-slate-500">{cluster.description}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((q) => (
                <Link
                  key={q.slug}
                  href={`/questions/${q.slug}`}
                  className="group flex gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                >
                  <span className="mt-0.5 font-mono text-xs font-semibold text-slate-300">
                    {String(q.id).padStart(2, '0')}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[15px] font-semibold leading-snug text-slate-900 group-hover:text-blue-700">
                      {q.question}
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-slate-500">
                      {q.summary}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )
      })}

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-base font-bold text-slate-900">이 페이지들을 만든 기준</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          질문 선정은 고용노동부 노동포털의 대표 계산·민원 항목, 공식 기관 FAQ 구성, 그리고 실제 상담에서
          반복되는 세부 질문을 교차해 정했습니다. 특정 키워드의 월간 검색량을 추정해 붙이지 않았고,
          답변은 근로기준법 조문과 대법원 판례, 고용노동부 행정해석을 근거로 작성했습니다.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          본 콘텐츠는 일반 정보 제공 목적이며 개별 사안의 결론은 달라질 수 있습니다. 실제 분쟁이 있다면
          고용노동부 고객상담센터(1350) 또는 전문가 상담을 함께 이용하시기 바랍니다.
        </p>
      </section>
    </div>
  )
}
