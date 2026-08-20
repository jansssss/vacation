# e-work GSC 개선 루틴

Google Search Console 유입 데이터를 읽어 **유저가 원했는데 못 얻고 간 것을 콘텐츠·구조로 채우고**,
그 변경이 **법령 정확성·코딩 품질·사이트 디자인에 맞는지 검사**한 뒤, **결과를 알림으로 통지**하는 자동 루틴이다.

커밋·푸시는 하지 않는다. 작업 트리에 변경만 남고, **검토 후 커밋·푸시는 사용자가 직접** 한다.

---

## 구성

| 단계 | 주체 | 산출물 |
|---|---|---|
| 1. 리포트 생성 | `scripts/analytics/gsc_daily_insight.py` | `reports/gsc/latest.json` · `latest.md` |
| 2. 개선 코드 반영 | `gsc-strategist` 에이전트 | 작업 트리 변경 + `reports/gsc/agent-<날짜>.md` |
| 3. 러너 자체 검증 | `run-gsc-cycle.ps1` | 보호경로·변경규모·`npm run build` |
| 4. 실효성·품질·디자인 리뷰 | `gsc-change-reviewer` 에이전트 | `reports/gsc/review-<날짜>.md` (PASS/FIX_REQUIRED/REJECT) |
| 5. 알림 | `gsc-report-notifier` 에이전트 + `scripts/notify-gsc.mjs` | `reports/gsc/notify-<날짜>.md` + 데스크톱/웹훅 알림 |

에이전트 정의는 `.claude/agents/` 에 있다.

### 회차 산출물 등급

이 루틴은 리포트를 요약하는 것이 목적이 아니다. 매 회차 아래 중 하나 이상을 실제로 만든다.

| 등급 | 산출물 |
|---|---|
| A | **콘텐츠 신설** — 새 질문 페이지(`app/questions/<slug>/page.js` + 레지스트리 등록) |
| B | **구조 변경** — 질문 사슬·클러스터·계산기 연결·내부링크 동선 |
| C | **콘텐츠 심화** — 기존 페이지에 섹션·표·FAQ 추가 |
| D | metadata 손질 — **순위 10위 이내인데 CTR만 미달일 때만** |

근거 약한 D-only 회차, 지난 회차와 같은 처방 반복, 얇은 신규 콘텐츠는 리뷰에서 `FIX_REQUIRED`.

### 판정에 따른 동작

| 판정 | 러너 동작 |
|---|---|
| `PASS` | 변경을 그대로 남기고 알림 (커밋 대기) |
| `FIX_REQUIRED` | 수정 지시를 물려 전략 에이전트를 **1회 더** 실행 → 재검증 → 재리뷰 |
| `REJECT` | 이 회차 변경을 **전부 되돌리고** 사유와 함께 알림 (exit 3) |
| 러너 검증 실패 | 보호 경로 침범 / 변경 8개 초과 / 빌드 실패 → **되돌림** (exit 2) |

통과한 변경은 `reports/gsc/patches/<날짜>.patch` 로도 남는다.

---

## 색인 이탈 진단 모드

최근 구간 노출이 **0**이면 리포트 생성기가 자동으로 구간을 **180일로 확대**해 재조회하고,
리포트에 `fallback_used: true` 와 🚨 배너를 남긴다.

이때 전략 에이전트는 콘텐츠를 늘리기 전에 **왜 노출 자체가 사라졌는지**를 코드에서 먼저 점검한다 —
`robots` · 페이지 `metadata` 의 `noindex` · `canonical` · 사이트맵 포함 여부 · 빌드 산출 라우트.
코드로 고칠 수 있는 원인은 고치고, 코드 밖 원인(도메인·DNS·수동 조치·색인 요청)은 보고만 한다.

> 2026-08 기준 e-work.kr 은 최근 90일 노출이 2회, 180일 기준 536회다. 즉 지금은 이 진단 모드가 기본 경로다.

---

## 최초 설정 (1회)

### 1. 파이썬 의존성

```powershell
pip install -r scripts\analytics\requirements.txt
```

### 2. GSC 자격증명

`scripts/credentials/` 에 `client_secret.json` 과 `token.json` 이 있어야 한다 (`.gitignore` 대상).
토큰이 없으면 **사람이 직접 한 번** 아래를 실행한다 — 브라우저 동의 화면이 뜬다.
(스케줄러가 처음 이걸 만나면 창을 못 띄우고 멈춘다.)

```powershell
python -m scripts.analytics.gsc_daily_insight --days 14
```

속성·경로는 `.env.local` 에서 읽는다.

```
GSC_SITE_URL=sc-domain:e-work.kr
GSC_CLIENT_SECRET_PATH=...    # 선택
GSC_TOKEN_PATH=...            # 선택
GSC_NOTIFY_WEBHOOK=https://hooks.slack.com/...   # 선택 — Slack/Discord 호환
```

### 3. claude 실행 파일

러너가 자동 탐색한다(PATH → VSCode 확장 번들). 못 찾으면 `CLAUDE_BIN` 환경변수로 지정한다.

---

## 사용법

```powershell
# 리포트만 생성해서 동작 확인 (에이전트 실행 안 함)
powershell -ExecutionPolicy Bypass -File scripts\schedule\run-gsc-cycle.ps1 -SkipAgent

# 코드는 안 고치고 분석·계획만
powershell -ExecutionPolicy Bypass -File scripts\schedule\run-gsc-cycle.ps1 -DryRun

# 전체 루틴 1회 실행
powershell -ExecutionPolicy Bypass -File scripts\schedule\run-gsc-cycle.ps1

# 스케줄 등록 — 매주 월요일 11:00
powershell -ExecutionPolicy Bypass -File scripts\schedule\register-gsc-cycle.ps1

# 등록된 작업 지금 실행 / 등록 해제
powershell -ExecutionPolicy Bypass -File scripts\schedule\register-gsc-cycle.ps1 -RunNow
powershell -ExecutionPolicy Bypass -File scripts\schedule\register-gsc-cycle.ps1 -Unregister
```

주요 옵션: `-Days <N>` · `-SkipReview`(권장 안 함) · `-SkipNotify`.
로그는 `reports/gsc/logs/run-<날짜>.log`.

---

## 왜 주 1회 11:00 인가

- **주 1회**: 리포트가 누적 구간(기본 14일)을 보므로 매일 돌리면 대부분 같은 데이터를 다시 본다.
  SEO 변경은 재크롤링·재평가에 며칠~몇 주가 걸린다. 일간 클릭이 두 자리로 올라오면 `-Daily -Days 7` 로 전환한다.
- **11:00**: 같은 PC에서 도는 다른 루틴과 겹치지 않게 배정했다 — **ohyess 09:10 · paytesla 10:00 · e-work 11:00**.
  겹치면 어느 사이트 알림인지 헷갈리고, claude 세션이 겹쳐 빌드가 서로 느려진다.
  `register-gsc-cycle.ps1` 은 등록 시 다른 GSC 작업과 시각이 겹치면 경고한다.
- **놓친 실행은 따라잡지 않는다**: PC가 꺼져 있었다면 그 회차는 건너뛰고 다음 정시를 기다린다.

---

## 안전장치 요약

에이전트 보고를 신뢰하지 않는다. 러너가 독립적으로 다시 검증한다.

- **쓰기 범위 — 콘텐츠·구조는 열고, 법령·로직은 잠근다**
  - 열림: `app/**` · `components/**` · `src/config/questionsRegistry.js` · `guidesRegistry.js` ·
    `contentLinks.js` · `calculatorsRegistry.js` · `app/sitemap.js`
  - 잠김: **`src/config/rules/**`(법정 수치 룰팩)** · `src/config/siteConfig*` · `lib/**`(진단 로직·법령 소스) ·
    `scripts/` · `supabase/` · `contexts/` · `build/` · `.github/` · 빌드 설정 · `app/api|admin/**`
- **법령 게이트**: 근거(`sources`) 없는 법 조항·수치·판례가 새로 등장하면 리뷰가 `REJECT`.
  룰팩 수정도 `REJECT` — 개정 반영은 사용자 담당이고, 에이전트는 제안만 한다.
- **git 차단**: `add` / `commit` / `push` / `checkout` / `reset` 을 도구 레벨에서 막는다.
- **변경 규모 상한**: 8개 파일. 초과하면 전량 되돌림.
- **구조 게이트**: `npm run build`. 이 저장소에는 lint·test 스크립트가 없어 빌드가 유일한 자동 게이트다.
- **실행 전부터 더러웠던 파일은 되돌림 대상에서 제외**된다.

### 알려진 이슈

`scripts/check-question-length.mjs` 는 본문 구간 파싱이 현재 페이지 구조와 어긋나 30개 전부 "파싱 실패"로 나온다
(종료 코드는 0이라 게이트로 쓸 수 없다). 분량 판단은 리뷰 에이전트가 육안 대조로 대신한다.
