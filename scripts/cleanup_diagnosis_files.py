"""
발송완료(sent) 후 30일이 지난 노무진단 접수 건의 첨부파일(Storage 'bank' 버킷)을 삭제한다.
- Supabase REST API + Storage API를 service role key로 직접 호출한다 (기존 scripts/pipeline/publisher.py 패턴과 동일).
- 삭제 완료 후 해당 건의 files_deleted_at을 채워 재실행 시 중복 삭제를 방지한다.
"""
from __future__ import annotations

import json
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib import request
from urllib.error import HTTPError

RETENTION_DAYS = 30


def _load_dotenv(dotenv_path: Path) -> None:
    if not dotenv_path.exists():
        return
    for raw_line in dotenv_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def _load_env() -> tuple[str, str]:
    project_root = Path(__file__).resolve().parent.parent
    _load_dotenv(project_root / ".env.local")
    _load_dotenv(project_root / ".env")

    supabase_url = os.getenv("SUPABASE_URL")
    service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    if not supabase_url or not service_role_key:
        raise SystemExit("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 환경변수가 필요합니다.")
    return supabase_url.rstrip("/"), service_role_key


def _headers(service_role_key: str) -> dict:
    return {
        "apikey": service_role_key,
        "Authorization": f"Bearer {service_role_key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }


def _fetch_due_requests(base_url: str, headers: dict, cutoff_iso: str) -> list[dict]:
    url = (
        f"{base_url}/rest/v1/labor_diagnosis_requests"
        f"?status=eq.sent&files_deleted_at=is.null&sent_at=lt.{cutoff_iso}"
        f"&select=id,file_paths"
    )
    req = request.Request(url, headers=headers)
    with request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _delete_storage_objects(base_url: str, headers: dict, paths: list[str]) -> None:
    if not paths:
        return
    url = f"{base_url}/storage/v1/object/bank"
    body = json.dumps({"prefixes": paths}).encode("utf-8")
    req = request.Request(url, data=body, headers=headers, method="DELETE")
    with request.urlopen(req, timeout=30) as resp:
        resp.read()


def _mark_files_deleted(base_url: str, headers: dict, request_id: str, deleted_at_iso: str) -> None:
    url = f"{base_url}/rest/v1/labor_diagnosis_requests?id=eq.{request_id}"
    body = json.dumps({"files_deleted_at": deleted_at_iso}).encode("utf-8")
    req = request.Request(url, data=body, headers=headers, method="PATCH")
    with request.urlopen(req, timeout=15) as resp:
        resp.read()


def main() -> None:
    base_url, service_role_key = _load_env()
    headers = _headers(service_role_key)

    cutoff = datetime.now(timezone.utc) - timedelta(days=RETENTION_DAYS)
    cutoff_iso = cutoff.strftime("%Y-%m-%dT%H:%M:%SZ")

    try:
        due_requests = _fetch_due_requests(base_url, headers, cutoff_iso)
    except HTTPError as exc:
        raise SystemExit(f"접수 목록 조회 실패: {exc}") from exc

    print(f"파기 대상 {len(due_requests)}건 (기준일: {cutoff_iso})")

    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    for row in due_requests:
        request_id = row["id"]
        paths = [f["path"] for f in (row.get("file_paths") or []) if f.get("path")]
        try:
            _delete_storage_objects(base_url, headers, paths)
            _mark_files_deleted(base_url, headers, request_id, now_iso)
            print(f"  - {request_id}: 파일 {len(paths)}개 삭제 완료")
        except HTTPError as exc:
            print(f"  - {request_id}: 삭제 실패 ({exc}) — 다음 실행에서 재시도")


if __name__ == "__main__":
    main()
