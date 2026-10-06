import { expect, test, type Page } from "@playwright/test";
import { crawlSitemaps } from "../support/seo-site-contract";

async function expectPageTop(page: Page) {
  await expect
    .poll(() => page.evaluate(() => window.scrollY), {
      message: "a fresh route navigation should start at the top",
    })
    .toBeLessThanOrEqual(2);
}

test("every public route renders its core shell without runtime or layout failures", async ({
  baseURL,
  page,
  request,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const inventory = await crawlSitemaps(request, baseURL!);
  const paths = inventory.pageUrls.map((url) => new URL(url).pathname);

  expect(paths.length).toBeGreaterThan(20);

  for (const path of paths) {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), `${path} should load`).toBeLessThan(400);
    await expect(page.locator("html")).toHaveAttribute("data-cyryx-hydrated", "true");
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator("footer")).toBeAttached();

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth, `${path} should not overflow`).toBeLessThanOrEqual(
      dimensions.clientWidth + 1,
    );
  }

  expect(pageErrors, `runtime errors: ${pageErrors.join(" | ")}`).toEqual([]);
});

test("contextual fit-review navigation and form controls work", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-cyryx-hydrated", "true");
  const primaryCta = page.locator('section[data-hero] a[data-cta="primary"]');
  await expect(primaryCta).toHaveAttribute("href", "/start?source=home");
  await primaryCta.click();

  await expect(page).toHaveURL(/\/start\?source=home$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(2);

  const name = page.locator('input[name="name"]');
  const email = page.locator('input[name="email"]');
  const company = page.locator('input[name="company"]');
  const projectType = page.locator('select[name="projectType"]');

  await expect(name).toBeVisible();
  await expect(email).toBeVisible();
  await expect(company).toBeVisible();
  await expect(projectType).toBeVisible();
  await expect(page.getByText("Coming from Homepage")).toBeVisible();
  await expect(projectType).toHaveValue("");

  await name.fill("Compatibility Test");
  await email.fill("compatibility@example.com");
  await company.fill("Cyryx Test");
  await projectType.selectOption({ label: "AI Governance & Cost Control" });

  await expect(name).toHaveValue("Compatibility Test");
  await expect(email).toHaveValue("compatibility@example.com");
  await expect(projectType).toHaveValue("AI Governance & Cost Control");
});

test("Solutions hub keeps its decision rail usable at mobile and desktop widths", async ({
  page,
}) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/solutions", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Which situation is closest to yours?" }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Start a project/i }).first()).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
  }
});

test("mobile menu reaches the fit review and exposes the form above the fold", async ({
  page,
}, testInfo) => {
  test.skip(
    !testInfo.project.name.includes("iphone") && !testInfo.project.name.includes("android"),
  );

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-cyryx-hydrated", "true");
  await page.getByRole("button", { name: "Open menu" }).click({ force: true });
  const mobileNavigation = page.getByRole("navigation", { name: "Mobile primary" });
  const startLink = mobileNavigation.getByRole("link", { name: "Start a project" });
  await expect(startLink).toBeVisible();
  await startLink.click();

  await expect(page).toHaveURL(/\/start$/);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(2);
  await expect(page.locator('input[name="name"]')).toBeInViewport();
});

test("mobile navigation starts fresh routes at the top and preserves Back restoration", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("html")).toHaveAttribute("data-cyryx-hydrated", "true");
  await page.waitForLoadState("load");

  const footer = page.locator('footer[role="contentinfo"]');
  await footer.scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1_000);
  const homeScrollY = await page.evaluate(() => window.scrollY);

  await footer.getByRole("link", { name: "Research", exact: true }).click();
  await expect(page).toHaveURL(/\/research$/);
  await expectPageTop(page);
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();

  await page.goBack({ waitUntil: "domcontentloaded" });
  await expect(page).toHaveURL(/\/$/);
  await expect
    .poll(() => page.evaluate(() => window.scrollY), {
      message: "Back should restore the prior homepage reading position",
    })
    .toBeGreaterThan(homeScrollY * 0.5);

  await page.getByRole("button", { name: "Open menu" }).click();
  const mobileNavigation = page.getByRole("navigation", { name: "Mobile primary" });
  await mobileNavigation.getByRole("button", { name: "Solutions", exact: true }).click();
  await mobileNavigation.getByRole("link", { name: "Workflow Automation", exact: true }).click();

  await expect(page).toHaveURL(/\/solutions\/workflow-automation$/);
  await expectPageTop(page);
  await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
});

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`AEXOS keeps server-rendered facts through hydration and reload (${reducedMotion})`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error" && /hydrat/i.test(message.text())) errors.push(message.text());
    });
    await page.emulateMedia({ reducedMotion });
    await page.goto("/products/aexos", { waitUntil: "networkidle" });
    const roles = page.locator('[data-count="64"]');
    await expect(roles).toHaveText("64");
    await roles.scrollIntoViewIfNeeded();
    await expect(roles).toHaveText("64", { timeout: 5_000 });
    await page.reload({ waitUntil: "networkidle" });
    await expect(roles).toHaveText("64");
    // Client navigation must not leave a deferred animation running on the old page.
    await page.locator('header a[href="/"]').first().click();
    await expect(page).toHaveURL(/\/$/);
    await page.goBack({ waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await roles.scrollIntoViewIfNeeded();
    await expect(roles).toHaveText("64", { timeout: 5_000 });
    expect(errors, `hydration/runtime errors: ${errors.join(" | ")}`).toEqual([]);
  });
}
