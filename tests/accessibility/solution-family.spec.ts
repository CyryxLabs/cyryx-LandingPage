import { expect, test } from "@playwright/test";

const SOLUTIONS = [
  { path: "/solutions/ai-strategy-advisory", variant: "matrix" },
  { path: "/solutions/digital-web-systems", variant: "flow" },
  { path: "/solutions/workflow-automation", variant: "flow" },
  { path: "/solutions/internal-ai-assistants", variant: "radial" },
  { path: "/solutions/custom-ai-product-development", variant: "stack" },
  { path: "/solutions/ai-governance-cost-control", variant: "matrix" },
] as const;

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1280, height: 900 },
] as const;

for (const solution of SOLUTIONS) {
  test(`${solution.path} has responsive editorial media and an accessible ${solution.variant} diagram`, async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "hero-a11y-chromium",
      "The solution-family contract runs once in the primary Chromium project.",
    );
    test.setTimeout(60_000);

    for (const viewport of VIEWPORTS) {
      await page.setViewportSize(viewport);
      const response = await page.goto(solution.path, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `${solution.path} should load on ${viewport.name}`).toBe(200);

      await expect(page.locator("#main-content")).toBeVisible();
      await expect(page.locator("h1")).toHaveCount(1);
      expect(await page.locator("h2").count()).toBeGreaterThan(5);

      const media = page.locator("figure[data-solution-media]");
      await expect(media).toHaveCount(1);
      await media.scrollIntoViewIfNeeded();
      const image = media.locator("img");
      await expect(image).toBeVisible();
      await expect(image).toHaveAttribute("width", "1440");
      await expect(image).toHaveAttribute("height", "900");
      await expect(image).toHaveAttribute("loading", "eager");
      await expect(image).toHaveAttribute("alt", /.{24,}/);
      await expect(media.locator("picture source")).toHaveAttribute("srcset", /768w.+1440w/);
      await expect(media.locator("figcaption")).toHaveCount(0);
      await expect
        .poll(() => image.evaluate((node) => node.complete && node.naturalWidth > 0))
        .toBe(true);

      const diagram = page.locator("figure[data-solution-diagram]");
      await expect(diagram).toHaveCount(1);
      await expect(diagram).toHaveAttribute("data-diagram-variant", solution.variant);
      await diagram.scrollIntoViewIfNeeded();
      await expect(diagram.locator("figcaption")).toBeVisible();

      const diagramSemantics = await diagram.evaluate((node) => {
        const labelledBy = node.getAttribute("aria-labelledby") ?? "";
        const describedBy = node.getAttribute("aria-describedby") ?? "";
        return {
          hasLabel: Boolean(labelledBy && document.getElementById(labelledBy)),
          hasDescription: Boolean(describedBy && document.getElementById(describedBy)),
          listItems: node.querySelectorAll("ol > li").length,
          tableRows: node.querySelectorAll("tbody > tr").length,
          mobileTerms: node.querySelectorAll("dl > div").length,
        };
      });
      expect(diagramSemantics.hasLabel).toBe(true);
      expect(diagramSemantics.hasDescription).toBe(true);
      expect(
        diagramSemantics.listItems + diagramSemantics.tableRows + diagramSemantics.mobileTerms,
      ).toBeGreaterThan(4);

      if (solution.variant === "matrix") {
        const mobileMatrix = diagram.locator("dl");
        const desktopMatrixTable = diagram.locator("table");
        const desktopMatrixWrapper = desktopMatrixTable.locator("..");

        if (viewport.name === "mobile") {
          await expect(mobileMatrix).toBeVisible();
          await expect(desktopMatrixWrapper).toBeHidden();
          await expect(desktopMatrixTable).toBeHidden();
        } else {
          await expect(mobileMatrix).toBeHidden();
          await expect(desktopMatrixWrapper).toBeVisible();
          await expect(desktopMatrixTable).toBeVisible();
        }
      }

      const layout = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(
        layout.scrollWidth,
        `${solution.path} should not overflow at ${viewport.width}px`,
      ).toBeLessThanOrEqual(layout.clientWidth + 1);
    }
  });
}
