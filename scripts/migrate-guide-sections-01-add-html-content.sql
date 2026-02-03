-- Step 1: Add new html_content column to guide_sections table
ALTER TABLE guide_sections
ADD COLUMN html_content TEXT;

-- Add comment
COMMENT ON COLUMN guide_sections.html_content IS 'Unified HTML content for the section (replaces heading, content, bullets, content2)';
