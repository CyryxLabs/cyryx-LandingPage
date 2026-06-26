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

  test("strips hash and stays at top when visiting /#contact directly", async ({ page }) => {
    await page.goto("/#contact");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(200);
    const y = await page.evaluate(() => window.scrollY);
    const hash = await page.evaluate(() => window.location.hash);
    expect(y).toBeLessThanOrEqual(2);
    expect(hash).toBe("");
  });
});
