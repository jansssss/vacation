'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function AdminGuideBar({ guideId }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session?.user)
    })
  }, [])

  if (!isAdmin || !guideId) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href={`/admin/guides/edit/${guideId}`}
        className="flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2.5 text-sm font-medium shadow-lg hover:bg-slate-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
        수정
      </Link>
    </div>
  )
}
