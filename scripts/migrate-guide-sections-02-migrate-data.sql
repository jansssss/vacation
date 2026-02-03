-- Step 2: Migrate existing data from old columns to html_content
-- This converts heading, content, bullets, content2 into a single HTML structure

UPDATE guide_sections
SET html_content = (
  CASE
    WHEN heading IS NOT NULL OR content IS NOT NULL OR bullets IS NOT NULL OR content2 IS NOT NULL THEN
      CONCAT(
        -- Add heading as h2
        CASE
          WHEN heading IS NOT NULL AND heading != '' THEN '<h2>' || heading || '</h2>'
          ELSE ''
        END,

        -- Add content (first paragraph)
        CASE
          WHEN content IS NOT NULL AND content != '' THEN content
          ELSE ''
        END,

        -- Add bullets as unordered list
        CASE
          WHEN bullets IS NOT NULL AND jsonb_array_length(bullets) > 0 THEN
            '<ul>' || (
              SELECT string_agg('<li>' || value::text || '</li>', '')
              FROM jsonb_array_elements_text(bullets)
            ) || '</ul>'
          ELSE ''
        END,

        -- Add content2 (second paragraph)
        CASE
          WHEN content2 IS NOT NULL AND content2 != '' THEN content2
          ELSE ''
        END
      )
    ELSE NULL
  END
)
WHERE html_content IS NULL;

-- Verify migration
-- SELECT id, guide_id,
--        CASE WHEN length(html_content) > 100 THEN substring(html_content, 1, 100) || '...' ELSE html_content END as html_preview
-- FROM guide_sections
-- ORDER BY created_at DESC
-- LIMIT 10;
