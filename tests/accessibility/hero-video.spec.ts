import { test, expect } from "@playwright/test";
for (const [label, width, height] of [
  ["desktop", 1920, 1080],
  ["phone", 390, 844],
] as const) {
  test(
    label + " receives a complete readable HTML demonstration, with no canvas or film preload",
    async ({ page }) => {
      const frames = new Set<string>();
      page.on("request", (r) => {
        if (r.url().includes("/media/hero-sequence/")) frames.add(r.url());
      });
      await page.setViewportSize({ width, height });
      await page.goto("/", { waitUntil: "networkidle" });
      await expect(page.locator("[data-hero] canvas")).toHaveCount(0);
      expect(frames.size).toBe(0);
      const scene = page.locator(
        width < 768
          ? ".cinema-mobile-build"
          : "[data-hero] .cinema-hero-software .cinema-composition",
      );
      await expect(scene).toBeVisible();
      await expect(scene).toContainText("THE BRIEF");
      await expect(scene).toContainText("Documents");
      await expect(scene).toContainText("Systems");
      await expect(scene).toContainText("People");
      await expect(scene).toContainText("Your work. In software.");
      await expect(page.locator('[data-hero] link[as="image"]')).toHaveCount(0);
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
  await expect(page.locator(".cinema-mobile-build")).toBeVisible();
  await expect(page.locator(".cinema-mobile-build .studio-screen")).toHaveCSS("opacity", "1");
});
test("reduced motion shows a complete static scene and the review-ready example", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("[data-hero] .cinema-hero-software .studio-screen")).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(page.locator(".cinema-draft-status")).toHaveText("Ready for review");
  expect(
    await page.evaluate(
      () => document.getAnimations().filter((a) => a.playState === "running").length,
    ),
  ).toBe(0);
});
test("no JavaScript still renders the business, CTA and operational evidence", async ({
  browser,
}, testInfo) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(String(testInfo.project.use.baseURL));
  await expect(page.locator("h1")).toContainText("to software.");
  await expect(page.locator('[data-cta="primary"]')).toHaveAttribute("href", "/start?source=home");
  await expect(page.locator(".cinema-draft-status")).toHaveText("Ready for review");
  await ctx.close();
});
