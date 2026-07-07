// 법제처 국가법령정보 공동활용(open.law.go.kr) Open API 클라이언트.
// 인증키(OC)는 발급받은 사용자 ID를 그대로 쓰는 방식이라 env var로 주입한다.
//
// 확인된 스펙 (2026-07-07, scripts/test-lawgokr.mjs로 실제 응답을 찍어 검증함):
//   - 법령 검색: GET https://www.law.go.kr/DRF/lawSearch.do?target=law
//     응답: { LawSearch: { law: [ { 법령일련번호(MST), 법령ID, 법령명한글, 시행일자, ... } ] } }
//   - 조문 조회: GET https://www.law.go.kr/DRF/lawService.do?target=lawjosub
//     필수: OC, target=lawjosub, type=JSON, (ID 또는 MST 중 하나), JO(조 번호 6자리)
//     응답: { 법령: { 기본정보: {...}, 조문: { 조문단위: [
//              { 조문여부: "전문", ... } <- 요약 마커, 내용 없음. 무시.
//              { 조문여부: "조문", 조문내용, 조문제목, 조문시행일자,
//                항: { 호: [ { 호번호, 호내용 }, ... ] } 또는 항 배열(항번호/항내용/호) } ,
//              ... (항이 여러 개면 조문단위 배열에 항목이 더 있을 수 있음)
//            ] } } }
//     조문내용은 조 리드인 문장만 담고, 호/목 목록은 별도 트리에 있어 전체 텍스트는
//     조문내용 + 항/호/목 내용을 순서대로 이어붙여야 완성된다 (아래 extractArticleFullText).

const BASE_URL = 'https://www.law.go.kr/DRF'

function getOC() {
  const oc = process.env.LAW_GO_KR_OC
  if (!oc) {
    throw new Error('LAW_GO_KR_OC 환경변수가 설정되어 있지 않습니다 (law.go.kr Open API 인증 ID).')
  }
  return oc
}

async function fetchJson(url) {
  const res = await fetch(url)
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`law.go.kr API 호출 실패 (HTTP ${res.status}): ${text.slice(0, 300)}`)
  }
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`law.go.kr API 응답을 JSON으로 파싱하지 못했습니다: ${text.slice(0, 300)}`)
  }
}

// "제93조" -> "009300", "제19조의2" -> "001902" 형태의 6자리 JO 코드로 변환.
// 조 번호 4자리 + 가지번호(의N) 2자리 관례를 따른다.
export function toJoCode(articleLabel) {
  const m = String(articleLabel).match(/제?\s*(\d+)\s*조(?:\s*의\s*(\d+))?/)
  if (!m) {
    throw new Error(`조 번호 형식을 해석할 수 없습니다: "${articleLabel}" (예상 형식: "제93조", "제19조의2")`)
  }
  const jo = m[1].padStart(4, '0')
  const branch = (m[2] || '0').padStart(2, '0')
  return `${jo}${branch}`
}

// 조문단위 트리(조문내용/항/호/목)를 순서대로 이어붙여 완성된 조문 텍스트를 만든다.
// 구조가 항이 단일 객체인지 배열인지(항이 여러 개인 조문) 확실치 않아 양쪽 다 방어적으로 처리한다.
function collectTextParts(node) {
  if (node == null) return []
  if (Array.isArray(node)) return node.flatMap(collectTextParts)
  if (typeof node !== 'object') return []

  const parts = []
  if (typeof node.조문내용 === 'string') parts.push(node.조문내용)
  if (typeof node.항내용 === 'string') parts.push(node.항내용)
  if (typeof node.호내용 === 'string') parts.push(node.호내용)
  if (typeof node.목내용 === 'string') parts.push(node.목내용)
  if (node.항) parts.push(...collectTextParts(node.항))
  if (node.호) parts.push(...collectTextParts(node.호))
  if (node.목) parts.push(...collectTextParts(node.목))
  return parts
}

// 조문 본문에 박힌 "<개정 2024.10.22>", "<신설 2012.2.1, 2019.4.30>" 같은 개정 이력 표기에서
// 날짜만 뽑아낸다. 이건 그 조문(또는 항)이 "언제 개정 공포됐는지"이지, 그 개정이 "언제부터
// 시행됐는지"가 아니다 — 공포일과 시행일 사이에 유예기간이 있는 경우가 흔하므로 절대 혼동하지 말 것.
function extractAmendmentDates(text) {
  const dates = new Set()
  const bracketRe = /<(?:개정|신설|전문개정|일부개정)\s*([^>]+)>/g
  let bracketMatch
  while ((bracketMatch = bracketRe.exec(text))) {
    const dateRe = /(\d{4})\s*\.\s*(\d{1,2})\s*\.\s*(\d{1,2})/g
    let dateMatch
    while ((dateMatch = dateRe.exec(bracketMatch[1]))) {
      dates.add(`${dateMatch[1]}-${dateMatch[2].padStart(2, '0')}-${dateMatch[3].padStart(2, '0')}`)
    }
  }
  return [...dates].sort()
}

function extractArticleFullText(data) {
  const units = data?.법령?.조문?.조문단위
  const list = Array.isArray(units) ? units : [units].filter(Boolean)
  // "전문" 항목은 조문번호만 있는 요약 마커라 내용이 없다 — 실제 내용이 있는 항목만 사용.
  const contentUnits = list.filter((u) => u?.조문여부 !== '전문')

  const text = contentUnits.flatMap(collectTextParts).join(' ').replace(/\s+/g, ' ').trim()
  const title = contentUnits.find((u) => u?.조문제목)?.조문제목 ?? null

  // 주의: 이 필드는 "법령 전체가 현재 어느 시행 버전으로 편집되어 있는지"를 나타내는 스냅샷
  // 날짜일 뿐, 이 조문이 그 날짜에 개정·시행됐다는 뜻이 아니다(법 전체 개정이 다른 조문만
  // 건드려도 모든 조문에 동일한 값이 찍힐 수 있음). 룰의 "시행일" 근거로 그대로 쓰면 안 된다.
  const lawSnapshotEffectiveDate =
    contentUnits.map((u) => u?.조문시행일자).filter(Boolean).sort().pop() ??
    data?.법령?.기본정보?.시행일자 ??
    null

  // 조문 본문에 실제로 박혀 있는 개정 공포일(가장 최근 값). 이것도 "공포일"이지 "시행일"이
  // 아니므로, 실제 시행일은 별도로 법제처 확인/부칙 조회 또는 운영자 수동 확인이 필요하다.
  const amendmentDates = extractAmendmentDates(text)
  const latestAmendmentDate = amendmentDates[amendmentDates.length - 1] ?? null

  return { text, title, lawSnapshotEffectiveDate, amendmentDates, latestAmendmentDate }
}

// 법령명 + 조 번호(예: "제93조")로 조문 본문을 조회한다. MST를 이미 알고 있으면 mst로 바로 조회.
export async function getArticleText({ mst, id, articleLabel }) {
  const oc = getOC()
  const jo = toJoCode(articleLabel)
  const idParam = mst ? `MST=${encodeURIComponent(mst)}` : `ID=${encodeURIComponent(id)}`
  const url = `${BASE_URL}/lawService.do?OC=${encodeURIComponent(oc)}&target=lawjosub&type=JSON&${idParam}&JO=${jo}`

  const data = await fetchJson(url)
  const { text, title, lawSnapshotEffectiveDate, amendmentDates, latestAmendmentDate } = extractArticleFullText(data)
  const lawName = data?.법령?.기본정보?.법령명_한글 ?? null

  return { text, title, lawSnapshotEffectiveDate, amendmentDates, latestAmendmentDate, lawName, raw: data, url }
}

// 법령명으로 MST(법령일련번호)를 찾는다. 응답 필드명이 아직 미검증이라 raw를 그대로 반환하고,
// 흔히 쓰이는 후보 키들로 best-effort 파싱을 시도한다.
export async function searchLaw(lawName) {
  const oc = getOC()
  const url = `${BASE_URL}/lawSearch.do?OC=${encodeURIComponent(oc)}&target=law&type=JSON&query=${encodeURIComponent(lawName)}`

  const data = await fetchJson(url)

  const list =
    data?.LawSearch?.law ??
    data?.LawSearch?.Law ??
    data?.law ??
    []
  const items = Array.isArray(list) ? list : [list].filter(Boolean)

  const candidates = items.map((item) => ({
    mst: item?.법령일련번호 ?? item?.MST ?? item?.mst ?? null,
    lawId: item?.법령ID ?? item?.ID ?? null,
    name: item?.법령명한글 ?? item?.법령명 ?? item?.name ?? null,
    effectiveDate: item?.시행일자 ?? item?.effectiveDate ?? null,
    raw: item,
  }))

  return { raw: data, url, candidates }
}
