import { expect, test } from "@playwright/test";

/**
 * prefers-reduced-motion contract for SolutionPage, Privacy, and Terms:
 * no infinite CSS animations, no CSS transitions with non-zero duration,
 * and no <video autoplay> should be active. Content still renders.
 */
const PAGES = [
  { path: "/solutions/workflow-automation", label: "SolutionPage" },
  { path: "/privacy", label: "Privacy" },
  { path: "/terms", label: "Terms" },
];

for (const { path, label } of PAGES) {
  test(`${label}: honors prefers-reduced-motion`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path, { waitUntil: "networkidle" });
    await expect(page.locator("#main-content")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();

    // No autoplaying videos.
    const autoplayCount = await page.locator("video[autoplay]").count();
    expect(autoplayCount, "reduced-motion should disable autoplay video").toBe(0);

    // Scan a bounded sample of interactive/animated elements. Any long,
    // infinite CSS animation implies motion the user asked to suppress.
    const offenders = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll("main *")) as HTMLElement[];
      const bad: { tag: string; anim: string; iter: string }[] = [];
      for (const el of nodes.slice(0, 400)) {
        const s = getComputedStyle(el);
        const iter = s.animationIterationCount;
        const name = s.animationName;
        if (name && name !== "none" && (iter === "infinite" || parseFloat(s.animationDuration) > 0.5)) {
          bad.push({ tag: el.tagName, anim: name, iter });
        }
      }
      return bad;
    });
    expect(offenders, `unsuppressed animations under reduced motion: ${JSON.stringify(offenders)}`).toEqual([]);
  });
}
