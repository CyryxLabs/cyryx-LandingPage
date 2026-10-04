import { test, expect } from "@playwright/test";
for (const [label, width, height] of [
  ["desktop", 1920, 1080],
  ["phone", 390, 844],
] as const) {
  test(
    label + " receives a complete responsive poster, with no canvas or film preload",
    async ({ page }) => {
      const frames = new Set<string>();
      page.on("request", (r) => {
        if (r.url().includes("/media/hero-sequence/")) frames.add(r.url());
      });
      await page.setViewportSize({ width, height });
      await page.goto("/", { waitUntil: "networkidle" });
      await expect(page.locator("[data-hero] canvas")).toHaveCount(0);
      expect(frames.size).toBe(1);
      const poster = page.locator("[data-hero-poster]");
      expect(
        await poster.evaluate((img) => (img as HTMLImageElement).naturalWidth),
      ).toBeGreaterThan(0);
      expect(await poster.evaluate((img) => (img as HTMLImageElement).currentSrc)).toContain(
        width < 768 ? "/mobile/" : "/desktop/",
      );
    },
  );
}
test("Save-Data keeps the useful static opening", async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true },
    }),
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveClass(/cx-low-perf/);
  await expect(page.locator('[data-cta="primary"]')).toBeInViewport();
  await expect(page.locator("[data-cinema-open]")).toHaveCSS("opacity", "0");
});
test("reduced motion shows a complete static scene and the review-ready example", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("[data-cinema-open]")).toHaveCSS("opacity", "1");
  await expect(page.locator(".cinema-draft-status")).toHaveText("Ready for review");
  expect(
    await page.evaluate(
      () => document.getAnimations().filter((a) => a.playState === "running").length,
    ),
  ).toBe(0);
});
test("no JavaScript still renders the business, CTA and operational evidence", async ({
  browser,
}) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("http://127.0.0.1:4175/");
  await expect(page.locator("h1")).toContainText("your business works");
  await expect(page.locator('[data-cta="primary"]')).toHaveAttribute("href", "/start?source=home");
  await expect(page.locator(".cinema-draft-status")).toHaveText("Ready for review");
  await ctx.close();
});
