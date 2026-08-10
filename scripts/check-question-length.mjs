// 질문형 SEO 페이지 본문 분량 점검
//
// 목표: 800~1200자 (고정 1,000자가 아니라 주제·난이도에 따라 가변)
// 세는 대상: <QuestionLayout ...> 와 </QuestionLayout> 사이 본문의 한글·숫자.
//            메타데이터, 목차 라벨, FAQ, 관련 링크는 본문이 아니므로 제외한다.
//
// 사용: node scripts/check-question-length.mjs

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const MIN = 800
const MAX = 1200

// 레지스트리에서 슬러그 순서를 그대로 읽어온다 (정규식 파싱 — 빌드 없이 실행하기 위함)
const registrySrc = readFileSync(join(root, 'src/config/questionsRegistry.js'), 'utf8')
const slugs = [...registrySrc.matchAll(/^\s{4}slug: "([^"]+)"/gm)].map((m) => m[1])

const countBody = (src) => {
  const start = src.indexOf('\n    >\n')
  const end = src.indexOf('\n    </QuestionLayout>')
  if (start === -1 || end === -1) return null
  const body = src.slice(start, end)
  return (body.match(/[가-힣0-9]/g) ?? []).length
}

let out = 0
console.log('ID  분량   상태  슬러그')
slugs.forEach((slug, i) => {
  const src = readFileSync(join(root, 'app/questions', slug, 'page.js'), 'utf8')
  const n = countBody(src)
  if (n === null) {
    console.log(`${String(i + 1).padStart(2)}   ---   본문 구간 파싱 실패  ${slug}`)
    out += 1
    return
  }
  const ok = n >= MIN && n <= MAX
  if (!ok) out += 1
  console.log(
    `${String(i + 1).padStart(2)}  ${String(n).padStart(4)}   ${ok ? '  ' : n < MIN ? '짧음' : '김  '}  ${slug}`
  )
})

console.log(`\n총 ${slugs.length}개 · 범위(${MIN}~${MAX}자) 이탈 ${out}개`)
if (out > 0) process.exitCode = 1
