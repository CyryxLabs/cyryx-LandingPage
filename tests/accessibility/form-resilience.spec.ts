import { expect, test, type Page } from "@playwright/test";
import { expectPageHydrated } from "../support/page-ready";

type Mode = "error" | "interrupted" | "success";

async function mockSubmission(page: Page, endpoint: string) {
  let mode: Mode = "error";
  let payload: Record<string, unknown> = {};
  await page.route(`**${endpoint}`, async (route) => {
    payload = route.request().postDataJSON();
    if (mode === "interrupted") return route.abort("failed");
    await route.fulfill({
      status: mode === "success" ? 200 : 503,
      json:
        mode === "success"
          ? {
              ok: true,
              id: "local-review-only",
              reference: "LOCAL-REVIEW",
              queued: true,
              confirmationQueued: true,
            }
          : { ok: false, error: "Local mock unavailable" },
    });
  });
  return {
    setMode: (value: Mode) => {
      mode = value;
    },
    payload: () => payload,
  };
}

test("project form retains every entered field across server and interrupted-request errors", async ({
  page,
}) => {
  const mock = await mockSubmission(page, "/api/public/contact");
  await page.goto("/start?source=home");
  await expectPageHydrated(page);
  await page.locator('input[name="name"]').fill("Local Review");
  await page.locator('input[name="email"]').fill("review@example.com");
  await page.locator('input[name="company"]').fill("Local Example");
  await page.locator('select[name="projectType"]').selectOption("Workflow Automation");
  await page
    .locator('textarea[name="problem"]')
    .fill("Route invoice exceptions to the right reviewer.");
  await page.locator('input[name="consent"]').check();
  await expect(page.locator('label:has(input[name="consent"]) a')).toHaveAttribute(
    "href",
    "/privacy",
  );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.locator('textarea[name="systems"]').fill("ERP and shared inbox");
  for (const mode of ["error", "interrupted"] as const) {
    mock.setMode(mode);
    await page.getByRole("button", { name: "Send project brief" }).click();
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByRole("button", { name: "Send project brief" })).toBeEnabled();
    await expect(page.locator('textarea[name="systems"]')).toHaveValue("ERP and shared inbox");
    await expect(page.getByText("Your brief has been recorded")).toHaveCount(0);
  }
  mock.setMode("success");
  await page.getByRole("button", { name: "Send project brief" }).click();
  await expect(page.getByText("Your brief has been recorded")).toBeVisible();
  expect(mock.payload()).toMatchObject({
    name: "Local Review",
    consent: true,
    source: "home",
    systems: "ERP and shared inbox",
    website: "",
  });
});

test("talent form handles failure, interruption and successful retry with consent intact", async ({
  page,
}) => {
  const mock = await mockSubmission(page, "/api/public/talent");
  await page.goto("/careers");
  await expectPageHydrated(page);
  await page.locator('input[name="name"]').fill("Local Review");
  await page.locator('input[name="email"]').fill("review@example.com");
  await page.locator('select[name="area"]').selectOption("Product Engineering");
  await page.locator('input[name="consent"]').check();
  const send = page.getByRole("button", { name: "Join the talent network", exact: true });
  for (const mode of ["error", "interrupted"] as const) {
    mock.setMode(mode);
    await send.click();
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.locator('input[name="email"]')).toHaveValue("review@example.com");
    await expect(send).toBeEnabled();
  }
  mock.setMode("success");
  await send.click();
  await expect(page.getByText("Introduction received.")).toBeVisible();
  expect(mock.payload()).toMatchObject({ consent: true, website: "", area: "Product Engineering" });
});

test("assistant lead form preserves consent and entered data through failure and retry", async ({
  page,
}) => {
  const mock = await mockSubmission(page, "/api/public/contact");
  await page.goto("/products");
  await expectPageHydrated(page);
  await page.getByRole("button", { name: "Ask Cyryx", exact: true }).click();
  const panel = page.getByRole("dialog", { name: "Cyryx assistant" });
  await panel.getByRole("button", { name: "Talk to the team" }).click();
  await panel.getByLabel("Name", { exact: true }).fill("Local Review");
  await panel.getByLabel("Work email").fill("review@example.com");
  await panel.getByLabel("Company", { exact: true }).fill("Local Example");
  await panel
    .getByLabel("What do you want to change?")
    .fill("Route invoice exceptions to the right reviewer.");
  await panel.locator('input[name="consent"]').check();
  const send = panel.getByRole("button", { name: "Send to the team" });
  for (const mode of ["error", "interrupted"] as const) {
    mock.setMode(mode);
    await send.click();
    await expect(panel.getByRole("alert")).toBeVisible();
    await expect(panel.getByLabel("Work email")).toHaveValue("review@example.com");
    await expect(send).toBeEnabled();
  }
  mock.setMode("success");
  await send.click();
  await expect(panel.getByRole("status")).toContainText("Sent.");
  expect(mock.payload()).toMatchObject({ consent: true, source: "assistant", website: "" });
});

test("brief retains its draft after server failure and network interruption", async ({ page }) => {
  const mock = await mockSubmission(page, "/api/public/brief/submit");
  await page.goto("/brief");
  await expectPageHydrated(page);
  await page.getByLabel("Project name").fill("Local review system");
  await page
    .getByLabel("Describe what you need")
    .fill("We need a workflow that routes invoice exceptions to the right reviewer.");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByLabel("The problem")
    .fill("Manual invoice exceptions need to reach the right reviewer with a complete record.");
  for (let step = 1; step < 7; step++)
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Full name").fill("Local Review");
  await page.getByLabel("Work email").fill("review@example.com");
  await page.getByRole("textbox", { name: "Company", exact: true }).fill("Local Example");
  await page.getByRole("checkbox", { name: /I agree that Cyryx Labs stores this brief/ }).check();
  const send = page.getByRole("button", { name: "Send my brief" });
  for (const mode of ["error", "interrupted"] as const) {
    mock.setMode(mode);
    await send.click();
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page.getByLabel("Work email")).toHaveValue("review@example.com");
    await expect(send).toBeEnabled();
  }
  mock.setMode("success");
  await send.click();
  await expect(page.getByText("Thank you. Your brief is with our team.")).toBeVisible();
  expect(mock.payload()).toMatchObject({ consent: true, marketingOptIn: false });
});
