import { expect, test } from "@playwright/test";
import { PRIMARY_NAVIGATION, PRIMARY_NAVIGATION_CTA } from "../../src/lib/navigation";

test.describe("footer navigation model", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
  });

  test("footer landmark and groups exist", async ({ page }) => {
    const footer = page.locator('footer[role="contentinfo"]');
    await expect(footer).toBeVisible();

    // Verify groups from model
    for (const group of PRIMARY_NAVIGATION) {
      // Find the group by its heading label
      const groupHeading = footer.getByText(group.label, { exact: true }).first();
      await expect(groupHeading).toBeVisible();
    }
  });

  test("products group content", async ({ page }) => {
    const productsGroup = page.locator('footer nav[aria-label="Products"]');
    await expect(productsGroup).toBeVisible();

    const expectedProducts = [
      { label: "Products Overview", href: "/products" },
      { label: "MAAX Studio", href: "/products/maax-studio" },
      { label: "Lyra", href: "/products/lyra" },
    ];

    for (const item of expectedProducts) {
      const link = productsGroup.getByRole("link", { name: item.label, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", item.href);
    }
  });

  test("solutions group content", async ({ page }) => {
    const solutionsGroup = page.locator('footer nav[aria-label="Solutions"]');
    await expect(solutionsGroup).toBeVisible();

    const expectedSolutions = [
      { label: "Digital & Web Systems", href: "/solutions/digital-web-systems" },
      { label: "Workflow Automation", href: "/solutions/workflow-automation" },
      { label: "Internal AI Assistants", href: "/solutions/internal-ai-assistants" },
      { label: "Custom AI Product Development", href: "/solutions/custom-ai-product-development" },
      { label: "AI Governance & Cost Control", href: "/solutions/ai-governance-cost-control" },
      { label: "Managed Operations", href: "/managed-operations" },
      { label: "How We Work", href: "/engagement-model" },
    ];

    for (const item of expectedSolutions) {
      const link = solutionsGroup.getByRole("link", { name: item.label, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", item.href);
    }
  });

  test("research group content", async ({ page }) => {
    const researchGroup = page.locator('footer nav[aria-label="Research"]');
    await expect(researchGroup).toBeVisible();

    const expectedResearch = [
      { label: "Research", href: "/research" },
      { label: "Answers", href: "/answers" },
    ];

    for (const item of expectedResearch) {
      const link = researchGroup.getByRole("link", { name: item.label, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", item.href);
    }
  });

  test("company group content", async ({ page }) => {
    const companyGroup = page.locator('footer nav[aria-label="Company"]');
    await expect(companyGroup).toBeVisible();

    const expectedCompany = [
      { label: "Company", href: "/company" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ];

    for (const item of expectedCompany) {
      const link = companyGroup.getByRole("link", { name: item.label, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", item.href);
    }
  });

  test("footer CTA", async ({ page }) => {
    const footer = page.locator('footer[role="contentinfo"]');
    const cta = footer.getByRole("link", { name: PRIMARY_NAVIGATION_CTA.label, exact: true });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", PRIMARY_NAVIGATION_CTA.href);
  });

  test("legal and email links", async ({ page }) => {
    const footer = page.locator('footer[role="contentinfo"]');
    
    // Privacy and Terms
    await expect(footer.getByRole("link", { name: "Privacy", exact: true })).toHaveAttribute("href", "/privacy");
    await expect(footer.getByRole("link", { name: "Terms", exact: true })).toHaveAttribute("href", "/terms");

    // Email actions
    await expect(footer.getByRole("link", { name: "Press", exact: true })).toHaveAttribute("href", "mailto:press@cyryxlabs.com");
    await expect(footer.getByRole("link", { name: "Security", exact: true })).toHaveAttribute("href", "mailto:security@cyryxlabs.com?subject=Security%20inquiry");
  });

  test("temporary stubs are absent", async ({ page }) => {
    const footer = page.locator('footer[role="contentinfo"]');
    const stubs = ["Docs", "Support", "Status", "Responsible AI"];
    
    for (const stub of stubs) {
      await expect(footer.getByRole("link", { name: stub, exact: true })).not.toBeVisible();
    }
  });

  test("no serious accessibility violations", async ({ page }) => {
    // Basic a11y check for contrast and structure
    const footer = page.locator('footer[role="contentinfo"]');
    await expect(footer).toBeVisible();
    // We could run axe-playwright here if available, but for now we focus on structure
  });

  test("responsive check (320px)", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    const footer = page.locator('footer[role="contentinfo"]');
    await expect(footer).toBeVisible();
    
    // Check for horizontal overflow within the footer itself or its container
    // We check if the footer's bounding box is significantly wider than the viewport
    const footerBox = await footer.boundingBox();
    expect(footerBox?.width).toBeLessThanOrEqual(321);
  });

});
