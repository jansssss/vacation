import rulepackV1 from './rulepack_v1.json'

export const RULEPACK = rulepackV1

export const DIAGNOSIS_MODEL = 'gpt-5.4'
export const DIAGNOSIS_MAX_TOKENS = 32000

export const SYSTEM_PROMPT = `당신은 한국 노무 문제 진단 엔진이다.
입력으로 (1) 룰팩 JSON, (2) 회사 정보, (3) 취업규칙 등 문서 추출 텍스트를 받아, 룰팩의 각 규칙을 문서에 적용한 결과를 JSON으로만 출력한다.

## 절대 원칙
1. **룰팩에 없는 판단을 하지 마라.** 진단은 룰팩의 basis에 근거한 것만 출력한다. 룰팩 밖의 법률 지식이 필요해 보이면 함부로 판단하지 말고 status를 "MANUAL_REVIEW"로 남겨라.
2. **문서에 없는 내용을 있다고 하지 마라.** 모든 finding에는 문서 원문에서 찾은 근거 조항을 evidence로 그대로 인용한다(조항 번호 포함). 인용할 원문이 없으면 "해당 조항 부재"가 곧 evidence다.
3. **확신이 없으면 낮춰라.** VIOLATION(위반 확실)과 RISK(위반 의심)를 구분하고, 문서만으로 판단 불가한 것은 CHECK_NEEDED(사람이 볼 질문 출력)로 분류한다.
4. **단정적 법률 위반 표현 금지.** "위법입니다" 대신 "위반에 해당할 수 있습니다", "행정 벌금이나 과태료로 판단될 가능성이 있습니다" 등 정보 제공 어조를 유지한다.
5. 상시근로자 수 기준으로 applies_to에 해당하지 않는 규칙은 status를 "NOT_APPLICABLE"로 출력한다.
6. **법령 근거 명시는 선택이 아니라 필수다.** 모든 finding은 explanation 또는 별도 필드에, 회사 취업규칙 조항 번호만이 아니라 **룰팩의 basis에 담긴 법률명·조문·판례/가이드 근거를 반드시 문장으로 노출**한다. "관행 기준으로 보입니다"처럼 근거 법령 없이 인상만 서술하는 문장을 금지한다. 예: "근로기준법 제50조는 주 40시간을 기준으로 하므로, 취업규칙 제24조의 '주 44시간' 기재는 현행법과 불일치할 가능성이 있습니다."
7. **심각도(zone)는 매 항목에 눈에 띄게 표시한다.** 리포트 렌더링 시 모든 항목에 RED/YELLOW/BLUE 배지를 붙이고, RED(위반 확실·법정 과태료 직결)만 별도로 상단에 모아 "즉시 조치 필요" 섹션으로 노출한다. 모든 항목을 동일한 medium/보통 키로 뭉뚱그리는 것을 금지한다.

## 출력 JSON 스키마
company_summary: employee_band, doc_types_received, last_revision_year, overall_grade(A/B/C/D — RED violation 존재=D, RED risk만=C, YELLOW만=B, 경미=A), headline(한 문장 요약)
findings: 각 항목마다 rule_id, zone(RED/YELLOW/BLUE), title, status(VIOLATION/RISK/CHECK_NEEDED/OK/NOT_APPLICABLE/MANUAL_REVIEW), evidence, explanation(2~3문장, 반드시 법령명·조문 근거 포함), basis_citation(룰팩 basis를 사람이 읽는 문장으로 변환), risk_detail(방치 시 결과), recommendation(구체적 조치 1~2문장), self_check_question(status가 CHECK_NEEDED일 때만: 재심사가 스스로 확인할 질문, 그 외엔 빈 문자열)
stats: red_violations, red_risks, yellow, blue, ok (findings 개수 집계)
operator_notes: 검수자(관리자)만 보는 메모 — 판단이 애매했던 지점, 원문 추출 품질 문제, MANUAL_REVIEW 사유 등. 고객에게 발송되지 않는다.

## 처리 순서
1. 문서 텍스트에서 조문 구조(장·조·항)를 파악한다. 파싱 품질이 낮으면 operator_notes에 기록한다.
2. 룰팩의 모든 규칙을 순서대로 적용한다. 각 규칙의 basis를 근거로 관련 조항을 찾고, 실제 문서 내용에 따라 판단한다.
3. findings는 zone 순서(RED→YELLOW→BLUE), 같은 zone 내에서는 status 심각도 순으로 정렬한다.
4. JSON 외에는 아무것도 출력하지 않는다. 마크다운 코드펜스도 쓰지 않는다.`

export function buildUserMessage(profile, documents) {
  const { companyName, industry, employeeBand, lastRevisionYear } = profile

  const docsSection = documents
    .map((doc) => `--- 문서: ${doc.originalFilename} ---\n${doc.extractedText}`)
    .join('\n\n')

  return `[회사 프로필]
- 회사명: ${companyName}
- 업종: ${industry || '(미기재)'}
- 상시근로자 규모: ${employeeBand}
- 취업규칙 최종 개정연도: ${lastRevisionYear || '(미기재)'}

[진단 체크리스트 (rulepack v1)]
${JSON.stringify(RULEPACK)}

[업로드된 문서에서 추출한 텍스트]
${docsSection}`
}

export const DIAGNOSIS_OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    diagnosis_result: {
      type: 'object',
      properties: {
        company_summary: {
          type: 'object',
          properties: {
            employee_band: { type: 'string' },
            doc_types_received: { type: 'array', items: { type: 'string' } },
            last_revision_year: { type: 'string' },
            overall_grade: { type: 'string', enum: ['A', 'B', 'C', 'D'] },
            headline: { type: 'string' },
          },
          required: ['employee_band', 'doc_types_received', 'last_revision_year', 'overall_grade', 'headline'],
          additionalProperties: false,
        },
        findings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              rule_id: { type: 'string' },
              zone: { type: 'string', enum: ['RED', 'YELLOW', 'BLUE'] },
              title: { type: 'string' },
              status: {
                type: 'string',
                enum: ['VIOLATION', 'RISK', 'CHECK_NEEDED', 'OK', 'NOT_APPLICABLE', 'MANUAL_REVIEW'],
              },
              evidence: { type: 'string' },
              explanation: { type: 'string' },
              basis_citation: { type: 'string' },
              risk_detail: { type: 'string' },
              recommendation: { type: 'string' },
              self_check_question: { type: 'string' },
            },
            required: [
              'rule_id',
              'zone',
              'title',
              'status',
              'evidence',
              'explanation',
              'basis_citation',
              'risk_detail',
              'recommendation',
              'self_check_question',
            ],
            additionalProperties: false,
          },
        },
        stats: {
          type: 'object',
          properties: {
            red_violations: { type: 'integer' },
            red_risks: { type: 'integer' },
            yellow: { type: 'integer' },
            blue: { type: 'integer' },
            ok: { type: 'integer' },
          },
          required: ['red_violations', 'red_risks', 'yellow', 'blue', 'ok'],
          additionalProperties: false,
        },
        operator_notes: { type: 'string' },
      },
      required: ['company_summary', 'findings', 'stats', 'operator_notes'],
      additionalProperties: false,
    },
  },
  required: ['diagnosis_result'],
  additionalProperties: false,
}

export const DIAGNOSIS_RESPONSE_FORMAT = {
  type: 'json_schema',
  json_schema: {
    name: 'labor_diagnosis_response',
    strict: true,
    schema: DIAGNOSIS_OUTPUT_SCHEMA,
  },
}
