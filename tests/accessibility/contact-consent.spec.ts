import { expect, test } from "@playwright/test";
import { ContactSchema } from "../../src/lib/contact.schema";
import { expectPageHydrated } from "../support/page-ready";

test.describe("Contact form consent — client", () => {
  test("project qualification requires explicit consent", async ({ page }) => {
    await page.goto("/start");
    await expectPageHydrated(page);
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

  test("context is allowlisted, preselected, editable, and persisted through the public API", async ({
    page,
  }) => {
    let requestBody: Record<string, unknown> | undefined;
    await page.route("**/api/public/contact", async (route) => {
      requestBody = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, confirmationQueued: true }),
      });
    });

    await page.goto("/start?source=solutions&intent=workflow-automation");
    await expectPageHydrated(page);
    await expect(page.getByText("Solutions overview / Workflow Automation")).toBeVisible();
    const projectType = page.locator('select[name="projectType"]');
    await expect(projectType).toHaveValue("Workflow Automation");
    await projectType.selectOption({ label: "AI Governance & Cost Control" });

    await page.getByLabel("Full name").fill("Ada Lovelace");
    await page.getByLabel("Work email").fill("ada@example.com");
    await page.locator('input[name="company"]').fill("Analytical Engines Ltd");
    await page.getByLabel("Primary problem").fill("A manual handoff loses review context.");
    await page.getByLabel("Desired outcome").fill("A controlled and reviewable operating path.");
    await page
      .getByLabel("Why now or timing context")
      .fill("The next operating cycle makes evaluation worthwhile now.");
    await page.locator('input[name="consent"]').check();
    await page.getByRole("button", { name: "Start a fit review" }).click();

    await expect(page.getByText("Your submission has been recorded")).toBeVisible();
    await expect(page.getByText(/confirmation email is being processed/i)).toBeVisible();
    expect(requestBody).toMatchObject({
      projectType: "AI Governance & Cost Control",
      source: "solutions",
      intent: "workflow-automation",
      consent: true,
    });
  });

  test("does not render success when the persistence boundary rejects the submission", async ({
    page,
  }) => {
    await page.route("**/api/public/contact", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ ok: false, error: "Backend unavailable" }),
      }),
    );
    await page.goto("/start");
    await expectPageHydrated(page);
    await page.getByLabel("Full name").fill("Grace Hopper");
    await page.getByLabel("Work email").fill("grace@example.com");
    await page.locator('input[name="company"]').fill("Compiler Systems");
    await page.locator('select[name="projectType"]').selectOption("Workflow Automation");
    await page.getByLabel("Primary problem").fill("A manual handoff loses review context.");
    await page.getByLabel("Desired outcome").fill("A controlled and reviewable operating path.");
    await page
      .getByLabel("Why now or timing context")
      .fill("There is no fixed deadline, but the current process merits review.");
    await page.locator('input[name="consent"]').check();
    await page.getByRole("button", { name: "Start a fit review" }).click();

    await expect(page.getByRole("alert")).toContainText("Backend unavailable");
    await expect(page.getByText("Your submission has been recorded")).toHaveCount(0);
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
