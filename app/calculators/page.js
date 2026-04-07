import Link from 'next/link'

export const metadata = {
  title: '노무/근로 계산기',
  description: '연차, 퇴직금, 실수령액, 육아지원금 등 노무/근로 계산기를 한 곳에서 이용하세요.',
}

const calculators = [
  {
    slug: 'childcare-support',
    title: '육아지원금 계산기',
    href: '/calculators/childcare-support',
    summary: '육아휴직과 육아기 단축근무의 사업주 지원금, 근로자 예상 수령액, 회사 순부담을 함께 계산합니다.',
    category: '육아지원',
    updatedAt: '2026-03-01',
  },
  {
    slug: 'annual-leave',
    title: '연차 계산기',
    href: '/calculators/annual-leave',
    summary: '입사일을 기준으로 연차 발생일수와 사용 기준을 계산합니다.',
    category: '연차',
    updatedAt: '2026-03-01',
  },
  {
    slug: 'severance-pay',
    title: '퇴직금 계산기',
    href: '/calculators/severance-pay',
    summary: '평균임금과 근속기간을 기반으로 예상 퇴직금을 계산합니다.',
    category: '퇴직',
    updatedAt: '2026-03-01',
  },
  {
    slug: 'retirement-pension',
    title: '퇴직연금 운용계산기',
    href: '/calculators/retirement-pension',
    summary: '은퇴 시점 적립금과 월 수령액, 부족분 대안을 계산합니다.',
    category: '연금',
    updatedAt: '2026-03-01',
  },
  {
    slug: 'net-salary',
    title: '실수령액 계산기',
    href: '/calculators/net-salary',
    summary: '세전 급여에서 4대보험과 세금을 반영해 실수령액을 계산합니다.',
    category: '급여',
    updatedAt: '2026-03-01',
  },
]

export default function CalculatorsPage() {
  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-b from-blue-50/60 to-white border border-blue-100/60 px-8 py-12 text-center">
        <span className="inline-block px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full mb-5">
          5가지 무료 계산기
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">노무/근로 계산기</h1>
        <p className="text-gray-500 text-base max-w-md mx-auto">
          연차, 퇴직금, 실수령액, 육아지원금을 숫자로 먼저 확인하세요.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">전체 계산기</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {calculators.map((calc) => (
            <Link
              key={calc.slug}
              href={calc.href}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                  {calc.category}
                </span>
                <span>업데이트 {calc.updatedAt}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-slate-900">{calc.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{calc.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <p className="text-xs text-slate-400 text-center">
        계산 결과는 참고용이며, 실제 결과는 개인 상황에 따라 달라질 수 있습니다.
      </p>
    </div>
  )
}
