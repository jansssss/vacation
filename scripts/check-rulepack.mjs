// 룰팩 최신성 점검을 CLI로 실행해 결과를 확인한다.
// 사용법:
//   node scripts/check-rulepack.mjs           -> 활성(is_active) 버전 점검
//   node scripts/check-rulepack.mjs 1.2        -> version_label로 지정 점검
//
// 이 스크립트는 읽기 전용이다(DB를 수정하지 않는다). 점검 결과만 콘솔에 출력한다.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'
import { checkRulepack } from '../lib/legalSources/checkRulepack.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
}

async function main() {
  if (!process.env.LAW_GO_KR_OC) {
    console.error('LAW_GO_KR_OC 환경변수가 없습니다.')
    process.exit(1)
  }
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const admin = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

  const versionLabel = process.argv[2]
  const query = admin.from('rulepack_versions').select('id, version_label, content')
  const { data, error } = versionLabel
    ? await query.eq('version_label', versionLabel).single()
    : await query.eq('is_active', true).single()

  if (error || !data) {
    console.error('룰팩 버전을 찾지 못했습니다.', error?.message)
    process.exit(1)
  }

  console.log(`점검 대상: 버전 ${data.version_label} (id=${data.id})\n`)

  const report = await checkRulepack(data.content, {
    onProgress: (current, total, label) => {
      if (current < total) process.stdout.write(`\r점검 중 (${current}/${total}) ${label}`.padEnd(70))
      else process.stdout.write(`\r점검 완료 (${total}/${total})`.padEnd(70) + '\n\n')
    },
  })

  console.log('요약:', JSON.stringify(report.summary))
  console.log('추가 조치 필요:', report.needs_attention)
  console.log('근거(legal_sources) 미보유 규칙:', report.rules_without_sources.join(', ') || '(없음)')
  console.log('\n--- 조문별 결과 ---')
  for (const r of report.results) {
    const line = `[${r.status}] ${r.rule_id} · ${r.law_name ?? ''} ${r.article ?? ''}`
    console.log(line + (r.reason ? `  — ${r.reason}` : ''))
  }
}

main().catch((err) => {
  console.error('\n점검 실행 중 오류:', err)
  process.exit(1)
})
