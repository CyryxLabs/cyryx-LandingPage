import { expect, test } from "@playwright/test";

const HOME_TITLE = "Cyryx Labs — The Execution Layer for Enterprise AI";
const HOME_DESCRIPTION =
  "Cyryx Labs designs, builds and runs AI systems that act inside your workflows, with clear permissions, human approval and a record of every decision.";

const EXPECTED = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  ogTitle: HOME_TITLE,
  ogDescription: HOME_DESCRIPTION,
  ogUrl: /\/$/,
  twitterTitle: HOME_TITLE,
  twitterDescription: HOME_DESCRIPTION,
};

test("Landing page SEO metadata stays synchronized with Cyryx Labs copy", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveTitle(EXPECTED.title);

  const meta = async (selector: string) => page.locator(selector).first().getAttribute("content");
  const link = async (selector: string) => page.locator(selector).first().getAttribute("href");

  expect(await meta('meta[name="description"]')).toBe(EXPECTED.description);
  expect(await meta('meta[property="og:title"]')).toBe(EXPECTED.ogTitle);
  expect(await meta('meta[property="og:description"]')).toBe(EXPECTED.ogDescription);
  expect(await meta('meta[property="og:type"]')).toBe("website");
  expect(await meta('meta[property="og:url"]')).toMatch(EXPECTED.ogUrl);
  expect(await meta('meta[property="og:image"]')).toMatch(/\/cyryx-og\.png\?v=20260723-1$/);
  expect(await meta('meta[property="og:image:secure_url"]')).toMatch(
    /\/cyryx-og\.png\?v=20260723-1$/,
  );
  expect(await meta('meta[name="twitter:card"]')).toBe("summary_large_image");
  expect(await meta('meta[name="twitter:title"]')).toBe(EXPECTED.twitterTitle);
  expect(await meta('meta[name="twitter:description"]')).toBe(EXPECTED.twitterDescription);
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
