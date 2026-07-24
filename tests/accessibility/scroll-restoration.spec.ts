import { expect, test } from "@playwright/test";

test.describe("Initial scroll restoration", () => {
  test("opens at top after scrolling and reloading", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(150);
    await page.reload();
    await page.waitForLoadState("domcontentloaded");
    // Give the inline restore script a tick to run
    await page.waitForTimeout(150);
    const y = await page.evaluate(() => window.scrollY);
    expect(y).toBeLessThanOrEqual(2);
  });

  test("preserves direct section links and lands on the requested section", async ({ page }) => {
    await page.goto("/#contact");
    await page.waitForLoadState("domcontentloaded");
    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("#contact");
    await expect
      .poll(() => page.evaluate(() => window.scrollY), {
        message: "the initial hash should scroll to the contact section after hydration",
        timeout: 5_000,
      })
      .toBeGreaterThan(100);
    await expect(page.locator("#contact")).toBeInViewport();
  });
});
