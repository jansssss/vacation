-- ================================
-- e-work.kr Database Schema
-- ================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ================================
-- 1. Guides 테이블 (가이드 메타데이터)
-- ================================
CREATE TABLE guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  keywords TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_guides_slug ON guides(slug);
CREATE INDEX idx_guides_updated_at ON guides(updated_at DESC);

-- ================================
-- 2. Guide Sections 테이블 (가이드 섹션)
-- ================================
CREATE TABLE guide_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  guide_id UUID NOT NULL REFERENCES guides(id) ON DELETE CASCADE,
  heading TEXT NOT NULL,
  content TEXT,
  bullets JSONB, -- Array of strings
  content2 TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_guide_sections_guide_id ON guide_sections(guide_id);
CREATE INDEX idx_guide_sections_order ON guide_sections(guide_id, order_index);

-- ================================
-- 3. Board Posts 테이블 (게시판 글)
-- ================================
CREATE TABLE board_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_board_posts_slug ON board_posts(slug);
CREATE INDEX idx_board_posts_created_at ON board_posts(created_at DESC);

-- ================================
-- Row Level Security (RLS) Policies
-- ================================

-- Enable RLS
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_posts ENABLE ROW LEVEL SECURITY;

-- Public can read all content
CREATE POLICY "Anyone can view guides"
  ON guides FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view guide sections"
  ON guide_sections FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view board posts"
  ON board_posts FOR SELECT
  USING (true);

-- Only authenticated admin can insert/update/delete
CREATE POLICY "Authenticated users can insert guides"
  ON guides FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update guides"
  ON guides FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete guides"
  ON guides FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert guide sections"
  ON guide_sections FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update guide sections"
  ON guide_sections FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete guide sections"
  ON guide_sections FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert board posts"
  ON board_posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update board posts"
  ON board_posts FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete board posts"
  ON board_posts FOR DELETE
  USING (auth.role() = 'authenticated');

-- ================================
-- Helper Functions
-- ================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for guides
CREATE TRIGGER update_guides_updated_at
  BEFORE UPDATE ON guides
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for board_posts
CREATE TRIGGER update_board_posts_updated_at
  BEFORE UPDATE ON board_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- 4. Consultation Requests 테이블 (무료 상담 신청)
-- ================================
CREATE TABLE consultation_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  inquiry_type TEXT,
  content TEXT,
  source_slug TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- 'new' | 'checked'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_consultation_requests_created_at ON consultation_requests(created_at DESC);
CREATE INDEX idx_consultation_requests_status ON consultation_requests(status);

-- Enable RLS
ALTER TABLE consultation_requests ENABLE ROW LEVEL SECURITY;

-- 비회원도 INSERT 가능 (상담 신청)
CREATE POLICY "Anyone can submit consultation request"
  ON consultation_requests FOR INSERT
  WITH CHECK (true);

-- 인증된 관리자만 조회/수정 가능
CREATE POLICY "Authenticated users can view consultation requests"
  ON consultation_requests FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update consultation requests"
  ON consultation_requests FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ================================
-- 5. Labor Diagnosis Requests 테이블 (기업 노무진단 접수)
-- ================================
CREATE TABLE labor_diagnosis_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  employee_band TEXT NOT NULL, -- '5인 미만' | '5~29인' | '30~49인' | '50~299인' | '300인 이상'
  industry TEXT,
  last_revision_year INTEGER,
  file_paths JSONB NOT NULL DEFAULT '[]', -- [{ "path": "bank/...", "original_filename": "취업규칙.pdf" }]
  status TEXT NOT NULL DEFAULT 'received', -- 'received' | 'extract_failed' | 'analyzed' | 'sent'
  extracted_text JSONB, -- { "<path>": "<extracted text>", ... } 문서별 추출 텍스트
  diagnosis_result JSONB, -- diagnosis_prompt.md 스키마를 따르는 구조화된 진단 결과
  report_html TEXT, -- 관리자가 편집 가능한 리포트 초안 HTML
  sent_at TIMESTAMP WITH TIME ZONE,
  files_deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_labor_diagnosis_requests_created_at ON labor_diagnosis_requests(created_at DESC);
CREATE INDEX idx_labor_diagnosis_requests_status ON labor_diagnosis_requests(status);

ALTER TABLE labor_diagnosis_requests ENABLE ROW LEVEL SECURITY;

-- 비회원도 INSERT 가능 (진단 접수)
CREATE POLICY "Anyone can submit labor diagnosis request"
  ON labor_diagnosis_requests FOR INSERT
  WITH CHECK (true);

-- 인증된 관리자만 조회/수정 가능
CREATE POLICY "Authenticated users can view labor diagnosis requests"
  ON labor_diagnosis_requests FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update labor diagnosis requests"
  ON labor_diagnosis_requests FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ================================
-- 6. Storage RLS — 'bank' 버킷 (노무진단 첨부 PDF)
-- ================================
-- 버킷 자체(Public 여부, 20MB 제한, application/pdf 전용 MIME 제한)는
-- Supabase 대시보드에서 이미 생성/설정되어 있다고 가정한다.
-- 아래 정책 없이는 어떤 역할도 이 버킷에 접근할 수 없다 (기본값: 전체 차단).

-- 익명 사용자는 'bank' 버킷에 INSERT(업로드)만 가능 — 조회/수정/삭제 불가
CREATE POLICY "Anyone can upload to bank bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'bank');

-- 인증된 관리자만 'bank' 버킷 파일을 조회(서명된 URL 발급 포함) 가능
CREATE POLICY "Authenticated users can view bank bucket files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'bank' AND auth.role() = 'authenticated');

-- ================================
-- 7. Rulepack Versions 테이블 (노무진단 룰팩 버전 관리)
-- ================================
-- 상세 마이그레이션(시드 데이터 포함)은 supabase/migration-rulepack-versions.sql 참고.
CREATE TABLE rulepack_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  version_label TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'archived'
  is_active BOOLEAN NOT NULL DEFAULT false, -- 고객 진단에 실제 사용되는 단 하나의 버전
  content JSONB NOT NULL, -- rulepack_v1.json과 동일 구조 (meta + rules)
  change_summary TEXT,
  based_on_version_id UUID REFERENCES rulepack_versions(id),
  created_by UUID,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- labor_diagnosis_requests: 진단 시점에 적용된 룰팩 버전 기록 (과거 진단 재현용)
ALTER TABLE labor_diagnosis_requests
  ADD COLUMN rulepack_version_id UUID REFERENCES rulepack_versions(id);

-- ================================
-- Comments for documentation
-- ================================
COMMENT ON TABLE guides IS '가이드 메타데이터 (제목, 요약, 키워드 등)';
COMMENT ON TABLE guide_sections IS '가이드의 각 섹션 (heading, content, bullets 등)';
COMMENT ON TABLE board_posts IS '게시판 글 (공지사항 등)';
COMMENT ON TABLE consultation_requests IS '무료 노무·인사 상담 신청 내역';
COMMENT ON TABLE labor_diagnosis_requests IS '기업 노무진단 접수 및 분석/발송 상태';
COMMENT ON TABLE rulepack_versions IS '노무진단 룰팩의 버전별 스냅샷. is_active=true인 단 하나의 row가 고객 진단에 사용됨.';
