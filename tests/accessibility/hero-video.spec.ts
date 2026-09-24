import { test, expect, type Page } from "@playwright/test";
import { expectPageHydrated } from "../support/page-ready";

test.describe.configure({ mode: "serial" });

async function useHighPerformanceProfile(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, value: 8 });
    Object.defineProperty(navigator, "deviceMemory", { configurable: true, value: 8 });
  });
}

test("Hero canvas sequence is present and fully preloaded on desktop", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.use.forcedColors === "active",
    "Forced colors hides the canvas and collapses the scene; covered by the forced-colors test.",
  );
  const frameRequests = new Set<string>();
  page.on("request", (request) => {
    const match = request
      .url()
      .match(/\/media\/hero-sequence\/(desktop|mobile)\/cyryx-hero-frame-(\d{3})\.webp/);
    if (match) frameRequests.add(`${match[1]}/${match[2]}`);
  });
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
  // Only the 15 "ignition" desktop frames exist; the retired 016-040 brand
  // reveal and the mobile sequence are never requested.
  expect([...frameRequests].sort()).toEqual(
    Array.from({ length: 15 }, (_, i) => `desktop/${String(i + 1).padStart(3, "0")}`),
  );
});

test("Phones render the static desktop poster and never load the frame sequence", async ({
  page,
}) => {
  const sequenceRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/media/hero-sequence/")) sequenceRequests.push(request.url());
  });
  await useHighPerformanceProfile(page);
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });
  await expectPageHydrated(page);

  const hero = page.locator("section[data-hero]");
  const sequence = hero.locator("[data-hero-sequence]");
  const poster = hero.locator("img[data-hero-poster]");
  await expect(sequence).toHaveAttribute("data-sequence-mode", "still");
  await expect(sequence).toHaveAttribute("data-sequence-ready", "false");
  await expect(hero.locator("canvas[data-hero-canvas]")).toHaveCount(0);
  await expect(poster).toBeVisible();
  await expect
    .poll(() => poster.evaluate((image) => (image as HTMLImageElement).currentSrc))
    .toMatch(/\/hero-sequence\/desktop\/cyryx-hero-frame-001\.webp$/);
  await expect(poster).toHaveCSS("object-fit", "cover");

  // Neither interaction nor the idle timeout may start the sequence on phones.
  await page.mouse.move(40, 40);
  await page.keyboard.press("Shift");
  await page.evaluate(() => window.scrollBy(0, 200));
  await page.waitForTimeout(3_000);
  await page.waitForLoadState("networkidle");
  expect(sequenceRequests.length).toBeGreaterThan(0);
  expect(
    sequenceRequests.every((url) => /\/desktop\/cyryx-hero-frame-001\.webp$/.test(url)),
    `unexpected sequence requests on mobile: ${sequenceRequests.join(", ")}`,
  ).toBe(true);
  await expect(sequence).toHaveAttribute("data-sequence-mode", "still");
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
  expect(sequenceRequests.length).toBeLessThanOrEqual(2);
  expect(sequenceRequests.length).toBeGreaterThan(0);
  expect(sequenceRequests.every((url) => /\/desktop\/cyryx-hero-frame-001\.webp$/.test(url))).toBe(
    true,
  );
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

test("Hero headline remains readable over the canvas background", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.use.forcedColors === "active",
    "Forced colors paints system colors with no canvas; hero.spec covers that contract.",
  );
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });
  await expectPageHydrated(page);
  const heading = page.locator("#hero-heading");
  await expect(heading).toBeVisible();
  // The chrome-gradient headline is clipped to the text, so legibility comes
  // from a drop-shadow filter (text-shadow would paint over the gradient).
  // Either mechanism satisfies the contract.
  const shadow = await heading
    .locator(".cx-hero-title-line")
    .first()
    .evaluate((el) => {
      const style = getComputedStyle(el);
      return { textShadow: style.textShadow, filter: style.filter };
    });
  expect(
    shadow.textShadow !== "none" || /drop-shadow/.test(shadow.filter),
    `headline has no shadow separating it from the canvas: ${JSON.stringify(shadow)}`,
  ).toBe(true);
});
