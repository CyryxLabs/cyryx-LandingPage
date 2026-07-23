import { expect, test } from "@playwright/test";

test.describe("MAAX Studio early-access funnel", () => {
  test("presents a focused promise and the four required lead fields", async ({ page }) => {
    await page.goto("/products/maax-studio");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Build software with agents",
    );
    await expect(page.locator('input[name="fullName"]')).toHaveAttribute("required", "");
    await expect(page.locator('input[name="email"]')).toHaveAttribute("autocomplete", "email");
    await expect(page.locator('input[name="phone"]')).toHaveAttribute("autocomplete", "tel");
    await expect(page.locator('input[name="country"]')).toHaveAttribute(
      "autocomplete",
      "country-name",
    );
  });

  test("requires explicit consent and links to the privacy policy", async ({ page }) => {
    await page.goto("/products/maax-studio#early-access");

    const consent = page.locator('input[name="consent"]');
    await expect(consent).toHaveAttribute("required", "");
    await expect(consent).not.toBeChecked();
    await expect(page.locator('label:has(input[name="consent"]) a[href="/privacy"]')).toBeVisible();
  });
});
