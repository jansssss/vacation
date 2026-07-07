// law.go.kr Open API 연동 확인용 1회성 스크립트.
// 사용법: .env.local에 LAW_GO_KR_OC=<발급받은 인증ID> 추가 후
//   node scripts/test-lawgokr.mjs
//
// 목적: searchLaw()/getArticleText() 응답의 실제 필드명을 눈으로 확인해
//       lib/legalSources/lawGoKrClient.js의 파싱 로직이 맞는지 검증한다.

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { searchLaw, getArticleText, toJoCode } from '../lib/legalSources/lawGoKrClient.js'
import { hashLegalText } from '../lib/legalSources/hashText.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// .env.local 수동 로드 (프로젝트에 dotenv 의존성이 없어 직접 파싱)
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
}

async function main() {
  if (!process.env.LAW_GO_KR_OC) {
    console.error('LAW_GO_KR_OC 환경변수가 없습니다. .env.local에 추가 후 다시 실행하세요.')
    process.exit(1)
  }

  console.log('--- 1) 법령 검색: 근로기준법 ---')
  const searchResult = await searchLaw('근로기준법')
  console.log('요청 URL:', searchResult.url)
  console.log('후보(파싱 결과):', JSON.stringify(searchResult.candidates, null, 2))
  console.log('원본 응답(raw, 앞부분만):', JSON.stringify(searchResult.raw).slice(0, 1500))

  const mst = searchResult.candidates[0]?.mst
  if (!mst) {
    console.warn('\nMST를 파싱하지 못했습니다. 위 raw 응답을 보고 lawGoKrClient.js의 searchLaw() 필드명을 보정해야 합니다.')
    return
  }

  console.log(`\n--- 2) 조문 조회: 근로기준법 제93조 (MST=${mst}, JO=${toJoCode('제93조')}) ---`)
  const article = await getArticleText({ mst, articleLabel: '제93조' })
  console.log('요청 URL:', article.url)
  console.log('법령명:', article.lawName)
  console.log('조문제목:', article.title)
  console.log('조문시행일자:', article.effectiveDate)

  if (article.text) {
    console.log('\n조문 전체 텍스트:', article.text)
    console.log('정규화 해시:', hashLegalText(article.text))
  } else {
    console.warn('\n조문 텍스트를 추출하지 못했습니다. raw 응답 구조를 다시 확인해야 합니다:')
    console.warn(JSON.stringify(article.raw, null, 2).slice(0, 2000))
  }
}

main().catch((err) => {
  console.error('테스트 스크립트 실행 중 오류:', err)
  process.exit(1)
})
