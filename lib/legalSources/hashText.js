import { createHash } from 'crypto'

// 조문 원문 비교용 정규화: 공백류를 통일하고 앞뒤 공백을 제거해 사소한 개행/공백 차이로
// 인해 "변경된 것"으로 오탐하지 않도록 한다.
export function normalizeLegalText(text) {
  return String(text ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{2,}/g, '\n')
    .trim()
}

export function hashLegalText(text) {
  return createHash('sha256').update(normalizeLegalText(text), 'utf8').digest('hex')
}
