'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import AdminNav from '../_components/AdminNav'

const PAGE_SIZE = 10

function DeleteConfirmModal({ guide, onConfirm, onCancel }) {
  if (!guide) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onCancel}>
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 py-5">
          <p className="text-base font-semibold text-slate-900 mb-2">가이드 삭제</p>
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-900">"{guide.title}"</span>을(를) 삭제하시겠습니까?
          </p>
          <p className="text-xs text-red-500 mt-2">이 작업은 되돌릴 수 없습니다.</p>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <button onClick={onCancel}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
            취소
          </button>
          <button onClick={onConfirm}
            className="rounded-full bg-red-500 text-white px-4 py-2 text-sm font-medium hover:bg-red-600 transition">
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminGuidesPage() {
  const [guides, setGuides] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [newConsultCount, setNewConsultCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  useEffect(() => {
    if (!authLoading && !user) router.replace('/admin')
  }, [user, authLoading, router])

  const load = useCallback(async () => {
    if (!user) return
    try {
      setLoading(true)
      const from = (page - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1
      const [guidesRes, consultRes] = await Promise.all([
        supabase.from('guides').select('*', { count: 'exact' }).order('updated_at', { ascending: false }).range(from, to),
        supabase.from('consultation_requests').select('id', { count: 'exact' }).eq('status', 'new'),
      ])
      if (guidesRes.error) throw guidesRes.error
      setGuides(guidesRes.data || [])
      setTotalCount(guidesRes.count || 0)
      setNewConsultCount(consultRes.count || 0)
    } catch {
      setError('가이드 목록을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [user, page])

  useEffect(() => { load() }, [load])

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      const { error: deleteError } = await supabase.from('guides').delete().eq('id', deleteTarget.id)
      if (deleteError) throw deleteError
      setDeleteTarget(null)
      setPage(1)
      load()
    } catch {
      setDeleteTarget(null)
      setError('삭제 중 오류가 발생했습니다.')
    }
  }

  const handleLogout = async () => {
    try { await signOut(); router.push('/admin') } catch {}
  }

  if (authLoading || (loading && guides.length === 0)) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="text-slate-600">불러오는 중...</div></div>
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <DeleteConfirmModal guide={deleteTarget} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />
      <AdminNav activeTab="guides" newCount={newConsultCount} onLogout={handleLogout} />

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">가이드 관리</h1>
            <p className="text-sm text-slate-500 mt-1">총 {totalCount}개</p>
          </div>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {totalCount === 0 && !loading ? (
            <div className="text-center py-16 text-slate-500 text-sm">등록된 가이드가 없습니다.</div>
          ) : (
            <>
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
                    {loading
                      ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                          <tr key={i}>
                            {[1,2,3,4].map(j => (
                              <td key={j} className="px-5 py-4">
                                <div className="h-4 rounded bg-slate-100 animate-pulse" style={{ width: j === 1 ? '60%' : j === 2 ? '40%' : j === 3 ? '5rem' : '4rem' }} />
                              </td>
                            ))}
                          </tr>
                        ))
                      : guides.map((guide) => (
                          <tr key={guide.id} className="hover:bg-slate-50 transition">
                            <td className="px-5 py-4 text-sm font-medium text-slate-900">{guide.title}</td>
                            <td className="px-5 py-4 text-xs text-slate-500">{guide.slug}</td>
                            <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
                              {new Date(guide.updated_at).toLocaleDateString('ko-KR')}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <Link href={`/guides/${guide.slug}`} target="_blank" className="text-xs text-blue-600 hover:underline">보기</Link>
                                <Link href={`/admin/guides/edit/${guide.id}`} className="text-xs text-slate-600 hover:underline">수정</Link>
                                <button onClick={() => setDeleteTarget(guide)} className="text-xs text-red-500 hover:underline">삭제</button>
                              </div>
                            </td>
                          </tr>
                        ))
                    }
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    {totalCount}개 중 {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)}번째
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition">
                      이전
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setPage(p)}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition ${p === page ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        {p}
                      </button>
                    ))}
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition">
                      다음
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
