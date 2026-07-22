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
      expect(
        Math.abs(heroTransform.e),
        "hero should not translate horizontally on mobile",
      ).toBeLessThan(2);
    }
  });
}

test("desktop Hero pins and scrubs the cinematic video with scroll", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });

  const hero = page.locator("section[data-hero]");
  const video = hero.locator("[data-hero-video]");
  await expect(hero).toHaveAttribute("data-scroll-scrub", "true", { timeout: 10_000 });
  await expect(page.locator(".pin-spacer")).toHaveCount(1);

  const duration = await video.evaluate((element) => (element as HTMLVideoElement).duration);
  expect(duration).toBeGreaterThan(1);

  await page.evaluate(() => window.scrollTo(0, 650));
  await page.waitForTimeout(900);

  const state = await page.evaluate(() => {
    const heroElement = document.querySelector<HTMLElement>("section[data-hero]");
    const videoElement = heroElement?.querySelector<HTMLVideoElement>("[data-hero-video]");
    const progress = heroElement?.querySelector<HTMLElement>("[data-scroll-progress]");
    const matrix = progress
      ? new DOMMatrixReadOnly(getComputedStyle(progress).transform)
      : new DOMMatrixReadOnly();
    return {
      currentTime: videoElement?.currentTime ?? 0,
      heroTop: heroElement?.getBoundingClientRect().top ?? Number.NaN,
      progressScale: matrix.a,
    };
  });

  expect(state.currentTime).toBeGreaterThan(1);
  expect(Math.abs(state.heroTop)).toBeLessThan(2);
  expect(state.progressScale).toBeGreaterThan(0.1);
});

test("reduced motion removes Hero pinning and video scrubbing", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.locator("section[data-hero]")).toBeVisible();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("[data-hero-video]")).toHaveCount(0);
});

/**
 * SolutionPage / Privacy / Terms must scroll cleanly at every breakpoint
 * with zero GSAP runtime errors and zero ScrollTrigger pinning. These
 * pages should not initialize GSAP timelines at all — they render pure
 * layout content.
 */
const CONTENT_PAGES = ["/solutions/workflow-automation", "/privacy", "/terms"];

for (const path of CONTENT_PAGES) {
  for (const vp of VIEWPORTS) {
    test(`${path} scrolls cleanly on ${vp.name}`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));

      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(path, { waitUntil: "networkidle" });
      await expect(page.locator("h1")).toBeVisible();

      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += vp.height) {
        await page.evaluate((sy) => window.scrollTo(0, sy), y);
        await page.waitForTimeout(40);
      }

      const relevant = errors.filter((e) => /gsap|scrolltrigger|react|invariant/i.test(e));
      expect(relevant, `runtime errors on ${path}@${vp.name}: ${relevant.join(" | ")}`).toEqual([]);
      expect(await page.locator(".pin-spacer").count(), `${path}: no pinning expected`).toBe(0);
    });
  }
}
