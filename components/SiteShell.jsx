'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const navItems = [
  { name: '계산기', href: '/calculators' },
  { name: '가이드', href: '/guides' },
]

export default function SiteShell({ children, latestGuideDate }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur border-b border-blue-100">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white text-sm font-bold">
              eW
            </span>
            e-work.kr
          </Link>
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 text-sm font-medium rounded-full text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-slate-100 bg-white/80 mt-12">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-slate-500">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="font-medium text-slate-700">노무/근로 유틸 플랫폼</div>
            <div>기준일: 2026-01-01 · 업데이트: {latestGuideDate ?? '2026-03-01'}</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
            <Link href="/about" className="hover:text-slate-700">소개</Link>
            <Link href="/contact" className="hover:text-slate-700">문의</Link>
            <Link href="/privacy" className="hover:text-slate-700">개인정보처리방침</Link>
            <Link href="/terms" className="hover:text-slate-700">이용약관</Link>
            <Link href="/disclaimer" className="hover:text-slate-700">면책</Link>
            <Link href="/editorial-policy" className="hover:text-slate-700">콘텐츠 정책</Link>
            <Link href="/admin" className="hover:text-slate-700">관리자</Link>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            운영자: 이워크 · 연락처: goooods@naver.com
          </div>
          <p className="mt-4 text-xs text-slate-400">
            본 서비스는 일반 정보 제공 목적이며 개별 상황에 따라 결과가 달라질 수 있습니다. 법률 자문이
            아니며, 최종 판단은 관련 기관 안내 및 전문가 상담을 권장합니다.
          </p>
        </div>
      </footer>
    </>
  )
}
