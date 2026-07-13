import { expect, test } from "@playwright/test";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

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
  "products.lyra.tsx", // 301 redirect to /lyra — canonical page is lyra.tsx
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

test("sitemap.xml includes every public page route in src/routes/", async ({ baseURL, request }) => {
  const files = await readdir(ROUTES_DIR);
  const expected = files
    .map(fileToPath)
    .filter((p): p is string => Boolean(p));

  const res = await request.get(`${baseURL}/sitemap.xml`);
  expect(res.status()).toBe(200);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
    new URL(m[1].trim()).pathname.replace(/\/$/, "") || "/",
  );
  const locSet = new Set(locs);

  const missing = expected.filter((p) => !locSet.has(p));
  expect(missing, `sitemap missing routes: ${missing.join(", ")}`).toEqual([]);
});

test("robots.txt Sitemap: directive points at a reachable sitemap", async ({ baseURL, request }) => {
  const robots = await request.get(`${baseURL}/robots.txt`);
  const body = await robots.text();
  const match = body.match(/Sitemap:\s*(\S+)/i);
  expect(match, "robots.txt must include Sitemap: directive").toBeTruthy();
  const sitemapPath = new URL(match![1]).pathname;
  const r = await request.get(`${baseURL}${sitemapPath}`);
  expect(r.status()).toBe(200);
});
