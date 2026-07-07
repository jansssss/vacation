'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../contexts/AuthContext'
import { supabase } from '../../../lib/supabase'
import AdminNav from '../_components/AdminNav'

async function getAccessToken() {
  const { data } = await supabase.auth.getSession()
  return data?.session?.access_token
}

const VERSION_STATUS_LABEL = {
  draft: { label: '초안', className: 'bg-slate-100 text-slate-600 border border-slate-200' },
  pending_approval: { label: '승인 대기', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
  approved: { label: '승인됨', className: 'bg-blue-50 text-blue-700 border border-blue-200' },
  rejected: { label: '반려', className: 'bg-red-50 text-red-700 border border-red-200' },
  archived: { label: '보관', className: 'bg-slate-100 text-slate-500 border border-slate-200' },
}

const CHECK_STATUS = {
  up_to_date: { label: '최신', className: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  changed: { label: '변경 감지', className: 'bg-red-50 text-red-700 border-red-200' },
  fetch_failed: { label: '조회 실패', className: 'bg-orange-50 text-orange-700 border-orange-200' },
  manual_check_required: { label: '수동 확인', className: 'bg-slate-50 text-slate-600 border-slate-200' },
  baseline_missing: { label: '기준 없음', className: 'bg-slate-50 text-slate-600 border-slate-200' },
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

export default function AdminRulepackPage() {
  const [versions, setVersions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [activating, setActivating] = useState(null)

  const [checking, setChecking] = useState(false)
  const [checkProgress, setCheckProgress] = useState(null) // { current, total, label, progressPct }
  const [checkReport, setCheckReport] = useState(null)
  const [checkError, setCheckError] = useState('')

  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) router.replace('/admin')
  }, [user, authLoading, router])

  const loadVersions = async () => {
    try {
      setLoading(true)
      const token = await getAccessToken()
      const res = await fetch('/api/rulepack/versions', { headers: { Authorization: `Bearer ${token}` } })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || '목록 조회 실패')
      setVersions(data.versions || [])
    } catch (err) {
      setError(err.message || '버전 목록을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    loadVersions()
  }, [user])

  const handleLogout = async () => {
    try { await signOut(); router.push('/admin') } catch {}
  }

  const activeVersion = versions.find((v) => v.is_active)

  const handleRunCheck = async () => {
    setChecking(true)
    setCheckReport(null)
    setCheckError('')
    setCheckProgress({ current: 0, total: 0, label: '준비 중…', progressPct: 0 })
    setNotice('')
    try {
      const token = await getAccessToken()
      const res = await fetch('/api/rulepack/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      })
      if (!res.body) throw new Error('서버 응답을 읽을 수 없습니다.')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let finalMsg = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        let nl
        while ((nl = buffer.indexOf('\n')) >= 0) {
          const line = buffer.slice(0, nl).trim()
          buffer = buffer.slice(nl + 1)
          if (!line) continue
          let msg
          try { msg = JSON.parse(line) } catch { continue }
          if (msg.type === 'progress') {
            setCheckProgress({ current: msg.current, total: msg.total, label: msg.label, progressPct: msg.progressPct })
          } else if (msg.type === 'done' || msg.type === 'error') {
            finalMsg = msg
          }
        }
      }

      if (!finalMsg || finalMsg.type === 'error') {
        throw new Error(finalMsg?.error || '점검 중 오류가 발생했습니다.')
      }
      setCheckReport({ versionLabel: finalMsg.versionLabel, ...finalMsg.report })
    } catch (err) {
      setCheckError(err.message || '점검 중 오류가 발생했습니다.')
    } finally {
      setChecking(false)
      setCheckProgress(null)
    }
  }

  const handleActivate = async (version) => {
    if (!confirm(`버전 ${version.version_label}을(를) 활성화하시겠습니까?\n이후 모든 신규 고객 진단에 이 버전이 적용됩니다.`)) return
    setActivating(version.id)
    setNotice('')
    try {
      const token = await getAccessToken()
      const res = await fetch('/api/rulepack/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: 'activate', versionId: version.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || '활성화 실패')
      setNotice(`버전 ${data.versionLabel}이(가) 활성화되었습니다.`)
      await loadVersions()
    } catch (err) {
      alert(err.message || '활성화 중 오류가 발생했습니다.')
    } finally {
      setActivating(null)
    }
  }

  if (authLoading || (loading && versions.length === 0)) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="text-slate-600">불러오는 중...</div></div>
  }
  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav activeTab="rulepack" onLogout={handleLogout} />

      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">룰팩 관리</h1>
          <p className="text-sm text-slate-500 mt-1">
            노무진단 기준(룰팩)의 법령 근거가 최신인지 점검하고, 버전을 활성화·롤백합니다.
            고객 진단은 <b>활성 버전</b>만 사용합니다.
          </p>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>}
        {notice && <div className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2">{notice}</div>}

        {/* 활성 버전 + 점검 실행 */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-xs font-medium text-slate-400">현재 활성 버전</p>
              <p className="text-lg font-semibold text-slate-900">
                {activeVersion ? `v${activeVersion.version_label}` : '없음'}
                {activeVersion && (
                  <span className="ml-2 text-xs font-normal text-slate-400">승인 {formatDate(activeVersion.approved_at)}</span>
                )}
              </p>
            </div>
            <button
              onClick={handleRunCheck}
              disabled={checking}
              className="rounded-full bg-blue-600 text-white px-5 py-2 text-sm font-medium hover:bg-blue-500 disabled:opacity-50"
            >
              {checking ? '점검 중...' : '최신성 점검 실행'}
            </button>
          </div>

          {checking && checkProgress && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-blue-700">
                <span>법령 조회 중… {checkProgress.label}</span>
                <span className="font-semibold">
                  {checkProgress.total > 0 ? `${checkProgress.current}/${checkProgress.total}` : ''} {checkProgress.progressPct}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-blue-100 overflow-hidden">
                <div className="h-full rounded-full bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${checkProgress.progressPct}%` }} />
              </div>
            </div>
          )}

          {checkError && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs text-red-700">점검 실패: {checkError}</div>
          )}

          {checkReport && <CheckReportView report={checkReport} />}
        </section>

        {/* 버전 이력 */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-800">버전 이력</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['버전', '상태', '변경 요약', '생성일', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {versions.map((v) => {
                  const statusInfo = VERSION_STATUS_LABEL[v.status] || VERSION_STATUS_LABEL.draft
                  return (
                    <tr key={v.id} className="hover:bg-slate-50 transition">
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-slate-900">v{v.version_label}</span>
                        {v.is_active && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold">활성</span>
                        )}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.className}`}>{statusInfo.label}</span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 max-w-md">{v.change_summary || '—'}</td>
                      <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">{formatDate(v.created_at)}</td>
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        {v.is_active ? (
                          <span className="text-xs text-slate-400">사용 중</span>
                        ) : (
                          <button
                            onClick={() => handleActivate(v)}
                            disabled={activating === v.id}
                            className="rounded-full bg-slate-900 text-white px-4 py-1.5 text-xs font-medium hover:bg-slate-700 disabled:opacity-50"
                          >
                            {activating === v.id ? '활성화 중...' : '활성화'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

function CheckReportView({ report }) {
  const summary = report.summary || {}
  const order = ['changed', 'fetch_failed', 'up_to_date', 'manual_check_required', 'baseline_missing']
  const sorted = [...(report.results || [])].sort(
    (a, b) => order.indexOf(a.status) - order.indexOf(b.status)
  )

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-slate-500">v{report.versionLabel} 점검 결과 · 조문 {report.total_sources}건 ·</span>
        {order.filter((s) => summary[s]).map((s) => (
          <span key={s} className={`inline-flex items-center rounded-full px-2 py-0.5 font-medium border ${CHECK_STATUS[s]?.className || ''}`}>
            {CHECK_STATUS[s]?.label || s} {summary[s]}
          </span>
        ))}
      </div>

      {report.needs_attention ? (
        <p className="text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          변경 또는 조회 실패가 감지되었습니다. 아래 항목을 확인하세요.
        </p>
      ) : (
        <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
          점검한 모든 조문이 저장된 기준과 일치합니다(변경 없음).
        </p>
      )}

      <div className="space-y-1.5">
        {sorted.map((r, i) => {
          const info = CHECK_STATUS[r.status] || { label: r.status, className: 'bg-slate-50 text-slate-600 border-slate-200' }
          return (
            <div key={i} className="flex items-start gap-2 text-xs rounded-lg border border-slate-100 px-3 py-2">
              <span className={`shrink-0 inline-flex rounded-full px-2 py-0.5 font-semibold border ${info.className}`}>{info.label}</span>
              <div className="min-w-0">
                <span className="font-medium text-slate-800">{r.rule_id}</span>
                <span className="text-slate-500"> · {r.law_name || ''} {r.article || ''}</span>
                {r.reason && <span className="text-slate-500"> — {r.reason}</span>}
              </div>
            </div>
          )
        })}
      </div>

      {report.rules_without_sources?.length > 0 && (
        <p className="text-[11px] text-slate-400">
          법령 근거(legal_sources) 미보유 규칙: {report.rules_without_sources.join(', ')} (판례·행정발표·고시형 — 수동 관리 대상)
        </p>
      )}
    </div>
  )
}
