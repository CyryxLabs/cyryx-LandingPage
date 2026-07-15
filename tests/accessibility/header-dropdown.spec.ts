import { test, expect } from "@playwright/test";

test.describe("Header Dropdown Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  test("Four top-level group triggers render", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const triggers = ["Products", "Solutions", "Research", "Company"];
    for (const name of triggers) {
      await expect(page.getByRole("button", { name, exact: true })).toBeVisible();
    }
  });

  test("Products opens and closes by click", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const trigger = page.getByRole("button", { name: "Products", exact: true });
    
    await trigger.click();
    await expect(trigger).toHaveAttribute("data-state", "open");
    
    // Use exact: true and scope to nav to avoid hero CTA overlap
    const dropdownLink = page.locator('header nav').getByRole("link", { name: "MAAX Studio", exact: true });
    await expect(dropdownLink).toBeVisible();
    
    await trigger.click();
    await expect(trigger).toHaveAttribute("data-state", "closed");
  });

  test("Opening Solutions closes Products", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const pTrigger = page.getByRole("button", { name: "Products", exact: true });
    const sTrigger = page.getByRole("button", { name: "Solutions", exact: true });
    
    await pTrigger.click();
    await expect(pTrigger).toHaveAttribute("data-state", "open");
    
    await sTrigger.click();
    await expect(sTrigger).toHaveAttribute("data-state", "open");
    await expect(pTrigger).toHaveAttribute("data-state", "closed");
  });

  test("Escape closes the open menu", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const trigger = page.getByRole("button", { name: "Products", exact: true });
    
    await trigger.click();
    await expect(trigger).toHaveAttribute("data-state", "open");
    
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("data-state", "closed");
  });

  test("Products child labels and order", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Products", exact: true }).click();
    
    const links = page.locator('header nav').getByRole("link");
    const labels = await links.evaluateAll(els => els.map(e => e.textContent?.trim()));
    
    const products = labels.filter(l => ["Products Overview", "MAAX Studio", "Lyra"].includes(l || ""));
    expect(products).toEqual(["Products Overview", "MAAX Studio", "Lyra"]);
  });

  test("Solutions contains seven items", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Solutions", exact: true }).click();
    
    const expected = [
      "Digital & Web Systems",
      "Workflow Automation",
      "Internal AI Assistants",
      "Custom AI Product Development",
      "AI Governance & Cost Control",
      "Managed Operations",
      "How We Work"
    ];
    
    const nav = page.locator('header nav');
    for (const label of expected) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
  });

  test("Research contains Research and Answers", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Research", exact: true }).click();
    
    const nav = page.locator('header nav');
    await expect(nav.getByRole("link", { name: "Research", exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Answers", exact: true })).toBeVisible();
  });

  test("Company contains Company, Careers and Contact", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Company", exact: true }).click();
    
    const nav = page.locator('header nav');
    await expect(nav.getByRole("link", { name: "Company", exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Careers", exact: true })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Contact", exact: true })).toBeVisible();
  });

  test("Selecting a child closes its menu", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const trigger = page.getByRole("button", { name: "Products", exact: true });
    await trigger.click();
    
    const link = page.locator('header nav').getByRole("link", { name: "MAAX Studio", exact: true });
    await link.click();
    
    await expect(page).toHaveURL(/\/products\/maax-studio/);
    await expect(trigger).toHaveAttribute("data-state", "closed");
  });

  test("Active parent is identifiable on a child route", async ({ page }) => {
    await page.goto("/products/maax-studio", { waitUntil: "domcontentloaded" });
    const trigger = page.getByRole("button", { name: "Products", exact: true });
    await expect(trigger).toHaveClass(/text-\[var\(--silver\)\]/);
    await expect(trigger).toHaveClass(/after:bg-\[var\(--accent-glow\)\]/);
  });

  test("Current child receives aria-current='page'", async ({ page }) => {
    await page.goto("/products/maax-studio", { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Products", exact: true }).click();
    
    const link = page.locator('header nav').getByRole("link", { name: "MAAX Studio", exact: true });
    await expect(link).toHaveAttribute("aria-current", "page");
  });

  test("Start a Project points to /start and is active only there", async ({ page }) => {
    const cta = page.getByRole("link", { name: "Start a Project" });
    
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(cta).toHaveAttribute("href", "/start");
    await expect(cta).not.toHaveClass(/after:bg-\[var\(--accent-glow\)\]/);
    
    await page.goto("/start", { waitUntil: "domcontentloaded" });
    await expect(cta).toHaveClass(/after:bg-\[var\(--accent-glow\)\]/);
  });

  test("Keyboard interaction works without mouse", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.keyboard.press("Tab"); // Should reach logo
    await page.keyboard.press("Tab"); // Should reach first nav trigger
    
    const trigger = page.getByRole("button", { name: "Products", exact: true });
    await expect(trigger).toBeFocused();
    
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("data-state", "open");
    
    await page.keyboard.press("Tab");
    const nav = page.locator('header nav');
    await expect(nav.getByRole("link", { name: "Products Overview", exact: true })).toBeFocused();
  });
});

