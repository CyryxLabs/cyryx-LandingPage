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
 * mobile/tablet/desktop breakpoints without runtime errors. The hero uses
 * native CSS sticky positioning, so GSAP pin spacers are never expected.
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
      // Governance keeps one visual (the monolith), shown from lg up; below
      // that the four controls carry the section and must be readable.
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

test("desktop Hero uses native sticky positioning and scrubs the canvas sequence", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.use.forcedColors === "active",
    "Forced colors hides the canvas, so frame drawing is not observable; covered by the forced-colors test.",
  );
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);
  const hero = page.locator("section[data-hero]");
  const canvas = hero.locator("[data-hero-canvas]");
  await expect(hero.locator("[data-scroll-progress]")).toHaveCount(1);
  await expect(hero).toHaveAttribute("data-scroll-scrub", "true", { timeout: 10_000 });
  await expect(hero.locator("[data-hero-sequence]")).toHaveAttribute(
    "data-sequence-ready",
    "true",
    { timeout: 20_000 },
  );
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(canvas).toHaveAttribute("data-frame-index", "1");

  await page.evaluate(() => {
    const heroScene = document.querySelector<HTMLElement>("[data-hero-scroll-scene]");
    const range = (heroScene?.offsetHeight ?? window.innerHeight) - window.innerHeight;
    window.scrollTo(0, range * 0.5);
  });
  await page.waitForTimeout(900);

  await expect
    .poll(
      () =>
        canvas.evaluate((element) =>
          Number((element as HTMLCanvasElement).dataset.frameIndex ?? 0),
        ),
      { timeout: 5_000 },
    )
    .toBeGreaterThan(12);

  const state = await page.evaluate(() => {
    const heroElement = document.querySelector<HTMLElement>("section[data-hero]");
    const stickyElement = heroElement?.querySelector<HTMLElement>("[data-hero-sticky]");
    const canvasElement = heroElement?.querySelector<HTMLCanvasElement>("[data-hero-canvas]");
    const progress = heroElement?.querySelector<HTMLElement>("[data-scroll-progress]");
    const matrix = progress
      ? new DOMMatrixReadOnly(getComputedStyle(progress).transform)
      : new DOMMatrixReadOnly();
    return {
      frameIndex: Number(canvasElement?.dataset.frameIndex ?? 0),
      stickyTop: stickyElement?.getBoundingClientRect().top ?? Number.NaN,
      progressScale: matrix.a,
    };
  });

  expect(state.frameIndex).toBeGreaterThan(12);
  expect(Math.abs(state.stickyTop)).toBeLessThan(2);
  expect(state.progressScale).toBeGreaterThan(0.1);
});

for (const viewport of [
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 800 },
]) {
  test(`${viewport.name} Hero follows the device performance policy without GSAP pinning`, async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.use.forcedColors === "active",
      "Forced colors hides the canvas, so frame drawing is not observable; covered by the forced-colors test.",
    );
    await useHighPerformanceProfile(page);
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expectPageHydrated(page);

    const hero = page.locator("section[data-hero]");
    const canvas = hero.locator("[data-hero-canvas]");
    await expect(hero).toHaveAttribute("data-scroll-scrub", "true", { timeout: 10_000 });
    await expect(hero.locator("[data-hero-sequence]")).toHaveAttribute(
      "data-sequence-ready",
      "true",
      { timeout: 20_000 },
    );
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(canvas).toHaveAttribute("data-frame-index", "1");

    await page.evaluate(() => {
      const heroScene = document.querySelector<HTMLElement>("[data-hero-scroll-scene]");
      const range = (heroScene?.offsetHeight ?? window.innerHeight) - window.innerHeight;
      window.scrollTo(0, range * 0.55);
    });
    await page.waitForTimeout(900);

    await expect
      .poll(
        () =>
          canvas.evaluate((element) =>
            Number((element as HTMLCanvasElement).dataset.frameIndex ?? 0),
          ),
        { timeout: 5_000 },
      )
      .toBeGreaterThan(12);

    const scrubbed = await page.evaluate(() => {
      const canvasElement = document.querySelector<HTMLCanvasElement>("[data-hero-canvas]");
      const progress = document.querySelector<HTMLElement>("[data-scroll-progress]");
      const matrix = progress
        ? new DOMMatrixReadOnly(getComputedStyle(progress).transform)
        : new DOMMatrixReadOnly();
      return {
        frameIndex: Number(canvasElement?.dataset.frameIndex ?? 0),
        progressScale: matrix.a,
      };
    });

    expect(scrubbed.frameIndex, `${viewport.name}: frame must advance with scroll`).toBeGreaterThan(
      12,
    );
    expect(scrubbed.progressScale).toBeGreaterThan(0.2);
  });
}

test("Hero reserves late sequence frames for an unobstructed brand reveal", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.use.forcedColors === "active",
    "Forced colors hides the canvas, so frame drawing is not observable; covered by the forced-colors test.",
  );
  await useHighPerformanceProfile(page);

  for (const viewport of [
    { name: "mobile", width: 390, height: 800 },
    { name: "desktop", width: 1280, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expectPageHydrated(page);

    const hero = page.locator("section[data-hero]");
    const canvas = hero.locator("[data-hero-canvas]");
    const storyPanels = hero.locator("[data-hero-story-panel]");
    const finalStory = storyPanels.last();
    await expect(storyPanels).toHaveCount(3);
    await expect(hero.locator("[data-hero-sequence]")).toHaveAttribute(
      "data-sequence-ready",
      "true",
      { timeout: 20_000 },
    );

    await page.evaluate(() => {
      const scene = document.querySelector<HTMLElement>("[data-hero-scroll-scene]");
      const range = (scene?.offsetHeight ?? window.innerHeight) - window.innerHeight;
      window.scrollTo(0, range * 0.67);
    });
    await page.waitForTimeout(500);
    await expect
      .poll(
        () =>
          finalStory.evaluate((element) => Number.parseFloat(getComputedStyle(element).opacity)),
        { timeout: 3_000 },
      )
      .toBeGreaterThan(0.5);

    await page.evaluate(() => {
      const scene = document.querySelector<HTMLElement>("[data-hero-scroll-scene]");
      const range = (scene?.offsetHeight ?? window.innerHeight) - window.innerHeight;
      window.scrollTo(0, range * 0.9);
    });
    await page.waitForTimeout(500);

    await expect
      .poll(
        () =>
          canvas.evaluate((element) =>
            Number((element as HTMLCanvasElement).dataset.frameIndex ?? 0),
          ),
        { timeout: 5_000 },
      )
      .toBeGreaterThanOrEqual(34);

    const finalOverlayState = await finalStory.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        opacity: Number.parseFloat(style.opacity),
        visibility: style.visibility,
      };
    });
    expect(finalOverlayState.opacity, `${viewport.name}: final story opacity`).toBeLessThan(0.02);
    expect(finalOverlayState.visibility, `${viewport.name}: final story visibility`).toBe("hidden");
  }
});

test("reduced motion removes Hero sequence scrubbing and extended scroll", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);

  await expect(page.locator("section[data-hero]")).toBeVisible();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("[data-hero-canvas]")).toHaveCount(0);
  await expect(page.locator("section[data-hero]")).not.toHaveAttribute("data-scroll-scrub", "true");
  const height = await page
    .locator("[data-hero-scroll-scene]")
    .evaluate((element) => element.getBoundingClientRect().height);
  expect(height).toBeLessThanOrEqual(901);
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
  await expectPageHydrated(page);
  await expect(page.locator("html")).toHaveAttribute("data-cyryx-scroll-ready", "true");
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
    const bottomAtCompletion = window.innerHeight * 0.34;
    const top = element.getBoundingClientRect().bottom + window.scrollY - bottomAtCompletion;
    window.scrollTo({ top, behavior: "auto" });
  });
  await page.waitForTimeout(900);

  const railTransform = await rail.evaluate((element) => getComputedStyle(element).transform);
  await expect
    .poll(
      () =>
        nodes.evaluateAll(
          (items) =>
            items.filter((item) => Number.parseFloat(getComputedStyle(item).opacity) > 0.6).length,
        ),
      { timeout: 5_000 },
    )
    .toBe(5);

  expect(railTransform).not.toBe("none");
  await expect(system).toContainText("From intent to action. From action to evidence.");
});
