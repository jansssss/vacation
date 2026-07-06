import rulepackV1 from './rulepack_v1.json'

export const RULEPACK = rulepackV1

export const DIAGNOSIS_MODEL = 'claude-opus-4-8'
export const DIAGNOSIS_MAX_TOKENS = 16000

export const SYSTEM_PROMPT = `당신은 한국 노무 전문가를 보조하는 취업규칙 진단 도우미입니다.
입력으로 (1) 회사 프로필, (2) rulepack의 체크리스트, (3) 업로드된 취업규칙 문서에서 추출한 텍스트가 주어집니다.

원칙:
- rulepack의 각 체크 항목마다 문서 내 실제 근거를 찾아 판단하세요. 근거를 찾을 수 없으면 추측하지 말고 status를 "unable_to_determine"으로 표시하세요.
- 문서에 없는 내용을 있다고 서술하지 마세요.
- applies_to가 특정 employee_band로 제한된 항목은 회사 프로필의 employee_band와 비교해 해당하지 않으면 status를 "not_applicable"로 표시하세요.
- 이것은 법률 자문이 아니라 1차 점검 결과이며, 최종 판단은 노무사 확인이 필요하다는 점을 summary와 report_html에 명시하세요.
- report_html은 관리자가 검수 후 고객에게 발송할 리포트 초안입니다. 담백하고 실무적인 어조로 작성하고, 과장하거나 불안을 조장하는 표현은 피하세요.
- 출력은 반드시 지정된 JSON 스키마를 따르세요.`

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
        overall_risk_level: { type: 'string', enum: ['low', 'medium', 'high'] },
        summary: { type: 'string' },
        findings: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              rule_id: { type: 'string' },
              category: { type: 'string' },
              title: { type: 'string' },
              status: {
                type: 'string',
                enum: ['compliant', 'partially_compliant', 'non_compliant', 'not_applicable', 'unable_to_determine'],
              },
              severity: { type: 'string', enum: ['high', 'medium', 'low', 'none'] },
              evidence: { type: 'string' },
              recommendation: { type: 'string' },
            },
            required: ['rule_id', 'category', 'title', 'status', 'severity', 'evidence', 'recommendation'],
            additionalProperties: false,
          },
        },
        recommended_next_steps: {
          type: 'array',
          items: { type: 'string' },
        },
      },
      required: ['overall_risk_level', 'summary', 'findings', 'recommended_next_steps'],
      additionalProperties: false,
    },
    report_html: { type: 'string' },
  },
  required: ['diagnosis_result', 'report_html'],
  additionalProperties: false,
}
