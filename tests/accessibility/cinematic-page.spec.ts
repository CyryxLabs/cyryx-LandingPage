import { expect, test } from "@playwright/test";
import axe from "axe-core";
import { expectPageHydrated } from "../support/page-ready";

test("the entire narrative and each evidence document pass WCAG checks", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  await expectPageHydrated(page);
  await page.addScriptTag({ content: axe.source });
  for (const name of ["Architecture brief", "Acceptance matrix", "Operating record"]) {
    await page.getByRole("tab", { name: new RegExp(name) }).click();
    const results = await page.evaluate(async () =>
      window.axe.run(document.querySelector("main")!, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
      }),
    );
    expect(results.violations, JSON.stringify(results.violations)).toEqual([]);
  }
});

test("evidence tabs support keyboard selection and preserve illustrative labels", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expectPageHydrated(page);
  const first = page.getByRole("tab", { name: /Architecture brief/ });
  await first.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Acceptance matrix/ })).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("Sample · illustrative data");
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: /Operating record/ })).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("09:14:02");
  await page.keyboard.press("ArrowRight");
  await expect(first).toBeFocused();
});

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`service selection works with keyboard and touch while copy stays visible (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion });
    await page.goto("/", { waitUntil: "networkidle" });
    await expectPageHydrated(page);
    const stage = page.locator("#service-visual .cinema-composition");
    const choices = page.locator(".cinema-service button");
    const copy = await page.locator(".cinema-services").innerText();
    await choices.nth(1).focus();
    await page.keyboard.press("Enter");
    await expect(choices.nth(1)).toHaveAttribute("aria-pressed", "true");
    await expect(stage).toHaveAttribute("data-view", "workflow");
    await expect(stage).toContainText("Connected work.");
    await choices.nth(2).click();
    await expect(stage).toHaveAttribute("data-view", "agent");
    await expect(stage).toContainText("A task, with boundaries.");
    expect(await page.locator(".cinema-services").innerText()).toBe(copy);
    await expect(page.locator(".cinema-service-link")).toHaveCount(3);
    if (reducedMotion === "reduce")
      await expect(stage.locator(".cinema-plane-interface")).toHaveCSS("transition-duration", "0s");
  });
}
