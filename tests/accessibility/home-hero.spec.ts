import { expect, test } from "@playwright/test";
import { expectPageHydrated } from "../support/page-ready";

/**
 * Home hero (2026-11-15): one headline over a short generated film (a hand
 * touches a pane of glass and teal pathways spread from the touch), with a
 * described still of its first frame as first paint. The labelled example
 * workflow lives in its own section, #demo. No canvas, no crest, no monolith
 * imagery, and no price.
 */
const SEQUENCE_URL_RE = /\/media\/hero-sequence\//i;

for (const viewport of [
  { name: "desktop", width: 1280, height: 900 },
  { name: "phone", width: 390, height: 844 },
]) {
  test(`${viewport.name}: the home downloads no frame sequence and its hero film is decorative`, async ({
    page,
  }) => {
    const hits: string[] = [];
    page.on("request", (request) => {
      if (SEQUENCE_URL_RE.test(request.url())) hits.push(request.url());
    });
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "networkidle", timeout: 60_000 });
    await expectPageHydrated(page);
    expect(hits).toEqual([]);
    // The hero visual is one short film over a described still of its first frame.
    await expect(page.locator("section[data-hero] canvas")).toHaveCount(0);
    const film = page.locator("section[data-hero] video");
    await expect(film).toHaveCount(1);
    await expect(film).toHaveAttribute("aria-hidden", "true");
    await expect(film).toHaveJSProperty("muted", true);
    await expect(film).toHaveJSProperty("loop", false);
    const still = page.locator("section[data-hero] picture:not(.cy-hv__end) img");
    await expect(still).toHaveCount(1);
    await expect(still).toHaveAttribute("alt", /hand touches a pane of dark glass/i);
    await expect(still).toHaveJSProperty("complete", true);
    expect(await still.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator("[data-hero-scroll-scene]")).toHaveCount(0);
    await expect(page.locator('img[src*="monolith"], img[src*="brand-mark"]')).toHaveCount(0);
    const layout = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth + 1);
  });
}

test("the example workflow is labelled as an example and states no price or result", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const figure = page.locator("#demo figure");
  await figure.scrollIntoViewIfNeeded();
  await expect(figure).toBeVisible();
  await expect(figure).toContainText("example");
  await expect(figure.locator("figcaption")).toContainText("Illustrative workflow");
  await expect(figure.getByRole("tab")).toHaveCount(3);
  await expect(figure).not.toContainText(/\$\d/);
  await expect(figure).not.toContainText(/\d+%/);
});

test("the example workflow tabs switch the steps shown", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);
  const figure = page.locator("#demo figure");
  await figure.scrollIntoViewIfNeeded();
  await figure.getByRole("tab", { name: "Invoice processing" }).click();
  await expect(figure.getByRole("tab", { name: "Invoice processing" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(figure.getByRole("tabpanel")).toContainText("Invoice PDF lands in the inbox");
});

test("reduced motion keeps the hero to one screen and shows every line", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const height = await page
    .locator("section[data-hero]")
    .evaluate((element) => element.getBoundingClientRect().height);
  expect(height).toBeLessThanOrEqual(981);
  await expect(page.locator("#hero-heading")).toBeVisible();
  await expect(page.locator("html.cy-js")).toHaveCount(0);
});

test("the readiness check gives a score before asking for contact details", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);
  const section = page.locator("#readiness");
  await section.scrollIntoViewIfNeeded();
  for (let question = 0; question < 5; question += 1) {
    await section.locator("button.cy-opt").first().click();
  }
  await expect(section.getByText("Your result")).toBeVisible();
  await expect(section.locator(".cy-score__num")).toContainText("0");
  await expect(section.getByLabel("Work email")).toBeVisible();
  await expect(section.locator('input[name="consent"]')).not.toBeChecked();
});

test("the market numbers and the services index stay readable without motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html.cy-pin")).toHaveCount(0);
  const market = page.locator("#market");
  await market.scrollIntoViewIfNeeded();
  await expect(market.locator(".cy-stat").first()).toBeVisible();
  await expect(market.locator(".cy-stat").first()).toHaveCSS("opacity", "1");
  await expect(page.locator("#services a.cy-index__row").last()).toHaveCSS("opacity", "1");
});

test("the ten services are an index: all on the page, none behind a sideways scroll", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);
  const rows = page.locator("#services a.cy-index__row");
  await expect(rows).toHaveCount(10);
  const section = page.locator("#services");
  await section.scrollIntoViewIfNeeded();
  // No pinning and no horizontal track: the section is as wide as the page and not taller than two screens.
  const box = await section.evaluate((element) => ({
    overflow: element.scrollWidth - element.clientWidth,
    height: element.getBoundingClientRect().height,
  }));
  expect(box.overflow).toBeLessThanOrEqual(1);
  expect(box.height).toBeLessThan(1800);
  await expect(section.locator("[data-cy-track]")).toHaveCount(0);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);

  // On a phone the same ten rows stack in one column inside the viewport.
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(rows).toHaveCount(10);
  const widest = await rows.evaluateAll((elements) =>
    Math.max(...elements.map((element) => element.getBoundingClientRect().right)),
  );
  expect(widest).toBeLessThanOrEqual(390);
});
