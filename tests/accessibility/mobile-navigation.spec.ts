import { test, expect } from "@playwright/test";

test.describe("Mobile Navigation Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Mobile trigger renders and has correct ARIA attributes", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /open menu/i });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-controls", "cyryx-mobile-navigation");
    await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("Dialog id matches aria-controls and toggles aria-expanded", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /open menu/i });
    
    await expect(async () => {
      await trigger.click({ force: true });
      await expect(page.locator("#cyryx-mobile-navigation")).toBeVisible({ timeout: 2000 });
    }).toPass();
    
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const dialog = page.locator("#cyryx-mobile-navigation");
    await expect(dialog).toHaveRole("dialog");
  });


  test("Accordion functionality: opening one closes another", async ({ page }) => {
    await page.getByRole("button", { name: /open menu/i }).click();
    
    const productsTrigger = page.getByRole("button", { name: /^Products$/ });
    const solutionsTrigger = page.getByRole("button", { name: /^Solutions$/ });

    // Open Products
    await productsTrigger.click();
    await expect(productsTrigger).toHaveAttribute("aria-expanded", "true");
    
    // Open Solutions closes Products
    await solutionsTrigger.click();
    await expect(solutionsTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(productsTrigger).toHaveAttribute("aria-expanded", "false");
  });

  test("Navigation group contents and order", async ({ page }) => {
    await page.getByRole("button", { name: /open menu/i }).click();
    
    const groups = ["Products", "Solutions", "Research", "Company"];
    for (const group of groups) {
      await expect(page.getByRole("button", { name: new RegExp(`^${group}$`) })).toBeVisible();
    }

    // Verify Products children
    await page.getByRole("button", { name: /^Products$/ }).click();
    const productsLinks = ["MAAX Runtime", "MAAX Studio", "Documentation"];
    for (const link of productsLinks) {
      await expect(page.getByRole("link", { name: link })).toBeVisible();
    }

    // Verify Research children
    await page.getByRole("button", { name: /^Research$/ }).click();
    await expect(page.getByRole("link", { name: "Research", exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: "Answers" })).toBeVisible();
  });

  test("Active group expands on initial menu opening", async ({ page }) => {
    // Navigate to a products sub-page
    await page.goto("/products/maax-studio");
    await page.getByRole("button", { name: /open menu/i }).click();
    
    const productsTrigger = page.getByRole("button", { name: /^Products$/ });
    await expect(productsTrigger).toHaveAttribute("aria-expanded", "true");
    
    const activeLink = page.getByRole("link", { name: "MAAX Studio" });
    await expect(activeLink).toHaveAttribute("aria-current", "page");
  });

  test("Selecting a child link closes the menu", async ({ page }) => {
    await page.getByRole("button", { name: /open menu/i }).click();
    await page.getByRole("button", { name: /^Products$/ }).click();
    
    await page.getByRole("link", { name: "MAAX Studio" }).click();
    await expect(page.locator("#cyryx-mobile-navigation")).not.toBeVisible();
  });

  test("Start a Project CTA behavior", async ({ page }) => {
    await page.getByRole("button", { name: /open menu/i }).click();
    
    const cta = page.getByRole("link", { name: "Start a Project" });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/start");
    
    await cta.click();
    await expect(page).toHaveURL(/\/start/);
    await expect(page.locator("#cyryx-mobile-navigation")).not.toBeVisible();
  });

  test("Escape closes menu and returns focus", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /open menu/i });
    await trigger.click();
    
    await page.keyboard.press("Escape");
    await expect(page.locator("#cyryx-mobile-navigation")).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test("Focus trap: Tab and Shift+Tab wrap", async ({ page }) => {
    await page.getByRole("button", { name: /open menu/i }).click();
    const closeBtn = page.getByRole("button", { name: /close menu/i });
    await expect(closeBtn).toBeFocused();

    // Tab through to the last element (CTA)
    // 4 triggers + 1 CTA = 5 tabs (if all closed)
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
    }
    
    // Should wrap back to close button or first trigger
    // Actually close button is first, triggers are next.
    // Let's verify it hits the CTA then wraps.
    const cta = page.getByRole("link", { name: "Start a Project" });
    await expect(cta).toBeFocused();
    
    await page.keyboard.press("Tab");
    await expect(closeBtn).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect(cta).toBeFocused();
  });

  test("Body scroll is locked while open and restores after close", async ({ page }) => {
    await page.getByRole("button", { name: /open menu/i }).click();
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    
    await page.getByRole("button", { name: /close menu/i }).click();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });

  test("320px has no horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.getByRole("button", { name: /open menu/i }).click();
    
    const overflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(overflow).toBe(false);
  });
});
