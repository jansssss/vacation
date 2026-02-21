import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const siteConfigPath = path.join(root, "src", "config", "siteConfig.json");
const routesPath = path.join(root, "src", "config", "seoRoutes.json");
const publicDir = path.join(root, "public");

const siteConfig = JSON.parse(fs.readFileSync(siteConfigPath, "utf8"));
const routes = JSON.parse(fs.readFileSync(routesPath, "utf8"));

// 빌드 시 오늘 날짜로 자동 업데이트
const today = new Date().toISOString().slice(0, 10);
siteConfig.updatedAt = today;
fs.writeFileSync(siteConfigPath, JSON.stringify(siteConfig, null, 2) + "\n", "utf8");

const lastmod = today;

const sitemapItems = routes
  .map((route) => {
    const changefreq = route.changefreq || "monthly";
    const priority = route.priority ?? 0.6;
    return `  <url>\n    <loc>${siteConfig.baseUrl}${route.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>`;
  })
  .join("\n");

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapItems}\n</urlset>\n`;

const robotsTxt = `User-agent: *\nDisallow:\nSitemap: ${siteConfig.baseUrl}/sitemap.xml\n`;

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXml, "utf8");
fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsTxt, "utf8");

console.log("SEO files generated:", "sitemap.xml", "robots.txt");
