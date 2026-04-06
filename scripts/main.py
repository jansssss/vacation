"""
e-work.kr 자동 가이드 발행 파이프라인
Usage:
  python -m scripts.main                    # 오늘 이슈 1개 자동 발행
  python -m scripts.main --count 2          # 오늘 이슈 2개 발행
  python -m scripts.main --dry-run          # Supabase 저장 없이 미리보기
  python -m scripts.main --model gpt-4o-mini  # 모델 직접 지정
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from scripts.pipeline.config import load_config
from scripts.pipeline.researcher import TavilyResearcher
from scripts.pipeline.writer import GuideWriter
from scripts.pipeline.publisher import SupabasePublisher


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="e-work.kr 자동 가이드 발행 파이프라인")
    p.add_argument("--count", type=int, default=None,
                   help="생성할 가이드 수 (기본: 환경변수 GUIDES_PER_RUN 또는 1)")
    p.add_argument("--dry-run", action="store_true",
                   help="Supabase 저장 없이 미리보기만 출력")
    p.add_argument("--model", type=str, default=None,
                   help="OpenAI 모델 지정 (예: gpt-5.4-nano, gpt-4o-mini)")
    return p


def main() -> None:
    args = build_parser().parse_args()
    config = load_config()

    count = args.count or config.guides_per_run
    model = args.model or config.openai_model

    # ── 환경변수 검증 ──────────────────────────────
    missing = []
    if not config.openai_api_key:
        missing.append("OPENAI_API_KEY")
    if not config.tavily_api_key:
        missing.append("TAVILY_API_KEY")
    if not args.dry_run:
        if not config.supabase_url:
            missing.append("SUPABASE_URL")
        if not config.supabase_service_role_key:
            missing.append("SUPABASE_SERVICE_ROLE_KEY")
    if missing:
        print(f"[ERROR] 필수 환경변수 누락: {', '.join(missing)}", flush=True)
        sys.exit(1)

    # ── 파이프라인 초기화 ──────────────────────────
    researcher = TavilyResearcher(config.tavily_api_key, config.openai_api_key, model)
    writer = GuideWriter(
        api_key=config.openai_api_key,
        model=model,
        prompt_path=config.prompt_path,
    )
    publisher = SupabasePublisher(
        supabase_url=config.supabase_url,
        service_role_key=config.supabase_service_role_key,
    ) if not args.dry_run else None

    print(f"[PIPELINE] 모델: {model} | 생성 수: {count}개", flush=True)

    # ── 발행 이력 조회 ───────────────────────────────
    published_topics: list[str] = []
    if publisher:
        print("[PIPELINE] 발행 이력 조회 중...", flush=True)
        published_topics = publisher.fetch_published_topics()
        print(f"[PIPELINE] 기발행 주제 {len(published_topics)}개 로드 완료", flush=True)

    # ── 실행 ────────────────────────────────────────
    for i in range(count):
        print(f"\n{'='*50}", flush=True)
        print(f"[PIPELINE] {i+1}/{count}번째 가이드 생성 시작", flush=True)

        # STEP 1: Tavily 리서치
        print("[STEP 1] Tavily 리서치 중...", flush=True)
        try:
            research = researcher.research_today(published_topics=published_topics)
            print(f"[STEP 1] 완료 - 주제: {research['topic']}", flush=True)
        except Exception as exc:
            print(f"[STEP 1] 실패: {exc}", flush=True)
            sys.exit(1)

        # STEP 2: OpenAI 가이드 작성
        print(f"[STEP 2] OpenAI 가이드 작성 중...", flush=True)
        try:
            guide = writer.write(research)
            print(f"[STEP 2] 완료 - 제목: {guide.title}", flush=True)
        except Exception as exc:
            print(f"[STEP 2] 실패: {exc}", flush=True)
            sys.exit(1)

        # STEP 3: Dry-run이면 출력만
        if args.dry_run:
            print(f"\n[DRY-RUN] slug: {guide.slug}", flush=True)
            print(f"[DRY-RUN] title: {guide.title}", flush=True)
            print(f"[DRY-RUN] summary: {guide.summary}", flush=True)
            print(f"[DRY-RUN] keywords: {guide.keywords}", flush=True)
            for j, section in enumerate(guide.sections, 1):
                print(f"[DRY-RUN] 섹션 {j}: {section.heading}", flush=True)
            published_topics.append(guide.title)
            continue

        # STEP 4: Supabase 발행
        print(f"[STEP 3] Supabase 발행 중...", flush=True)
        try:
            result = publisher.publish(guide)
            print(f"[STEP 3] 발행 완료! slug={result['slug']}", flush=True)
            published_topics.append(guide.title)
        except Exception as exc:
            print(f"[STEP 3] 실패: {exc}", flush=True)
            sys.exit(1)

    print(f"\n[PIPELINE] 전체 완료! {count}개 가이드 생성됨", flush=True)


if __name__ == "__main__":
    main()
