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

type RecordedCall = {
  fn: string;
  body: Record<string, unknown> | null;
  signatureValid?: boolean;
  idempotencyKey?: string | null;
};

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

test("homepage hero carries the registered headline and the project CTA", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await openHome(page);

  const heading = page.locator("#hero-heading");
  const primary = page.locator('section[data-hero] a[data-cta="primary"]');
  await expect(heading).toHaveText("The execution layer for enterprise AI.");
  await expect(primary).toHaveText(/Start a project/);
  await expect(primary).toHaveAttribute("href", "/start?source=home");
  // The approved scroll scene is kept: phones read the copy after the film.
  await expect(page.locator("[data-hero-scroll-scene]")).toHaveCount(1);
});

test("a CTA click reaches the CRM as a signed funnel event without personal data", async ({
  page,
  request,
}) => {
  await openHome(page);
  await page.evaluate(() => {
    // Stay on the page so the beacon is observable.
    document
      .querySelector('section[data-hero] a[data-cta="primary"]')
      ?.addEventListener("click", (event) => event.preventDefault());
  });
  await page.locator('section[data-hero] a[data-cta="primary"]').click();

  await expect
    .poll(async () => {
      const calls = (await (await request.get(`${MOCK_ORIGIN}/calls`)).json()) as RecordedCall[];
      return calls.filter((call) => call.fn === "crm_event").at(-1) ?? null;
    })
    .toMatchObject({
      signatureValid: true,
      body: {
        schemaVersion: "1",
        event: "start_project",
        section: "hero",
        path: "/",
        href: "/start",
      },
    });
});

test("the careers talent form reaches the CRM as a signed introduction, not a lead", async ({
  page,
  request,
}) => {
  await page.goto("/careers", { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);
  await page.locator('input[name="name"]').fill("Grace Hopper");
  await page.locator('input[name="email"]').fill("grace@example.com");
  await page.locator('select[name="area"]').selectOption("Product Engineering");
  await page.locator('input[name="profile"]').fill("https://github.com/grace");
  await page.locator('textarea[name="context"]').fill("Compilers and teams.");
  await page.locator('input[name="consent"]').check();
  await page.getByRole("button", { name: "Join the talent network" }).click();
  await expect(page.getByText("Introduction received.")).toBeVisible();

  const calls = (await (await request.get(`${MOCK_ORIGIN}/calls`)).json()) as RecordedCall[];
  const talent = calls.filter((call) => call.fn === "crm_talent").at(-1);
  expect(talent).toMatchObject({
    signatureValid: true,
    body: {
      schemaVersion: "1",
      name: "Grace Hopper",
      email: "grace@example.com",
      area: "Product Engineering",
      profileUrl: "https://github.com/grace",
      introduction: "Compilers and teams.",
    },
  });
  expect(
    calls.some(
      (call) =>
        call.fn === "crm_submit" &&
        (call.body?.contact as { email?: string } | undefined)?.email === "grace@example.com",
    ),
  ).toBe(false);
});

test("retired console and hosting URLs redirect instead of failing", async ({ baseURL, request }) => {
  for (const path of ["/auth", "/workspace", "/workspace/pipeline"]) {
    const response = await request.get(`${baseURL}${path}`, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe("https://crm.cyryxlabs.com/");
  }
  const unsubscribe = await request.get(`${baseURL}/unsubscribe?token=x`, { maxRedirects: 0 });
  expect(unsubscribe.status()).toBe(308);
  expect((await request.get(`${baseURL}/lovable/email/queue/process`)).status()).toBe(410);
});

test("the funnel endpoint refuses cross-site beacons", async ({ baseURL, request }) => {
  const response = await request.post(`${baseURL}/api/public/cta-events`, {
    headers: { origin: "https://evil.example", "content-type": "application/json" },
    data: { cta: "start_project", section: "hero", path: "/" },
  });
  expect(response.status()).toBe(403);
});

test("desktop 1440x900 shows the H1 and primary CTA at load", async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name === "hero-a11y-mobile-360",
    "Desktop layout contract; the mobile project emulates a touch device.",
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await openHome(page);

  await expect(page.locator("#hero-heading")).toBeInViewport();
  await expect(page.locator('section[data-hero] a[data-cta="primary"]')).toBeInViewport({
    ratio: 1,
  });
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
  // With the CRM intake configured (the production path) the lead is signed
  // and sent to the CRM; otherwise it goes to the legacy v2 RPC.
  const crmSubmission = calls.find(
    (call) =>
      call.fn === "crm_submit" &&
      (call.body?.contact as { email?: string } | undefined)?.email === email,
  );
  if (crmSubmission) {
    expect(crmSubmission.signatureValid).toBe(true);
    expect(crmSubmission.idempotencyKey).toMatch(/^web_project_/);
    const body = crmSubmission.body as Record<string, any>;
    expect(body.kind).toBe("project");
    expect(body.requirements.projectType).toBe("Workflow Automation");
    expect(body.requirements.technical.existingSystems).toBe("NetSuite, Slack");
    expect(body.engagement.timeline).toBe("Within 30 days");
    expect(body.source).toMatchObject({
      page: "/start",
      entrySource: "solutions",
      entryIntent: "workflow-automation",
    });
    expect(body.aiFirstReply).toContain("invoice exceptions");
    expect(body.consent.privacyNoticeVersion).toMatch(/^website-contact-/);
    return;
  }
  const submission = calls.find(
    (call) => call.fn === "submit_contact_public_v2" && call.body?.p_email === email,
  );
  expect(submission, "mock recorded neither a CRM intake nor a v2 RPC call").toBeTruthy();
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

test("assistant launcher waits until the visitor scrolls past the hero", async ({ page }) => {
  await openHome(page);
  const launcher = page.getByRole("button", { name: "Ask Cyryx" });
  await expect(launcher).toHaveCount(0);

  await page.evaluate(() => window.scrollTo({ top: window.innerHeight, behavior: "instant" }));
  await expect(launcher).toBeVisible();

  await page.goto("/products", { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);
  await expect(page.getByRole("button", { name: "Ask Cyryx" })).toBeVisible();
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
