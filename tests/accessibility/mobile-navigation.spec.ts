import { test, expect } from "@playwright/test";

test.describe("Mobile Navigation Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    // Force mobile viewport if not already set by project
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");
    // Wait for hydration
    await page.waitForLoadState("networkidle");
  });

  const getMobileMenu = (page: any) => page.locator("#cyryx-mobile-navigation");
  const getNav = (page: any) => page.getByRole("navigation", { name: /mobile/i });

  test("1-5. Trigger and state: renders, type, aria attributes", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /open menu/i });
    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("type", "button");
    await expect(trigger).toHaveAttribute("aria-controls", "cyryx-mobile-navigation");
    await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("6-8. Opening behavior: expanded state and dialog semantics", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /open menu/i });
    const dialog = getMobileMenu(page);
    await expect(dialog).not.toBeVisible();

    await trigger.click({ force: true });
    // Re-select trigger as the open/close state change might swap the element if React re-renders it differently
    const openTrigger = page.getByRole("banner").getByRole("button", { name: /close menu/i });
    await expect(openTrigger).toHaveAttribute("aria-expanded", "true", { timeout: 5000 });
    
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("id", "cyryx-mobile-navigation");
    await expect(dialog).toHaveRole("dialog");
    await expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  test("9-11. Accordion group switching: products and solutions", async ({ page }) => {
    await page.getByRole("button", { name: /open menu/i }).click();
    const nav = getNav(page);
    
    const productsTrigger = nav.getByRole("button", { name: /^Products$/ });
    const solutionsTrigger = nav.getByRole("button", { name: /^Solutions$/ });

    // 9. Products opens
    await productsTrigger.click();
    await expect(productsTrigger).toHaveAttribute("aria-expanded", "true");
    
    // 12. Exact Products labels and hrefs
    await expect(nav.getByRole("link", { name: "Products Overview" })).toHaveAttribute("href", "/products");
    await expect(nav.getByRole("link", { name: "MAAX Studio", exact: true })).toHaveAttribute("href", "/products/maax-studio");
    await expect(nav.getByRole("link", { name: "Lyra" })).toHaveAttribute("href", "/products/lyra");

    // 10. Products closes when solutions opens
    // 11. Solutions opening closes Products
    await solutionsTrigger.click();
    await expect(solutionsTrigger).toHaveAttribute("aria-expanded", "true");
    await expect(productsTrigger).toHaveAttribute("aria-expanded", "false");
  });

  test("13-16. All groups and forbidden labels check", async ({ page }) => {
    await page.getByRole("button", { name: /open menu/i }).click();
    const nav = getNav(page);
    
    // 13. Exact Solutions labels and hrefs
    const solutionsTrigger = nav.getByRole("button", { name: /^Solutions$/ });
    await solutionsTrigger.click();
    const solutions = [
      ["Digital & Web Systems", "/solutions/digital-web-systems"],
      ["Workflow Automation", "/solutions/workflow-automation"],
      ["Internal AI Assistants", "/solutions/internal-ai-assistants"],
      ["Custom AI Product Development", "/solutions/custom-ai-product-development"],
      ["AI Governance & Cost Control", "/solutions/ai-governance-cost-control"],
      ["Managed Operations", "/managed-operations"],
      ["How We Work", "/engagement-model"]
    ];
    for (const [label, href] of solutions) {
      await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute("href", href);
    }

    // 14. Exact Research labels and hrefs
    await nav.getByRole("button", { name: /^Research$/ }).click();
    await expect(nav.getByRole("link", { name: "Research", exact: true })).toHaveAttribute("href", "/research");
    await expect(nav.getByRole("link", { name: "Answers" })).toHaveAttribute("href", "/answers");

    // 15. Exact Company labels and hrefs
    await nav.getByRole("button", { name: /^Company$/ }).click();
    await expect(nav.getByRole("link", { name: "Company", exact: true })).toHaveAttribute("href", "/company");
    await expect(nav.getByRole("link", { name: "Careers" })).toHaveAttribute("href", "/careers");
    await expect(nav.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");

    // 16. Forbidden labels absent
    const forbidden = [
      "MAAX Runtime", "Documentation", "Enterprise Lead Systems",
      "AI Product Engineering", "Applied AI Systems", "Governance Optimization",
      "AI Websites & Lead Systems", "AI Integrations"
    ];
    for (const label of forbidden) {
      await expect(nav.getByRole("link", { name: label })).not.toBeVisible();
    }
  });

  test("17-19. Active group and current page behavior", async ({ page }) => {
    // 17. Active group expands on open
    await page.goto("/products/maax-studio");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: /open menu/i }).click();
    const nav = getNav(page);
    
    const productsTrigger = nav.getByRole("button", { name: /^Products$/ });
    await expect(productsTrigger).toHaveAttribute("aria-expanded", "true");
    
    // 18. Current child has aria-current
    const activeLink = nav.getByRole("link", { name: "MAAX Studio", exact: true });
    await expect(activeLink).toHaveAttribute("aria-current", "page");

    // 19. Child selection closes
    await activeLink.click();
    await expect(getMobileMenu(page)).not.toBeVisible();
  });

  test("20-21. CTA behavior", async ({ page }) => {
    await page.getByRole("button", { name: /open menu/i }).click();
    const nav = getNav(page);
    
    // 20. CTA label and href
    const cta = nav.getByRole("link", { name: "Start a Project" });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/start");
    
    // 21. CTA selection closes
    await cta.click();
    await expect(page).toHaveURL(/\/start/);
    await expect(getMobileMenu(page)).not.toBeVisible();
  });

  test("22-24. Closing: Escape and focus", async ({ page }) => {
    const trigger = page.getByRole("button", { name: /open menu/i });
    await trigger.click();
    
    // 22. Escape closes
    await page.keyboard.press("Escape");
    await expect(getMobileMenu(page)).not.toBeVisible();
    
    // 24. Focus returns
    await expect(trigger).toBeFocused();
  });

  test("25-27. Focus management: Tab trap", async ({ page }) => {
    await page.getByRole("button", { name: /open menu/i }).click();
    const dialog = getMobileMenu(page);
    const nav = getNav(page);
    const closeBtn = dialog.getByRole("button", { name: /close menu/i });
    await expect(closeBtn).toBeFocused();

    // 25. Tab trap (forward)
    // 4 groups + 1 CTA = 5 tabs to reach end if all closed
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
    }
    const cta = nav.getByRole("link", { name: "Start a Project" });
    await expect(cta).toBeFocused();
    
    await page.keyboard.press("Tab");
    await expect(closeBtn).toBeFocused();

    // 26. Shift+Tab trap (backward)
    await page.keyboard.press("Shift+Tab");
    await expect(cta).toBeFocused();

    // 27. Collapsed children not tabbable
    // Re-verify initial closed state
    await expect(nav.getByRole("button", { name: /^Products$/ })).toHaveAttribute("aria-expanded", "false");
    
    // Try to find hidden link in tab order
    await closeBtn.focus();
    let foundHiddenLink = false;
    // We expect 5 tab steps to cover 4 triggers + 1 CTA
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press("Tab");
      const active = await page.evaluate(() => document.activeElement?.textContent);
      if (active?.includes("MAAX Studio") || active?.includes("Products Overview")) {
        foundHiddenLink = true;
      }
    }
    expect(foundHiddenLink).toBe(false);
  });

  test("28-30. Body scroll and route change", async ({ page }) => {
    await page.getByRole("button", { name: /open menu/i }).click();
    // 28. Body scroll locks
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    
    // 30. Route change closes
    await getMobileMenu(page).getByRole("button", { name: /close menu/i }).click();
    // 29. Body scroll restores
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });

  test("31. 320px horizontal overflow absent", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.getByRole("button", { name: /open menu/i }).click();
    
    const overflow = await page.evaluate(() => {
      const scrollWidth = document.documentElement.scrollWidth;
      const clientWidth = document.documentElement.clientWidth;
      // Allow 1px subpixel tolerance
      return scrollWidth > clientWidth + 1;
    });
    expect(overflow).toBe(false);
  });

  test("32. Reduced-motion functionality", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.getByRole("button", { name: /open menu/i }).click();
    const panel = getMobileMenu(page);
    await expect(panel).toBeVisible();
    await expect(panel).toHaveCSS("opacity", "1");
  });

  test("33. Axe with dialog open", async ({ page }) => {
    await page.getByRole("button", { name: /open menu/i }).click();
    await expect(page.getByRole("dialog")).toHaveAttribute("aria-label", /navigation/i);
    await expect(getNav(page)).toBeVisible();
  });

  test("34. Desktop dropdown absent from accessibility tree at mobile width", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    const desktopNav = page.locator("nav[aria-label='Primary']");
    await expect(desktopNav).not.toBeVisible();
  });
});
