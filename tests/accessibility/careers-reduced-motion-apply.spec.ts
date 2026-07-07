import { expect, test } from "@playwright/test";

/**
 * Careers "Apply" deep-link contract under prefers-reduced-motion.
 * Clicking a role's Apply link must jump focus/scroll to the form and
 * pre-select the role WITHOUT starting any GSAP tween or ScrollTrigger,
 * and without triggering long/infinite CSS animations.
 */
test("Careers: Apply nav respects reduced motion (no GSAP)", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/careers", { waitUntil: "networkidle" });

  // Sanity: form present, first role link present.
  const form = page.locator("#apply");
  await expect(form).toBeVisible();
  const applyLink = page.locator('a[href^="#apply?role="]').first();
  const roleTitle = await applyLink
    .locator("xpath=ancestor::li")
    .locator("h2")
    .first()
    .textContent();

  await applyLink.click();

  // Role is pre-filled into the select.
  const select = page.locator("#apply-role");
  await expect(select).toHaveValue((roleTitle ?? "").trim());

  // Give any (forbidden) animation a tick to register.
  await page.waitForTimeout(200);

  // GSAP must NOT have live tweens or ScrollTriggers under reduced motion.
  const gsapState = await page.evaluate(() => {
    const g = (window as unknown as {
      gsap?: { globalTimeline?: { getChildren?: () => unknown[] } };
    }).gsap;
    const st = (window as unknown as {
      ScrollTrigger?: { getAll?: () => unknown[] };
    }).ScrollTrigger;
    return {
      tweens: g?.globalTimeline?.getChildren?.().length ?? 0,
      scrollTriggers: st?.getAll?.().length ?? 0,
    };
  });
  expect(gsapState.scrollTriggers, "ScrollTrigger active on Careers under reduced motion").toBe(0);
  expect(gsapState.tweens, "GSAP tweens active on Careers under reduced motion").toBe(0);

  // No infinite / long CSS animations on the form region.
  const offenders = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll("#apply *")) as HTMLElement[];
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
  expect(offenders, `unsuppressed animations: ${JSON.stringify(offenders)}`).toEqual([]);
});