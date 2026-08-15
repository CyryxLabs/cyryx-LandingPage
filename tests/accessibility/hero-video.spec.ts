import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("Hero canvas sequence is present and fully preloaded on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });

  const hero = page.locator("section[data-hero]");
  const sequence = hero.locator("[data-hero-sequence]");
  await expect(sequence).toHaveAttribute("data-sequence-ready", "true", { timeout: 20_000 });
  await expect(hero.locator("canvas[data-hero-canvas]")).toHaveCount(1);
  await expect(hero.locator("img[data-hero-poster]")).toHaveCount(1);
  await expect(hero.locator("canvas[data-hero-canvas]")).toHaveAttribute("data-frame-index", "1");
});

test("Hero selects the mobile sequence and contain-fit canvas surface", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });

  const hero = page.locator("section[data-hero]");
  await expect(hero.locator("[data-hero-sequence]")).toHaveAttribute(
    "data-sequence-ready",
    "true",
    { timeout: 20_000 },
  );
  await expect(hero.locator("canvas[data-hero-canvas]")).toBeVisible();
  await expect(hero.locator("img[data-hero-poster]")).toBeVisible();
  await expect
    .poll(() => hero.locator("img[data-hero-poster]").evaluate((image) => image.currentSrc))
    .toContain("/hero-sequence/mobile/");
});

test("prefers-reduced-motion disables sequence playback and collapses the scroll scene", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });

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
  const heading = page.locator("#hero-heading");
  await expect(heading).toBeVisible();
  const shadow = await heading
    .locator(".cx-hero-title-line")
    .first()
    .evaluate((el) => getComputedStyle(el).textShadow);
  expect(shadow).not.toBe("none");
});
