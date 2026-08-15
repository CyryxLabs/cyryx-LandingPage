import { test, expect, type Page } from "@playwright/test";
import { expectPageHydrated } from "../support/page-ready";

test.describe.configure({ mode: "serial" });

async function useHighPerformanceProfile(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, value: 8 });
    Object.defineProperty(navigator, "deviceMemory", { configurable: true, value: 8 });
  });
}

test("Hero canvas sequence is present and fully preloaded on desktop", async ({ page }) => {
  await useHighPerformanceProfile(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });
  await expectPageHydrated(page);

  const hero = page.locator("section[data-hero]");
  const sequence = hero.locator("[data-hero-sequence]");
  await expect(sequence).toHaveAttribute("data-sequence-ready", "true", { timeout: 20_000 });
  await expect(hero.locator("canvas[data-hero-canvas]")).toHaveCount(1);
  await expect(hero.locator("img[data-hero-poster]")).toHaveCount(1);
  await expect(hero.locator("canvas[data-hero-canvas]")).toHaveAttribute("data-frame-index", "1");
});

test("Hero selects the mobile sequence and contain-fit canvas surface", async ({ page }) => {
  await useHighPerformanceProfile(page);
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });
  await expectPageHydrated(page);

  const hero = page.locator("section[data-hero]");
  const sequence = hero.locator("[data-hero-sequence]");
  await expect(sequence).toHaveAttribute("data-sequence-ready", "true", { timeout: 20_000 });
  await expect(hero.locator("canvas[data-hero-canvas]")).toBeVisible();
  await expect(hero.locator("img[data-hero-poster]")).toBeVisible();
  await expect
    .poll(() => hero.locator("img[data-hero-poster]").evaluate((image) => image.currentSrc))
    .toContain("/hero-sequence/mobile/");
});

test("low-performance mobile devices use the still poster without sequence preload", async ({
  page,
}) => {
  const sequenceRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/media/hero-sequence/")) sequenceRequests.push(request.url());
  });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, value: 4 });
  });
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });
  await expectPageHydrated(page);

  const hero = page.locator("section[data-hero]");
  await expect(page.locator("html")).toHaveClass(/cx-low-perf/);
  await expect(hero.locator("[data-hero-sequence]")).toHaveAttribute("data-sequence-mode", "still");
  await expect(hero.locator("canvas[data-hero-canvas]")).toHaveCount(0);
  await expect(hero.locator("img[data-hero-poster]")).toBeVisible();
  await page.waitForLoadState("networkidle");
  expect(sequenceRequests.length).toBeLessThanOrEqual(3);
  expect(sequenceRequests.length).toBeGreaterThan(0);
  expect(sequenceRequests.every((url) => /cyryx-hero-frame-(001|040)\.webp$/.test(url))).toBe(true);
});

test("prefers-reduced-motion disables sequence playback and collapses the scroll scene", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });
  await expectPageHydrated(page);

  const hero = page.locator("section[data-hero]");
  await expect(hero.locator("[data-hero-sequence]")).toHaveAttribute("data-sequence-mode", "still");
  await expect(hero.locator("canvas[data-hero-canvas]")).toHaveCount(0);
  await expect(hero.locator("img[data-hero-poster]")).toBeVisible();
  const height = await hero.evaluate((element) => element.getBoundingClientRect().height);
  expect(height).toBeLessThanOrEqual(901);
});

test("Hero headline remains readable over the canvas background", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });
  await expectPageHydrated(page);
  const heading = page.locator("#hero-heading");
  await expect(heading).toBeVisible();
  const shadow = await heading
    .locator(".cx-hero-title-line")
    .first()
    .evaluate((el) => getComputedStyle(el).textShadow);
  expect(shadow).not.toBe("none");
});
