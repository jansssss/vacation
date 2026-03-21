"""
Supabase REST API로 guides + guide_sections 테이블에 발행
- service role key 사용 (RLS 우회)
"""
from __future__ import annotations

import json
from urllib import request
from urllib.error import HTTPError

from .writer import Guide


class SupabasePublisher:
    def __init__(self, supabase_url: str, service_role_key: str) -> None:
        self.base_url = supabase_url.rstrip("/")
        self._headers = {
            "apikey": service_role_key,
            "Authorization": f"Bearer {service_role_key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }

    def fetch_published_topics(self, limit: int = 60) -> list[str]:
        """최근 발행된 가이드 제목 목록 반환 (중복 주제 회피용)"""
        url = f"{self.base_url}/rest/v1/guides?select=title&order=created_at.desc&limit={limit}"
        req = request.Request(url, headers=self._headers)
        try:
            with request.urlopen(req, timeout=10) as resp:
                rows = json.loads(resp.read().decode("utf-8"))
                return [row["title"] for row in rows]
        except Exception:
            return []

    def _slug_is_unique(self, slug: str) -> bool:
        url = f"{self.base_url}/rest/v1/guides?slug=eq.{slug}&select=id&limit=1"
        req = request.Request(url, headers=self._headers)
        with request.urlopen(req, timeout=10) as resp:
            rows = json.loads(resp.read().decode("utf-8"))
            return len(rows) == 0

    def _unique_slug(self, base_slug: str) -> str:
        slug = base_slug
        suffix = 1
        while not self._slug_is_unique(slug):
            slug = f"{base_slug}-{suffix}"
            suffix += 1
        return slug

    def publish(self, guide: Guide) -> dict:
        """
        guides 테이블에 insert 후 guide_sections 삽입
        Returns: { id, slug }
        """
        slug = self._unique_slug(guide.slug)

        # 1. guides 테이블 insert
        guide_row = {
            "slug": slug,
            "title": guide.title,
            "summary": guide.summary,
            "keywords": guide.keywords,
        }
        raw_body = json.dumps(guide_row).encode("utf-8")
        req = request.Request(
            f"{self.base_url}/rest/v1/guides",
            data=raw_body,
            headers=self._headers,
            method="POST",
        )
        try:
            with request.urlopen(req, timeout=15) as resp:
                result = json.loads(resp.read().decode("utf-8"))
                guide_record = result[0] if isinstance(result, list) else result
                guide_id = guide_record["id"]
        except HTTPError as e:
            body = e.read().decode("utf-8")
            raise RuntimeError(f"guides insert 실패 ({e.code}): {body}") from e

        # 2. guide_sections 테이블 bulk insert
        sections_rows = [
            {
                "guide_id": guide_id,
                "html_content": section.html_content,
                "order_index": idx + 1,
            }
            for idx, section in enumerate(guide.sections)
        ]
        raw_body = json.dumps(sections_rows).encode("utf-8")
        req = request.Request(
            f"{self.base_url}/rest/v1/guide_sections",
            data=raw_body,
            headers={**self._headers, "Prefer": "return=minimal"},
            method="POST",
        )
        try:
            with request.urlopen(req, timeout=15) as resp:
                resp.read()
        except HTTPError as e:
            body = e.read().decode("utf-8")
            raise RuntimeError(f"guide_sections insert 실패 ({e.code}): {body}") from e

        return {"id": guide_id, "slug": slug}
