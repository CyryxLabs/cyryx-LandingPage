import { test, expect, type Page } from "@playwright/test";
import { expectPageHydrated } from "../support/page-ready";

// Forced-colors mode keeps the still poster and never downloads frames, so the
// sequence-loading contracts below only apply to regular color modes.
// eslint-disable-next-line no-empty-pattern -- Playwright requires a destructured fixtures argument.
test.beforeEach(({}, testInfo) => {
  test.skip(
    testInfo.project.use.forcedColors === "active",
    "No frame sequence in forced-colors mode.",
  );
});

test.describe.configure({ mode: "serial" });

const SEQUENCE_URL_RE = /\/media\/hero-sequence\/(?:desktop|mobile)\/cyryx-hero-frame-\d{3}\.webp/i;

test("Hero sequence is not downloaded on routes without the hero", async ({ page }) => {
  const hits: string[] = [];
  page.on("request", (request) => {
    if (SEQUENCE_URL_RE.test(request.url())) hits.push(request.url());
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/contact", { waitUntil: "networkidle", timeout: 60_000 });
  expect(hits).toEqual([]);
});

/**
 * Keeps the 2.5s idle fallback from ever firing so a test can observe the
 * interaction gate on its own. Only timers of exactly LOAD_IDLE_DELAY_MS are
 * suppressed.
 */
async function suppressIdleLoadTimer(page: Page) {
  await page.addInitScript(() => {
    const nativeSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) =>
      timeout === 2500
        ? nativeSetTimeout(() => undefined, 2 ** 31 - 1)
        : nativeSetTimeout(handler, timeout, ...args)) as typeof window.setTimeout;
  });
}

async function useHighPerformanceProfile(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, value: 8 });
    Object.defineProperty(navigator, "deviceMemory", { configurable: true, value: 8 });
  });
}

test("Hero activates canvas playback only after all 15 desktop frames preload", async ({
  page,
}) => {
  const hits = new Set<string>();
  page.on("request", (request) => {
    const url = request.url();
    if (url.includes("/media/hero-sequence/")) hits.add(url);
  });
  await useHighPerformanceProfile(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });

  const sequence = page.locator("section[data-hero] [data-hero-sequence]");
  await expect(sequence).toHaveAttribute("data-sequence-ready", "true", { timeout: 20_000 });
  await expect(sequence).toHaveAttribute("data-sequence-mode", "sequence");
  expect(hits.size).toBe(15);
  expect(
    [...hits].every((url) => /\/desktop\/cyryx-hero-frame-0(0[1-9]|1[0-5])\.webp$/.test(url)),
  ).toBe(true);
  await expect(page.locator("section[data-hero] [data-hero-loader]")).toHaveCount(0);
  await expect(page.locator("section[data-hero]")).not.toContainText("Loading experience");
});

test("Desktop frames wait for the first interaction before loading", async ({ page }) => {
  const hits = new Set<string>();
  page.on("request", (request) => {
    const url = request.url();
    if (url.includes("/media/hero-sequence/")) hits.add(url);
  });
  await suppressIdleLoadTimer(page);
  await useHighPerformanceProfile(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });
  await expectPageHydrated(page);

  const sequence = page.locator("section[data-hero] [data-hero-sequence]");
  await page.waitForTimeout(3_500);
  // Before any interaction only the poster (frame 001) has been fetched.
  expect([...hits].every((url) => /cyryx-hero-frame-001\.webp$/.test(url))).toBe(true);
  await expect(sequence).toHaveAttribute("data-sequence-mode", "loading");
  await expect(sequence).toHaveAttribute("data-sequence-ready", "false");

  await page.mouse.move(200, 200);
  await page.mouse.move(260, 240);
  await expect(sequence).toHaveAttribute("data-sequence-ready", "true", { timeout: 20_000 });
  expect(hits.size).toBe(15);
});

test("Desktop frames start loading after the idle timeout without interaction", async ({
  page,
}) => {
  await useHighPerformanceProfile(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });
  await expectPageHydrated(page);
  const sequence = page.locator("section[data-hero] [data-hero-sequence]");
  await expect(sequence).toHaveAttribute("data-sequence-ready", "true", { timeout: 20_000 });
});

test("A failed frame keeps the deterministic poster fallback instead of partial playback", async ({
  page,
}) => {
  await page.route("**/hero-sequence/desktop/cyryx-hero-frame-010.webp", (route) => route.abort());
  await useHighPerformanceProfile(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });

  const hero = page.locator("section[data-hero]");
  await expect(hero.locator("[data-hero-sequence]")).toHaveAttribute(
    "data-sequence-mode",
    "fallback",
    { timeout: 20_000 },
  );
  await expect(hero.locator("canvas[data-hero-canvas]")).toHaveCSS("opacity", "0");
  await expect(hero.locator("img[data-hero-poster]")).toBeVisible();
  await expect(hero.getByRole("status")).toContainText("static Cyryx image");
});
