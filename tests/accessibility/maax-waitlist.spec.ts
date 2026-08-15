import { expect, test } from "@playwright/test";
import { expectPageHydrated } from "../support/page-ready";

test.describe("MAAX Studio early-access funnel", () => {
  test("opens the early-access form in an accessible modal", async ({ page }) => {
    await page.goto("/products/maax-studio");
    await expectPageHydrated(page);
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Build software with agents",
    );
    await expect(page.locator('input[name="fullName"]')).toHaveCount(0);

    await page.getByRole("button", { name: "Request early-access review" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("dialog")).toContainText("Be considered for the next access wave");
    await expect(page.locator('input[name="fullName"]')).toHaveAttribute("required", "");
    await expect(page.locator('input[name="email"]')).toHaveAttribute("autocomplete", "email");
    await expect(page.locator('input[name="company"]')).toHaveAttribute("required", "");
    await expect(page.locator('input[name="role"]')).toHaveAttribute("required", "");
    await expect(page.locator('textarea[name="useCase"]')).toHaveAttribute("required", "");
    await expect(page.locator('textarea[name="operatingConstraint"]')).toHaveAttribute(
      "required",
      "",
    );
    await expect(page.locator('input[name="phone"]')).not.toHaveAttribute("required", "");
    await expect(page.locator('input[name="phone"]')).toHaveAttribute("autocomplete", "tel");
    await expect(page.locator('input[name="country"]')).toHaveAttribute(
      "autocomplete",
      "country-name",
    );
  });

  test("requires explicit consent and links to the privacy policy", async ({ page }) => {
    await page.goto("/products/maax-studio#early-access");
    await expectPageHydrated(page);
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Open early-access form" }).click();

    const consent = page.locator('input[name="consent"]');
    await expect(consent).toHaveAttribute("required", "");
    await expect(consent).not.toBeChecked();
    await expect(page.locator('label:has(input[name="consent"]) a[href="/privacy"]')).toBeVisible();
  });

  test("closes the modal with Escape and restores focus to its trigger", async ({ page }) => {
    await page.goto("/products/maax-studio");
    await expectPageHydrated(page);
    await page.waitForLoadState("networkidle");

    const trigger = page.getByRole("button", { name: "Request early-access review" });
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("opens the dedicated waitlist from the homepage MAAX call to action", async ({ page }) => {
    await page.goto("/");
    await expectPageHydrated(page);

    await page.getByRole("button", { name: "Request early-access review" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.locator('input[name="fullName"]')).toBeVisible();
  });

  test("validates qualification context and preserves optional telephone semantics", async ({
    page,
  }) => {
    await page.goto("/products/maax-studio");
    await expectPageHydrated(page);
    await page.getByRole("button", { name: "Request early-access review" }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Request early-access review", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText("highlighted fields");
    await expect(dialog.locator('input[name="company"]')).toHaveAttribute("aria-invalid", "true");
    await expect(dialog.locator('textarea[name="useCase"]')).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    await expect(dialog.locator('input[name="phone"]')).not.toHaveAttribute("aria-invalid", "true");
  });
});
