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
