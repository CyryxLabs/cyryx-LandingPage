import { test, expect } from "@playwright/test";

/**
 * Domain-restriction E2E: only @cyryxlabs.com accounts may sign in or
 * request a password reset. Verifies the client blocks non-authorized
 * domains before any Supabase call, shows a clear message, and never
 * navigates away from /auth.
 */
test.describe("/auth domain restriction", () => {
  const invalidEmails = [
    "user@gmail.com",
    "attacker@evil.com",
    "someone@cyryxlabs.co", // near-miss TLD
    "notcyryxlabs.com@fake.com",
  ];

  for (const email of invalidEmails) {
    test(`sign-in is denied for ${email}`, async ({ page }) => {
      const consoleWarnings: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "warning") consoleWarnings.push(m.text());
      });

      await page.goto("/auth");
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").fill("whatever-Passw0rd!");
      await page.getByRole("button", { name: "Sign in" }).click();

      const alert = page.getByRole("alert");
      await expect(alert).toBeVisible();
      await expect(alert).toContainText(/@cyryxlabs\.com/);
      await expect(page).toHaveURL(/\/auth$/);
      expect(consoleWarnings.some((t) => t.includes("blocked sign-in"))).toBe(true);
    });

    test(`password recovery is denied for ${email}`, async ({ page }) => {
      const consoleWarnings: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "warning") consoleWarnings.push(m.text());
      });

      await page.goto("/auth");
      await page.getByLabel("Email").fill(email);
      await page.getByRole("button", { name: "Forgot password?" }).click();

      const alert = page.getByRole("alert");
      await expect(alert).toBeVisible();
      await expect(alert).toContainText(/@cyryxlabs\.com/);
      await expect(page).toHaveURL(/\/auth$/);
      expect(consoleWarnings.some((t) => t.includes("blocked password recovery"))).toBe(true);
    });
  }

  test("workspace routes redirect unauthenticated users to /auth", async ({ page }) => {
    for (const path of ["/workspace", "/workspace/careers", "/workspace/does-not-exist"]) {
      await page.goto(path);
      await page.waitForURL(/\/auth$/);
      await expect(page).toHaveURL(/\/auth$/);
    }
  });
});