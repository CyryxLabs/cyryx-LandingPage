import { expect, test } from "@playwright/test";

const EXPECTED = {
  title: /Cyryx Labs.*(AI Products|Execution Systems)/i,
  description: /Cyryx Labs.*(proprietary AI products|agentic|governed execution)/i,
  ogTitle: /Cyryx Labs/,
  ogDescription: /(Proprietary AI products|agentic|execution)/i,
  ogUrl: /\/$/,
  twitterTitle: /Cyryx Labs/,
  twitterDescription: /(execution|operational AI|agentic)/i,
};

test("Landing page SEO metadata stays synchronized with Cyryx Labs copy", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

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

test("JSON-LD schema.org graph exposes Organization, WebSite, WebPage, MAAX Studio", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
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
  const app = graph.find((n) => n["@type"] === "SoftwareApplication");
  expect(app?.name).toBe("MAAX Studio");
});