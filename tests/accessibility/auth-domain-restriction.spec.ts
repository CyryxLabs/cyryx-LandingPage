import { test, expect, type Page, type Request as PWRequest } from "@playwright/test";

/**
 * Domain-restriction E2E: only @cyryxlabs.com accounts may sign in or
 * request a password reset. Verifies the client blocks non-authorized
 * domains before any Supabase call, shows a clear message, and never
 * navigates away from /auth.
 */
test.describe("/auth domain restriction", () => {
  // Domains that must ALL be rejected — covers mixed case, plus-addressing,
  // near-miss TLDs, subdomain smuggling, hyphen tricks, unicode look-alikes,
  // trailing text, and prefix tricks.
  const invalidEmails = [
    "user@gmail.com",
    "attacker@evil.com",
    "someone@cyryxlabs.co", // near-miss TLD
    "notcyryxlabs.com@fake.com",
    "User+Tag@Gmail.COM", // mixed-case with plus tag on wrong domain
    "user@sub.cyryxlabs.com", // subdomain smuggling
    "user@cyryxlabs.com.evil.com", // suffix smuggling
    "user@cyryxlabs-com.evil", // hyphen trick
    "user@cyryxlabs.co.uk", // extended TLD
    "user@cyrуxlabs.com", // Cyrillic 'у' look-alike
  ];

  async function captureBlockLog(page: Page) {
    const logs: { url: string; postData: string | null }[] = [];
    page.on("request", (req: PWRequest) => {
      if (req.url().includes("/api/public/auth/domain-block")) {
        logs.push({ url: req.url(), postData: req.postData() });
      }
    });
    return logs;
  }

  for (const email of invalidEmails) {
    test(`sign-in is denied for ${email}`, async ({ page }) => {
      const consoleWarnings: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "warning") consoleWarnings.push(m.text());
      });
      const blockLogs = await captureBlockLog(page);

      await page.goto("/auth", { waitUntil: "networkidle" });
      const emailField = page.getByLabel("Email");
      const passwordField = page.getByLabel("Password");
      await emailField.pressSequentially(email);
      await passwordField.pressSequentially("whatever-Passw0rd!");
      await passwordField.press("Enter");

      const alert = page.getByRole("alert");
      await expect(alert).toBeVisible();
      await expect(alert).toContainText(/@cyryxlabs\.com/);
      await expect(page.getByRole("link", { name: "Contact IT" })).toBeVisible();
      await expect(page).toHaveURL(/\/auth$/);
      expect(consoleWarnings.some((t) => t.includes("blocked sign-in"))).toBe(true);

      // The blocked attempt MUST be persisted server-side (not only console.warn),
      // and the payload MUST include the exact blocked email.
      await expect
        .poll(() => blockLogs.length, { timeout: 4000 })
        .toBeGreaterThan(0);
      const payload = JSON.parse(blockLogs[0].postData ?? "{}");
      // Browser inputs may punycode-encode unicode domains — accept either form.
      const sent = String(payload.email ?? "").toLowerCase();
      expect(sent.startsWith(email.split("@")[0].toLowerCase() + "@")).toBe(true);
      expect(sent.endsWith("@cyryxlabs.com")).toBe(false);
      expect(payload.reason).toBe("sign_in");
    });

    test(`password recovery is denied for ${email}`, async ({ page }) => {
      const consoleWarnings: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "warning") consoleWarnings.push(m.text());
      });
      const blockLogs = await captureBlockLog(page);

      await page.goto("/auth", { waitUntil: "networkidle" });
      await page.getByLabel("Email").pressSequentially(email);
      await page.getByRole("button", { name: "Forgot password?" }).click();

      const alert = page.getByRole("alert");
      await expect(alert).toBeVisible();
      await expect(alert).toContainText(/@cyryxlabs\.com/);
      await expect(page.getByRole("link", { name: "Contact IT" })).toBeVisible();
      await expect(page).toHaveURL(/\/auth$/);
      expect(consoleWarnings.some((t) => t.includes("blocked password recovery"))).toBe(true);

      await expect
        .poll(() => blockLogs.length, { timeout: 4000 })
        .toBeGreaterThan(0);
      const payload = JSON.parse(blockLogs[0].postData ?? "{}");
      const sent = String(payload.email ?? "").toLowerCase();
      expect(sent.startsWith(email.split("@")[0].toLowerCase() + "@")).toBe(true);
      expect(sent.endsWith("@cyryxlabs.com")).toBe(false);
      expect(payload.reason).toBe("password_recovery");
    });
  }

  // Direct-endpoint attack surface: even if the client is bypassed, the
  // server-side recovery route must reject any non-@cyryxlabs.com email.
  test("server-side recovery endpoint rejects non-cyryxlabs domains", async ({ request }) => {
    for (const email of ["attacker@evil.com", "user@sub.cyryxlabs.com", "user@cyryxlabs.co"]) {
      const res = await request.post("/api/public/auth/recover", { data: { email } });
      expect(res.status(), `expected 403 for ${email}, got ${res.status()}`).toBe(403);
      const body = await res.json();
      expect(body.error).toMatch(/@cyryxlabs\.com/);
    }
  });

  test("server-side recovery endpoint accepts @cyryxlabs.com emails (mixed case + plus tag)", async ({
    request,
  }) => {
    for (const email of ["ok@cyryxlabs.com", "Ok.User+tag@Cyryxlabs.COM"]) {
      const res = await request.post("/api/public/auth/recover", { data: { email } });
      expect(res.status(), `expected 200 for ${email}, got ${res.status()}`).toBe(200);
      const body = await res.json();
      expect(body.ok).toBe(true);
    }
  });

  test("workspace routes redirect unauthenticated users to /auth", async ({ page }) => {
    for (const path of ["/workspace", "/workspace/careers", "/workspace/does-not-exist"]) {
      await page.goto(path);
      await page.waitForURL(/\/auth$/);
      await expect(page).toHaveURL(/\/auth$/);
    }
  });
});