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
    await page.goto("/", { waitUntil: "domcontentloaded" });
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

    if (vp.name !== "desktop") {
      const governanceVisual = await page.evaluate(() => {
        const core = document.querySelector<HTMLElement>("[data-governance-core]");
        const gates = Array.from(document.querySelectorAll<HTMLElement>("[data-governance-gate]"));
        const labels = Array.from(
          document.querySelectorAll<HTMLElement>("[data-governance-label]"),
        );

        const scaleOf = (element: HTMLElement) => {
          const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
          return { x: Math.hypot(matrix.a, matrix.b), y: Math.hypot(matrix.c, matrix.d) };
        };

        return {
          coreScaleY: core ? scaleOf(core).y : 0,
          gateScales: gates.map((gate) => scaleOf(gate).x),
          visibleLabels: labels.filter(
            (label) => Number.parseFloat(getComputedStyle(label).opacity) > 0.8,
          ).length,
        };
      });

      expect(
        governanceVisual.coreScaleY,
        `${vp.name}: governance core must be visible`,
      ).toBeGreaterThan(0.95);
      expect(
        governanceVisual.gateScales.every((scale) => scale > 0.95),
        `${vp.name}: governance gates must be visible without desktop GSAP`,
      ).toBe(true);
      expect(governanceVisual.visibleLabels, `${vp.name}: governance labels must be visible`).toBe(
        4,
      );
    }
  });
}

test("desktop Hero pins and scrubs the cinematic video with scroll", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const hero = page.locator("section[data-hero]");
  const video = hero.locator("[data-hero-video]");
  await expect(hero.locator("[data-scroll-progress]")).toHaveCount(1);
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

for (const viewport of [
  { name: "tablet", width: 768, height: 1024, shouldPin: true },
  { name: "mobile", width: 390, height: 800, shouldPin: false },
]) {
  test(`${viewport.name} Hero scrubs with scroll without autoplay fallback`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const hero = page.locator("section[data-hero]");
    const video = hero.locator("[data-hero-video]");
    await expect(hero).toHaveAttribute("data-scroll-scrub", "true", { timeout: 10_000 });
    await expect(page.locator(".pin-spacer")).toHaveCount(viewport.shouldPin ? 1 : 0);
    await expect
      .poll(() => video.evaluate((element) => (element as HTMLVideoElement).duration))
      .toBeGreaterThan(1);

    const initial = await video.evaluate((element) => {
      const media = element as HTMLVideoElement;
      return { paused: media.paused, currentTime: media.currentTime };
    });
    expect(initial.paused, `${viewport.name}: video must not autoplay`).toBe(true);
    expect(initial.currentTime).toBeLessThan(0.25);

    await page.evaluate((distance) => window.scrollTo(0, distance), viewport.height * 0.72);
    await page.waitForTimeout(900);

    const scrubbed = await page.evaluate(() => {
      const media = document.querySelector<HTMLVideoElement>("[data-hero-video]");
      const progress = document.querySelector<HTMLElement>("[data-scroll-progress]");
      const matrix = progress
        ? new DOMMatrixReadOnly(getComputedStyle(progress).transform)
        : new DOMMatrixReadOnly();
      return {
        paused: media?.paused ?? false,
        currentTime: media?.currentTime ?? 0,
        progressScale: matrix.a,
      };
    });

    expect(scrubbed.paused, `${viewport.name}: scroll scrub must keep playback paused`).toBe(true);
    expect(scrubbed.currentTime).toBeGreaterThan(0.5);
    expect(scrubbed.progressScale).toBeGreaterThan(0.2);
  });
}

test("reduced motion removes Hero pinning and video scrubbing", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.locator("section[data-hero]")).toBeVisible();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("[data-hero-video]")).toHaveCount(0);
});

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

test("desktop execution rail progresses through the governed operating sequence", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("section[data-hero]")).toHaveAttribute("data-scroll-scrub", "true", {
    timeout: 10_000,
  });

  const system = page.locator("[data-execution-system]");
  const nodes = system.locator("[data-execution-node]");
  const rail = system.locator("[data-execution-rail]");
  await expect(system).toBeVisible();
  await expect(nodes).toHaveCount(5);
  await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
  await system.evaluate((element) => {
    element.scrollIntoView({ behavior: "auto", block: "center" });
  });
  await page.waitForTimeout(700);

  const railTransform = await rail.evaluate((element) => getComputedStyle(element).transform);
  const visibleNodes = await nodes.evaluateAll(
    (items) =>
      items.filter((item) => Number.parseFloat(getComputedStyle(item).opacity) > 0.6).length,
  );

  expect(railTransform).not.toBe("none");
  expect(visibleNodes).toBe(5);
  await expect(system).toContainText("From intent to action. From action to evidence.");
});
