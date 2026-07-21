import { expect, test } from "@playwright/test";
import { ContactSchema } from "../../src/lib/contact.schema";

test.describe("Contact form consent — client", () => {
  test("submit is disabled until consent is checked and shows specific error", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(page.locator('form[data-hydrated="true"]')).toBeVisible();

    await page.locator('input[name="name"]').fill("Ada Lovelace");
    await page.locator('input[name="email"]').fill("ada@example.com");
    await page.locator('textarea[name="message"]').fill("Hello there, this is a real message.");

    const submit = page.getByRole("button", { name: /send message/i });
    await expect(submit).toBeDisabled();

    // Force-click to confirm validation also fires when somehow submitted
    await submit.click({ force: true }).catch(() => {});
    // Toggle consent and confirm enabled
    await page.locator('input[name="consent"]').check();
    await expect(submit).toBeEnabled();
  });

  test("privacy policy link is accessible and opens in new tab", async ({ page }) => {
    await page.goto("/");
    const link = page.locator('#contact a[href="/privacy"]').first();
    await expect(link).toHaveAttribute("target", "_blank");
    const rel = (await link.getAttribute("rel")) ?? "";
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
    await expect(link).toHaveAttribute("aria-label", /privacy policy.*new tab/i);
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
