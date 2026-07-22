import { test, expect } from "@playwright/test";
import { hasNewPublication, PUBLICATIONS } from "../../src/data/publications";

test.describe("research publication evidence boundary", () => {
  test("does not advertise a new publication without an approved public record", () => {
    expect(PUBLICATIONS).toEqual([]);
    expect(hasNewPublication(30)).toBe(false);
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
