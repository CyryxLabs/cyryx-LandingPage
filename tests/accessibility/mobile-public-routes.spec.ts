import { expect, test } from "@playwright/test";
import { crawlSitemaps, PRIMARY_SITEMAP } from "../support/seo-site-contract";

const MOBILE_VIEWPORTS = [
  { width: 320, height: 800 },
  { width: 390, height: 844 },
] as const;

test("all sitemap pages remain usable without horizontal overflow on mobile", async ({
  baseURL,
  page,
  request,
}, testInfo) => {
  test.setTimeout(120_000);

  test.skip(
    testInfo.project.name !== "hero-a11y-mobile-360",
    "The public-route matrix only needs one mobile browser project.",
  );

  const inventory = await crawlSitemaps(request, baseURL!, PRIMARY_SITEMAP);
  const paths = inventory.pageUrls.map((url) => new URL(url).pathname);

  expect(paths.length).toBeGreaterThan(20);

  for (const viewport of MOBILE_VIEWPORTS) {
    await page.setViewportSize(viewport);

    for (const path of paths) {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `${path} should load at ${viewport.width}px`).toBeLessThan(400);

      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("footer")).toBeAttached();

      const metrics = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyOverflow: getComputedStyle(document.body).overflow,
      }));

      expect(
        metrics.scrollWidth,
        `${path} overflows horizontally at ${viewport.width}px`,
      ).toBeLessThanOrEqual(metrics.clientWidth + 1);
      expect(metrics.bodyOverflow, `${path} leaves body scroll locked`).not.toBe("hidden");
    }
  }
});

test("Start a project keeps its first field in the initial mobile viewport", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "hero-a11y-mobile-360",
    "The form placement only needs one mobile browser project.",
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/start", { waitUntil: "domcontentloaded" });

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(2);
  const firstField = page.locator('input[name="name"]');
  await expect(firstField).toBeInViewport();
  await expect(firstField).toBeVisible();
});
