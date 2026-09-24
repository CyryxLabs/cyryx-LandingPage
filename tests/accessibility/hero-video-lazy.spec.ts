import { test, expect } from "@playwright/test";

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

test("Hero activates canvas playback only after all 40 desktop frames preload", async ({
  page,
}) => {
  const hits = new Set<string>();
  page.on("request", (request) => {
    const url = request.url();
    if (url.includes("/media/hero-sequence/desktop/")) hits.add(url);
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });

  const sequence = page.locator("section[data-hero] [data-hero-sequence]");
  await expect(sequence).toHaveAttribute("data-sequence-ready", "true", { timeout: 20_000 });
  expect(hits.size).toBe(40);
  await expect(page.locator("section[data-hero] [data-hero-loader]")).toHaveCount(0);
});

test("A failed frame keeps the deterministic poster fallback instead of partial playback", async ({
  page,
}) => {
  await page.route("**/hero-sequence/desktop/cyryx-hero-frame-020.webp", (route) => route.abort());
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
});
