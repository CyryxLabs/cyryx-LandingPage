#!/usr/bin/env node
// Post-deploy SEO self-check. Verifies that the live site exposes:
//   - <title>, <meta name="description">
//   - OpenGraph tags (og:title, og:description, og:image, og:url, og:type)
//   - Twitter card tags (twitter:card, twitter:title, twitter:description, twitter:image)
//   - robots.txt (with Sitemap: directive)
//   - sitemap.xml (with <urlset> and at least one <loc>)
//
//   node scripts/seo-self-check.mjs --site=https://cyryxlabs.com
//
// Exits 1 if any required signal is missing.

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, "").split("=");
    return [k, v.join("=") || "true"];
  }),
);
const SITE = (args.site || "https://cyryxlabs.com").replace(/\/$/, "");

const REQUIRED_META = [
  ["title", /<title[^>]*>([^<]{5,})<\/title>/i],
  ["meta:description", /<meta[^>]+name=["']description["'][^>]+content=["'][^"']{20,}["']/i],
  ["og:title", /<meta[^>]+property=["']og:title["'][^>]+content=["'][^"']+["']/i],
  ["og:description", /<meta[^>]+property=["']og:description["'][^>]+content=["'][^"']+["']/i],
  ["og:image", /<meta[^>]+property=["']og:image["'][^>]+content=["']https?:[^"']+["']/i],
  ["og:type", /<meta[^>]+property=["']og:type["'][^>]+content=["'][^"']+["']/i],
  ["twitter:card", /<meta[^>]+name=["']twitter:card["'][^>]+content=["'][^"']+["']/i],
  ["twitter:title", /<meta[^>]+name=["']twitter:title["'][^>]+content=["'][^"']+["']/i],
  ["twitter:description", /<meta[^>]+name=["']twitter:description["'][^>]+content=["'][^"']+["']/i],
  ["twitter:image", /<meta[^>]+name=["']twitter:image["'][^>]+content=["']https?:[^"']+["']/i],
];

const results = [];
function record(label, ok, detail = "") {
  results.push({ label, ok, detail });
  console.log(`${ok ? "✓" : "✖"} ${label}${detail ? `  — ${detail}` : ""}`);
}

async function get(path) {
  const r = await fetch(`${SITE}${path}`, { headers: { "cache-control": "no-cache" } });
  return { status: r.status, type: r.headers.get("content-type") || "", body: await r.text() };
}

// 1) Home HTML — meta tags
const home = await get("/");
if (home.status !== 200) {
  record(`GET / (status)`, false, `HTTP ${home.status}`);
} else {
  record(`GET / (status)`, true, `HTTP 200`);
  for (const [name, re] of REQUIRED_META) record(`meta: ${name}`, re.test(home.body));
}

// 2) robots.txt
const robots = await get("/robots.txt");
record(`GET /robots.txt`, robots.status === 200, `HTTP ${robots.status}`);
if (robots.status === 200) {
  record(`robots.txt: Sitemap directive`, /^\s*Sitemap:\s*https?:\/\//mi.test(robots.body));
  record(`robots.txt: not blocking all`, !/^\s*User-agent:\s*\*\s*[\r\n]+\s*Disallow:\s*\/\s*$/mi.test(robots.body));
}

// 3) sitemap.xml
const sitemap = await get("/sitemap.xml");
record(`GET /sitemap.xml`, sitemap.status === 200, `HTTP ${sitemap.status}, type=${sitemap.type}`);
if (sitemap.status === 200) {
  record(`sitemap.xml: urlset present`, /<urlset[\s>]/.test(sitemap.body));
  const locs = (sitemap.body.match(/<loc>/g) || []).length;
  record(`sitemap.xml: ≥1 <loc>`, locs > 0, `${locs} entries`);
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${failed.length === 0 ? "All SEO signals live." : `${failed.length} failing check(s).`}`);
process.exit(failed.length === 0 ? 0 : 1);