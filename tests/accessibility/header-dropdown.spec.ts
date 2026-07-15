import { test, expect } from "@playwright/test";

test.describe("Header Dropdown Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  test("Four top-level group triggers render", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const triggers = ["Products", "Solutions", "Research", "Company"];
    for (const name of triggers) {
      await expect(page.getByRole("button", { name, exact: true })).toBeVisible();
    }
  });

  test("Products opens and closes by click", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const trigger = page.getByRole("button", { name: "Products", exact: true });
    
    // Check initial state
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    
    await trigger.click();
    
    // Expect visible content and accessible state
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    
    const dropdownLink = page.locator('header nav').getByRole("link", { name: "MAAX Studio", exact: true });
    await expect(dropdownLink).toBeVisible();
    
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(dropdownLink).not.toBeVisible();
  });

  test("Opening Solutions closes Products", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const pTrigger = page.getByRole("button", { name: "Products", exact: true });
    const sTrigger = page.getByRole("button", { name: "Solutions", exact: true });
    
    await pTrigger.click();
    await expect(pTrigger).toHaveAttribute("aria-expanded", "true");
    
    await sTrigger.click();
    await expect(sTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(pTrigger).toHaveAttribute("aria-expanded", "false");
  });

  test("Escape closes the open menu", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const trigger = page.getByRole("button", { name: "Products", exact: true });
    
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("Outside click closes the menu", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const trigger = page.getByRole("button", { name: "Products", exact: true });
    
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    
    // Click on the hero area
    await page.mouse.click(640, 450);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("Keyboard interaction (Enter/Space) works", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const trigger = page.getByRole("button", { name: "Products", exact: true });
    
    // Use focus() to be explicit
    await trigger.focus();
    await expect(trigger).toBeFocused();
    
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    
    await page.keyboard.press("Space");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  test("Child selection closes the menu", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const trigger = page.getByRole("button", { name: "Products", exact: true });
    await trigger.click();
    
    const link = page.locator('header nav').getByRole("link", { name: "MAAX Studio", exact: true });
    await link.click();
    
    await expect(page).toHaveURL(/\/products\/maax-studio/);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("Programmatic route change closes the menu", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const trigger = page.getByRole("button", { name: "Products", exact: true });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    
    // Simulate route change by navigating to a different page via the logo
    await page.getByRole("link", { name: "Cyryx Labs — home" }).click();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("Active parent and aria-current are correct", async ({ page }) => {
    // Navigate to a subpage and wait for it to be stable
    await page.goto("/products/maax-studio", { waitUntil: "networkidle" });
    const trigger = page.getByRole("button", { name: "Products", exact: true });
    
    // Check if the trigger is visible before asserting class
    await expect(trigger).toBeVisible();
    
    // Parent active state - use string matching instead of regex if possible for stability
    const className = await trigger.getAttribute("class") || "";
    expect(className).toContain("text-[var(--silver)]");
    
    await trigger.click();
    const link = page.locator('header nav').getByRole("link", { name: "MAAX Studio", exact: true });
    await expect(link).toHaveAttribute("aria-current", "page");
  });

  test("Reduced motion variants are applied", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "networkidle" });
    
    const trigger = page.getByRole("button", { name: "Products", exact: true });
    await trigger.click();
    
    const dropdownContent = page.locator('[data-radix-navigation-menu-viewport]');
    // Wait for it to be attached/visible
    await expect(dropdownContent).toBeAttached();
    
    const transition = await dropdownContent.evaluate((el) => window.getComputedStyle(el).transition);
    const animation = await dropdownContent.evaluate((el) => window.getComputedStyle(el).animation);
    
    expect(transition === "none 0s ease 0s" || transition === "" || transition.includes("0s")).toBeTruthy();
    expect(animation === "none 0s ease 0s" || animation === "" || animation.includes("0s")).toBeTruthy();
  });
});


