import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("Hero video is present and playing on desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });
  const video = page.locator("section[data-hero] video[data-hero-video]");
  await expect(video).toHaveCount(1);
  await expect(video).not.toHaveAttribute("loop", "");
  await expect(video).toHaveAttribute("muted", "");
  await expect(video).toHaveAttribute("playsinline", "");
  await expect(video).toHaveAttribute("aria-hidden", "true");

  // Poster image always rendered for instant LCP / fallback
  await expect(page.locator("section[data-hero] img[data-hero-poster]")).toHaveCount(1);
});

test("Hero video is present on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });
  await expect(page.locator("section[data-hero] video[data-hero-video]")).toHaveCount(1);
  await expect(page.locator("section[data-hero] img[data-hero-poster]")).toBeVisible();
});

test("prefers-reduced-motion disables the Hero video", async ({ page }) => {
  // Emulate on the test-owned page so the media preference is applied before
  // navigation and cannot be lost when Playwright composes project context options.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });
  expect(
    await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches),
  ).toBe(true);
  // Video must NOT render when user requests reduced motion
  await expect(page.locator("section[data-hero] video[data-hero-video]")).toHaveCount(0);
  // Poster image still anchors the hero
  await expect(page.locator("section[data-hero] img[data-hero-poster]")).toBeVisible();
});

test("Hero headline remains readable over the video background", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });
  const heading = page.locator("#hero-heading");
  await expect(heading).toBeVisible();
  const shadow = await heading
    .locator(".cx-hero-title-line")
    .first()
    .evaluate((el) => getComputedStyle(el).textShadow);
  // text-shadow keeps copy legible against motion
  expect(shadow).not.toBe("none");
});
