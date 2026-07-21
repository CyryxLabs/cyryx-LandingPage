import { expect, test } from "@playwright/test";

const EXPECTED = {
  title: /Cyryx Labs.*enterprise AI/i,
  description: /Cyryx Labs.*advises, builds, and operates.*controlled execution/i,
  ogTitle: /Cyryx Labs/,
  ogDescription: /(Advisory|digital systems).*controlled execution/i,
  ogUrl: /\/$/,
  twitterTitle: /Cyryx Labs/,
  twitterDescription: /(Advisory|digital systems).*controlled execution/i,
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
  expect(await meta('meta[property="og:image"]')).toBe("https://cyryxlabs.com/og.png");
  expect(await meta('meta[property="og:image:width"]')).toBe("1200");
  expect(await meta('meta[property="og:image:height"]')).toBe("630");
  expect(await meta('meta[name="twitter:card"]')).toBe("summary_large_image");
  expect(await meta('meta[name="twitter:title"]')).toMatch(EXPECTED.twitterTitle);
  expect(await meta('meta[name="twitter:description"]')).toMatch(EXPECTED.twitterDescription);
  expect(await meta('meta[name="twitter:image"]')).toBe("https://cyryxlabs.com/og.png");
  expect(await link('link[rel="canonical"]')).toMatch(/\/$/);

  const socialCard = await page.evaluate(
    () =>
      new Promise<{ width: number; height: number }>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
        image.onerror = () => reject(new Error("The social card did not load"));
        image.src = "/og.png";
      }),
  );
  expect(socialCard).toEqual({ width: 1200, height: 630 });
});

test("JSON-LD schema.org graph exposes Organization, WebSite, WebPage, MAAX Studio", async ({
  page,
}) => {
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
