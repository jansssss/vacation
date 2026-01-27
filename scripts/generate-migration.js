/**
 * 기존 JS 데이터를 Supabase SQL INSERT 문으로 변환하는 스크립트
 */

const fs = require('fs');
const path = require('path');

// 데이터 import
const { guidesRegistry } = require('../src/config/guidesRegistry');
const { boardPosts } = require('../src/content/boardPosts');

// SQL escape helper
function escapeSql(str) {
  if (!str) return 'NULL';
  return `'${str.replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
}

function escapeJson(obj) {
  if (!obj) return 'NULL';
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'`;
}

// Generate SQL
let sql = `-- ================================
-- Data Migration SQL
-- Generated: ${new Date().toISOString()}
-- ================================

-- Disable triggers temporarily for bulk insert
SET session_replication_role = 'replica';

`;

// ================================
// Migrate Guides
// ================================
sql += `\n-- ================================\n`;
sql += `-- Guides Data\n`;
sql += `-- ================================\n\n`;

guidesRegistry.forEach((guide, guideIndex) => {
  const guideId = `guide-${guideIndex + 1}`;

  sql += `-- Guide: ${guide.title}\n`;
  sql += `INSERT INTO guides (id, slug, title, summary, keywords, updated_at)\n`;
  sql += `VALUES (\n`;
  sql += `  '${guideId}',\n`;
  sql += `  ${escapeSql(guide.slug)},\n`;
  sql += `  ${escapeSql(guide.title)},\n`;
  sql += `  ${escapeSql(guide.summary)},\n`;
  sql += `  ${escapeSql(guide.keywords || null)},\n`;
  sql += `  '${guide.updatedAt || '2026-01-25'}'\n`;
  sql += `);\n\n`;

  // Insert sections
  if (guide.sections && guide.sections.length > 0) {
    guide.sections.forEach((section, sectionIndex) => {
      sql += `INSERT INTO guide_sections (guide_id, heading, content, bullets, content2, order_index)\n`;
      sql += `VALUES (\n`;
      sql += `  '${guideId}',\n`;
      sql += `  ${escapeSql(section.heading)},\n`;
      sql += `  ${escapeSql(section.content)},\n`;
      sql += `  ${section.bullets ? escapeJson(section.bullets) : 'NULL'},\n`;
      sql += `  ${escapeSql(section.content2)},\n`;
      sql += `  ${sectionIndex + 1}\n`;
      sql += `);\n\n`;
    });
  }
});

// ================================
// Migrate Board Posts
// ================================
sql += `\n-- ================================\n`;
sql += `-- Board Posts Data\n`;
sql += `-- ================================\n\n`;

boardPosts.forEach((post, postIndex) => {
  sql += `-- Board Post: ${post.title}\n`;
  sql += `INSERT INTO board_posts (id, slug, title, author, summary, content, created_at)\n`;
  sql += `VALUES (\n`;
  sql += `  'post-${postIndex + 1}',\n`;
  sql += `  ${escapeSql(post.slug)},\n`;
  sql += `  ${escapeSql(post.title)},\n`;
  sql += `  ${escapeSql(post.author)},\n`;
  sql += `  ${escapeSql(post.summary)},\n`;
  sql += `  ${escapeSql(post.content)},\n`;
  sql += `  '${post.createdAt}'\n`;
  sql += `);\n\n`;
});

// Re-enable triggers
sql += `\n-- Re-enable triggers\n`;
sql += `SET session_replication_role = 'origin';\n`;

// Write to file
const outputPath = path.join(__dirname, '../supabase/migration-data.sql');
fs.writeFileSync(outputPath, sql, 'utf8');

console.log('✅ Migration SQL generated successfully!');
console.log(`📁 File: ${outputPath}`);
console.log(`📊 Guides: ${guidesRegistry.length}`);
console.log(`📊 Board Posts: ${boardPosts.length}`);
