import { expect, test } from "@playwright/test";

const HOME_SECTIONS = [
  "execution-gap",
  "controlled-execution",
  "operating-model",
  "security",
  "maax",
  "evidence",
  "contact",
] as const;

function isTransparentColor(value: string) {
  const normalized = value.replaceAll(" ", "").toLowerCase();
  return (
    normalized === "transparent" || normalized === "rgba(0,0,0,0)" || normalized.endsWith(",0)")
  );
}

test("Safari mobile keeps the homepage compact, visible, and scroll-safe on lower-end devices", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "safari-mobile", "This contract targets WebKit mobile.");
  test.setTimeout(120_000);

  await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", {
      configurable: true,
      get: () => 2,
    });
  });
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveClass(/cx-low-perf/);

  const maaxCtaLabel = page.locator('a[href="#maax"] > span');
  await expect(maaxCtaLabel).toHaveText("MAAX Studio");
  const maaxCtaColors = await maaxCtaLabel.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      color: style.color,
      textFillColor: style.webkitTextFillColor,
    };
  });
  expect(isTransparentColor(maaxCtaColors.color)).toBe(false);
  expect(isTransparentColor(maaxCtaColors.textFillColor)).toBe(false);

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

test("Safari mobile opens Start a fit review at the form", async ({ page }, testInfo) => {
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
