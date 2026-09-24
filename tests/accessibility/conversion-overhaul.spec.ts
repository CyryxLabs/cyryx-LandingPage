import { expect, test, type Page } from "@playwright/test";
import { expectPageHydrated } from "../support/page-ready";

/**
 * Contracts introduced by the conversion overhaul (Sep 2026): MAAX retirement,
 * a first-viewport hero on every device, the two-step /start brief with an
 * instant first read, the Cyryx assistant, and the hero copy option B.
 *
 * The production test server talks to tests/support/mock-gemini-server.mjs for
 * both Supabase RPCs and Gemini (SUPABASE_URL / GEMINI_API_BASE).
 */
const MOCK_ORIGIN = process.env.MOCK_GEMINI_ORIGIN ?? "http://127.0.0.1:4599";

type RecordedCall = { fn: string; body: Record<string, unknown> | null };

async function openHome(page: Page, path = "/") {
  await page.goto(path, { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);
}

test("discontinued /products/maax-studio permanently redirects to /products", async ({
  baseURL,
  request,
}) => {
  const response = await request.get(`${baseURL}/products/maax-studio`, { maxRedirects: 0 });
  expect(response.status()).toBe(308);
  expect(new URL(response.headers().location!, baseURL).pathname).toBe("/products");

  const destination = await request.get(`${baseURL}/products`, { maxRedirects: 0 });
  expect(destination.status()).toBe(200);
  expect(await destination.text()).not.toMatch(/MAAX/);
});

test("homepage at 360x800 shows the H1 and primary CTA inside the first viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openHome(page);

  const heading = page.locator("#hero-heading");
  const primary = page.locator('section[data-hero] a[data-cta="primary"]');
  await expect(heading).toHaveText("The execution layer for enterprise AI.");
  await expect(primary).toHaveText(/Start a project/);

  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  for (const [name, locator] of [
    ["H1", heading],
    ["primary CTA", primary],
  ] as const) {
    const box = await locator.boundingBox();
    expect(box, `${name} has no layout box`).not.toBeNull();
    expect(box!.y, `${name} starts above the viewport`).toBeGreaterThanOrEqual(0);
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y + box!.height, `${name} ends below the first viewport`).toBeLessThanOrEqual(800);
    expect(box!.x + box!.width).toBeLessThanOrEqual(360);
  }
});

test("desktop 1440x900 shows the primary CTA at load and keeps it pinned while scrolling", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === "hero-a11y-mobile-360",
    "Desktop layout contract; the mobile project emulates a touch device.",
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await openHome(page);

  const primary = page.locator('section[data-hero] a[data-cta="primary"]');
  await expect(primary).toBeInViewport({ ratio: 1 });
  const before = await primary.boundingBox();
  expect(before).not.toBeNull();

  await page.evaluate(() => window.scrollTo({ top: 400, behavior: "instant" }));
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY))).toBe(400);
  await expect(primary).toBeInViewport({ ratio: 1 });

  // The sticky stage pins the copy for one extra viewport of scroll. Forced
  // colors and reduced motion deliberately collapse the scene instead.
  const collapsed = await page.evaluate(
    () =>
      matchMedia("(forced-colors: active)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  if (!collapsed) {
    const after = await primary.boundingBox();
    expect(Math.abs(after!.y - before!.y), "primary CTA should stay pinned").toBeLessThan(2);
  }
});

test("/start two-step brief ends with the instant first read and a structured v2 record", async ({
  page,
  request,
}) => {
  const email = `first-read-${Date.now()}-${test.info().project.name}@example.com`;
  await page.goto("/start?source=solutions&intent=workflow-automation");
  await expectPageHydrated(page);

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Tell us what you want AI to change.",
  );
  await expect(page).toHaveTitle("Start a Project — Cyryx Labs");
  await expect(page.getByLabel("What kind of work?")).toHaveValue("Workflow Automation");

  await page.getByLabel("Full name").fill("Ada Lovelace");
  await page.getByLabel("Work email").fill(email);
  await page.locator('input[name="company"]').fill("Analytical Engines Ltd");
  await page
    .getByLabel("What do you want to change?")
    .fill("Route invoice exceptions to the right approver without manual triage.");
  await page.locator('input[name="consent"]').check();
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByText("Step 2 of 2")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Anything else that helps us prepare?" }),
  ).toBeFocused();
  for (const label of [
    "Desired outcome",
    "Why now",
    "Budget range",
    "Timeline",
    "Your role in the decision",
    "Role or title",
    "Company website",
    "Current stage",
    "Systems or data involved",
    "Anything else",
  ]) {
    // Selects nested in their <label> include the current option in their
    // accessible name ("Budget range Select…"), so match by prefix.
    await expect(page.getByLabel(label)).toBeVisible();
  }
  await expect(page.getByRole("button", { name: "Back" })).toBeVisible();
  await page.getByLabel("Timeline").selectOption("Within 30 days");
  await page.getByLabel("Systems or data involved").fill("NetSuite, Slack");
  await page.getByRole("button", { name: "Send project brief" }).click();

  const success = page.getByRole("status").filter({ hasText: "Received" });
  await expect(success.getByText("Here is a first read of your request.")).toBeVisible({
    timeout: 20_000,
  });
  await expect(success).toContainText("invoice exceptions");
  await expect(success).toContainText("A person on our team reviews every brief");

  const response = await request.get(`${MOCK_ORIGIN}/calls`);
  expect(response.ok()).toBe(true);
  const calls = (await response.json()) as RecordedCall[];
  const submission = calls.find(
    (call) => call.fn === "submit_contact_public_v2" && call.body?.p_email === email,
  );
  expect(submission, "mock did not record a submit_contact_public_v2 call").toBeTruthy();
  const qualification = submission!.body!.p_qualification as Record<string, unknown>;
  expect(qualification.project_type).toBe("Workflow Automation");
  expect(qualification).toMatchObject({
    source: "solutions",
    intent: "workflow-automation",
    timeline: "Within 30 days",
  });
});

test("assistant opens from the hero, streams an answer, and hands off to the team", async ({
  page,
}) => {
  await openHome(page);
  const hero = page.locator("section[data-hero]");

  const entry = hero.getByRole("button", {
    name: "Have a question first? Ask the Cyryx assistant. It answers in seconds.",
  });
  await expect(entry).toBeVisible();
  await entry.click();

  const panel = page.getByRole("dialog", { name: "Cyryx assistant" });
  await expect(panel).toBeVisible();
  await expect(panel.getByLabel("Your question")).toBeFocused();

  const assistantResponse = page.waitForResponse("**/api/public/assistant");
  await panel.getByRole("button", { name: "Where should we start?" }).click();
  expect((await assistantResponse).status()).toBe(200);

  await expect(panel.locator(".cx-assistant-msg--user")).toHaveText("Where should we start?");
  await expect(panel.locator(".cx-assistant-msg").last()).toContainText("Advise", {
    timeout: 15_000,
  });
  await expect(panel.locator(".cx-assistant-msg").last()).toContainText(
    "Want to tell me about yours?",
  );
  // Suggestions are only offered on an empty thread.
  await expect(panel.getByRole("button", { name: "Where should we start?" })).toHaveCount(0);

  await panel.getByRole("button", { name: "Talk to the team" }).click();
  await expect(
    panel.getByText("Leave your details and a person from Cyryx will follow up."),
  ).toBeVisible();
  await expect(panel.getByLabel("Name", { exact: true })).toBeVisible();
  await expect(panel.getByLabel("Work email")).toBeVisible();
  await expect(panel.getByLabel("What do you want to change?")).toHaveValue(
    "Where should we start?",
  );
  await expect(panel.getByRole("button", { name: "Send to the team" })).toBeVisible();
});

test("assistant launcher waits until the visitor scrolls past the hero and is hidden on /auth", async ({
  page,
}) => {
  await openHome(page);
  const launcher = page.getByRole("button", { name: "Ask Cyryx" });
  await expect(launcher).toHaveCount(0);

  await page.evaluate(() => window.scrollTo({ top: window.innerHeight, behavior: "instant" }));
  await expect(launcher).toBeVisible();

  await page.goto("/products", { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);
  await expect(page.getByRole("button", { name: "Ask Cyryx" })).toBeVisible();

  await page.goto("/auth", { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);
  await expect(page.getByRole("button", { name: "Ask Cyryx" })).toHaveCount(0);
});

test("closing the assistant with its close button returns focus to the launcher", async ({
  page,
}) => {
  await page.goto("/products", { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);
  await page.getByRole("button", { name: "Ask Cyryx" }).click();
  const panel = page.getByRole("dialog", { name: "Cyryx assistant" });
  await expect(panel).toBeVisible();
  await panel.getByRole("button", { name: "Close assistant" }).click();
  await expect(panel).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Ask Cyryx" })).toBeFocused();
});

// Currently fails: the Escape handler focuses the launcher synchronously while
// it is still unmounted (AssistantWidget renders it only when the panel is
// closed), so focus falls back to <body>. Kept as a real accessibility defect.
test("closing the assistant with Escape returns focus to the control that opened it", async ({
  page,
}) => {
  await page.goto("/products", { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);
  const launcher = page.getByRole("button", { name: "Ask Cyryx" });
  await launcher.click();
  const panel = page.getByRole("dialog", { name: "Cyryx assistant" });
  await expect(panel.getByLabel("Your question")).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Ask Cyryx" })).toBeFocused();
});

test("?copy=v4b renders hero option B and ?copy=v4a restores the default", async ({ page }) => {
  await openHome(page, "/?copy=v4b");
  await expect(page.locator("#hero-heading")).toHaveText(
    "Put AI to work in your operations, without losing control of it.",
  );
  await expect(page.locator("section[data-hero]")).toContainText(
    "Cyryx Labs builds agents, automations and internal assistants",
  );
  await expect(page.locator('section[data-hero] a[data-cta="primary"]')).toHaveText(
    /Start a project/,
  );

  // The choice is pinned in this browser...
  await openHome(page, "/");
  await expect(page.locator("#hero-heading")).toHaveText(
    "Put AI to work in your operations, without losing control of it.",
  );

  // ...until the visitor opts back into the default.
  await openHome(page, "/?copy=v4a");
  await expect(page.locator("#hero-heading")).toHaveText("The execution layer for enterprise AI.");
});
