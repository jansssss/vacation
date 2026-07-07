-- Migration: rulepack_versions 테이블 + labor_diagnosis_requests 버전 추적 컬럼
-- Generated: 2026-07-07
-- 목적: 룰팩(lib/diagnosis/rulepack_v1.json)을 코드 하드코딩 대신 DB 버전 테이블로 이관.
--       고객 진단은 여전히 인터넷 검색 없이 '승인된 활성 버전'만 사용하며,
--       룰팩 갱신은 코드 재배포 없이 DB row 승인만으로 반영된다.

-- ================================
-- 1. rulepack_versions 테이블
-- ================================
CREATE TABLE rulepack_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version_label TEXT NOT NULL UNIQUE,        -- '1.1', '1.2' ...
  status TEXT NOT NULL DEFAULT 'draft',      -- draft | pending_approval | approved | rejected | archived
  is_active BOOLEAN NOT NULL DEFAULT false,  -- 고객 진단에 실제 사용되는 단 하나의 버전
  content JSONB NOT NULL,                    -- rulepack_v1.json과 동일 구조 (meta + rules)
  change_summary TEXT,
  based_on_version_id UUID REFERENCES rulepack_versions(id),
  created_by UUID,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 활성(is_active=true) 버전은 항상 하나만 존재하도록 강제
CREATE UNIQUE INDEX idx_one_active_rulepack ON rulepack_versions (is_active) WHERE is_active;
CREATE INDEX idx_rulepack_versions_status ON rulepack_versions(status);

ALTER TABLE rulepack_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view rulepack versions"
  ON rulepack_versions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert rulepack versions"
  ON rulepack_versions FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update rulepack versions"
  ON rulepack_versions FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ================================
-- 2. labor_diagnosis_requests: 진단 시점 룰팩 버전 기록
-- ================================
ALTER TABLE labor_diagnosis_requests
  ADD COLUMN rulepack_version_id UUID REFERENCES rulepack_versions(id);

-- ================================
-- 3. 시드 데이터: 현재 lib/diagnosis/rulepack_v1.json(v1.1)을 최초 승인된 활성 버전으로 등록
-- ================================
INSERT INTO rulepack_versions (version_label, status, is_active, content, change_summary, approved_at)
VALUES (
  '1.1',
  'approved',
  true,
  $rulepack${
  "meta": {
    "version": "1.1",
    "basis_date": "2026-07-06",
    "note": "verify_by_operator=true 항목은 공개 전 운영자(인사 전문가)가 법령·수치를 최종 확인할 것. 룰팩은 법 개정 시 버전업하며, 이 버전 이력이 구독 서비스(정기 재진단)의 근거가 된다.",
    "zones": {
      "RED": "위반 시 벌금·과태료 등 제재 직결",
      "YELLOW": "분쟁 발생 시 회사가 패소하거나 부담이 커지는 취약점",
      "BLUE": "2025~2026 법 개정으로 새로 반영해야 하는 사항"
    }
  },
  "rules": [
    {
      "id": "R01",
      "zone": "RED",
      "title": "취업규칙 신고 의무 (10인 이상)",
      "applies_if": "상시근로자 10인 이상",
      "detect": "문서 표지·부칙에서 제정/개정일, 신고 이력 언급 확인. 신청 폼의 '최종 개정연도'와 대조",
      "logic": "10인 이상 사업장이 취업규칙을 작성·신고하지 않았거나, 최종 개정이 2024년 이전이면(이후 다수 법 개정 존재) 미개정 리스크로 판정",
      "basis": "근로기준법 제93조(작성·신고 의무), 제116조(과태료)",
      "risk": "미신고·미작성 시 500만원 이하 과태료. 근로감독 시 1순위 점검 항목",
      "advice": "최신 법령 기준으로 취업규칙을 개정하고 근로자 과반수 의견 청취(불이익 변경 시 동의) 절차를 거쳐 관할 고용노동청에 신고",
      "verify_by_operator": false
    },
    {
      "id": "R02",
      "zone": "RED",
      "title": "2026년 최저임금 미달 여부",
      "applies_if": "전체",
      "detect": "임금 조항·임금표·임금명세서에서 기본급, 정기상여금, 복리후생비 항목과 금액",
      "logic": "산입범위(정기상여금·복리후생비 전액 산입) 기준으로 시급 환산액이 10,320원(월 209시간 기준 2,156,880원) 미만인지 판정. 임금표가 없으면 '확인 불가 — 임금대장 점검 권고'로 출력",
      "basis": "최저임금법, 2026년 적용 최저임금 시급 10,320원 (2026.1.1. 시행)",
      "risk": "최저임금 미달 지급 시 3년 이하 징역 또는 2천만원 이하 벌금, 차액 소급 지급",
      "advice": "2026년 임금테이블 기준 전 직급 최저임금 위반 여부 재점검, 특히 수습·단시간 근로자",
      "verify_by_operator": false
    },
    {
      "id": "R03",
      "zone": "RED",
      "title": "통상임금 재산정 (2024 전원합의체 판결 반영)",
      "applies_if": "전체",
      "detect": "임금 조항에서 '재직자에 한해 지급', '지급일 현재 재직 중인 자', '○개월 근무 시 지급' 등 조건부 문구가 붙은 상여금·수당, 그리고 통상임금 정의 조항",
      "logic": "재직조건·근무일수 조건이 붙은 정기 상여금/수당을 통상임금에서 제외하는 규정이 있으면 위반 소지 판정. 2024년 대법원 전원합의체 판결로 이러한 조건부 임금도 정기성·일률성이 있으면 통상임금에 포함되는 방향으로 기준 변경",
      "basis": "대법원 2024.12.19. 선고 2020다247190, 2023다302838 전원합의체 판결 — '고정성' 요건 폐기, 소정근로대가성·정기성·일률성 3요소로 통상임금 판단. 판결 선고일(2024.12.19.) 이후 산정분부터 적용",
      "risk": "연장·야간·휴일수당, 연차수당, 퇴직금이 과소 산정되어 임금체불 성립 — 2025~2026 강화된 체불 제재와 결합 시 최대 리스크 항목",
      "advice": "재직조건부·근무일수조건부 상여금·수당도 소정근로대가성·정기성·일률성을 갖추면 통상임금에 포함해 재산정하고, 이를 기초로 각종 법정수당 지급 기준을 취업규칙·임금규정에 반영",
      "verify_by_operator": false
    },
    {
      "id": "R04",
      "zone": "RED",
      "title": "임금명세서 교부 및 필수 기재사항",
      "applies_if": "전체",
      "detect": "임금명세서 샘플(제출 시): 임금 구성항목, 항목별 금액, 계산방법(연장·야간·휴일수당의 시간수 및 산식), 공제내역 기재 여부. 미제출 시 취업규칙 내 임금명세서 교부 조항 유무",
      "logic": "계산방법(특히 시간외수당 산출 근거) 누락이 가장 흔한 위반 — 항목별로 체크",
      "basis": "근로기준법 제48조 제2항(2021.11.19. 시행)",
      "risk": "미교부·기재사항 누락 시 근로자 1인당·건당 과태료(최대 500만원 이하) — 인원×월수로 누적되는 구조",
      "advice": "임금명세서에 산출식을 자동 기재하는 급여 시스템 도입 또는 서식 교체",
      "verify_by_operator": false
    },
    {
      "id": "R05",
      "zone": "RED",
      "title": "근로계약서 필수 기재사항·교부",
      "applies_if": "전체",
      "detect": "근로계약서 양식(제출 시): 임금 구성·계산·지급방법, 소정근로시간, 휴일, 연차유급휴가 명시 여부 + 교부 조항",
      "logic": "필수 기재사항 5요소 체크리스트 방식으로 판정. 기간제·단시간 근로자는 추가 기재사항(계약기간, 근로일별 근로시간 등) 확인",
      "basis": "근로기준법 제17조, 기간제법 제17조",
      "risk": "미작성·미교부 시 500만원 이하 벌금(기간제·단시간은 즉시 과태료). 분쟁 시 회사 주장 입증 곤란",
      "advice": "표준 근로계약서 양식을 2026년 기준으로 갱신하고 전자 교부 체계 마련",
      "verify_by_operator": false
    },
    {
      "id": "R06",
      "zone": "RED",
      "title": "임금 지급 원칙 및 강화된 체불 제재 대응",
      "applies_if": "전체",
      "detect": "임금 지급일 조항, 지급 지연·분할 지급 관련 규정, 퇴직 시 금품청산(14일) 조항",
      "logic": "지급일이 불명확하거나 '회사 사정에 따라 지급일 변경 가능' 류의 조항이 있으면 위험 판정",
      "basis": "근로기준법 제37조 개정(2024.10.22. 공포, 2025.10.23. 시행) 및 시행령 제17조 — 재직 근로자 체불에도 연 20% 지연이자 적용. 제43조의8(2025.10.23. 시행) — 고의적 체불 등 요건 충족 시 최대 3배 징벌적 손해배상 청구 가능",
      "risk": "체불 시 지연이자 연 20%가 재직자에게도 적용, 고의·반복 체불은 징벌적 손해배상(최대 3배) 및 상습체불 사업주 제재 강화",
      "advice": "임금 지급일·산정기간을 명확히 규정하고, 통상임금 재산정(R03)과 연계해 잠재 체불액 존재 여부 점검",
      "verify_by_operator": false
    },
    {
      "id": "R07",
      "zone": "YELLOW",
      "title": "포괄임금제 약정의 유효성",
      "applies_if": "전체",
      "detect": "'포괄임금', '연장근로수당 포함', '제수당 포함' 문구, 고정OT 시간 명시 여부",
      "logic": "포괄임금 조항이 있는데 ①포함된 수당의 종류·시간수·금액이 특정되지 않았거나 ②근로시간 산정이 어렵지 않은 직무(사무직 등)에 일괄 적용이면 무효 리스크 판정",
      "basis": "대법원 판례 법리(근로시간 산정이 어려운 경우 등 엄격 요건). 고용노동부 포괄임금 오남용 기획감독 기조 지속",
      "risk": "약정 무효 시 실근로시간 기준 수당 차액 전액 소급 지급 — 대규모 우발채무",
      "advice": "고정OT 시간·금액을 특정하는 방식으로 전환하거나 실근로시간 기록 체계 도입",
      "verify_by_operator": false
    },
    {
      "id": "R08",
      "zone": "YELLOW",
      "title": "연차휴가 사용촉진 절차의 적법성",
      "applies_if": "전체",
      "detect": "연차 조항: 사용촉진 절차(시기·서면통보·근로자 지정·회사 지정) 규정 여부, '미사용 연차는 소멸한다' 류의 조항",
      "logic": "법정 절차(6개월 전 서면 촉구 → 근로자 미지정 시 2개월 전 회사 지정) 없이 '소멸' 만 규정했으면 무효 판정 — 연차수당 지급 의무 존속",
      "basis": "근로기준법 제61조",
      "risk": "촉진 절차 하자 시 미사용 연차수당 3년치 소급 청구 가능",
      "advice": "촉진 절차를 취업규칙에 명문화하고 서면(전자문서 포함) 통보 증빙 체계 마련",
      "verify_by_operator": false
    },
    {
      "id": "R09",
      "zone": "YELLOW",
      "title": "직장 내 괴롭힘 예방·조치 규정",
      "applies_if": "상시근로자 10인 이상(취업규칙 필수기재)",
      "detect": "괴롭힘의 예방·발생 시 조치 조항(신고 절차, 조사, 피해자 보호, 가해자 징계, 비밀유지)",
      "logic": "조항 자체가 없으면 필수기재사항 누락 판정, 있어도 신고→조사→조치 절차가 비어 있으면 부실 판정",
      "basis": "근로기준법 제76조의2·3, 제93조 제11호",
      "risk": "취업규칙 필수기재 누락 시 과태료, 사건 발생 시 조치의무 위반(과태료) 및 손해배상 책임",
      "advice": "신고 채널·조사 절차·불이익 금지를 포함한 표준 조항 신설",
      "verify_by_operator": false
    },
    {
      "id": "R10",
      "zone": "YELLOW",
      "title": "3.3% 위촉·프리랜서 계약의 근로자성 리스크",
      "applies_if": "프리랜서·위촉직 사용 기업",
      "detect": "취업규칙 적용범위 조항, 신청 폼 업종·고용형태 정보. 문서에서 '위촉', '프리랜서', '업무위탁' 언급",
      "logic": "지휘감독·고정 출퇴근·전속성이 있는 인력을 3.3% 사업소득 계약으로 운영 중이면 고위험 고지 (문서만으로 확정 불가 — 자가점검 질문 형태로 출력)",
      "basis": "2026 고용노동부 업무보고: 가짜 3.3 계약에 대한 국세청 과세정보 연계 기획감독 확대, '노동자 추정제' 입법 추진",
      "risk": "근로자성 인정 시 4대보험·퇴직금·수당 소급, 기획감독 적발 시 일괄 시정",
      "advice": "위촉 인력의 실질 판단 체크리스트로 자가진단 후 고위험군은 계약 형태 전환 검토",
      "verify_by_operator": false
    },
    {
      "id": "R11",
      "zone": "YELLOW",
      "title": "상시근로자 수 경계 (5인/10인/30인) 의무 점검",
      "applies_if": "전체",
      "detect": "신청 폼의 근로자 수 구간 + 문서상 규모 단서",
      "logic": "구간 경계(5인, 10인, 30인, 50인) 부근이면 해당 경계 통과 시 발생하는 의무 목록을 출력 (예: 5인→연장·야간·휴일 가산수당, 연차, 해고제한 / 10인→취업규칙 신고 / 30인→노사협의회·휴게시설 등)",
      "basis": "근로기준법 시행령 제7조의2(상시근로자 수 산정)",
      "risk": "경계 통과 미인지로 인한 일괄 위반이 중소기업 분쟁의 최다 패턴",
      "advice": "월별 연인원 기준 상시근로자 수를 정기 산정하고 경계 통과 시 의무 체크리스트 가동",
      "verify_by_operator": false
    },
    {
      "id": "R12",
      "zone": "BLUE",
      "title": "'노동절' 명칭 변경 반영 (2026.5.1.)",
      "applies_if": "전체",
      "detect": "'근로자의 날' 문구 검색",
      "logic": "'근로자의 날' 표기가 남아 있으면 용어 정비 대상 판정 (유급휴일 성격은 동일)",
      "basis": "관련 법률 개정(2025.11.11.)으로 2026.5.1.부터 명칭 '노동절'로 변경",
      "risk": "직접 제재는 없으나 규정 전반의 최신성 신호 — 감독·분쟁 시 '방치된 규정' 인상",
      "advice": "사규 전반의 용어 일괄 정비(개정 이력에 포함)",
      "verify_by_operator": false
    },
    {
      "id": "R13a",
      "zone": "BLUE",
      "title": "육아휴직 개정사항 반영",
      "applies_if": "전체",
      "detect": "육아휴직 조항에서 대상 자녀 연령, 기간 규정",
      "logic": "육아휴직 조항이 '만 8세 이하 또는 초등학교 2학년 이하'가 아니면(예: 구법 '생후 1년 미만') 위반 판정. 기간은 원칙 1년, 부모 각 3개월 이상 사용/한부모/중증장애아동 부모는 6개월 추가(최대 1년6개월, 2025.2.23. 시행)",
      "basis": "남녀고용평등과 일·가정 양립 지원에 관한 법률 제19조 (근로기준법 아님). 2024.10.22. 개정, 2025.2.23. 시행",
      "risk": "육아휴직 미허용 시 500만원 이하 벌금",
      "advice": "육아휴직(제19조, 만8세/초2) 조항의 기간·요건을 최신화",
      "verify_by_operator": false
    },
    {
      "id": "R13b",
      "zone": "BLUE",
      "title": "육아기 근로시간 단축 개정사항 반영",
      "applies_if": "전체",
      "detect": "육아기 근로시간 단축 조항에서 대상 자녀 연령, 기간 규정",
      "logic": "육아기 근로시간 단축 조항이 없거나 '만 8세 이하'로만 되어 있으면 미반영 판정 — 2025.2.23. 개정으로 대상이 '만 12세 이하 또는 초등학교 6학년 이하'로 확대됨. 육아휴직(R13a)과 법적 근거·연령 기준이 다르므로 절대 혼용하지 말 것",
      "basis": "남녀고용평등과 일·가정 양립 지원에 관한 법률 제19조의2. 2024.10.22. 개정, 2025.2.23. 시행",
      "risk": "육아기 근로시간 단축 대상 연령 미반영 시 신청 거부·분쟁 소지",
      "advice": "육아기 근로시간 단축(제19조의2, 만12세/초6)을 별도 조항으로 명확히 신설·구분",
      "verify_by_operator": false
    },
    {
      "id": "R14",
      "zone": "BLUE",
      "title": "노란봉투법 시행(2026.3.10.)에 따른 도급·협력 관계 점검",
      "applies_if": "하청·협력업체 또는 플랫폼/특고 인력 사용 기업",
      "detect": "신청 폼 업종 + 문서상 도급·파견·협력업체 관련 조항",
      "logic": "해당 기업이면 원청의 사용자성 확대, 노조 가입 범위 확대(플랫폼·특고 포함), 쟁의 손배 제한의 3대 변화 요약을 안내형으로 출력 (규정 위반 판정이 아닌 리스크 브리핑)",
      "basis": "노동조합법 제2조·제3조 개정, 2026.3.10. 시행",
      "risk": "원·하청 관계에서 단체교섭 요구 상대방이 될 가능성, 쟁의 대응 방식 변화",
      "advice": "협력업체 인력 운영 실태 점검 및 커뮤니케이션 기록 체계 정비",
      "verify_by_operator": false
    },
    {
      "id": "R15",
      "zone": "BLUE",
      "title": "2026년 4대보험 요율·기준 변경 반영",
      "applies_if": "전체",
      "detect": "취업규칙·임금 조항의 공제 항목, 임금명세서의 보험료 공제율. 2026년 확정 요율: 국민연금 9.5%(근로자 4.75%), 건강보험 7.19%(근로자 3.595%), 장기요양보험 건강보험료의 13.14%, 고용보험 실업급여요율 총 1.8%(근로자 0.9%), 산재보험은 업종별(사업주 100% 부담). 국민연금 기준소득월액 상한 637만원·하한 40만원(2025.7.1.~2026.6.30. 적용)",
      "logic": "임금명세서 샘플이 있으면 공제액을 위 신요율로 역산해 구요율(2025년 이전 국민연금 9%, 건강보험 7.09% 등) 사용 여부를 탐지. 명세서가 없으면 '확인 불가 — 최신 요율 반영 여부 점검 권고'로 출력",
      "basis": "2026년 국민연금·건강보험·장기요양보험 요율 고시. 고용보험·산재보험은 전년 수준 유지",
      "risk": "구요율 공제 시 정산 차액 발생, 실수령액 변동 미고지로 인한 불만·문의 폭증",
      "advice": "2026년 1월 급여분부터 신요율(국민연금 9.5%, 건강보험 7.19%, 장기요양 13.14%) 적용 확인 및 직원 사전 안내문 발송",
      "verify_by_operator": false
    }
  ]
}$rulepack$::jsonb,
  '기존 lib/diagnosis/rulepack_v1.json 파일 내용을 DB 버전 관리로 최초 이관',
  NOW()
);

COMMENT ON TABLE rulepack_versions IS '노무진단 룰팩의 버전별 스냅샷. is_active=true인 단 하나의 row가 고객 진단에 사용됨.';
