import { expect, test } from "@playwright/test";

/**
 * Visual regression snapshots for SolutionPage, Privacy and Terms.
 * Reduced motion is forced so GSAP/CSS animation state doesn't cause flakes.
 * Update snapshots locally with `bun run test:a11y -- --update-snapshots`.
 */
const PAGES = [
  { path: "/solutions/workflow-automation", name: "solution-workflow-automation" },
  { path: "/privacy", name: "privacy" },
  { path: "/terms", name: "terms" },
];

for (const { path, name } of PAGES) {
  test(`visual snapshot: ${name}`, async ({ page }, testInfo) => {
    test.skip(
      process.platform !== "win32" || testInfo.project.name !== "hero-a11y-chromium",
      "Approved visual baselines are Windows desktop captures.",
    );

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1280, height: 1600 });
    await page.goto(path, { waitUntil: "networkidle" });
    // Wait for web fonts so glyph metrics are stable before capturing.
    await page.evaluate(
      () => (document as unknown as { fonts?: { ready: Promise<void> } }).fonts?.ready,
    );
    await expect(page.locator("#main-content")).toBeVisible();

    await expect(page.locator("main")).toHaveScreenshot(`${name}.png`, {
      maxDiffPixelRatio: 0.02,
      animations: "disabled",
      caret: "hide",
    });
  });
}
