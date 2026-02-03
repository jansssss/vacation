-- Step 3: Drop old columns (ONLY RUN AFTER VERIFYING DATA MIGRATION)
-- CAUTION: This is irreversible. Make sure to backup your data first.

-- Drop the old columns
ALTER TABLE guide_sections
DROP COLUMN heading,
DROP COLUMN content,
DROP COLUMN bullets,
DROP COLUMN content2;

-- Verify final structure
-- \d guide_sections
