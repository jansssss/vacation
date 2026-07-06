# 노무진단 AI 프롬프트 설계 (v1)

`app/api/diagnose/route.js`가 이 문서의 스키마와 시스템 프롬프트를 그대로 구현한다. 실제 런타임 상수는
`lib/diagnosis/prompt.js`에 있으며, 이 문서와 항상 동기화되어야 한다. `lib/diagnosis/rulepack_v1.json`이
체크리스트 원본이다.

## API 호출 파라미터

- 제공자: OpenAI (기존 콘텐츠 파이프라인에서 쓰는 `OPENAI_API_KEY` 재사용)
- 모델: `gpt-5.4`
- `response_format: { type: "json_schema", json_schema: { name: "labor_diagnosis_response", strict: true, schema: DIAGNOSIS_OUTPUT_SCHEMA } }` (`DIAGNOSIS_RESPONSE_FORMAT`으로 export)
- `max_completion_tokens: 16000`
- 스트리밍 사용 (`openai.chat.completions.create({ stream: true, ... })`로 청크를 모아 최종 JSON 문자열 조립), Vercel 함수 타임아웃 회피 목적

## 시스템 프롬프트

```
당신은 한국 노무 전문가를 보조하는 취업규칙 진단 도우미입니다.
입력으로 (1) 회사 프로필, (2) 아래 rulepack의 체크리스트, (3) 업로드된 취업규칙 문서에서 추출한 텍스트가 주어집니다.

원칙:
- rulepack의 각 체크 항목마다 문서 내 실제 근거를 찾아 판단하세요. 근거를 찾을 수 없으면 추측하지 말고 status를 "unable_to_determine" 또는 "not_found"로 표시하세요.
- 문서에 없는 내용을 있다고 서술하지 마세요.
- applies_to가 특정 employee_band로 제한된 항목은 회사 프로필의 employee_band와 비교해 해당하지 않으면 status를 "not_applicable"로 표시하세요.
- 이것은 법률 자문이 아니라 1차 점검 결과이며, 최종 판단은 노무사 확인이 필요하다는 점을 summary와 report_html에 명시하세요.
- report_html은 관리자가 검수 후 고객에게 발송할 리포트 초안입니다. 담백하고 실무적인 어조로 작성하고, 과장하거나 불안을 조장하는 표현은 피하세요.
- 출력은 반드시 지정된 JSON 스키마를 따르세요.
```

## 사용자 메시지 조립

```
[회사 프로필]
- 회사명: {company_name}
- 업종: {industry}
- 상시근로자 규모: {employee_band}
- 취업규칙 최종 개정연도: {last_revision_year}

[진단 체크리스트 (rulepack v1)]
{rulepack_v1.json 전체를 JSON 문자열로 삽입}

[업로드된 문서에서 추출한 텍스트]
--- 문서: {original_filename} ---
{extracted_text}
(문서가 여러 개인 경우 문서별로 반복)
```

`extract_failed` 상태의 문서(스캔본 등으로 텍스트 추출 실패)는 관리자가 어드민 화면에서 수동으로 붙여넣은
텍스트가 있으면 그 텍스트를 사용하고, 없으면 "본 문서는 텍스트 추출에 실패했습니다"라는 안내를 포함해
모델이 해당 문서 분량만큼 판단 근거 부족으로 처리하게 한다.

## 출력 JSON 스키마 (`DIAGNOSIS_OUTPUT_SCHEMA`)

최상위 응답은 `diagnosis_result`와 `report_html` 두 필드로 구성되며, 서버 코드는 이를 각각
`labor_diagnosis_requests.diagnosis_result` (jsonb)와 `labor_diagnosis_requests.report_html` (text)
컬럼에 그대로 저장한다.

```json
{
  "type": "object",
  "properties": {
    "diagnosis_result": {
      "type": "object",
      "properties": {
        "overall_risk_level": { "type": "string", "enum": ["low", "medium", "high"] },
        "summary": { "type": "string" },
        "findings": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "rule_id": { "type": "string" },
              "category": { "type": "string" },
              "title": { "type": "string" },
              "status": {
                "type": "string",
                "enum": ["compliant", "partially_compliant", "non_compliant", "not_applicable", "unable_to_determine"]
              },
              "severity": { "type": "string", "enum": ["high", "medium", "low", "none"] },
              "evidence": { "type": "string" },
              "recommendation": { "type": "string" }
            },
            "required": ["rule_id", "category", "title", "status", "severity", "evidence", "recommendation"],
            "additionalProperties": false
          }
        },
        "recommended_next_steps": {
          "type": "array",
          "items": { "type": "string" }
        }
      },
      "required": ["overall_risk_level", "summary", "findings", "recommended_next_steps"],
      "additionalProperties": false
    },
    "report_html": { "type": "string" }
  },
  "required": ["diagnosis_result", "report_html"],
  "additionalProperties": false
}
```

## 스캔본(추출 실패) 처리

`app/api/diagnose/route.js`는 PDF 텍스트 추출 단계에서 문서별로 (추출 글자 수 ÷ PDF 페이지 수)가
페이지당 50자 미만이면 해당 문서를 스캔본으로 간주하고 `extract_failed` 처리한다. 요청에 포함된 모든
문서가 `extract_failed`면 AI 호출을 하지 않고 상태만 `extract_failed`로 남긴다. 일부 문서만
실패한 경우, 성공한 문서만으로 진단을 진행하고 실패한 문서는 위 안내 문구로 대체한다. 관리자가 수동
텍스트를 붙여넣은 뒤 재실행하면 그 텍스트가 우선 사용된다.
