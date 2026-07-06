import { expect, test } from "@playwright/test";

/**
 * Global metadata contract: every indexable route must ship a unique
 * title + description, a self-referencing canonical + og:url, and matching
 * Open Graph / Twitter tags. Fails CI if a route drops back to root defaults.
 */
const ROUTES = [
  "/",
  "/company",
  "/products",
  "/products/maax-studio",
  "/solutions",
  "/solutions/ai-websites-lead-systems",
  "/solutions/workflow-automation",
  "/solutions/internal-ai-assistants",
  "/solutions/custom-ai-product-development",
  "/solutions/ai-integrations",
  "/solutions/ai-governance-cost-control",
  "/privacy",
  "/terms",
  "/contact",
];

const BASE = "https://cyryxlabs.com";

const seen = { titles: new Map<string, string>(), descs: new Map<string, string>() };

for (const route of ROUTES) {
  test(`metadata contract: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: "networkidle" });

    const title = await page.title();
    const meta = (sel: string) => page.locator(sel).first().getAttribute("content");
    const description = (await meta('meta[name="description"]')) ?? "";
    const ogTitle = await meta('meta[property="og:title"]');
    const ogDesc = await meta('meta[property="og:description"]');
    const ogUrl = await meta('meta[property="og:url"]');
    const ogType = await meta('meta[property="og:type"]');
    const ogImage = await meta('meta[property="og:image"]');
    const twCard = await meta('meta[name="twitter:card"]');
    const twTitle = await meta('meta[name="twitter:title"]');
    const twDesc = await meta('meta[name="twitter:description"]');
    const canonical = await page.locator('link[rel="canonical"]').first().getAttribute("href");

    // Title / description bounds and non-defaults
    expect(title, `${route}: empty title`).toBeTruthy();
    expect(title.length, `${route}: title too long`).toBeLessThan(70);
    expect(title).not.toBe("Lovable App");
    expect(description.length, `${route}: description empty`).toBeGreaterThan(20);
    expect(description.length, `${route}: description too long`).toBeLessThan(170);
    expect(description).not.toBe("Lovable Generated Project");

    // Uniqueness across routes (each page should own its story)
    const priorTitle = seen.titles.get(title);
    expect(priorTitle, `${route}: duplicate title with ${priorTitle}`).toBeUndefined();
    seen.titles.set(title, route);
    const priorDesc = seen.descs.get(description);
    expect(priorDesc, `${route}: duplicate description with ${priorDesc}`).toBeUndefined();
    seen.descs.set(description, route);

    // Open Graph + Twitter parity
    expect(ogTitle, `${route}: missing og:title`).toBeTruthy();
    expect(ogDesc, `${route}: missing og:description`).toBeTruthy();
    expect(ogType, `${route}: missing og:type`).toBeTruthy();
    expect(ogImage, `${route}: missing og:image`).toMatch(/^https:\/\//);
    expect(twCard).toBe("summary_large_image");
    expect(twTitle).toBeTruthy();
    expect(twDesc).toBeTruthy();

    // Self-referencing canonical + og:url
    const expectedUrl = `${BASE}${route}`;
    expect(canonical, `${route}: canonical mismatch`).toBe(expectedUrl);
    expect(ogUrl, `${route}: og:url mismatch`).toBe(expectedUrl);
  });
}
