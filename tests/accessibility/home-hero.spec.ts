import { expect, test } from "@playwright/test";
import { expectPageHydrated } from "../support/page-ready";

/**
 * Home v10 (approved 2026-11-18): a still metallic plate behind the hero, a
 * "what we do" chapter, an interactive workflow demo driven by the visitor or
 * by the scroll, and a close that hands an intent to /start. Scroll scenes use
 * native sticky stages: no film, no frame sequence, no pin spacers, no
 * monolith, no crest, no price.
 */
const RETIRED_MEDIA_RE = /\/media\/(hero-sequence|hero-film)\//i;

for (const viewport of [
  { name: "desktop", width: 1280, height: 900 },
  { name: "phone", width: 390, height: 844 },
]) {
  test(`${viewport.name}: the hero is a still plate with no film or canvas`, async ({ page }) => {
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
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
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
  // Land on the section heading: on large screens the scroll then walks the
  // steps, and the controls scroll to the step they name.
  await page.goto("/#workflow", { waitUntil: "load" });
  await expectPageHydrated(page);
  const demo = page.locator("#workflow");
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

for (const viewport of [
  { name: "desktop", width: 1280, height: 900 },
  { name: "phone", width: 390, height: 844 },
]) {
  test(`${viewport.name}: the "what we do" scene shows one capability at a time`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expectPageHydrated(page);
    const scene = page.locator("#what");
    await expect(scene).toHaveClass(/is-pin/, { timeout: 15_000 });
    const track = page.locator(".what-track");
    const panels = scene.locator("[data-wpanel]");
    for (const [ratio, index] of [
      [0.02, 0],
      [0.45, 1],
      [0.98, 3],
    ] as const) {
      await track.evaluate((element, r) => {
        const rect = element.getBoundingClientRect();
        const span = rect.height - window.innerHeight;
        window.scrollTo(0, rect.top + window.scrollY + span * r);
      }, ratio);
      await expect(panels.nth(index)).toBeVisible();
      await expect(panels.nth(index === 0 ? 1 : 0)).toBeHidden();
    }
    await expect(page.locator("#what-title")).toBeInViewport();
    const layout = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
  });

  test(`${viewport.name}: the page scroll walks through the workflow`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expectPageHydrated(page);
    const track = page.locator("[data-hm-track]");
    await expect(track).toHaveClass(/is-scrub/);
    const steps = page.getByRole("list", { name: "Workflow steps" });
    for (const [ratio, index] of [
      [0.02, 0],
      [0.5, 2],
      [0.98, 4],
    ] as const) {
      await track.evaluate((element, r) => {
        const rect = element.getBoundingClientRect();
        const span = rect.height - window.innerHeight;
        window.scrollTo(0, rect.top + window.scrollY + span * r);
      }, ratio);
      await expect(steps.getByRole("button").nth(index)).toHaveAttribute("aria-current", "step");
    }
    // The stage stays on screen while the steps change.
    await expect(page.locator(".hm-stage")).toBeInViewport();
  });

  test(`${viewport.name}: the approval can be given on the sticky stage`, async ({ page }) => {
    await page.setViewportSize(viewport);
    // The page re-anchors to the #hash once on load: wait for it before scrolling.
    await page.goto("/#workflow", { waitUntil: "load" });
    await expectPageHydrated(page);
    const demo = page.locator("#workflow");
    await demo.getByRole("button", { name: /Draft reviewed/ }).click();
    const approve = demo.getByRole("button", { name: "Approve & send" });
    await expect(approve).toBeInViewport({ ratio: 1 });
    await approve.click();
    await expect(demo).toContainText("Sent (simulated)");
  });
}

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
  await expect(page.locator(".hx.hx-on")).toHaveCount(0);
  // No tall scroll tracks: every panel of the "what we do" chapter is on the page.
  await expect(page.locator("#what [data-wpanel]:visible")).toHaveCount(4);
  for (const id of ["#solutions", "#products", "#delivery"]) {
    await page.locator(id).scrollIntoViewIfNeeded();
    await expect(page.locator(`${id} h2`).first()).toHaveCSS("opacity", "1");
  }
});

test("content is readable before JavaScript arms the entrances", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("#hero-heading")).toBeVisible();
  await page.locator("#products").scrollIntoViewIfNeeded();
  await expect(page.locator("#products h2").first()).toHaveCSS("opacity", "1");
  await expect(page.locator("#what [data-wpanel]:visible")).toHaveCount(4);
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
