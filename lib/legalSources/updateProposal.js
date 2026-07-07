import OpenAI from 'openai'

// 룰팩 최신성 점검에서 "변경 감지"된 규칙에 대해, 기존 룰과 신·구 조문 텍스트를 주고
// AI에게 "룰을 어떻게 고쳐야 할지" 초안을 받는다. 절대 자동 반영하지 않는다 — 관리자 승인 필수.

export const PROPOSAL_MODEL = 'gpt-5.4'
export const PROPOSAL_MAX_TOKENS = 8000

export const PROPOSAL_SYSTEM_PROMPT = `당신은 한국 노무 룰팩(진단 기준)의 유지보수 보조자다.
입력으로 (1) 현재 룰 1개의 전체 JSON, (2) 그 룰이 참조하는 조문들의 '기존 원문'과 'law.go.kr 최신 원문' 비교가 주어진다.
법령 본문이 실제로 바뀌었다는 사실은 이미 해시 비교로 확인되었다. 당신의 일은 "그 변경을 룰에 어떻게 반영할지" 초안을 만드는 것이다.

## 절대 원칙
1. **제공된 신·구 조문 텍스트만 근거로 삼아라.** 당신의 학습 지식으로 법이 바뀌었는지 스스로 판단하거나, 제공되지 않은 조문·판례·시행일을 지어내지 마라. 불확실하면 change_grade를 높이고 requires_expert_review_reason에 이유를 적어라.
2. **룰의 id와 전체 구조(필드 구성)는 유지하라.** 실제로 바뀌어야 하는 필드(basis, logic, detect, advice, risk, title 등)만 최소 수정한다. proposed_rule은 수정된 룰 전체를 담되, legal_sources 필드는 포함하지 마라(그 부분은 시스템이 별도로 관리한다).
3. **시행일 관련 서술은 신중히.** 조문 본문의 <개정 YYYY.MM.DD>는 '공포일'이지 '시행일'이 아니다. 공포일과 시행일을 혼동하지 말고, 시행일이 불확실하면 단정하지 말고 expert_review로 표시하라.
4. **과장·불안 조장 금지.** 담백하고 실무적인 어조를 유지한다.

## change_grade 분류 기준
- "auto_candidate": 숫자·금액·시행일·법령 명칭·조문 번호 이동처럼 해석 여지가 거의 없는 기계적 변경.
- "admin_review": 법령 개정으로 룰의 문구나 판정 기준을 다시 써야 하지만, 법리 해석까지는 필요 없는 변경.
- "expert_review": 통상임금, 연장근로 산정, 징계·해고, 근로자성, 취업규칙 불이익 변경, 판례·행정해석처럼 법적 해석이 필요한 변경. 조문 변경의 의미가 모호하면 이 등급으로 올려라.

## auto_apply_recommended
- change_grade가 "auto_candidate"이고 수정이 명백할 때만 true. 그 외에는 false.
- true여도 시스템은 자동 반영하지 않고 관리자 승인을 거친다. 이 필드는 관리자에게 주는 신뢰도 신호일 뿐이다.

출력은 반드시 지정된 JSON 스키마를 따른다. 마크다운 코드펜스 없이 JSON만 출력한다.`

export const PROPOSAL_RESPONSE_FORMAT = {
  type: 'json_schema',
  json_schema: {
    name: 'rulepack_update_proposal',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        rule_id: { type: 'string' },
        change_grade: { type: 'string', enum: ['auto_candidate', 'admin_review', 'expert_review'] },
        impact_summary: { type: 'string' },
        diff_explanation: { type: 'string' },
        proposed_rule: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            zone: { type: 'string' },
            title: { type: 'string' },
            applies_if: { type: 'string' },
            detect: { type: 'string' },
            logic: { type: 'string' },
            basis: { type: 'string' },
            risk: { type: 'string' },
            advice: { type: 'string' },
            verify_by_operator: { type: 'boolean' },
          },
          required: ['id', 'zone', 'title', 'applies_if', 'detect', 'logic', 'basis', 'risk', 'advice', 'verify_by_operator'],
          additionalProperties: false,
        },
        auto_apply_recommended: { type: 'boolean' },
        requires_expert_review_reason: { type: 'string' },
      },
      required: ['rule_id', 'change_grade', 'impact_summary', 'diff_explanation', 'proposed_rule', 'auto_apply_recommended', 'requires_expert_review_reason'],
      additionalProperties: false,
    },
  },
}

function buildProposalUserMessage(rule, changedSources) {
  // 룰에서 legal_sources는 제외하고 넘긴다(메타데이터라 AI 판단에 불필요).
  const { legal_sources, ...ruleForAI } = rule

  const changesText = changedSources
    .map((c, i) => {
      return `[변경 ${i + 1}] ${c.law_name ?? ''} ${c.article ?? ''}
- 기존 원문:
${c.old_text ?? '(저장된 기존 원문 없음 — 신 원문만 참고)'}
- 최신 원문(law.go.kr):
${c.new_text ?? '(없음)'}`
    })
    .join('\n\n')

  return `[현재 룰 (id=${rule.id})]
${JSON.stringify(ruleForAI, null, 2)}

[감지된 조문 변경 (신·구 비교)]
${changesText}

위 변경을 반영해 이 룰을 어떻게 수정해야 할지 초안을 스키마에 맞춰 출력하라.`
}

// 한 규칙에 대한 수정안을 생성한다. 실패 시 예외를 던진다.
export async function generateRuleUpdateProposal(rule, changedSources) {
  const openai = new OpenAI()
  const completion = await openai.chat.completions.create({
    model: PROPOSAL_MODEL,
    max_completion_tokens: PROPOSAL_MAX_TOKENS,
    response_format: PROPOSAL_RESPONSE_FORMAT,
    messages: [
      { role: 'system', content: PROPOSAL_SYSTEM_PROMPT },
      { role: 'user', content: buildProposalUserMessage(rule, changedSources) },
    ],
  })

  const content = completion.choices?.[0]?.message?.content
  const finishReason = completion.choices?.[0]?.finish_reason
  if (finishReason === 'length') {
    throw new Error(`수정안 응답이 최대 길이(${PROPOSAL_MAX_TOKENS} 토큰) 제한으로 잘렸습니다.`)
  }
  if (!content) {
    throw new Error('AI 수정안 응답이 비어 있습니다.')
  }
  return JSON.parse(content)
}
