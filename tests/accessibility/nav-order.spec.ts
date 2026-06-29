import { test, expect } from "@playwright/test";

const EXPECTED = ["Company", "MAAX Studio", "Solutions", "Research"];
const ROUTES = ["/", "/products/maax-studio", "/solutions", "/research", "/company", "/contact"];

for (const route of ROUTES) {
  test(`desktop nav order + no Answers @ ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(route, { waitUntil: "domcontentloaded" });
    const labels = await page
      .locator('header nav[aria-label="Primary"] a')
      .evaluateAll((els) => els.map((e) => (e.textContent ?? "").trim().replace(/\s+/g, " ")));
    const normalized = labels.map((l) => l.replace(/\s*New publication\s*$/i, "").trim());
    expect(normalized).toEqual(EXPECTED);
    expect(labels.join("|")).not.toMatch(/Answers/i);
  });

  test(`mobile nav order + no Answers @ ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 800 });
    await page.goto(route, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /open menu/i }).click();
    const panel = page.getByRole("dialog", { name: /main navigation/i });
    await expect(panel).toBeVisible();
    const labels = await panel
      .locator('nav[aria-label="Mobile primary"] a')
      .evaluateAll((els) =>
        els.map((e) => (e.querySelector("span")?.textContent ?? e.textContent ?? "").trim().replace(/\s+/g, " ")),
      );
    const normalized = labels.map((l) => l.replace(/\s*New publication\s*$/i, "").trim());
    expect(normalized).toEqual(EXPECTED);
    expect(labels.join("|")).not.toMatch(/Answers/i);
  });
}