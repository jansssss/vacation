'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) router.replace('/admin')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    const load = async () => {
      try {
        setLoading(true)
        const { data, error: fetchError } = await supabase
          .from('guides')
          .select('*')
          .order('updated_at', { ascending: false })
        if (fetchError) throw fetchError
        setGuides(data || [])
      } catch {
        setError('가이드 목록을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`"${title}" 가이드를 삭제하시겠습니까?`)) return
    try {
      const { error: deleteError } = await supabase.from('guides').delete().eq('id', id)
      if (deleteError) throw deleteError
      setGuides((prev) => prev.filter((g) => g.id !== id))
      alert('삭제했습니다.')
    } catch {
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const handleLogout = async () => {
    try { await signOut(); router.push('/admin') } catch {}
  }

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="text-slate-600">불러오는 중...</div></div>
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white text-sm font-bold">eW</span>
              관리자
            </Link>
            <nav className="flex gap-4">
              <Link href="/admin/guides" className="text-sm font-medium text-blue-700">가이드</Link>
              <Link href="/admin/consultations" className="text-sm font-medium text-slate-600 hover:text-slate-900">상담내역</Link>
            </nav>
          </div>
          <button onClick={handleLogout} className="text-sm text-slate-600 hover:text-slate-900">로그아웃</button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">가이드 관리</h1>
            <p className="text-sm text-slate-500 mt-1">총 {guides.length}개</p>
          </div>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {guides.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm">등록된 가이드가 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['제목', 'slug', '업데이트', '관리'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {guides.map((guide) => (
                    <tr key={guide.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-4 text-sm font-medium text-slate-900">{guide.title}</td>
                      <td className="px-5 py-4 text-xs text-slate-500">{guide.slug}</td>
                      <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
                        {new Date(guide.updated_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Link href={`/guides/${guide.slug}`} target="_blank" className="text-xs text-blue-600 hover:underline">보기</Link>
                          <button onClick={() => handleDelete(guide.id, guide.title)} className="text-xs text-red-500 hover:underline">삭제</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
