import { test, expect } from "@playwright/test";
import { hasNewPublication, PUBLICATIONS, type Publication } from "../../src/data/publications";

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

test.describe("research publication release boundary", () => {
  test("unapproved publication routes return to the research hub", async ({ page }) => {
    await page.goto("/research/cgp-v1");
    await expect(page).toHaveURL(/\/research\/?$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Research for systems that must leave the lab",
    );
    await expect(page.locator("main")).not.toContainText("DOI");
    await expect(page.locator("main")).toContainText("Evidence before publication");
  });
});
