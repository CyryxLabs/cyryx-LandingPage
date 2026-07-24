import { expect, test } from "@playwright/test";
import { CGP_V1, PUBLICATIONS } from "../../src/data/publications";

test.describe("verified research publication record", () => {
  test("keeps the approved CGP record and public identifiers in the registry", () => {
    expect(PUBLICATIONS).toContain(CGP_V1);
    expect(CGP_V1.status).toBe("published");
    expect(CGP_V1.doi).toBe("10.5281/zenodo.21045760");
    expect(CGP_V1.conceptDoi).toBe("10.5281/zenodo.21045759");
    expect(CGP_V1.recordUrl).toBe("https://zenodo.org/records/21045760");
  });

  test("lists the publication from the Research hub", async ({ page }) => {
    await page.goto("/research");
    await expect(
      page.getByRole("heading", {
        name: "CGP: Cyryx Governance Protocol for Agentic AI Execution",
      }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Read the protocol" })).toHaveAttribute(
      "href",
      "/research/cgp-v1",
    );
    await expect(
      page.getByRole("link", { name: /DOI 10\.5281\/zenodo\.21045760/ }),
    ).toHaveAttribute("href", "https://doi.org/10.5281/zenodo.21045760");
  });

  test("renders the citable publication page without redirecting", async ({ page }) => {
    await page.goto("/research/cgp-v1");

    await expect(page).toHaveURL(/\/research\/cgp-v1$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "CGP: Cyryx Governance Protocol for Agentic AI Execution",
    );
    await expect(page.getByText("DOI 10.5281/zenodo.21045760")).toBeVisible();
    await expect(page.getByRole("link", { name: "Open DOI record" })).toHaveAttribute(
      "href",
      "https://doi.org/10.5281/zenodo.21045760",
    );

    await expect(page.getByRole("button", { name: "Copy citation" })).toBeVisible();
    await expect(page.getByText(/CYRYX Labs\. \(2026\).*10\.5281\/zenodo\.21045760/)).toBeVisible();
  });
});
