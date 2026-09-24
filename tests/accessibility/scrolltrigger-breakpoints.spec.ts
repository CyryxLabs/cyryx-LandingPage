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

async function readFrameIndex(page: Page) {
  return page
    .locator("section[data-hero] [data-hero-canvas]")
    .evaluate((element) => Number((element as HTMLCanvasElement).dataset.frameIndex ?? 0));
}

async function scrollHeroScene(page: Page, ratio: number) {
  await page.evaluate((r) => {
    const heroScene = document.querySelector<HTMLElement>("[data-hero-scroll-scene]");
    const range = (heroScene?.offsetHeight ?? window.innerHeight) - window.innerHeight;
    window.scrollTo(0, range * r);
  }, ratio);
}

async function expectHeroCopyPinnedInViewport(page: Page, label: string) {
  const hero = page.locator("section[data-hero]");
  for (const locator of [
    page.locator("#hero-heading"),
    hero.locator(".cx-hero-sub"),
    hero.locator('a[data-cta="primary"]'),
    hero.locator('a[data-cta="secondary"]'),
  ]) {
    await expect(locator, `${label}: hero copy must stay in the first viewport`).toBeInViewport();
    const opacity = await locator.evaluate((element) => {
      let node: HTMLElement | null = element as HTMLElement;
      let value = 1;
      while (node) {
        value *= Number.parseFloat(getComputedStyle(node).opacity);
        node = node.parentElement;
      }
      return value;
    });
    expect(opacity, `${label}: hero copy must not fade while the scene scrubs`).toBeGreaterThan(
      0.99,
    );
  }
}

test("desktop Hero uses native sticky positioning and scrubs the canvas sequence", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.use.forcedColors === "active",
    "Forced colors hides the canvas and collapses the scene; covered by the forced-colors test.",
  );
  await useHighPerformanceProfile(page);
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

  // 190svh scene: one extra viewport of scrub behind a 100svh sticky stage.
  const geometry = await page.evaluate(() => {
    const scene = document.querySelector<HTMLElement>("[data-hero-scroll-scene]");
    const sticky = document.querySelector<HTMLElement>("[data-hero-sticky]");
    return {
      sceneHeight: scene?.getBoundingClientRect().height ?? 0,
      stickyHeight: sticky?.getBoundingClientRect().height ?? 0,
      stickyPosition: sticky ? getComputedStyle(sticky).position : "",
      viewportHeight: window.innerHeight,
    };
  });
  expect(geometry.sceneHeight / geometry.viewportHeight).toBeGreaterThan(1.85);
  expect(geometry.sceneHeight / geometry.viewportHeight).toBeLessThan(1.95);
  expect(Math.abs(geometry.stickyHeight - geometry.viewportHeight)).toBeLessThan(2);
  expect(geometry.stickyPosition).toBe("sticky");

  await scrollHeroScene(page, 0.5);
  await page.waitForTimeout(900);
  await expect.poll(() => readFrameIndex(page), { timeout: 5_000 }).toBeGreaterThan(4);
  const midFrame = await readFrameIndex(page);
  expect(midFrame).toBeLessThan(12);

  const state = await page.evaluate(() => {
    const heroElement = document.querySelector<HTMLElement>("section[data-hero]");
    const stickyElement = heroElement?.querySelector<HTMLElement>("[data-hero-sticky]");
    const progress = heroElement?.querySelector<HTMLElement>("[data-scroll-progress]");
    const matrix = progress
      ? new DOMMatrixReadOnly(getComputedStyle(progress).transform)
      : new DOMMatrixReadOnly();
    return {
      stickyTop: stickyElement?.getBoundingClientRect().top ?? Number.NaN,
      progressScale: matrix.a,
    };
  });
  expect(Math.abs(state.stickyTop)).toBeLessThan(2);
  expect(state.progressScale).toBeGreaterThan(0.1);
  await expectHeroCopyPinnedInViewport(page, "desktop mid-scene");

  await scrollHeroScene(page, 1);
  await expect.poll(() => readFrameIndex(page), { timeout: 5_000 }).toBe(15);
  await expectHeroCopyPinnedInViewport(page, "desktop end of scene");
});

test("tablet Hero scrubs the short scene with native sticky and no GSAP pinning", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.use.forcedColors === "active",
    "Forced colors hides the canvas and collapses the scene; covered by the forced-colors test.",
  );
  await useHighPerformanceProfile(page);
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);

  const hero = page.locator("section[data-hero]");
  await expect(hero).toHaveAttribute("data-scroll-scrub", "true", { timeout: 10_000 });
  await expect(hero.locator("[data-hero-sequence]")).toHaveAttribute(
    "data-sequence-ready",
    "true",
    { timeout: 20_000 },
  );
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(hero.locator("[data-hero-canvas]")).toHaveAttribute("data-frame-index", "1");

  await scrollHeroScene(page, 0.55);
  await page.waitForTimeout(900);
  await expect.poll(() => readFrameIndex(page), { timeout: 5_000 }).toBeGreaterThan(4);

  const progressScale = await page.evaluate(() => {
    const progress = document.querySelector<HTMLElement>("[data-scroll-progress]");
    return progress ? new DOMMatrixReadOnly(getComputedStyle(progress).transform).a : 0;
  });
  expect(progressScale).toBeGreaterThan(0.2);
  await expectHeroCopyPinnedInViewport(page, "tablet mid-scene");

  await scrollHeroScene(page, 1);
  await expect.poll(() => readFrameIndex(page), { timeout: 5_000 }).toBe(15);
});

test("forced colors collapses the Hero to a static, readable first screen", async ({ page }) => {
  await useHighPerformanceProfile(page);
  await page.emulateMedia({ forcedColors: "active" });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);

  const geometry = await page.evaluate(() => {
    const scene = document.querySelector<HTMLElement>("[data-hero-scroll-scene]");
    const sticky = document.querySelector<HTMLElement>("[data-hero-sticky]");
    const canvas = document.querySelector<HTMLElement>("[data-hero-canvas]");
    return {
      sceneHeight: scene?.getBoundingClientRect().height ?? 0,
      stickyPosition: sticky ? getComputedStyle(sticky).position : "",
      canvasDisplay: canvas ? getComputedStyle(canvas).display : "none",
      viewportHeight: window.innerHeight,
    };
  });
  expect(geometry.sceneHeight).toBeLessThanOrEqual(geometry.viewportHeight + 1);
  expect(geometry.stickyPosition).not.toBe("sticky");
  expect(geometry.canvasDisplay).toBe("none");
  await expectHeroCopyPinnedInViewport(page, "forced colors");
});

test("mobile Hero has no scroll scene, no canvas and no scrubbing", async ({ page }) => {
  await useHighPerformanceProfile(page);
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expectPageHydrated(page);

  const hero = page.locator("section[data-hero]");
  await expect(hero.locator("[data-hero-sequence]")).toHaveAttribute("data-sequence-mode", "still");
  await expect(hero.locator("[data-hero-canvas]")).toHaveCount(0);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(hero).not.toHaveAttribute("data-scroll-scrub", "true", { timeout: 10_000 });

  const geometry = await page.evaluate(() => {
    const scene = document.querySelector<HTMLElement>("[data-hero-scroll-scene]");
    const sticky = document.querySelector<HTMLElement>("[data-hero-sticky]");
    return {
      sceneHeight: scene?.getBoundingClientRect().height ?? 0,
      stickyPosition: sticky ? getComputedStyle(sticky).position : "",
      viewportHeight: window.innerHeight,
    };
  });
  expect(geometry.stickyPosition).not.toBe("sticky");
  // The first screen is one viewport of content, not an extended scrub.
  expect(geometry.sceneHeight).toBeLessThanOrEqual(geometry.viewportHeight * 1.1);
  await expectHeroCopyPinnedInViewport(page, "mobile first viewport");
});

test("Hero no longer renders story panels, a rail or a loading indicator", async ({ page }) => {
  await useHighPerformanceProfile(page);
  for (const viewport of [
    { name: "mobile", width: 390, height: 800 },
    { name: "desktop", width: 1280, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expectPageHydrated(page);
    const hero = page.locator("section[data-hero]");
    await expect(hero.locator("[data-hero-story-panel]"), viewport.name).toHaveCount(0);
    await expect(hero.locator(".cx-hero-story-panel"), viewport.name).toHaveCount(0);
    await expect(hero.locator("[data-hero-loader]"), viewport.name).toHaveCount(0);
    await expect(hero, viewport.name).not.toContainText("Loading experience");
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
