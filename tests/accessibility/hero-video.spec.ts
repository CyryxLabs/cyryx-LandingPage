import { test, expect } from "@playwright/test";
for (const [label, width, height] of [
  ["desktop", 1920, 1080],
  ["phone", 390, 844],
] as const) {
  test(
    label + " receives a complete scene and sample application, with two bounded still assets",
    async ({ page }) => {
      const frames = new Set<string>();
      page.on("request", (r) => {
        if (r.url().includes("/media/hero-sequence/")) frames.add(r.url());
      });
      await page.setViewportSize({ width, height });
      await page.goto("/", { waitUntil: "networkidle" });
      await expect(page.locator("[data-hero] canvas")).toHaveCount(0);
      expect(frames.size).toBeLessThanOrEqual(2);
      expect([...frames].every((url) => /frame-(001|020|028)\.webp$/.test(url))).toBe(true);
      await expect(page.locator("[data-hero] video")).toHaveCount(0);
      const scene = page.locator("[data-request-demo]");
      await expect(scene).toBeVisible();
      await expect(scene).toContainText("THE ORIGINAL REQUEST");
      await expect(scene).toContainText("equipment inspection");
      await expect(scene).toContainText("Building B");
      await expect(scene).toContainText("New service request");
      await expect(scene).toContainText("sample data");
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
  await expect(page.locator(".cinema-request-app")).toHaveCSS("opacity", "1");
  await expect(page.locator(".cinema-aperture-door").first()).toHaveCSS("display", "none");
});
test("reduced motion shows a complete static scene and the review-ready example", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator(".cinema-request-app")).toHaveCSS("opacity", "1");
  await expect(page.locator(".cinema-aperture-door").first()).toHaveCSS("display", "none");
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
  await expect(page.locator("h1")).toHaveText("AI products. Software, made real.");
  await expect(page.locator("[data-request-demo]")).toContainText("Equipment inspection");
  await expect(page.locator('[data-cta="primary"]')).toHaveAttribute("href", "/start?source=home");
  await expect(page.locator(".cinema-draft-status")).toHaveText("Ready for review");
  await ctx.close();
});
