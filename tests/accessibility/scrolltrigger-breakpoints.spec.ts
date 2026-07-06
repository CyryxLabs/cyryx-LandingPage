import { expect, test } from "@playwright/test";

/**
 * Smoke-tests that home-route GSAP ScrollTrigger timelines render across
 * mobile/tablet/desktop breakpoints without runtime errors and without
 * introducing heavy pinning (spacer elements / position:fixed hero) on mobile.
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
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("section[data-hero]")).toBeVisible();

    // Scroll through the page in stages so ScrollTrigger has to run.
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < height; y += vp.height) {
      await page.evaluate((sy) => window.scrollTo(0, sy), y);
      await page.waitForTimeout(60);
    }

    // Filter out unrelated third-party/network noise; fail on GSAP or React errors.
    const relevant = errors.filter((e) => /gsap|scrolltrigger|react|invariant/i.test(e));
    expect(relevant, `runtime errors on ${vp.name}: ${relevant.join(" | ")}`).toEqual([]);

    // Heavy-pinning check: GSAP inserts .pin-spacer elements when pin:true is used.
    // Mobile must not use pinning; tablet/desktop may.
    const pinSpacers = await page.locator(".pin-spacer").count();
    if (vp.name === "mobile") {
      expect(pinSpacers, "mobile must not use ScrollTrigger pinning").toBe(0);
      // No horizontal transforms on the hero either.
      const heroTransform = await page.locator("section[data-hero]").evaluate((el) => {
        const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
        return { e: m.e, f: m.f };
      });
      expect(Math.abs(heroTransform.e), "hero should not translate horizontally on mobile").toBeLessThan(2);
    }
  });
}
