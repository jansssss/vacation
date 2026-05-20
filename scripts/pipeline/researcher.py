"""
Tavily Search + OpenAI로 오늘의 한국 노무/근로 인기 이슈 조사
- Tavily로 실시간 검색 → OpenAI로 JSON 포맷
"""
from __future__ import annotations

import json
from urllib import request
from urllib.error import HTTPError
from datetime import date


class TavilyResearcher:
    TAVILY_URL = "https://api.tavily.com/search"
    OPENAI_URL = "https://api.openai.com/v1/chat/completions"

    def __init__(self, tavily_api_key: str, openai_api_key: str, openai_model: str = "gpt-4o-mini") -> None:
        self.tavily_api_key = tavily_api_key
        self.openai_api_key = openai_api_key
        self.openai_model = openai_model

    def _tavily_search(self, query: str) -> dict:
        payload = {
            "api_key": self.tavily_api_key,
            "query": query,
            "search_depth": "basic",
            "include_answer": True,
            "max_results": 5,
        }
        raw_body = json.dumps(payload).encode("utf-8")
        req = request.Request(
            self.TAVILY_URL,
            data=raw_body,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with request.urlopen(req, timeout=60) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except HTTPError as e:
            body = e.read().decode("utf-8")
            raise RuntimeError(f"Tavily HTTP {e.code}: {body}") from e

    def research_today(
        self,
        published_topics: list[str] | None = None,
        seed_query: str | None = None,
    ) -> dict:
        """
        노무/근로 이슈 리서치.
        seed_query가 있으면 해당 독자 질문에 답하는 방향으로 리서치.
        없으면 Tavily로 오늘의 이슈를 자유 선정.

        Returns: { topic, category, background, key_data, impact_on_workers, related_keywords }
        """
        today = date.today().strftime("%Y년 %m월 %d일")

        exclude_block = ""
        if published_topics:
            titles = "\n".join(f"- {t}" for t in published_topics)
            exclude_block = (
                "\n\n【이미 발행된 주제 - 반드시 제외】\n"
                f"{titles}\n"
                "위 주제와 동일하거나 매우 유사한 주제는 선택하지 마세요."
            )

        # Step 1: Tavily 리서치 (seed_query가 있으면 해당 질문으로 검색)
        if seed_query:
            tavily_query = f"{seed_query} 근로기준법 고용노동부 판례"
            print(f"[RESEARCHER] GSC 시드 쿼리 사용: '{seed_query}'", flush=True)
        else:
            tavily_query = f"대한민국 노무 근로 최신 이슈 뉴스 {today}"
            print("[RESEARCHER] Tavily 자유 선정 모드", flush=True)

        search_results = self._tavily_search(tavily_query)
        answer = search_results.get("answer", "")
        snippets = "\n".join(
            f"- [{r['title']}]({r['url']}): {r['content'][:300]}"
            for r in search_results.get("results", [])
        )
        context = f"[검색 요약]\n{answer}\n\n[주요 기사]\n{snippets}"

        # Step 2: OpenAI로 JSON 포맷
        if seed_query:
            task_instruction = (
                f"실제 독자가 구글에서 검색한 질문입니다: \"{seed_query}\"\n\n"
                "이 질문에 제대로 된 답변을 제공하는 가이드를 작성하기 위한 리서치를 수행하세요. "
                "독자가 이 질문을 검색한 상황과 맥락을 먼저 파악하고, "
                "그들이 실제로 알고 싶은 것(결론과 판단 기준)을 중심으로 리서치하세요.\n\n"
                f"[참고 자료]\n{context}\n\n"
            )
        else:
            task_instruction = (
                f"오늘({today}) 아래 검색 결과를 바탕으로 노무·근로 이슈를 1개 선정하세요.\n\n"
                f"[검색 결과]\n{context}\n\n"
            )

        payload = {
            "model": self.openai_model,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "당신은 대한민국 노무/근로 전문 리서처입니다. "
                        "주어진 검색 결과를 분석하여 정확한 JSON 형식으로 응답합니다. "
                        "연차, 퇴직금, 최저임금, 근로계약, 육아휴직, 해고, 임금체불, 4대보험 등 실무 이슈를 다룹니다."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        task_instruction
                        + "아래 형식의 JSON으로만 응답하세요. JSON 외 다른 텍스트는 출력하지 마세요.\n\n"
                        "{\n"
                        '  "topic": "이슈 제목 (한국어, 50자 이내)",\n'
                        '  "category": "연차 | 퇴직금 | 최저임금 | 근로계약 | 육아휴직 | 해고 | 임금 | 4대보험 | 노무일반 중 1개",\n'
                        '  "background": "이슈 배경 설명 (200자 이상, 관련 법령 포함)",\n'
                        '  "key_data": [\n'
                        '    {"fact": "구체적 수치나 법 규정", "source": "출처 기관명 또는 법령명, 연도"},\n'
                        '    ...\n'
                        '  ],\n'
                        '  "impact_on_workers": "근로자/인사담당자에게 미치는 실질적 영향 (200자 이상)",\n'
                        '  "related_keywords": ["키워드1", "키워드2", "키워드3"]\n'
                        "}\n\n"
                        "요구사항:\n"
                        "- key_data는 최소 3개 이상 (수치 또는 법 조항 필수)\n"
                        "- 고용노동부, 근로기준법, 대법원 판례 등 국내 기준 우선\n"
                        "- 추측이나 불확실한 내용 금지"
                        + exclude_block
                    ),
                },
            ],
            "max_completion_tokens": 2000,
            "temperature": 0.2,
        }

        raw_body = json.dumps(payload).encode("utf-8")
        req = request.Request(
            self.OPENAI_URL,
            data=raw_body,
            headers={
                "Authorization": f"Bearer {self.openai_api_key}",
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
            raise RuntimeError(f"OpenAI HTTP {e.code}: {body}") from e
