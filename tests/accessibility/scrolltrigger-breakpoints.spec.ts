import { expect, test } from "@playwright/test";
import { expectPageHydrated } from "../support/page-ready";

/**
 * Smoke-tests that home-route GSAP ScrollTrigger timelines render across
 * mobile/tablet/desktop breakpoints without runtime errors. The home hero has
 * no scroll scene since the 2026-11-06 redesign, so pin spacers are never expected.
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

    // Native sticky scrollytelling must not create GSAP pin spacers.
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
      // The six offer rows must end fully readable on phones and tablets.
      const controls = page.locator('#services li[id^="service-"]');
      await expect(controls).toHaveCount(6);
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

/**
 * SolutionPage / Privacy / Terms must scroll cleanly at every breakpoint
 * with zero GSAP runtime errors and zero ScrollTrigger pinning. These
 * pages may use lightweight reveal timelines, but never pin content.
 */
const CONTENT_PAGES = ["/solutions/workflow-automation", "/privacy", "/terms"];

for (const path of CONTENT_PAGES) {
  for (const vp of VIEWPORTS) {
    test(`${path} scrolls cleanly on ${vp.name}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));

      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(page.locator("h1")).toBeVisible();

      const maxScroll = await page.evaluate(
        () => document.documentElement.scrollHeight - window.innerHeight,
      );
      for (const ratio of [0, 0.25, 0.5, 0.75, 1]) {
        await page.evaluate((sy) => window.scrollTo(0, sy), maxScroll * ratio);
        await page.waitForTimeout(30);
      }

      const relevant = errors.filter((e) => /gsap|scrolltrigger|react|invariant/i.test(e));
      expect(relevant, `runtime errors on ${path}@${vp.name}: ${relevant.join(" | ")}`).toEqual([]);
      expect(await page.locator(".pin-spacer").count(), `${path}: no pinning expected`).toBe(0);
    });
  }
}

test("home control section lists its three rules after the 2026-11-06 redesign", async ({
  page,
}) => {
  // The animated execution rail was retired with the Hallmark redesign; the
  // same three commitments now read as a numbered list beside a photograph.
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);
  const control = page.locator("#control");
  await expect(control.getByRole("heading", { level: 2 })).toHaveText("AI within limits you set.");
  await expect(control.locator("ol > li")).toHaveCount(3);
  await expect(control.getByRole("link", { name: "How we set AI limits" })).toHaveAttribute(
    "href",
    "/solutions/ai-governance-cost-control",
  );
});
