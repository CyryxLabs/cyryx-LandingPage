import { expect, test, request as pwRequest } from "@playwright/test";

const REQUIRED_BOTS = [
  "*",
  "OAI-SearchBot",
  "GPTBot",
  "PerplexityBot",
  "ClaudeBot",
  "Google-Extended",
];

test("robots.txt: served, allows required bots, references sitemap", async ({ baseURL, request }) => {
  const res = await request.get(`${baseURL}/robots.txt`);
  expect(res.status(), "robots.txt must return 200").toBe(200);
  const body = await res.text();

  for (const bot of REQUIRED_BOTS) {
    const re = new RegExp(`^User-agent:\\s*${bot.replace(/[*]/g, "\\*")}\\s*$`, "mi");
    expect(re.test(body), `robots.txt missing User-agent block for ${bot}`).toBe(true);
  }

  // Required directives
  expect(/\bAllow:\s*\//i.test(body), "robots.txt must Allow:/").toBe(true);
  expect(/\bSitemap:\s*https?:\/\/.+\/sitemap\.xml/i.test(body), "robots.txt must reference sitemap.xml").toBe(true);

  // Must not block everyone
  expect(/^User-agent:\s*\*\s*$\s*Disallow:\s*\/\s*$/im.test(body), "robots.txt blocks all crawlers").toBe(false);
});

test("sitemap.xml: served, well-formed, every URL returns 200 (no 3xx/404)", async ({ baseURL, request }) => {
  const res = await request.get(`${baseURL}/sitemap.xml`);
  expect(res.status(), "sitemap.xml must return 200").toBe(200);
  const xml = await res.text();

  expect(xml.includes("<urlset"), "sitemap.xml missing <urlset>").toBe(true);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  expect(locs.length, "sitemap has no <loc> entries").toBeGreaterThan(0);

  // Rewrite production origin to the preview baseURL so we can reach every URL locally.
  const ctx = await pwRequest.newContext();
  try {
    for (const loc of locs) {
      const path = new URL(loc).pathname;
      const target = `${baseURL}${path}`;
      const r = await ctx.fetch(target, { maxRedirects: 0 });
      expect(
        r.status(),
        `sitemap URL ${path} returned ${r.status()} (expected 200, no 3xx/404)`,
      ).toBe(200);
    }
  } finally {
    await ctx.dispose();
  }
});
