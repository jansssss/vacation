# e-work.kr 색인 진단 — 2026-08-20

GSC 상태: **발견됨 – 현재 색인이 생성되지 않음 77개**, 최종 크롤링 "해당사항 없음"(= 한 번도 크롤링되지 않음).
유효성 검사 시작 26.8.18. 사이트맵 기준 99개 URL.

검색 성과: 최근 14일 노출 **0**, 90일 **2**, 180일 **536**(클릭 2). 즉 노출이 붕괴한 상태.

---

## 1. 차단 요인은 없다 (전수 확인)

| 점검 | 결과 |
|---|---|
| 사이트맵 99개 URL 응답 | **전부 200** |
| TTFB | 중앙값 0.52초 · 최대 0.92초 (2초 초과 0개) |
| `robots.txt` | `Disallow:` 비어 있음 + Sitemap 선언 정상 |
| `X-Robots-Tag` / `noindex` | 없음 |
| `http://` → `https://` | 308 정상 |
| `www` → apex | 307 정상 |
| canonical 자기참조 불일치 | 0건 |
| 고아 페이지(인바운드 내부링크 0) | 0건 |
| h1 누락 / 중복 | 0건 |
| description 누락 | 0건 |

즉 **기술적으로 막고 있는 것은 없다.** "발견됐지만 크롤링조차 안 됨"은 차단이 아니라 **크롤링 수요(crawl demand)가 낮다**는 신호다.

## 2. 발견한 실제 결함

### 2-1. 계산기 5개가 완전히 같은 메타데이터 (조치 완료)

`/calculators/{annual-leave, severance-pay, net-salary, retirement-pension, childcare-support}` 5개가
title `e-work.kr | 노무/근로 계산기 허브`, description 까지 **전부 동일**했고 canonical 도 없었다.

원인: 이 페이지들이 `'use client'` 컴포넌트라 `metadata` 를 내보낼 수 없어 루트 레이아웃 기본값을 그대로 상속.
서로 구분되지 않는 페이지 5개는 중복으로 판단돼 색인에서 빠지기 쉽다.

**조치**: 각 라우트에 서버 컴포넌트 `layout.js` 를 추가해 페이지별 title·description·canonical 부여.
빌드 산출물에서 고유 title 과 self-canonical 생성 확인.

### 2-2. canonical 누락 9개 (조치 완료)

홈 · `/guides` · `/calculators` · `/labor-check` · `/contact` · `/privacy` · `/terms` · `/disclaimer` · `/editorial-policy`
→ `alternates.canonical` 추가.

### 2-3. 가이드 17개가 인바운드 내부링크 1개뿐 (미조치)

`/guides` 허브에서만 연결되고 다른 곳에서 링크되지 않는 가이드 —
`unpaid-leave-impact` · `reduced-hours-support-2026` · `childcare-support-faq-2026` · `workload-sharing-support-2026` ·
`parental-leave-pay` · `half-day-leave` · `maternity-leave-pay` · `work-injury-basic` · `severance-pay-mid-settlement` ·
`right-to-disconnect` · `yellow-envelope-act-2026` · `health-insurance-after-quit` · `severance-irp-comparison` ·
`parental-late-start` · `comprehensive-wage-2026-changes` · `unemployment-while-working` · `flexible-work-hours`

허브 한 곳에서만 링크되는 페이지는 크롤링 우선순위가 낮다. 관련 질문 페이지·가이드에서 맥락 링크를 걸어야 한다.

### 2-4. 구조화 데이터 없음 67개 (미조치)

질문 페이지(`/questions/*`)는 `QuestionLayout` 이 Article + FAQPage JSON-LD 를 생성하지만,
가이드 전체와 허브·계산기에는 없다.

### 2-5. 얇은 페이지 7개 (참고)

`/contact` 225자 · `/terms` 361자 · `/disclaimer` 384자 · `/privacy` 396자 ·
`/calculators` 473자 · `/labor-check` 534자 · `/calculators/retirement-pension` 596자
(한글·숫자 기준. 전체 중앙값 975자)

정책 페이지가 얇은 것은 정상이지만, `/calculators` 허브와 `/labor-check` 는 진입 페이지치고 빈약하다.

## 3. 판단

77개가 "크롤링조차 안 된" 근본 이유는 **사이트 신뢰도·크롤링 수요**다. 2-1은 실제 결함이므로 고쳤지만,
이것만으로 색인이 보장되지는 않는다. 남은 레버는 코드 밖에 더 많다.

- 코드로 할 수 있는 것: 중복 메타 제거(완료) · 내부링크 강화(2-3) · 구조화 데이터(2-4) · 얇은 진입 페이지 보강(2-5)
- 코드 밖: GSC 색인 요청(URL 검사 → 색인 생성 요청)을 대표 페이지 몇 개에 직접 넣기, 외부 유입 신호 만들기

주간 루틴(`run-gsc-cycle.ps1`)은 최근 구간 노출이 0이면 180일로 확대 조회하고 색인 이탈 진단 모드로 전환한다.
다음 회차 에이전트는 이 문서를 먼저 읽고 2-3 → 2-4 순으로 처리하면 된다.
