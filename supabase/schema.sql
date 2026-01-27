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
-- Comments for documentation
-- ================================
COMMENT ON TABLE guides IS '가이드 메타데이터 (제목, 요약, 키워드 등)';
COMMENT ON TABLE guide_sections IS '가이드의 각 섹션 (heading, content, bullets 등)';
COMMENT ON TABLE board_posts IS '게시판 글 (공지사항 등)';
