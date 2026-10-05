import { expect, test, type Page } from "@playwright/test";
import { expectPageHydrated } from "../support/page-ready";

async function useHighPerformanceProfile(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { configurable: true, value: 8 });
    Object.defineProperty(navigator, "deviceMemory", { configurable: true, value: 8 });
  });
}

/**
 * Smoke-tests that home-route GSAP ScrollTrigger timelines render across
 * mobile/tablet/desktop breakpoints without runtime errors or pinned scenes.
 */
const VIEWPORTS = [
  { name: "mobile", width: 390, height: 800 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 900 },
];

for (const vp of VIEWPORTS) {
  test(`ScrollTrigger renders and stays lightweight on ${vp.name}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expectPageHydrated(page);
    await expect(page.locator("section[data-hero]")).toBeVisible();

    // Scroll through the page in stages so ScrollTrigger has to run.
    const maxScroll = await page.evaluate(
      () => document.documentElement.scrollHeight - window.innerHeight,
    );
    for (const ratio of [0, 0.16, 0.33, 0.5, 0.66, 0.83, 1]) {
      await page.evaluate((sy) => window.scrollTo(0, sy), maxScroll * ratio);
      await page.waitForTimeout(35);
    }

    // Filter out unrelated third-party/network noise; fail on GSAP or React errors.
    const relevant = errors.filter((e) => /gsap|scrolltrigger|react|invariant/i.test(e));
    expect(relevant, `runtime errors on ${vp.name}: ${relevant.join(" | ")}`).toEqual([]);

    // Native scrolling must not create GSAP pin spacers.
    const pinSpacers = await page.locator(".pin-spacer").count();
    expect(pinSpacers, `${vp.name} must not use ScrollTrigger pinning`).toBe(0);
    if (vp.name === "mobile") {
      // No horizontal transforms on the hero either.
      const heroTransform = await page.locator("section[data-hero]").evaluate((el) => {
        const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
        return { e: m.e, f: m.f };
      });
      expect(
        Math.abs(heroTransform.e),
        "hero should not translate horizontally on mobile",
      ).toBeLessThan(2);
    }

    if (vp.name !== "desktop") {
      // The four actual build practices remain readable on smaller screens.
      const controls = page.locator("#security [data-governance-control]");
      await expect(controls).toHaveCount(4);
      await controls.last().scrollIntoViewIfNeeded();
      await expect
        .poll(
          () =>
            controls.evaluateAll((items) =>
              items.every((item) => Number.parseFloat(getComputedStyle(item).opacity) > 0.8),
            ),
          { timeout: 5_000 },
        )
        .toBe(true);
    }
  });
}

for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1920, height: 1080 },
]) {
  test(
    "native scroll transforms art, never hides the message at " + viewport.width,
    async ({ page }) => {
      await useHighPerformanceProfile(page);
      await page.setViewportSize(viewport);
      await page.goto("/", { waitUntil: "networkidle" });
      await expectPageHydrated(page);
      // Wait for the existing two-frame bootstrap reset before user scrolling.
      await expect(page.locator("html")).toHaveAttribute("data-cyryx-scroll-ready", "true");
      await expect(page.locator(".pin-spacer")).toHaveCount(0);
      const stage = page.locator("#service-visual");
      const geometry = await stage.evaluate((el) => ({
        top: el.getBoundingClientRect().top + scrollY,
        height: el.getBoundingClientRect().height,
      }));
      await page.evaluate(
        (y) => window.scrollTo({ top: y - innerHeight * 0.9, behavior: "instant" }),
        geometry.top,
      );
      const signal = stage.locator("[data-signal]").first();
      await expect
        .poll(() => signal.evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset)))
        .toBeGreaterThan(0.9);
      await page.evaluate(
        (y) => window.scrollTo({ top: y - innerHeight * 0.5, behavior: "instant" }),
        geometry.top + geometry.height,
      );
      await expect
        .poll(() => signal.evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset)))
        .toBeLessThan(0.1);
      await expect(page.locator(".cinema-services")).toContainText("Applications & websites");
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await expect(page.locator("#hero-heading")).toBeInViewport();
      await expect(page.locator('[data-cta="primary"]')).toBeInViewport();
    },
  );
}
test("dynamic reduced motion reverts every scroll transformation", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo({ top: 500, behavior: "instant" }));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect
    .poll(() =>
      page.locator("#service-visual .studio-screen").evaluate((el) => {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(el).transform);
        return matrix.isIdentity;
      }),
    )
    .toBe(true);
  await expect
    .poll(() =>
      page
        .locator("#service-visual [data-signal]")
        .first()
        .evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset)),
    )
    .toBe(0);
  await expect(page.locator("[data-opening] .studio-screen").first()).toHaveCSS("opacity", "1");
});
test("invoice trace completes once and returns to its static state with reduced motion", async ({
  page,
}) => {
  await useHighPerformanceProfile(page);
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("html")).toHaveAttribute("data-cyryx-scroll-ready", "true");
  await page.locator("[data-invoice-example]").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator("[data-cinema-invoice-line]")
        .first()
        .evaluate((el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a),
    )
    .toBeGreaterThan(0.99);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-cinema-invoice-line]").first()).toHaveCSS("transform", "none");
  await expect(page.locator(".cinema-draft-status")).toHaveText("Ready for review");
});
