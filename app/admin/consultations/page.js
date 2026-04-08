'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import AdminNav from '../_components/AdminNav'

const PAGE_SIZE = 10

const STATUS_LABEL = {
  new: { label: '미확인', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
  checked: { label: '확인 완료', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
}

function DetailModal({ row, onClose }) {
  if (!row) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">상담 상세</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none">×</button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">이름</p>
              <p className="text-sm text-slate-900">{row.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">연락처</p>
              <p className="text-sm text-slate-900">{row.contact}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">문의 유형</p>
              <p className="text-sm text-slate-900">{row.inquiry_type || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">접수일</p>
              <p className="text-sm text-slate-900">
                {new Date(row.created_at).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          {row.source_slug && (
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">출처 가이드</p>
              <p className="text-sm text-blue-600">{row.source_slug}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">문의 내용</p>
            <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-xl p-4 min-h-[80px]">
              {row.content || '(내용 없음)'}
            </p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm font-medium hover:bg-slate-700 transition">닫기</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminConsultationsPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedRow, setSelectedRow] = useState(null)
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
          .from('consultation_requests')
          .select('*')
          .order('created_at', { ascending: false })
        if (fetchError) throw fetchError
        setRows(data || [])
      } catch {
        setError('상담 내역을 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const handleFilterChange = (key) => {
    setFilter(key)
    setPage(1)
  }

  const handleStatusToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'new' ? 'checked' : 'new'
    try {
      const { error: updateError } = await supabase.from('consultation_requests').update({ status: nextStatus }).eq('id', id)
      if (updateError) throw updateError
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r)))
    } catch {
      alert('상태 변경 중 오류가 발생했습니다.')
    }
  }

  const handleLogout = async () => {
    try { await signOut(); router.push('/admin') } catch {}
  }

  if (authLoading || (loading && rows.length === 0)) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="text-slate-600">불러오는 중...</div></div>
  }

  if (!user) return null

  const filtered = filter === 'all' ? rows : rows.filter((r) => r.status === filter)
  const newCount = rows.filter((r) => r.status === 'new').length
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="min-h-screen bg-slate-50">
      <DetailModal row={selectedRow} onClose={() => setSelectedRow(null)} />
      <AdminNav activeTab="consultations" newCount={newCount} onLogout={handleLogout} />

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">상담 내역</h1>
            <p className="text-sm text-slate-500 mt-1">총 {rows.length}건 · 미확인 {newCount}건</p>
          </div>
          <div className="flex gap-1 rounded-xl bg-white border border-slate-200 p-1 self-start">
            {[{ key: 'all', label: '전체' }, { key: 'new', label: '미확인' }, { key: 'checked', label: '확인 완료' }].map(({ key, label }) => (
              <button key={key} onClick={() => handleFilterChange(key)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${filter === key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm">
              {filter === 'all' ? '아직 접수된 상담이 없습니다.' : '해당 상태의 상담이 없습니다.'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {['접수일', '이름', '연락처', '문의 유형', '문의 내용', '상태'].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginated.map((row) => {
                      const statusInfo = STATUS_LABEL[row.status] || STATUS_LABEL.new
                      return (
                        <tr key={row.id} className="hover:bg-slate-50 transition">
                          <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
                            {new Date(row.created_at).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' })}
                            <span className="block text-xs text-slate-400">
                              {new Date(row.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-sm font-medium text-slate-900 whitespace-nowrap">{row.name}</td>
                          <td className="px-5 py-4 text-sm text-slate-700 whitespace-nowrap">{row.contact}</td>
                          <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{row.inquiry_type || <span className="text-slate-300">—</span>}</td>
                          <td className="px-5 py-4 text-sm text-slate-600 max-w-xs">
                            {row.content ? (
                              <button onClick={() => setSelectedRow(row)} className="line-clamp-2 leading-relaxed text-left hover:text-blue-600 transition cursor-pointer">
                                {row.content}
                              </button>
                            ) : (
                              <button onClick={() => setSelectedRow(row)} className="text-slate-300 hover:text-blue-500 transition text-xs">
                                상세보기
                              </button>
                            )}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <button onClick={() => handleStatusToggle(row.id, row.status)}
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition hover:opacity-70 ${statusInfo.className}`}>
                              {statusInfo.label}
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    {filtered.length}건 중 {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}번째
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
