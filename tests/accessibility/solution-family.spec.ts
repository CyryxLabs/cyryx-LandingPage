import { expect, test } from "@playwright/test";
import { SERVICES } from "../../src/data/services";

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1280, height: 900 },
] as const;

/**
 * Every service page of the 2026-11-13 site shares one template: an
 * answer-first paragraph, what you get, the steps, examples by company size,
 * a visible FAQ that matches its FAQPage schema, and no price.
 */
for (const service of SERVICES) {
  test(`${service.path} follows the service template without overflow`, async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "hero-a11y-chromium",
      "The service-family contract runs once in the primary Chromium project.",
    );
    test.setTimeout(60_000);

    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport);
      const response = await page.goto(service.path, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `${service.path} should load on ${viewport.name}`).toBe(200);

      await expect(page.locator("#main-content")).toBeVisible();
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toHaveText(service.h1);
      expect(await page.locator("h2").count()).toBeGreaterThan(5);
      await expect(page.locator(".cy-answer")).toHaveText(service.answer);
      await expect(page.locator("#what-you-get ol > li")).toHaveCount(service.deliver.length);
      await expect(page.locator("main")).not.toContainText(/\$\d/);
      await expect(page.locator('img[src*="monolith"], img[src*="brand-mark"]')).toHaveCount(0);

      const questions = await page.locator(".cy-faq summary").allInnerTexts();
      expect(questions.map((question) => question.trim())).toEqual(
        service.faq.map((item) => item.q),
      );
      const schemaQuestions = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((nodes) =>
          nodes
            .map((node) => JSON.parse(node.textContent || "{}"))
            .filter((node) => node["@type"] === "FAQPage")
            .flatMap((node) => node.mainEntity.map((entry: { name: string }) => entry.name)),
        );
      expect(schemaQuestions).toEqual(service.faq.map((item) => item.q));

      const layout = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(
        layout.scrollWidth,
        `${service.path} should not overflow at ${viewport.width}px`,
      ).toBeLessThanOrEqual(layout.clientWidth + 1);
    }
  });
}
