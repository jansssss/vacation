-- Migration: rulepack_update_proposals 테이블 (AI 수정안 감사 추적)
-- Generated: 2026-07-07
-- 목적: 룰팩 최신성 점검에서 변경이 감지된 규칙에 대해 AI가 생성한 수정 초안을 원본 그대로
--       저장한다(누가·언제·무엇을 근거로 제안했는지 추적). 승인 시 새 룰팩 버전을 만든다.

CREATE TABLE rulepack_update_proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  base_version_id UUID NOT NULL REFERENCES rulepack_versions(id),
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected' | 'superseded'
  -- 이 제안 묶음에서 가장 높은 검토 등급: auto_candidate | admin_review | expert_review
  overall_grade TEXT,
  -- AI 응답 원본(rule_updates[] 등) 그대로 저장 — 감사/재현용
  ai_response JSONB NOT NULL,
  -- 점검에서 이 제안을 촉발한 변경 요약(rule_id, 조문, 신·구 텍스트 등)
  detected_changes JSONB,
  -- 승인 시 생성된 새 버전
  resulting_version_id UUID REFERENCES rulepack_versions(id),
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rulepack_proposals_status ON rulepack_update_proposals(status);
CREATE INDEX idx_rulepack_proposals_base ON rulepack_update_proposals(base_version_id);

ALTER TABLE rulepack_update_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view rulepack proposals"
  ON rulepack_update_proposals FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert rulepack proposals"
  ON rulepack_update_proposals FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update rulepack proposals"
  ON rulepack_update_proposals FOR UPDATE
  USING (auth.role() = 'authenticated');

COMMENT ON TABLE rulepack_update_proposals IS 'AI가 생성한 룰팩 수정 초안(감사 추적). 승인 시 새 rulepack_versions 버전을 생성한다.';
