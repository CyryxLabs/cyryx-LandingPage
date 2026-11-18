import { expect, test } from "@playwright/test";
import { expectPageHydrated } from "../support/page-ready";

/**
 * Home of the rebuild v9 (2026-11-17): a still metallic plate behind the hero,
 * three readable workflow surfaces labelled as sample data, an interactive
 * workflow demo driven by the visitor, and a close that hands an intent to
 * /start. No film, no frame sequence, no monolith, no crest, no price.
 */
const RETIRED_MEDIA_RE = /\/media\/(hero-sequence|hero-film)\//i;

for (const viewport of [
  { name: "desktop", width: 1280, height: 900 },
  { name: "phone", width: 390, height: 844 },
]) {
  test(`${viewport.name}: the hero is a still plate with labelled sample surfaces`, async ({
    page,
  }) => {
    const hits: string[] = [];
    page.on("request", (request) => {
      if (RETIRED_MEDIA_RE.test(request.url())) hits.push(request.url());
    });
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "networkidle", timeout: 60_000 });
    await expectPageHydrated(page);
    expect(hits).toEqual([]);
    const hero = page.locator("section[data-hero]");
    await expect(hero.locator("video, canvas")).toHaveCount(0);
    // The plate is decorative.
    await expect(hero.locator(".hm-plate")).toHaveAttribute("aria-hidden", "true");
    await expect(hero.locator(".hm-plate img")).toHaveAttribute("alt", "");
    await expect(hero.getByRole("img", { name: /sample data/i })).toHaveCount(1);
    await expect(page.locator('img[src*="monolith"], img[src*="brand-mark"]')).toHaveCount(0);
    const layout = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
  });
}

test("the workflow demo is labelled as sample data and states no price or result", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const demo = page.locator("#workflow");
  await demo.scrollIntoViewIfNeeded();
  await expect(demo).toContainText("Sample data");
  await expect(demo).toContainText("Illustrative workflow using sample data.");
  await expect(demo.getByRole("list", { name: "Workflow steps" }).getByRole("button")).toHaveCount(
    5,
  );
  await expect(demo).not.toContainText(/\$\d/);
  await expect(demo).not.toContainText(/\d+%/);
});

test("the workflow demo is driven by the visitor and reaches the approved state", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);
  const demo = page.locator("#workflow");
  await demo.scrollIntoViewIfNeeded();
  const steps = demo.getByRole("list", { name: "Workflow steps" });
  await expect(steps.getByRole("button").first()).toHaveAttribute("aria-current", "step");
  await expect(demo.getByRole("heading", { level: 3 }).first()).toContainText("Inquiry received");

  await demo.getByRole("button", { name: "Next step" }).click();
  await expect(steps.getByRole("button").nth(1)).toHaveAttribute("aria-current", "step");
  await expect(demo).toContainText("Reschedule a meeting");

  await steps.getByRole("button", { name: /Draft reviewed/ }).click();
  await expect(demo).toContainText("Waiting for your approval");
  await demo.getByRole("button", { name: "Approve & send" }).click();
  await expect(steps.getByRole("button").nth(4)).toHaveAttribute("aria-current", "step");
  await expect(demo).toContainText("Sent (simulated)");

  await demo.getByRole("button", { name: "Replay" }).click();
  await expect(steps.getByRole("button").first()).toHaveAttribute("aria-current", "step");

  // The whole example is available as text.
  await demo.getByText("Read the whole example as text").click();
  await expect(demo.locator(".hm-texteq li")).toHaveCount(5);
});

test("reduced motion keeps the hero to one screen and shows every element", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);
  const height = await page
    .locator("section[data-hero]")
    .evaluate((element) => element.getBoundingClientRect().height);
  expect(height).toBeLessThanOrEqual(981);
  await expect(page.locator("#hero-heading")).toBeVisible();
  // Entrance states are never armed under reduced motion.
  await expect(page.locator("html.hm-js")).toHaveCount(0);
  for (const id of ["#solutions", "#products", "#delivery"]) {
    await page.locator(id).scrollIntoViewIfNeeded();
    await expect(page.locator(`${id} [data-hm-in]`).first()).toHaveCSS("opacity", "1");
  }
});

test("content is readable before JavaScript arms the entrances", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#hero-heading")).toBeVisible();
  await page.locator("#products").scrollIntoViewIfNeeded();
  await expect(page.locator("#products [data-hm-in]").first()).toHaveCSS("opacity", "1");
  await context.close();
});

test("the close hands the chosen intent to /start", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);
  const close = page.locator("#contact");
  await close.scrollIntoViewIfNeeded();
  const cta = close.getByRole("link", { name: /Discuss your project/ });
  // The first intent is preselected so the action always carries one.
  await expect(cta).toHaveAttribute("href", "/start?source=home&intent=workflow-automation");
  await close.getByText("Build software", { exact: true }).click();
  await expect(cta).toHaveAttribute("href", "/start?source=home&intent=custom-ai-product");
  await close.getByText("Need guidance", { exact: true }).click();
  await expect(cta).toHaveAttribute("href", "/start?source=home&intent=strategy-advisory");
  await expect(close).toContainText("No documents needed.");
});
