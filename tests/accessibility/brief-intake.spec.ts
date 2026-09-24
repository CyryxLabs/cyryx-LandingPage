import { expect, test, type Page } from "@playwright/test";
import { expectPageHydrated } from "../support/page-ready";

const MOCK_ORIGIN = "http://127.0.0.1:4599";

type RecordedCall = {
  fn: string;
  body: Record<string, any> | null;
  signatureValid?: boolean;
  idempotencyKey?: string | null;
};

// 1x1 PNG
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

async function openBrief(page: Page) {
  await page.goto("/brief", { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);
  await page.evaluate(() => {
    try {
      window.localStorage.removeItem("cyryx-brief-draft-v1");
    } catch {
      /* ignore */
    }
  });
}

test("brief page presents the offer and an eight-step brief", async ({ page }) => {
  await openBrief(page);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Tell us what to build.");
  await expect(page).toHaveTitle(/Project Brief/);
  await expect(page.getByRole("heading", { name: "Start with what you know." })).toBeVisible();
  await expect(page.getByLabel("Describe what you need")).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("brief drafts with AI, uploads a signed file and reaches the CRM", async ({
  page,
  request,
}) => {
  test.setTimeout(90_000);
  const email = `brief-${Date.now()}-${test.info().project.name}@example.com`;
  await openBrief(page);
  const started = Date.now();

  await page
    .getByLabel("Describe what you need")
    .fill(
      "We run 40 clinics and schedule staff in spreadsheets. We want a web app where managers publish shifts, staff swap them, and payroll gets an export every two weeks.",
    );
  const draft = page.getByRole("button", { name: "Draft my brief" });
  if (await draft.isVisible()) {
    await draft.click();
    await expect(page.getByText(/Drafted \d+ sections/)).toBeVisible({ timeout: 20_000 });
    await expect(page.getByLabel("Project name")).toHaveValue("Shift scheduling");
  } else {
    await page.getByLabel("Project name").fill("Shift scheduling");
  }

  const next = page.getByRole("button", { name: "Continue" });
  await next.click(); // problem
  if (!(await page.getByLabel("The problem").inputValue())) {
    await page
      .getByLabel("The problem")
      .fill("Managers schedule 40 clinics in spreadsheets, which takes hours every week.");
  }
  await page.getByLabel("How you will measure success").fill("Scheduling time under 1 hour a week");
  await page.getByLabel("How you will measure success").press("Enter");
  await next.click(); // users
  await next.click(); // scope
  await expect(page.getByText("Must · Publish weekly shifts")).toBeVisible();
  await next.click(); // systems
  await next.click(); // quality
  await next.click(); // files
  await page.locator('input[type="file"]').setInputFiles({
    name: "current-schedule.png",
    mimeType: "image/png",
    buffer: PNG,
  });
  await page.getByLabel("What is current-schedule.png?").fill("Today's spreadsheet");
  await page.getByLabel("Budget range").selectOption("$25,000–$75,000");
  await next.click(); // review

  await page.getByLabel("Full name").fill("Grace Hopper");
  await page.getByLabel("Work email").fill(email);
  await page.getByRole("textbox", { name: "Company", exact: true }).fill("Clinic Group");
  await page.getByRole("checkbox", { name: /I agree that Cyryx Labs stores this brief/ }).check();
  await expect(page.getByText("# Shift scheduling")).toBeVisible();

  // The server ignores submissions filled in under 8 seconds (bot guard).
  const wait = 8_500 - (Date.now() - started);
  if (wait > 0) await page.waitForTimeout(wait);
  await page.getByRole("button", { name: "Send my brief" }).click();
  await expect(page.getByText("Thank you. Your brief is with our team.")).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByRole("button", { name: "Download your brief" })).toBeVisible();

  const calls = (await (await request.get(`${MOCK_ORIGIN}/calls`)).json()) as RecordedCall[];
  const init = calls.find((c) => c.fn === "crm_init" && c.body?.email === email);
  expect(init?.signatureValid).toBe(true);
  expect(init?.body?.files?.[0]).toMatchObject({ name: "current-schedule.png", mime: "image/png" });
  expect(
    calls.some(
      (c) => c.fn === "crm_upload" && String(c.body?.path).includes("current-schedule.png"),
    ),
  ).toBe(true);
  const submit = calls.find((c) => c.fn === "crm_submit" && c.body?.contact?.email === email);
  expect(submit?.signatureValid).toBe(true);
  expect(submit?.idempotencyKey).toMatch(/^web_brief_/);
  expect(submit?.body?.kind).toBe("brief");
  expect(submit?.body?.requirements?.projectName).toBe("Shift scheduling");
  expect(submit?.body?.attachments?.[0]).toMatchObject({
    name: "current-schedule.png",
    mime: "image/png",
    caption: "Today's spreadsheet",
  });
  expect(submit?.body?.attachments?.[0]?.sha256).toMatch(/^[a-f0-9]{64}$/);
  expect(submit?.body?.quality?.score).toBeGreaterThan(0);
  expect(submit?.body?.consent?.privacyNoticeVersion).toMatch(/^website-brief-/);
});

test("brief asks for contact details and consent before sending", async ({ page }) => {
  await openBrief(page);
  await page.getByLabel("Project name").fill("Test");
  for (let i = 0; i < 7; i += 1) await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Send my brief" }).click();
  await expect(page.getByText("Your name is required.")).toBeVisible();
  await expect(page.getByText("Enter a valid work email.")).toBeVisible();
  await expect(page.getByText("Please accept so we can process your brief.")).toBeVisible();
});
