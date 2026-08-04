import { expect, type Page } from "@playwright/test";

export async function expectPageHydrated(page: Page) {
  await expect(page.locator("html")).toHaveAttribute("data-cyryx-hydrated", "true", {
    timeout: 30_000,
  });
}
