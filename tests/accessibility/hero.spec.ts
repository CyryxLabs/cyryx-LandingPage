import { expect, test, type Page } from "@playwright/test";
import axeCore from "axe-core";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

declare global {
  interface Window {
    axe: {
      run: (context: Element, options: unknown) => Promise<AxeResults>;
    };
  }
}

type AxeViolation = {
  id: string;
  impact: "minor" | "moderate" | "serious" | "critical" | null;
  description: string;
  help: string;
  helpUrl: string;
  nodes: Array<{
    target: string[];
    html: string;
    failureSummary?: string;
  }>;
};

type AxeResults = {
  url: string;
  timestamp: string;
  violations: AxeViolation[];
  passes: unknown[];
  incomplete: unknown[];
  inapplicable: unknown[];
};

const reportDir = process.env.A11Y_REPORT_DIR ?? "a11y-report";

async function writeA11yReport(testName: string, results: AxeResults, critical: AxeViolation[]) {
  await mkdir(reportDir, { recursive: true });
  const safeName = testName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const payload = {
    generatedAt: new Date().toISOString(),
    scannedRegion: "section[data-hero]",
    criticalViolationCount: critical.length,
    criticalViolations: critical,
    violations: results.violations,
  };

  await writeFile(
    path.join(reportDir, `${safeName}.json`),
    `${JSON.stringify(payload, null, 2)}\n`,
    "utf8",
  );

  await writeFile(
    path.join(reportDir, `${safeName}.html`),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Hero accessibility report</title>
    <style>
      body { font-family: system-ui, sans-serif; margin: 2rem; line-height: 1.5; color: #111; }
      code, pre { background: #f4f4f5; border-radius: 4px; padding: 0.15rem 0.3rem; }
      article { border-top: 1px solid #d4d4d8; padding-top: 1rem; margin-top: 1rem; }
    </style>
  </head>
  <body>
    <h1>Hero accessibility report</h1>
    <p><strong>Generated:</strong> ${payload.generatedAt}</p>
    <p><strong>Critical violations:</strong> ${critical.length}</p>
    ${results.violations
      .map(
        (violation) => `<article>
          <h2>${violation.id} — ${violation.impact ?? "unknown"}</h2>
          <p>${violation.help}</p>
          <p><a href="${violation.helpUrl}">${violation.helpUrl}</a></p>
          <pre>${escapeHtml(
            JSON.stringify(
              violation.nodes.map((node) => ({
                target: node.target,
                failureSummary: node.failureSummary,
              })),
              null,
              2,
            ),
          )}</pre>
        </article>`,
      )
      .join("\n")}
  </body>
</html>`,
    "utf8",
  );
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char] ?? char,
  );
}

async function scanHeroWithAxe(page: Page) {
  await page.addScriptTag({ content: axeCore.source });
  return page.evaluate(async () => {
    const hero = document.querySelector("section[data-hero]");
    if (!hero) throw new Error("Hero section not found");
    return window.axe.run(hero, {
      resultTypes: ["violations", "incomplete", "passes", "inapplicable"],
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
      },
    });
  }) as Promise<AxeResults>;
}

test.beforeEach(async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await expect(page.locator("section[data-hero]")).toBeVisible();
});

test("Hero has no critical axe violations", async ({ page }, testInfo) => {
  const results = await scanHeroWithAxe(page);
  const failOn = (process.env.AXE_FAIL_ON ?? "critical").toLowerCase();
  const order = ["minor", "moderate", "serious", "critical"] as const;
  const threshold = Math.max(0, order.indexOf(failOn as (typeof order)[number]));
  const blocking = results.violations.filter(
    (v) => v.impact && order.indexOf(v.impact) >= threshold,
  );
  await writeA11yReport(testInfo.project.name, results, blocking);

  expect(blocking, JSON.stringify(blocking, null, 2)).toHaveLength(0);
});

test("Skip link lands on main content and keyboard focus continues through Hero", async ({
  page,
}) => {
  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();

  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();

  const primaryLabel = "Start a Project with Cyryx Labs";
  const secondaryLabel = "Explore MAAX Studio — flagship product";
  const primary = page.locator(`section[data-hero] a[aria-label="${primaryLabel}"]`);
  const secondary = page.locator(`section[data-hero] a[aria-label="${secondaryLabel}"]`);

  await primary.focus();
  await expect(primary).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(secondary).toBeFocused();

  const primaryHref = await primary.getAttribute("href");
  expect(primaryHref).toBe("/start");

  const secondaryHref = await secondary.getAttribute("href");
  expect(secondaryHref).toBe("#maax");
});

test("Hero headline typography stays unclipped from 360px to 1024px", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const viewport of [
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("#hero-heading")).toBeVisible();

    const metrics = await page.locator("#hero-heading").evaluate((heading) => {
      const headingRect = heading.getBoundingClientRect();
      const lineRects = Array.from(heading.querySelectorAll(".cx-hero-title-line")).map((line) => {
        const rect = line.getBoundingClientRect();
        const style = getComputedStyle(line);
        return {
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
          fontSize: parseFloat(style.fontSize),
          lineHeight: parseFloat(style.lineHeight),
          letterSpacing: style.letterSpacing,
          overflow: style.overflow,
          paddingBottom: parseFloat(style.paddingBottom),
        };
      });
      return {
        heading: {
          top: headingRect.top,
          right: headingRect.right,
          bottom: headingRect.bottom,
          left: headingRect.left,
          overflow: getComputedStyle(heading).overflow,
        },
        lineRects,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
      };
    });

    expect(metrics.heading.overflow).toBe("visible");
    expect(metrics.documentWidth).toBeLessThanOrEqual(metrics.viewportWidth + 1);
    for (const line of metrics.lineRects) {
      expect(line.overflow).toBe("visible");
      // Exact authored CSS ratios: compact negative tracking, line-height 1.08-1.14.
      const computedLetterSpacing =
        line.letterSpacing === "normal" ? 0 : parseFloat(line.letterSpacing);
      const letterSpacingRatio = metrics.viewportWidth < 768 ? -0.03 : -0.035;
      const expectedLetterSpacing = line.fontSize * letterSpacingRatio;
      expect(Number.isFinite(computedLetterSpacing)).toBeTruthy();
      expect(Math.abs(computedLetterSpacing - expectedLetterSpacing)).toBeLessThanOrEqual(
        Math.max(0.1, line.fontSize * 0.005), // relaxed slightly for browser rounding
      );

      const lineHeightRatio = metrics.viewportWidth < 768 ? 1.14 : 1.08; // 1.08 for lg match
      const expectedLineHeight = line.fontSize * lineHeightRatio;
      expect(Math.abs(line.lineHeight - expectedLineHeight)).toBeLessThanOrEqual(
        Math.max(0.1, line.fontSize * 0.005),
      );

      const expectedPaddingBottom = line.fontSize * 0.08;
      expect(Math.abs(line.paddingBottom - expectedPaddingBottom)).toBeLessThanOrEqual(
        Math.max(0.05, line.fontSize * 0.003),
      );
      expect(line.left).toBeGreaterThanOrEqual(metrics.heading.left - 1);
      expect(line.right).toBeLessThanOrEqual(metrics.viewportWidth + 1);
      expect(line.top).toBeGreaterThanOrEqual(0);
      expect(line.bottom).toBeLessThanOrEqual(metrics.viewportHeight + 1);
    }
  }
});

test("Forced-colors keeps Hero text and focus indicators system-readable", async ({ page }) => {
  await page.emulateMedia({ forcedColors: "active" });
  await page.reload({ waitUntil: "networkidle" });
  const headlineColor = await page
    .locator(".cx-hero-title-line")
    .first()
    .evaluate((el) => getComputedStyle(el).color);
  const textFill = await page
    .locator(".cx-hero-title-line")
    .first()
    .evaluate((el) => getComputedStyle(el).webkitTextFillColor);
  expect(headlineColor).not.toBe("rgba(0, 0, 0, 0)");
  expect(textFill).not.toBe("rgba(0, 0, 0, 0)");

  const primaryAnchor = page.locator('section[data-hero] a[href="/start"]').first();
  await expect(primaryAnchor).toBeVisible();
  await primaryAnchor.focus();
  const focusIndicator = await primaryAnchor.evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: parseFloat(style.outlineWidth) || 0,
      boxShadow: style.boxShadow,
    };
  });
  const hasVisibleIndicator =
    (focusIndicator.outlineStyle !== "none" && focusIndicator.outlineWidth > 0) ||
    (focusIndicator.boxShadow && focusIndicator.boxShadow !== "none");
  expect(
    hasVisibleIndicator,
    `Expected system-readable focus indicator on primary Hero CTA; received ${JSON.stringify(focusIndicator)}`,
  ).toBeTruthy();

  const secondaryAnchor = page.locator('section[data-hero] a[href="#maax"]').first();
  await expect(secondaryAnchor).toBeVisible();
});
