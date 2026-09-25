import { expect, test } from "@playwright/test";

// Homepage chapter order: 01 problem, 02 ways to engage, 03 how it runs,
// 04 what you receive, 05 governance, 06 start.
const HOME_SECTIONS = [
  "execution-gap",
  "operating-model",
  "controlled-execution",
  "evidence",
  "security",
  "contact",
] as const;

function isTransparentColor(value: string) {
  const normalized = value.replaceAll(" ", "").toLowerCase();
  return (
    normalized === "transparent" || normalized === "rgba(0,0,0,0)" || normalized.endsWith(",0)")
  );
}

test("Safari on iPhone gets the full experience, not the low-performance fallback", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "safari-mobile", "This contract targets WebKit mobile.");
  test.setTimeout(120_000);

  // iOS Safari reports 4 cores on every iPhone and exposes no deviceMemory.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, get: () => 4 });
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).not.toHaveClass(/cx-low-perf/);

  const hero = page.locator("section[data-hero]");
  await expect(hero.locator("[data-hero-sequence]")).toHaveAttribute(
    "data-sequence-ready",
    "true",
    {
      timeout: 30_000,
    },
  );
  await expect(hero.locator(".cx-hero-sub")).toBeVisible();
  await expect(hero.locator(".cx-hero-ctas")).toBeVisible();

  for (const id of HOME_SECTIONS) {
    const section = page.locator(`#${id}`);
    await section.evaluate((element) => {
      const top = element.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.45;
      window.scrollTo(0, Math.max(0, top));
    });
    await expect
      .poll(
        () =>
          section.evaluate((element) =>
            [...element.querySelectorAll<HTMLElement>(".cx-reveal, .cx-stagger-item")].every(
              (item) => Number.parseFloat(getComputedStyle(item).opacity) >= 0.95,
            ),
          ),
        { message: `${id} reveals should finish in WebKit`, timeout: 15_000 },
      )
      .toBe(true);
  }
});

test("Safari mobile keeps the homepage compact, visible, and scroll-safe on lower-end devices", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "safari-mobile", "This contract targets WebKit mobile.");
  test.setTimeout(120_000);

  // Low-performance path: Save-Data style connection hint.
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      get: () => ({ saveData: true, effectiveType: "4g" }),
    });
  });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveClass(/cx-low-perf/);

  // The hero CTAs keep a visible fill (chrome-gradient text must not go transparent).
  await expect(page.locator("main")).not.toContainText(/MAAX/i);
  const primaryCta = page.locator('section[data-hero] a[data-cta="primary"]');
  await expect(primaryCta).toHaveAttribute("href", "/start?source=home");
  const secondaryCtaLabel = page.locator('section[data-hero] a[data-cta="secondary"] > span');
  await expect(secondaryCtaLabel).toHaveText("See how we work");
  const secondaryCtaColors = await secondaryCtaLabel.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      color: style.color,
      textFillColor: style.webkitTextFillColor,
    };
  });
  expect(isTransparentColor(secondaryCtaColors.color)).toBe(false);
  expect(isTransparentColor(secondaryCtaColors.textFillColor)).toBe(false);

  for (const id of HOME_SECTIONS) {
    const section = page.locator(`#${id}`);
    await section.evaluate((element) => {
      const top = element.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.45;
      window.scrollTo(0, Math.max(0, top));
    });
    await page.waitForTimeout(350);

    await expect(section).toBeVisible();
    await expect
      .poll(
        () =>
          section.evaluate((element) =>
            [...element.querySelectorAll<HTMLElement>(".cx-reveal, .cx-stagger-item")].every(
              (item) => Number.parseFloat(getComputedStyle(item).opacity) >= 0.95,
            ),
          ),
        {
          message: `${id} should not leave invisible animation gaps in WebKit`,
          timeout: 15_000,
        },
      )
      .toBe(true);
  }

  const layout = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
  }));

  expect(layout.scrollWidth, "Safari mobile must not overflow horizontally").toBeLessThanOrEqual(
    layout.clientWidth + 1,
  );
  expect(layout.scrollHeight, "Homepage mobile storytelling should remain compact").toBeLessThan(
    12_500,
  );
});

test("Safari mobile opens Start a project at the form", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "safari-mobile", "This contract targets WebKit mobile.");

  await page.goto("/start", { waitUntil: "networkidle" });

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(2);
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="name"]')).toBeInViewport();

  const widths = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(widths.scroll).toBeLessThanOrEqual(widths.client + 1);
});
