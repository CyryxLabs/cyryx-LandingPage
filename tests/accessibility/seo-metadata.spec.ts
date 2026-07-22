import { expect, test } from "@playwright/test";

const EXPECTED = {
  title: /Cyryx Labs.*Execution Layer for Enterprise AI/i,
  description: /Cyryx Labs.*governed AI systems.*(ownership|evidence|cost visibility)/i,
  ogTitle: /Cyryx Labs/,
  ogDescription: /(governed AI systems|ownership|evidence|cost visibility)/i,
  ogUrl: /\/$/,
  twitterTitle: /Cyryx Labs/,
  twitterDescription: /(governed AI systems|ownership|evidence|cost visibility)/i,
};

test("Landing page SEO metadata stays synchronized with Cyryx Labs copy", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveTitle(EXPECTED.title);

  const meta = async (selector: string) => page.locator(selector).first().getAttribute("content");
  const link = async (selector: string) => page.locator(selector).first().getAttribute("href");

  expect(await meta('meta[name="description"]')).toMatch(EXPECTED.description);
  expect(await meta('meta[property="og:title"]')).toMatch(EXPECTED.ogTitle);
  expect(await meta('meta[property="og:description"]')).toMatch(EXPECTED.ogDescription);
  expect(await meta('meta[property="og:type"]')).toBe("website");
  expect(await meta('meta[property="og:url"]')).toMatch(EXPECTED.ogUrl);
  expect(await meta('meta[name="twitter:card"]')).toBe("summary_large_image");
  expect(await meta('meta[name="twitter:title"]')).toMatch(EXPECTED.twitterTitle);
  expect(await meta('meta[name="twitter:description"]')).toMatch(EXPECTED.twitterDescription);
  expect(await link('link[rel="canonical"]')).toMatch(/\/$/);
});

test("JSON-LD exposes the organization, site, page, and approved MAAX Studio product entity", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(blocks.length).toBeGreaterThan(0);

  const graph = blocks.flatMap((raw) => {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.["@graph"]) ? parsed["@graph"] : [parsed];
  });

  const types = graph.map((n) => n["@type"]);
  expect(types).toContain("Organization");
  expect(types).toContain("WebSite");
  expect(types).toContain("WebPage");
  expect(types).toContain("SoftwareApplication");

  const org = graph.find((n) => n["@type"] === "Organization");
  expect(org?.name).toBe("Cyryx Labs");
  const apps = graph.filter((n) => n["@type"] === "SoftwareApplication");
  expect(apps.map((app) => app.name)).toEqual(["MAAX Studio"]);
  expect(apps.map((app) => app.name)).not.toContain("Lyra");
});
