'use client'

import Link from 'next/link'

export default function AdminNav({ newCount = 0, onLogout, activeTab }) {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white text-sm font-bold">eW</span>
            관리자
          </Link>
          <nav className="flex gap-4">
            <Link href="/admin/guides"
              className={`text-sm font-medium transition ${activeTab === 'guides' ? 'text-blue-700' : 'text-slate-600 hover:text-slate-900'}`}>
              가이드
            </Link>
            <Link href="/admin/consultations"
              className={`text-sm font-medium flex items-center gap-1.5 transition ${activeTab === 'consultations' ? 'text-blue-700' : 'text-slate-600 hover:text-slate-900'}`}>
              상담내역
              {newCount > 0 && (
                <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {newCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
        <button onClick={onLogout} className="text-sm text-slate-600 hover:text-slate-900">로그아웃</button>
      </div>
    </header>
  )
}
