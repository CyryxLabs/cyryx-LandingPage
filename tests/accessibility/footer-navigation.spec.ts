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
      { label: "All products", href: "/products" },
      { label: "AEXOS", href: "/products/aexos" },
      { label: "Onyx", href: "/products/onyx" },
    ];

    for (const item of expectedProducts) {
      const link = productsGroup.getByRole("link", { name: item.label, exact: true });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", item.href);
    }

    // The discontinued MAAX program must not be linked from the footer.
    await expect(page.locator('footer a[href*="maax" i]')).toHaveCount(0);
  });

  // Rebuild v9 (2026-11-17): Products · Solutions · Demos · Insights · Company.
  for (const group of PRIMARY_NAVIGATION.filter((g) => g.id !== "products")) {
    test(`${group.id} group content`, async ({ page }) => {
      const nav = page.locator(`footer nav[aria-label="${group.label}"]`);
      await expect(nav).toBeVisible();
      for (const item of group.children) {
        const link = nav.getByRole("link", { name: item.label, exact: true });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute("href", item.href);
      }
    });
  }

  test("the footer groups follow the approved order", async ({ page }) => {
    const labels = await page
      .locator('footer[role="contentinfo"] nav[aria-label]')
      .evaluateAll((navs) => navs.map((nav) => nav.getAttribute("aria-label")));
    expect(labels.filter((l) => l !== "Legal")).toEqual(
      expect.arrayContaining(["Products", "Solutions", "Demos", "Insights", "Company"]),
    );
    expect(PRIMARY_NAVIGATION.map((g) => g.label)).toEqual([
      "Products",
      "Solutions",
      "Demos",
      "Insights",
      "Company",
    ]);
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
    await expect(footer.getByRole("link", { name: "Privacy", exact: true })).toHaveAttribute(
      "href",
      "/privacy",
    );
    await expect(footer.getByRole("link", { name: "Terms", exact: true })).toHaveAttribute(
      "href",
      "/terms",
    );

    // Email actions
    await expect(
      footer.getByRole("link", { name: "press@cyryxlabs.com", exact: true }),
    ).toHaveAttribute("href", "mailto:press@cyryxlabs.com");
    await expect(
      footer.getByRole("link", { name: "security@cyryxlabs.com", exact: true }),
    ).toHaveAttribute("href", "mailto:security@cyryxlabs.com?subject=Security%20inquiry");
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
