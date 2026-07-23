import { test, expect } from "@playwright/test";

test.describe.configure({ mode: "serial" });

const EXPECTED_TOP_LEVEL = ["Products", "Solutions", "Research", "Company", "Start a Project"];
const ROUTES = ["/", "/products/maax-studio", "/solutions", "/research", "/company", "/contact"];

for (const route of ROUTES) {
  test(`desktop nav order + no Answers @ ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(route, { waitUntil: "domcontentloaded", timeout: 60_000 });
    
    // Check top-level triggers + CTA
    // HeaderDropdown triggers are buttons inside [role="menuitem"] if Radix default structure is followed, 
    // or we check the specific navigation landmark.
    const topLevelElements = page.locator('header nav[aria-label="Primary"] button[data-radix-collection-item], header a[aria-label="Start a Project"]');
    
    const labels = await topLevelElements.evaluateAll((els) => 
      els.map((e) => (e.textContent ?? "").trim().replace(/\s+/g, " "))
    );
    
    const normalized = labels.map((l) => l.replace(/\s*→\s*$/i, "").trim());
    expect(normalized).toEqual(EXPECTED_TOP_LEVEL);
    
    // Verify Answers is not a top-level trigger
    expect(labels.join("|")).not.toMatch(/Answers/i);
  });
}

test("mobile nav order + no Answers", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/", { waitUntil: "domcontentloaded", timeout: 60_000 });
  
  const openBtn = page.getByRole("button", { name: /open menu/i });
  await expect(openBtn).toBeVisible();
  
  // Try to click until the dialog is visible (handling hydration/GSAP race)
  await expect(async () => {
    await openBtn.click();
    await expect(page.locator("#cyryx-mobile-navigation")).toBeVisible({ timeout: 2000 });
  }).toPass();
  
  const dialog = page.locator("#cyryx-mobile-navigation");
  
  // Accordion triggers for groups
  const triggers = dialog.locator('nav[aria-label="Mobile primary"] button[data-state]');
  const groupLabels = await triggers.evaluateAll((els) => 
    els.map((e) => e.textContent?.trim().replace(/\s+/g, " ") ?? "")
  );
  
  const EXPECTED_GROUPS = ["Products", "Solutions", "Research", "Company"];
  expect(groupLabels).toEqual(EXPECTED_GROUPS);
  
  // CTA
  const cta = dialog.locator('a[href="/start"]');
  await expect(cta).toBeVisible();
  const ctaText = (await cta.textContent())?.trim().replace(/\s*→\s*$/i, "") ?? "";
  expect(ctaText).toBe("Start a Project");
  
  // Verify Answers is not a group trigger
  expect(groupLabels.join("|")).not.toMatch(/Answers/i);
});


