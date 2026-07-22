import { expect, test } from "@playwright/test";

test("Lyra page emits dedicated OG/Twitter social preview metadata", async ({ page, request }) => {
  await page.goto("/products/lyra", { waitUntil: "networkidle" });

  const meta = async (selector: string) => page.locator(selector).first().getAttribute("content");
  const allLinks = async (selector: string) =>
    page
      .locator(selector)
      .evaluateAll((els) => els.map((el) => (el as HTMLLinkElement).getAttribute("href")));

  const ogTitle = await meta('meta[property="og:title"]');
  const ogDesc = await meta('meta[property="og:description"]');
  const ogType = await meta('meta[property="og:type"]');
  const ogUrl = await meta('meta[property="og:url"]');
  const ogImage = await meta('meta[property="og:image"]');
  const twCard = await meta('meta[name="twitter:card"]');
  const twTitle = await meta('meta[name="twitter:title"]');
  const twDesc = await meta('meta[name="twitter:description"]');
  const twImage = await meta('meta[name="twitter:image"]');
  const canonicals = await allLinks('link[rel="canonical"]');

  expect(ogTitle).toMatch(/Lyra/);
  expect(ogDesc?.length ?? 0).toBeGreaterThan(20);
  expect(ogType).toBe("product");
  expect(ogUrl).toBe("https://cyryxlabs.com/products/lyra");
  expect(canonicals).toContain("https://cyryxlabs.com/products/lyra");

  expect(twCard).toBe("summary_large_image");
  expect(twTitle).toMatch(/Lyra/);
  expect(twDesc?.length ?? 0).toBeGreaterThan(20);

  // Dedicated Lyra image, not the site-wide default social image.
  expect(ogImage).toMatch(/^https:\/\//);
  expect(ogImage).toMatch(/lyra-og-1200x630\.jpg$/);
  expect(twImage).toBe(ogImage);

  // Image is reachable and served as an image.
  const res = await request.get(new URL(ogImage!).pathname);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"] ?? "").toMatch(/^image\//);
});
