'use client'

import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

const INQUIRY_TYPES = ['연차·휴가', '퇴직금·퇴직연금', '급여·임금', '해고·징계', '근로계약', '기타']

const ConsultationCTA = ({ sourceSlug }) => {
  const [form, setForm] = useState({ name: '', contact: '', type: '', content: '' })
  const [agreed, setAgreed] = useState(false)
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!agreed) { setErrorMsg('개인정보 수집·이용에 동의해주세요.'); return }
    setStatus('loading'); setErrorMsg('')
    try {
      if (!supabase) throw new Error('supabase not configured')
      const { error } = await supabase.from('consultation_requests').insert([{
        name: form.name.trim(),
        contact: form.contact.trim(),
        inquiry_type: form.type || null,
        content: form.content.trim() || null,
        source_slug: sourceSlug || null,
      }])
      if (error) throw error
      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMsg('신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  if (status === 'success') {
    return (
      <section className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-800 to-blue-900 p-6 text-center shadow-lg">
        <p className="text-lg font-bold text-white mb-1">신청이 완료되었습니다</p>
        <p className="text-slate-400 text-xs">영업일 기준 1~2일 내로 연락드리겠습니다.</p>
      </section>
    )
  }

  const inputBase = 'w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-sm text-white placeholder-slate-400 outline-none transition focus:border-blue-400 focus:ring-1 focus:ring-blue-400/50'

  return (
    <section className="rounded-2xl bg-gradient-to-br from-slate-800 via-slate-800 to-blue-900 p-5 md:p-6 shadow-lg">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-300">무료 상담 신청</span>
          </div>
          <h2 className="text-base font-bold text-white">노무·인사 문제, 혼자 고민하지 마세요</h2>
        </div>
        {/* trust 뱃지 - 인라인 */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400">
          <span>✓ 비밀보장</span>
          <span>✓ 1~2일 내 검토</span>
          <span>✓ 무료</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="text" name="name" value={form.name} onChange={handleChange}
            placeholder="이름 *" required className={inputBase} />
          <input type="text" name="contact" value={form.contact} onChange={handleChange}
            placeholder="연락처 (전화 또는 이메일) *" required className={inputBase} />
        </div>

        <select name="type" value={form.type} onChange={handleChange}
          className={`${inputBase} appearance-none`}>
          <option value="" className="bg-slate-800">문의 유형 선택 (선택)</option>
          {INQUIRY_TYPES.map((t) => <option key={t} value={t} className="bg-slate-800">{t}</option>)}
        </select>

        <textarea name="content" value={form.content} onChange={handleChange}
          placeholder="문의 내용 (선택)" rows={2}
          className={`${inputBase} resize-none`} />

        <div className="flex items-start gap-2">
          <input type="checkbox" id="agree-cta" checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 accent-blue-500 shrink-0" />
          <label htmlFor="agree-cta" className="text-xs text-slate-400 leading-relaxed cursor-pointer">
            개인정보(이름, 연락처) 수집·이용에 동의합니다. 상담 목적으로만 사용되며 완료 후 파기됩니다.
          </label>
        </div>

        {errorMsg && <p className="text-xs text-red-400 bg-red-400/10 rounded px-3 py-1.5">{errorMsg}</p>}

        <button type="submit" disabled={status === 'loading'}
          className="w-full rounded-full bg-blue-500 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:opacity-60 disabled:cursor-not-allowed">
          {status === 'loading' ? '신청 중...' : '무료로 상담 신청하기 →'}
        </button>
      </form>
    </section>
  )
}

export default ConsultationCTA
