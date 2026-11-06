import { expect, test } from "@playwright/test";
import { expectPageHydrated } from "../support/page-ready";

/**
 * Home hero after the 2026-11-06 institutional revision: the monolith film is
 * gone, and the hero shows a labelled example of the written project plan.
 * Replaces the film's playback and preload contracts.
 */
const SEQUENCE_URL_RE = /\/media\/hero-sequence\//i;

for (const viewport of [
  { name: "desktop", width: 1280, height: 900 },
  { name: "phone", width: 390, height: 844 },
]) {
  test(`${viewport.name}: the home downloads no film frames and draws no canvas`, async ({
    page,
  }) => {
    const hits: string[] = [];
    page.on("request", (request) => {
      if (SEQUENCE_URL_RE.test(request.url())) hits.push(request.url());
    });
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "networkidle", timeout: 60_000 });
    await expectPageHydrated(page);
    expect(hits).toEqual([]);
    await expect(page.locator("section[data-hero] canvas")).toHaveCount(0);
    await expect(page.locator("[data-hero-scroll-scene]")).toHaveCount(0);
  });
}

test("the hero plan is labelled as an example and states no price", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const plan = page.locator("section[data-hero] figure.hm-plan");
  await expect(plan).toBeVisible();
  await expect(plan).toContainText("Example");
  await expect(plan.locator("figcaption")).toContainText("written plan");
  await expect(plan).not.toContainText(/\$\d/);
});

test("reduced motion keeps the hero to one screen", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const height = await page
    .locator("section[data-hero]")
    .evaluate((element) => element.getBoundingClientRect().height);
  expect(height).toBeLessThanOrEqual(901);
});
