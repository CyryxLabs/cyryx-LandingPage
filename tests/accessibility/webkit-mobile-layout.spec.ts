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

test("Safari mobile keeps the homepage compact, visible, and scroll-safe", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "safari-mobile", "This contract targets WebKit mobile.");
  test.setTimeout(120_000);

  await page.goto("/", { waitUntil: "networkidle" });

  for (const id of HOME_SECTIONS) {
    const section = page.locator(`#${id}`);
    await section.evaluate((element) => {
      const top = element.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.45;
      window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
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

test("Safari mobile opens Start a Project at the form", async ({ page }, testInfo) => {
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
