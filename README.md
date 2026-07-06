# e-work.kr

근로자와 인사담당자를 위한 노동법 실무 참고 사이트.

## 주요 기능

### 계산기
| 계산기 | 경로 | 설명 |
|---|---|---|
| 연차 계산기 | `/calculators/annual-leave` | 입사일 기준 연차 발생일수·사용 기준 계산 |
| 퇴직금 계산기 | `/calculators/severance-pay` | 평균임금·근속기간 기반 예상 퇴직금 계산 |
| 퇴직연금 운용계산기 | `/calculators/retirement-pension` | 은퇴 시점 적립금·월 수령액·부족분 계산 |
| 실수령액 계산기 | `/calculators/net-salary` | 세전 급여에서 4대보험·세금 반영 실수령액 계산 |

### 가이드
실무에서 자주 묻는 노동법 주제를 콘텐츠로 제공 (Supabase DB 또는 로컬 레지스트리 fallback).

### 게시판
노동법·HR 관련 뉴스 및 공지 게시글.

### 기업 노무진단
| 경로 | 설명 |
|---|---|
| `/labor-check` | 취업규칙 PDF 접수 폼 (Server Action으로 Supabase Storage 업로드 + DB insert) |
| `/admin/labor-check` | 관리자 목록/상세, 텍스트 추출 실패 시 수동 붙여넣기, 분석 실행, 리포트 편집, 발송 |

흐름: 접수(`received`) → 관리자가 "분석 실행"(`app/api/diagnose`, PDF 텍스트 추출 + OpenAI(`gpt-5.4`) 분석) →
`analyzed` (텍스트 추출 완전 실패 시 `extract_failed`) → 관리자가 리포트 편집 후 "발송"(`app/api/send-report`,
Resend) → `sent`. 발송 후 30일이 지난 첨부파일은 `scripts/cleanup_diagnosis_files.py`
(`.github/workflows/cleanup-diagnosis-files.yml`에서 매일 실행)가 Storage에서 자동 삭제한다.

## 환경변수

로컬 개발은 `.env.local`, 배포는 Vercel 프로젝트 설정(Production/Preview)에 아래 값을 등록한다.

| 변수 | 용도 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 브라우저 및 Server Action에서 사용하는 익명 Supabase 클라이언트 (`lib/supabase.js`) |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | 서버 전용 관리자 클라이언트 (`lib/supabaseAdmin.js`), Route Handler와 파기 스크립트에서 RLS를 우회해 사용 |
| `OPENAI_API_KEY` | `app/api/diagnose`의 OpenAI API 호출 (`gpt-5.4`). 기존 콘텐츠 파이프라인(`scripts/`)에서 쓰는 키를 그대로 재사용 |
| `RESEND_API_KEY` | `app/api/send-report`의 이메일 발송. 미설정 시 실제 발송 없이 상태만 `sent`로 변경하는 mock 모드로 동작 |
| `RESEND_FROM_EMAIL` | 발신자 주소 (기본값 `e-work.kr <noreply@e-work.kr>`) |

### Resend 도메인 SPF/DKIM 설정

1. Resend 대시보드 → Domains → `e-work.kr` 도메인 추가.
2. Resend가 안내하는 DNS 레코드를 e-work.kr 도메인의 DNS(가비아 등)에 등록:
   - **SPF**: 기존 TXT 레코드에 `include:amazonses.com`을 추가하거나, 없다면
     `v=spf1 include:amazonses.com ~all` TXT 레코드를 새로 추가.
   - **DKIM**: Resend가 제공하는 3개의 CNAME 레코드(`resend._domainkey` 등)를 그대로 등록.
   - **DMARC**(권장): `_dmarc` TXT에 `v=DMARC1; p=none; rua=mailto:postmaster@e-work.kr` 등록.
3. Resend 대시보드에서 도메인 상태가 "Verified"로 바뀔 때까지 대기 (보통 몇 분~1시간).
4. 발신 주소는 검증된 도메인을 사용하는 주소로 `RESEND_FROM_EMAIL`에 설정 (예: `e-work.kr <noreply@e-work.kr>`).

