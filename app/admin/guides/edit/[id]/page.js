'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../../../../contexts/AuthContext'
import { supabase } from '../../../../../lib/supabase'
import AdminNav from '../../../_components/AdminNav'

export default function AdminGuideEditPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [summary, setSummary] = useState('')
  const [keywords, setKeywords] = useState('')
  const [sections, setSections] = useState([]) // [{ id, order_index, html_content }]

  useEffect(() => {
    if (!authLoading && !user) router.replace('/admin')
  }, [user, authLoading, router])

  const load = useCallback(async () => {
    if (!user || !id) return
    try {
      setLoading(true)
      const [guideRes, sectionsRes] = await Promise.all([
        supabase.from('guides').select('*').eq('id', id).single(),
        supabase.from('guide_sections').select('*').eq('guide_id', id).order('order_index'),
      ])
      if (guideRes.error) throw guideRes.error
      const g = guideRes.data
      setTitle(g.title || '')
      setSlug(g.slug || '')
      setSummary(g.summary || '')
      setKeywords(Array.isArray(g.keywords) ? g.keywords.join(', ') : (g.keywords || ''))
      setSections(sectionsRes.data || [])
    } catch {
      setError('가이드를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }, [user, id])

  useEffect(() => { load() }, [load])

  const updateSection = (idx, value) => {
    setSections(prev => prev.map((s, i) => i === idx ? { ...s, html_content: value } : s))
  }

  const addSection = () => {
    setSections(prev => [...prev, { id: null, order_index: prev.length + 1, html_content: '' }])
  }

  const removeSection = (idx) => {
    setSections(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSave = async () => {
    setError('')
    setSuccess(false)
    if (!title.trim() || !slug.trim()) {
      setError('제목과 slug는 필수입니다.')
      return
    }
    try {
      setSaving(true)

      const { error: guideErr } = await supabase
        .from('guides')
        .update({ title: title.trim(), slug: slug.trim(), summary: summary.trim(), keywords: keywords.trim() })
        .eq('id', id)
      if (guideErr) throw guideErr

      // 기존 섹션 전체 삭제 후 재삽입
      const { error: delErr } = await supabase.from('guide_sections').delete().eq('guide_id', id)
      if (delErr) throw delErr

      const newSections = sections
        .filter(s => s.html_content.trim())
        .map((s, i) => ({ guide_id: id, html_content: s.html_content, order_index: i + 1 }))

      if (newSections.length > 0) {
        const { error: insErr } = await supabase.from('guide_sections').insert(newSections)
        if (insErr) throw insErr
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      setError(`저장 중 오류: ${e.message}`)
    } finally {
      setSaving(false)
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
      <AdminNav activeTab="guides" onLogout={handleLogout} />

      <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/guides" className="text-sm text-slate-500 hover:text-slate-700 mb-1 inline-block">← 목록으로</Link>
            <h1 className="text-2xl font-semibold text-slate-900">가이드 수정</h1>
          </div>
          <div className="flex items-center gap-3">
            {success && <span className="text-sm text-green-600 font-medium">저장 완료!</span>}
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm font-medium hover:bg-slate-700 disabled:opacity-50 transition"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>

        {error && <div className="text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>}

        {/* 기본 정보 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">기본 정보</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">제목 *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Slug *</label>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-500 font-mono focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">요약 (summary)</label>
              <textarea
                value={summary}
                onChange={e => setSummary(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">키워드 (쉼표로 구분)</label>
              <input
                type="text"
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
                placeholder="예: 육아휴직, 근로시간, 지원금"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>
          </div>
        </div>

        {/* 섹션 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">섹션 ({sections.length}개)</h2>
            <button
              onClick={addSection}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              + 섹션 추가
            </button>
          </div>
          {sections.length === 0 && (
            <p className="text-sm text-slate-400">섹션이 없습니다.</p>
          )}
          {sections.map((section, idx) => (
            <div key={idx} className="border border-slate-100 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">섹션 {idx + 1}</span>
                <button
                  onClick={() => removeSection(idx)}
                  className="text-xs text-red-400 hover:text-red-600 transition"
                >
                  삭제
                </button>
              </div>
              <textarea
                value={section.html_content}
                onChange={e => updateSection(idx, e.target.value)}
                rows={8}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-xs font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-y"
                placeholder="HTML 콘텐츠를 입력하세요"
              />
            </div>
          ))}
        </div>

        {/* 하단 저장 */}
        <div className="flex justify-end gap-3 pb-8">
          {success && <span className="text-sm text-green-600 font-medium self-center">저장 완료!</span>}
          <Link href="/admin/guides" className="rounded-full border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
            취소
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-slate-900 text-white px-5 py-2 text-sm font-medium hover:bg-slate-700 disabled:opacity-50 transition"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}
