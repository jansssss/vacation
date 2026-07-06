'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import AdminNav from '../_components/AdminNav'

const PAGE_SIZE = 10

const STATUS_LABEL = {
  received: { label: '접수', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
  extract_failed: { label: '텍스트 추출 실패', className: 'bg-red-50 text-red-700 border border-red-200' },
  analyzed: { label: '분석 완료', className: 'bg-blue-50 text-blue-700 border border-blue-200' },
  sent: { label: '발송 완료', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
}

async function getAccessToken() {
  const { data } = await supabase.auth.getSession()
  return data?.session?.access_token
}

function FindingsTable({ findings }) {
  if (!findings || findings.length === 0) return null
  const severityClass = {
    high: 'bg-red-50 text-red-700 border-red-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-slate-50 text-slate-600 border-slate-200',
    none: 'bg-slate-50 text-slate-400 border-slate-200',
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            {['카테고리', '항목', '상태', '심각도', '근거', '권고'].map((h) => (
              <th key={h} className="px-3 py-2 text-left text-xs font-medium text-slate-500 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {findings.map((f) => (
            <tr key={f.rule_id}>
              <td className="px-3 py-2 text-xs text-slate-500 whitespace-nowrap">{f.category}</td>
              <td className="px-3 py-2 text-slate-800 max-w-[180px]">{f.title}</td>
              <td className="px-3 py-2 whitespace-nowrap">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] border ${severityClass[f.severity] || severityClass.none}`}>
                  {f.status}
                </span>
              </td>
              <td className="px-3 py-2 text-xs whitespace-nowrap">{f.severity}</td>
              <td className="px-3 py-2 text-xs text-slate-500 max-w-[220px]">{f.evidence}</td>
              <td className="px-3 py-2 text-xs text-slate-500 max-w-[220px]">{f.recommendation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DetailPanel({ row, onClose, onUpdated }) {
  const [manualTexts, setManualTexts] = useState({})
  const [reportDraft, setReportDraft] = useState(row.report_html || '')
  const [analyzing, setAnalyzing] = useState(false)
  const [sending, setSending] = useState(false)
  const [savingText, setSavingText] = useState(false)
  const [savingReport, setSavingReport] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    setReportDraft(row.report_html || '')
  }, [row.id, row.report_html])

  const extractedText = row.extracted_text || {}

  const handleViewFile = async (path) => {
    const { data, error } = await supabase.storage.from('bank').createSignedUrl(path, 60)
    if (error || !data?.signedUrl) {
      alert('파일 링크 생성에 실패했습니다.')
      return
    }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer')
  }

  const handleSaveManualText = async (path) => {
    const text = manualTexts[path]
    if (!text) return
    setSavingText(true)
    try {
      const nextExtractedText = { ...extractedText, [path]: text }
      const { error } = await supabase
        .from('labor_diagnosis_requests')
        .update({ extracted_text: nextExtractedText })
        .eq('id', row.id)
      if (error) throw error
      onUpdated({ ...row, extracted_text: nextExtractedText })
      setNotice('텍스트가 저장되었습니다. 분석 실행 시 반영됩니다.')
    } catch {
      alert('텍스트 저장 중 오류가 발생했습니다.')
    } finally {
      setSavingText(false)
    }
  }

  const handleAnalyze = async () => {
    setAnalyzing(true)
    setNotice('')
    try {
      const token = await getAccessToken()
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ requestId: row.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || '분석 실패')

      if (data.status === 'extract_failed') {
        onUpdated({ ...row, status: 'extract_failed', extracted_text: data.extractedText })
        setNotice('모든 문서에서 텍스트를 추출하지 못했습니다. 수동으로 텍스트를 입력한 뒤 다시 실행해주세요.')
      } else {
        onUpdated({ ...row, status: 'analyzed', diagnosis_result: data.diagnosisResult, report_html: data.reportHtml })
        setReportDraft(data.reportHtml || '')
        setNotice('분석이 완료되었습니다.')
      }
    } catch (err) {
      alert(err.message || '분석 중 오류가 발생했습니다.')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSaveReport = async () => {
    setSavingReport(true)
    try {
      const { error } = await supabase
        .from('labor_diagnosis_requests')
        .update({ report_html: reportDraft })
        .eq('id', row.id)
      if (error) throw error
      onUpdated({ ...row, report_html: reportDraft })
      setNotice('리포트가 저장되었습니다.')
    } catch {
      alert('리포트 저장 중 오류가 발생했습니다.')
    } finally {
      setSavingReport(false)
    }
  }

  const handleSend = async () => {
    if (!confirm(`${row.email} 로 리포트를 발송하시겠습니까?`)) return
    setSending(true)
    try {
      const token = await getAccessToken()
      const res = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ requestId: row.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || '발송 실패')
      onUpdated({ ...row, status: 'sent' })
      setNotice(data.mocked ? '(Mock) RESEND_API_KEY가 없어 실제 발송 없이 상태만 변경했습니다.' : '발송이 완료되었습니다.')
    } catch (err) {
      alert(err.message || '발송 중 오류가 발생했습니다.')
    } finally {
      setSending(false)
    }
  }

  const handlePrintReport = () => {
    const html = reportDraft || row.report_html
    if (!html) return
    const printWindow = window.open('', '_blank', 'noopener,noreferrer')
    if (!printWindow) {
      alert('팝업이 차단되었습니다. 브라우저의 팝업 차단을 해제해주세요.')
      return
    }
    printWindow.document.write(`<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8" />
<title>${row.company_name} 노무진단 리포트</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; line-height: 1.6; color: #1e293b; padding: 24px; max-width: 800px; margin: 0 auto; }
  h1, h2, h3 { color: #0f172a; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #e2e8f0; padding: 6px 10px; font-size: 13px; }
</style>
</head>
<body>${html}</body>
</html>`)
    printWindow.document.close()
    printWindow.onload = () => printWindow.print()
  }

  const statusInfo = STATUS_LABEL[row.status] || STATUS_LABEL.received
  const diagnosisResult = row.diagnosis_result

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-4xl my-8 rounded-2xl bg-white shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-base font-semibold text-slate-900">{row.company_name} 노무진단 상세</h2>
            <span className={`inline-flex mt-1 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.className}`}>
              {statusInfo.label}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-xl leading-none">×</button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {notice && <div className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2">{notice}</div>}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div><p className="text-xs text-slate-400 mb-1">이메일</p><p className="text-slate-900">{row.email}</p></div>
            <div><p className="text-xs text-slate-400 mb-1">상시근로자 규모</p><p className="text-slate-900">{row.employee_band}</p></div>
            <div><p className="text-xs text-slate-400 mb-1">업종</p><p className="text-slate-900">{row.industry || '—'}</p></div>
            <div><p className="text-xs text-slate-400 mb-1">최종 개정연도</p><p className="text-slate-900">{row.last_revision_year || '—'}</p></div>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400 mb-2">첨부 파일</p>
            <div className="space-y-3">
              {(row.file_paths || []).map((f) => (
                <div key={f.path} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-800">{f.original_filename}</span>
                    <button onClick={() => handleViewFile(f.path)} className="text-xs text-blue-600 hover:underline">원문보기 (서명된 URL)</button>
                  </div>
                  {extractedText[f.path] && (
                    <p className="mt-2 text-xs text-slate-400 line-clamp-2 whitespace-pre-wrap">{extractedText[f.path]}</p>
                  )}
                  {row.status === 'extract_failed' && (
                    <div className="mt-2 space-y-2">
                      <textarea
                        rows={4}
                        placeholder="텍스트 추출에 실패한 문서입니다. 원문 내용을 붙여넣어주세요."
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-400"
                        value={manualTexts[f.path] ?? ''}
                        onChange={(e) => setManualTexts((prev) => ({ ...prev, [f.path]: e.target.value }))}
                      />
                      <button
                        onClick={() => handleSaveManualText(f.path)}
                        disabled={savingText || !manualTexts[f.path]}
                        className="rounded-full bg-slate-900 text-white px-4 py-1.5 text-xs disabled:opacity-50"
                      >
                        텍스트 저장
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="rounded-full bg-blue-600 text-white px-5 py-2 text-sm font-medium hover:bg-blue-500 disabled:opacity-50"
            >
              {analyzing ? '분석 중...' : '분석 실행'}
            </button>
            <button
              onClick={handleSend}
              disabled={sending || !row.report_html}
              className="rounded-full bg-emerald-600 text-white px-5 py-2 text-sm font-medium hover:bg-emerald-500 disabled:opacity-50"
            >
              {sending ? '발송 중...' : '발송'}
            </button>
            <button
              onClick={handlePrintReport}
              disabled={!row.report_html}
              className="rounded-full bg-white border border-slate-300 text-slate-700 px-5 py-2 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            >
              보고서 PDF로 저장
            </button>
          </div>

          {diagnosisResult && (
            <div className="space-y-3">
              <p className="text-xs font-medium text-slate-400">진단 결과</p>
              <div className="text-sm">
                <span className="font-medium text-slate-900">전체 위험도: </span>
                <span>{diagnosisResult.overall_risk_level}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{diagnosisResult.summary}</p>
              <FindingsTable findings={diagnosisResult.findings} />
              {diagnosisResult.recommended_next_steps?.length > 0 && (
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  {diagnosisResult.recommended_next_steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {row.status !== 'received' && row.status !== 'extract_failed' && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-400">리포트 편집 (발송될 HTML)</p>
              <textarea
                rows={10}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono outline-none focus:border-blue-400"
                value={reportDraft}
                onChange={(e) => setReportDraft(e.target.value)}
              />
              <button
                onClick={handleSaveReport}
                disabled={savingReport}
                className="rounded-full bg-slate-900 text-white px-4 py-1.5 text-xs disabled:opacity-50"
              >
                리포트 저장
              </button>
              <div className="mt-2 rounded-xl border border-slate-100 p-4 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: reportDraft }} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminLaborCheckPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [selectedRow, setSelectedRow] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [deleting, setDeleting] = useState(false)
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) router.replace('/admin')
  }, [user, authLoading, router])

  const load = async () => {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('labor_diagnosis_requests')
        .select('*')
        .order('created_at', { ascending: false })
      if (fetchError) throw fetchError
      setRows(data || [])
    } catch {
      setError('접수 내역을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    load()
  }, [user])

  const handleUpdated = (updatedRow) => {
    setRows((prev) => prev.map((r) => (r.id === updatedRow.id ? updatedRow : r)))
    setSelectedRow(updatedRow)
  }

  const handleLogout = async () => {
    try { await signOut(); router.push('/admin') } catch {}
  }

  const toggleSelected = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAllOnPage = (ids, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => (checked ? next.add(id) : next.delete(id)))
      return next
    })
  }

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return
    if (!confirm(`선택한 ${selectedIds.size}건을 삭제하시겠습니까? 첨부 파일도 함께 삭제되며 되돌릴 수 없습니다.`)) return

    setDeleting(true)
    try {
      const token = await getAccessToken()
      const res = await fetch('/api/labor-check/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ requestIds: Array.from(selectedIds) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || '삭제 실패')

      setRows((prev) => prev.filter((r) => !selectedIds.has(r.id)))
      if (selectedRow && selectedIds.has(selectedRow.id)) setSelectedRow(null)
      setSelectedIds(new Set())
    } catch (err) {
      alert(err.message || '삭제 중 오류가 발생했습니다.')
    } finally {
      setDeleting(false)
    }
  }

  if (authLoading || (loading && rows.length === 0)) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="text-slate-600">불러오는 중...</div></div>
  }

  if (!user) return null

  const filtered = filter === 'all' ? rows : rows.filter((r) => r.status === filter)
  const newCount = rows.filter((r) => r.status === 'received').length
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="min-h-screen bg-slate-50">
      {selectedRow && (
        <DetailPanel row={selectedRow} onClose={() => setSelectedRow(null)} onUpdated={handleUpdated} />
      )}
      <AdminNav activeTab="labor-check" laborCheckNewCount={newCount} onLogout={handleLogout} />

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">노무진단 접수 내역</h1>
            <p className="text-sm text-slate-500 mt-1">총 {rows.length}건 · 미분석 {newCount}건</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {selectedIds.size > 0 && (
              <button
                onClick={handleDeleteSelected}
                disabled={deleting}
                className="rounded-lg bg-red-600 text-white px-4 py-1.5 text-sm font-medium hover:bg-red-500 disabled:opacity-50"
              >
                {deleting ? '삭제 중...' : `선택 삭제 (${selectedIds.size})`}
              </button>
            )}
            <div className="flex gap-1 rounded-xl bg-white border border-slate-200 p-1 self-start flex-wrap">
              {[
                { key: 'all', label: '전체' },
                { key: 'received', label: '접수' },
                { key: 'extract_failed', label: '추출실패' },
                { key: 'analyzed', label: '분석완료' },
                { key: 'sent', label: '발송완료' },
              ].map(({ key, label }) => (
                <button key={key} onClick={() => { setFilter(key); setPage(1) }}
                  className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${filter === key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>}

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm">
              {filter === 'all' ? '아직 접수된 노무진단이 없습니다.' : '해당 상태의 접수가 없습니다.'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-5 py-3 text-left w-10">
                        <input
                          type="checkbox"
                          checked={paginated.length > 0 && paginated.every((r) => selectedIds.has(r.id))}
                          onChange={(e) => toggleSelectAllOnPage(paginated.map((r) => r.id), e.target.checked)}
                          className="h-4 w-4 accent-slate-900"
                        />
                      </th>
                      {['접수일', '회사명', '이메일', '규모', '상태', ''].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginated.map((row) => {
                      const statusInfo = STATUS_LABEL[row.status] || STATUS_LABEL.received
                      return (
                        <tr key={row.id} className="hover:bg-slate-50 transition">
                          <td className="px-5 py-4">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(row.id)}
                              onChange={() => toggleSelected(row.id)}
                              className="h-4 w-4 accent-slate-900"
                            />
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
                            {new Date(row.created_at).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' })}
                          </td>
                          <td className="px-5 py-4 text-sm font-medium text-slate-900 whitespace-nowrap">{row.company_name}</td>
                          <td className="px-5 py-4 text-sm text-slate-700 whitespace-nowrap">{row.email}</td>
                          <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">{row.employee_band}</td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusInfo.className}`}>
                              {statusInfo.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <button onClick={() => setSelectedRow(row)} className="text-xs text-blue-600 hover:underline">상세보기</button>
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
                    <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
                      className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition">
                      이전
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button key={p} onClick={() => setPage(p)}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition ${p === page ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        {p}
                      </button>
                    ))}
                    <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}
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
