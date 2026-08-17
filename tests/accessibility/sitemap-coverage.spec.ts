import { expect, test } from "@playwright/test";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { crawlSitemaps, PRIMARY_SITEMAP } from "../support/seo-site-contract";

/**
 * Enforces that public page routes (src/routes/*.tsx) are present in the
 * live sitemap.xml. Keeps sitemap in sync as routes are added.
 */
const ROUTES_DIR = path.resolve("src/routes");

// Route file basenames that are public pages but shouldn't appear (dynamic slugs,
// auth callbacks, layout-only files, private/auth-required pages).
const EXCLUDED = new Set<string>([
  "__root.tsx",
  "unsubscribe.tsx",
  "newsletter.confirm.tsx",
  "research.$slug.tsx", // dynamic — covered by sitemap-research generator
  "auth.tsx", // authenticated entry point; explicitly noindex
  // Compatibility aliases intentionally redirect to canonical solution routes.
  "solutions.ai-integrations.tsx",
  "solutions.ai-product-engineering.tsx",
  "solutions.ai-websites-lead-systems.tsx",
  "solutions.applied-ai-systems.tsx",
  "solutions.governance-optimization.tsx",
]);

function fileToPath(name: string): string | null {
  if (EXCLUDED.has(name)) return null;
  if (!name.endsWith(".tsx")) return null;
  if (name.startsWith("_") || name.includes("$")) return null;
  const base = name.replace(/\.tsx$/, "");
  if (base === "index") return "/";
  const segments = base.split(".").map((s) => (s === "index" ? "" : s));
  return "/" + segments.filter(Boolean).join("/");
}

test("sitemap.xml includes every public page route in src/routes/", async ({
  baseURL,
  request,
}) => {
  const files = await readdir(ROUTES_DIR);
  const expected = files.map(fileToPath).filter((p): p is string => Boolean(p));

  const inventory = await crawlSitemaps(request, baseURL!, PRIMARY_SITEMAP);
  const locs = inventory.pageUrls.map((loc) => new URL(loc).pathname.replace(/\/$/, "") || "/");
  const locSet = new Set(locs);

  const missing = expected.filter((p) => !locSet.has(p));
  expect(missing, `sitemap missing routes: ${missing.join(", ")}`).toEqual([]);
});

test("robots.txt Sitemap: directive points at a reachable sitemap", async ({
  baseURL,
  request,
}) => {
  const robots = await request.get(`${baseURL}/robots.txt`);
  const body = await robots.text();
  const matches = [...body.matchAll(/^Sitemap:\s*(\S+)\s*$/gim)];
  expect(matches, "robots.txt must include exactly one Sitemap directive").toHaveLength(1);
  const sitemapPath = new URL(matches[0][1]).pathname;
  const r = await request.get(`${baseURL}${sitemapPath}`);
  expect(r.status()).toBe(200);
});
