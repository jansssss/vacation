"""
Perplexity sonar-pro로 오늘의 한국 노무/근로 인기 이슈 조사
- 1회 호출로 주제 선정 + 핵심 데이터 수집
"""
from __future__ import annotations

import json
from urllib import request
from urllib.error import HTTPError
from datetime import date


class PerplexityResearcher:
    API_URL = "https://api.perplexity.ai/chat/completions"

    def __init__(self, api_key: str) -> None:
        self.api_key = api_key

    def research_today(self) -> dict:
        """
        오늘의 노무/근로 인기 이슈 1개 선정 + 심층 리서치
        Returns: { topic, category, background, key_data, impact_on_workers, related_keywords }
        """
        today = date.today().strftime("%Y년 %m월 %d일")
        payload = {
            "model": "sonar-pro",
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "당신은 대한민국 노무/근로 전문 리서처입니다. "
                        "오늘 네이버·구글에서 가장 화제가 되는 노무·근로 이슈를 파악하고, "
                        "해당 주제에 대한 심층 데이터를 수집합니다. "
                        "연차, 퇴직금, 최저임금, 근로계약, 육아휴직, 해고, 임금체불, 4대보험 등 실무 이슈를 다룹니다. "
                        "모든 수치는 실제 출처(기관명+연도+법령명)와 함께 제공합니다."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        f"오늘({today}) 대한민국에서 가장 화제가 되는 노무·근로 이슈를 1개 선정하고, "
                        "아래 형식의 JSON으로만 응답하세요. JSON 외 다른 텍스트는 출력하지 마세요.\n\n"
                        "{\n"
                        '  "topic": "이슈 제목 (한국어, 50자 이내)",\n'
                        '  "category": "연차 | 퇴직금 | 최저임금 | 근로계약 | 육아휴직 | 해고 | 임금 | 4대보험 | 노무일반 중 1개",\n'
                        '  "background": "이슈 배경 설명 (200자 이상, 왜 지금 화제인지, 관련 법령 포함)",\n'
                        '  "key_data": [\n'
                        '    {"fact": "구체적 수치나 법 규정", "source": "출처 기관명 또는 법령명, 연도"},\n'
                        '    ...\n'
                        '  ],\n'
                        '  "impact_on_workers": "근로자/인사담당자에게 미치는 실질적 영향 (200자 이상)",\n'
                        '  "related_keywords": ["키워드1", "키워드2", "키워드3"]\n'
                        "}\n\n"
                        "요구사항:\n"
                        "- key_data는 최소 5개 이상 (수치 또는 법 조항 필수)\n"
                        "- 고용노동부, 근로기준법, 대법원 판례 등 국내 기준 우선\n"
                        "- 추측이나 불확실한 내용 금지"
                    ),
                },
            ],
            "max_tokens": 2000,
            "temperature": 0.2,
        }

        raw_body = json.dumps(payload).encode("utf-8")
        req = request.Request(
            self.API_URL,
            data=raw_body,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                content = data["choices"][0]["message"]["content"].strip()
                if content.startswith("```"):
                    content = content.split("```")[1]
                    if content.startswith("json"):
                        content = content[4:]
                return json.loads(content.strip())
        except HTTPError as e:
            body = e.read().decode("utf-8")
            raise RuntimeError(f"Perplexity HTTP {e.code}: {body}") from e
