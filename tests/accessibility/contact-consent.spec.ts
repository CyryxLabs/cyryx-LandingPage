import { expect, test } from "@playwright/test";
import { ContactSchema } from "../../src/lib/contact.schema";

test.describe("Contact form consent — client", () => {
  test("project qualification requires explicit consent", async ({ page }) => {
    await page.goto("/start");
    const consent = page.locator('input[name="consent"]');
    await expect(consent).toHaveAttribute("required", "");
    await expect(consent).not.toBeChecked();
    await consent.check();
    await expect(consent).toBeChecked();
  });

  test("privacy policy link is accessible from the consent block", async ({ page }) => {
    await page.goto("/start");
    const link = page.locator('label:has(input[name="consent"]) a[href="/privacy"]');
    await expect(link).toBeVisible();
    await expect(link).toHaveText(/privacy policy/i);
  });
});

test.describe("Contact form consent — server schema", () => {
  test("rejects payload when consent is false", () => {
    const result = ContactSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      company: "",
      message: "Hello there, this is a real message.",
      consent: false,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const consentIssue = result.error.issues.find((i) => i.path[0] === "consent");
      expect(consentIssue?.message).toMatch(/consent/i);
    }
  });

  test("accepts payload when consent is true", () => {
    const result = ContactSchema.safeParse({
      name: "Ada",
      email: "ada@example.com",
      company: "",
      message: "Hello there, this is a real message.",
      consent: true,
    });
    expect(result.success).toBe(true);
  });
});
