import { expect, test } from "@playwright/test";

const EXPECTED = {
  title: /Cyryx Labs.*AI Systems from Strategy to Operations/i,
  description:
    /Cyryx Labs helps organizations Advise, Build, Control, and Operate AI-enabled systems through individual capabilities or connected, evidence-led programs\./i,
  ogTitle: /Cyryx Labs/,
  ogDescription:
    /helps organizations Advise, Build, Control, and Operate AI-enabled systems through individual capabilities or connected, evidence-led programs\./i,
  ogUrl: /\/$/,
  twitterTitle: /Cyryx Labs/,
  twitterDescription:
    /helps organizations Advise, Build, Control, and Operate AI-enabled systems through individual capabilities or connected, evidence-led programs\./i,
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
  expect(await meta('meta[property="og:image"]')).toMatch(/\/cyryx-og\.png\?v=20260723-1$/);
  expect(await meta('meta[property="og:image:secure_url"]')).toMatch(
    /\/cyryx-og\.png\?v=20260723-1$/,
  );
  expect(await meta('meta[name="twitter:card"]')).toBe("summary_large_image");
  expect(await meta('meta[name="twitter:title"]')).toMatch(EXPECTED.twitterTitle);
  expect(await meta('meta[name="twitter:description"]')).toMatch(EXPECTED.twitterDescription);
  expect(await meta('meta[name="twitter:image"]')).toMatch(/\/cyryx-og\.png\?v=20260723-1$/);
  expect(await link('link[rel="icon"][sizes="any"]')).toBe("/favicon.ico?v=20260723-1");
  expect(await link('link[rel="icon"][sizes="32x32"]')).toBe("/favicon-32x32.png?v=20260723-1");
  expect(await link('link[rel="apple-touch-icon"]')).toBe("/apple-touch-icon.png?v=20260723-1");
  expect(await link('link[rel="canonical"]')).toMatch(/\/$/);
});

test("JSON-LD exposes truthful organization, site, and page entities without unsupported rich-result claims", async ({
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
  expect(types).not.toContain("SoftwareApplication");
  expect(types).not.toContain("Product");

  const org = graph.find((n) => n["@type"] === "Organization");
  expect(org?.name).toBe("Cyryx Labs");
});
