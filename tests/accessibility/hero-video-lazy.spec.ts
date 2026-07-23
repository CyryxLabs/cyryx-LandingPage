import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

const VIDEO_URL_RE = /cyryx-hero-(?:720|1080)\.mp4/i;

test("Hero video is NOT downloaded on routes without the hero", async ({ page }) => {
  const hits: string[] = [];
  page.on("request", (req) => {
    if (VIDEO_URL_RE.test(req.url())) hits.push(req.url());
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/contact", { waitUntil: "networkidle", timeout: 60_000 });
  expect(hits).toEqual([]);
});

test("Hero video only downloads after IntersectionObserver fires on /", async ({ page }) => {
  const hits: { url: string; at: number }[] = [];
  const start = Date.now();
  page.on("request", (req) => {
    if (VIDEO_URL_RE.test(req.url())) hits.push({ url: req.url(), at: Date.now() - start });
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });

  // Video element renders with no src until IO observes intersection
  const video = page.locator("section[data-hero] video[data-hero-video]");
  await expect(video).toHaveCount(1);

  // Wait for src to be wired up by the observer, then for the network hit
  await expect
    .poll(() => video.evaluate((el: HTMLVideoElement) => el.currentSrc || el.src || ""))
    .toMatch(VIDEO_URL_RE);
  await expect.poll(() => hits.length, { timeout: 10_000 }).toBeGreaterThan(0);
});

test("Hero video preloads metadata after IO so scroll scrubbing is deterministic", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });
  const preload = await page
    .locator("section[data-hero] video[data-hero-video]")
    .getAttribute("preload");
  expect(preload).toBe("metadata");
});
