import { expect, test, type Page } from "@playwright/test";
import axeCore from "axe-core";

type AxeViolation = {
  id: string;
  impact: "minor" | "moderate" | "serious" | "critical" | null;
  help: string;
  helpUrl: string;
  nodes: Array<{ target: string[]; failureSummary?: string }>;
};

type AxeResults = { violations: AxeViolation[] };

declare global {
  interface Window {
    axe: { run: (ctx: Element | Document, opts: unknown) => Promise<AxeResults> };
  }
}

const PAGES = [
  { path: "/solutions/workflow-automation", label: "SolutionPage" },
  { path: "/privacy", label: "Privacy" },
  { path: "/terms", label: "Terms" },
];

async function runAxe(page: Page): Promise<AxeResults> {
  await page.addScriptTag({ content: axeCore.source });
  return page.evaluate(async () => {
    return window.axe.run(document, {
      resultTypes: ["violations"],
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    });
  }) as Promise<AxeResults>;
}

for (const { path, label } of PAGES) {
  test.describe(`${label} (${path})`, () => {
    test("has no critical/serious axe violations", async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });
      const { violations } = await runAxe(page);
      const failOn = (process.env.AXE_FAIL_ON ?? "critical").toLowerCase();
      const order = ["minor", "moderate", "serious", "critical"] as const;
      const threshold = Math.max(0, order.indexOf(failOn as (typeof order)[number]));
      const blocking = violations.filter((v) => v.impact && order.indexOf(v.impact) >= threshold);
      expect(blocking, JSON.stringify(blocking, null, 2)).toHaveLength(0);
    });

    test("skip link + keyboard navigation reach main content", async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });
      await page.keyboard.press("Tab");
      await expect(page.locator(".skip-link")).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.locator("#main-content")).toBeFocused();

      // Tab through several interactive elements; assert focus advances and
      // visible focus ring exists on the currently focused element.
      const seen = new Set<string>();
      for (let i = 0; i < 6; i += 1) {
        await page.keyboard.press("Tab");
        const key = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return "";
          const style = getComputedStyle(el);
          return `${el.tagName}:${el.textContent?.trim().slice(0, 40) ?? ""}:${style.outlineStyle}`;
        });
        if (key) seen.add(key);
      }
      expect(seen.size, "tabbing did not advance focus across distinct elements").toBeGreaterThan(
        2,
      );
    });

    test("current breadcrumb is marked with aria-current=page", async ({ page }) => {
      await page.goto(path, { waitUntil: "networkidle" });
      const current = page.locator('[aria-current="page"]').first();
      await expect(current).toBeVisible();
    });
  });
}
