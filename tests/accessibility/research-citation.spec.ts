import { test, expect } from "@playwright/test";
import {
  hasNewPublication,
  PUBLICATIONS,
  type Publication,
} from "../../src/data/publications";

const DAY = 24 * 60 * 60 * 1000;

function withMutated<T>(fn: (originals: Publication[]) => T): T {
  const originals = PUBLICATIONS.map((p) => ({ ...p }));
  try {
    return fn(originals);
  } finally {
    PUBLICATIONS.forEach((p, i) => Object.assign(p, originals[i]));
  }
}

test.describe("hasNewPublication() static date check", () => {
  test("returns true when a paper is within the last 30 days", () => {
    withMutated(() => {
      const recent = new Date(Date.now() - 5 * DAY).toISOString();
      PUBLICATIONS.forEach((p) => {
        p.status = "published";
        p.publishedAt = recent;
      });
      expect(hasNewPublication(30)).toBe(true);
    });
  });

  test("returns false when all papers are older than 30 days and not flagged new", () => {
    withMutated(() => {
      const old = new Date(Date.now() - 60 * DAY).toISOString();
      PUBLICATIONS.forEach((p) => {
        p.status = "published";
        p.publishedAt = old;
      });
      expect(hasNewPublication(30)).toBe(false);
    });
  });

  test('returns true when a paper is explicitly status="new"', () => {
    withMutated(() => {
      const old = new Date(Date.now() - 365 * DAY).toISOString();
      PUBLICATIONS.forEach((p) => {
        p.status = "new";
        p.publishedAt = old;
      });
      expect(hasNewPublication(30)).toBe(true);
    });
  });
});

test.describe("CGP v1.0 citation modal", () => {
  test("tabs switch and Copy writes plain text with no HTML entities", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    await page.goto("/research/cgp-v1");
    await page.getByRole("button", { name: /cite this paper/i }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // Default tab: BibTeX
    await expect(dialog.locator("pre")).toContainText("@techreport{cyryxlabs2026cgp");

    // Switch to APA
    await dialog.getByRole("button", { name: "APA" }).click();
    await expect(dialog.locator("pre")).toContainText(
      "CGP: Cyryx Governance Protocol for Agentic AI Execution",
    );
    await expect(dialog.locator("pre")).toContainText("Cyryx Labs LLC");

    // Switch to Plain text
    await dialog.getByRole("button", { name: /plain text/i }).click();
    await expect(dialog.locator("pre")).toContainText("DOI:");

    // Copy and read clipboard
    await dialog.getByRole("button", { name: /^copy$/i }).click();
    const clip = await page.evaluate(() => navigator.clipboard.readText());

    expect(clip.length).toBeGreaterThan(0);
    // No HTML entities should leak into copied text
    expect(clip).not.toMatch(/&(amp|lt|gt|quot|#\d+|#x[0-9a-fA-F]+);/);
    expect(clip).toContain("CGP: Cyryx Governance Protocol for Agentic AI Execution");

    // Close via Close button
    await dialog.getByRole("button", { name: /^close$/i }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});