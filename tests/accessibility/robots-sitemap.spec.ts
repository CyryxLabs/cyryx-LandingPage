import { expect, test } from "@playwright/test";
import { crawlSitemaps, PRIMARY_ORIGIN, PRIMARY_SITEMAP } from "../support/seo-site-contract";

const REQUIRED_BOTS = [
  "*",
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "GPTBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
];

const RETRIEVAL_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
];
const PROTECTED_PATHS = ["/api/", "/_serverFn/", "/workspace", "/auth", "/lovable/"];

test("robots.txt: served, allows required bots, references sitemap", async ({
  baseURL,
  request,
}) => {
  const res = await request.get(`${baseURL}/robots.txt`);
  expect(res.status(), "robots.txt must return 200").toBe(200);
  const body = await res.text();

  for (const bot of REQUIRED_BOTS) {
    const re = new RegExp(`^User-agent:\\s*${bot.replace(/[*]/g, "\\*")}\\s*$`, "mi");
    expect(re.test(body), `robots.txt missing User-agent block for ${bot}`).toBe(true);
  }

  expect(body).not.toMatch(/^User-agent:\s*Claude-Web\s*$/im);

  for (const bot of RETRIEVAL_BOTS) {
    const start = body.search(new RegExp(`^User-agent:\\s*${bot}\\s*$`, "mi"));
    const remainder = body.slice(start);
    const next = remainder.slice(1).search(/^User-agent:/im);
    const block = next >= 0 ? remainder.slice(0, next + 1) : remainder;
    for (const path of PROTECTED_PATHS) {
      expect(block, `${bot} must exclude ${path}`).toContain(`Disallow: ${path}`);
    }
  }

  // Required directives
  expect(/\bAllow:\s*\//i.test(body), "robots.txt must Allow:/").toBe(true);
  const sitemapDirectives = [...body.matchAll(/^Sitemap:\s*(\S+)\s*$/gim)].map((match) => match[1]);
  expect(sitemapDirectives, "robots.txt must submit one canonical sitemap").toEqual([
    PRIMARY_SITEMAP,
  ]);

  // Must not block everyone
  expect(
    /^User-agent:\s*\*\s*$\s*Disallow:\s*\/\s*$/im.test(body),
    "robots.txt blocks all crawlers",
  ).toBe(false);
});

test("sitemap index: canonical shards are disjoint and every URL returns direct 200", async ({
  baseURL,
  request,
}) => {
  const inventory = await crawlSitemaps(request, baseURL!, PRIMARY_SITEMAP);
  expect(inventory.sitemapUrls.length).toBeGreaterThan(1);
  expect(inventory.pageUrls.length).toBeGreaterThan(0);

  for (const [loc, sources] of inventory.memberships) {
    expect(new URL(loc).origin, `${loc}: non-canonical host`).toBe(PRIMARY_ORIGIN);
    expect(sources, `${loc}: duplicate sitemap membership`).toHaveLength(1);
    const path = new URL(loc).pathname;
    const response = await request.get(`${baseURL}${path}`, { maxRedirects: 0 });
    expect(response.status(), `${path}: expected direct 200`).toBe(200);
  }
});
