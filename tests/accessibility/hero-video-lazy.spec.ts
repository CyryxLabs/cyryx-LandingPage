import { test, expect } from "@playwright/test";
test("internal routes never download homepage imagery", async ({ page }) => {
  const images: string[] = [];
  page.on("request", (r) => {
    if (/hero-sequence|hero-poster/.test(r.url())) images.push(r.url());
  });
  await page.goto("/contact", { waitUntil: "networkidle" });
  expect(images).toEqual([]);
});
test("blocked fonts leave text and navigation usable", async ({ page }) => {
  await page.route(/\/fonts\/.*\.woff2/, (route) => route.abort());
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("#hero-heading")).toBeVisible();
  await expect(page.locator('[data-cta="primary"]')).toBeVisible();
  await page.locator('[data-cta="primary"]').click();
  await expect(page).toHaveURL(/\/start\?source=home/);
  await expect(page.locator('input[name="name"]')).toBeVisible();
});
