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
]);

// Pure permanent-redirect routes: legacy solution aliases and discontinued
// product URLs. They must never be listed in the sitemap. Every entry is
// verified below to really be a redirect-only route, so this list cannot hide
// a real page.
const REDIRECT_ONLY = new Set<string>([
  // Compatibility aliases intentionally redirect to canonical solution routes.
  "solutions.ai-integrations.tsx",
  "solutions.ai-product-engineering.tsx",
  "solutions.ai-websites-lead-systems.tsx",
  "solutions.applied-ai-systems.tsx",
  "solutions.governance-optimization.tsx",
  // Discontinued product (Sep 2026): permanently redirected to /products.
  "products.maax-studio.tsx",
]);

/**
 * A route file is a pure redirect when its route only throws a 308 redirect
 * from beforeLoad and renders nothing.
 */
function isPureRedirectRoute(source: string): boolean {
  return (
    /beforeLoad:\s*\(\)\s*=>\s*\{\s*throw\s+redirect\(/.test(source) &&
    /statusCode:\s*308/.test(source) &&
    /component:\s*\(\)\s*=>\s*null/.test(source) &&
    !/\bhead:/.test(source) &&
    !/loader:/.test(source)
  );
}

function fileToPath(name: string): string | null {
  if (EXCLUDED.has(name) || REDIRECT_ONLY.has(name)) return null;
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

test("redirect-only route files are detected, excluded, and absent from the sitemap", async ({
  baseURL,
  request,
}) => {
  const files = (await readdir(ROUTES_DIR)).filter((name) => name.endsWith(".tsx"));
  const detected: string[] = [];
  for (const name of files) {
    const source = await readFile(path.join(ROUTES_DIR, name), "utf8");
    if (isPureRedirectRoute(source)) detected.push(name);
  }
  // The explicit list and the source-level detection must agree exactly, so a
  // new redirect alias is excluded deliberately and a real page never is.
  expect(detected.sort()).toEqual([...REDIRECT_ONLY].sort());

  const inventory = await crawlSitemaps(request, baseURL!, PRIMARY_SITEMAP);
  const locs = new Set(
    inventory.pageUrls.map((loc) => new URL(loc).pathname.replace(/\/$/, "") || "/"),
  );
  for (const name of REDIRECT_ONLY) {
    const routePath =
      "/" +
      name
        .replace(/\.tsx$/, "")
        .split(".")
        .join("/");
    expect(locs.has(routePath), `${routePath} is a redirect and must not be in the sitemap`).toBe(
      false,
    );
    const response = await request.get(`${baseURL}${routePath}`, { maxRedirects: 0 });
    expect(response.status(), `${routePath} must be a permanent redirect`).toBe(308);
  }
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
