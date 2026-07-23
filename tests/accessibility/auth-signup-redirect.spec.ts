import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

/**
 * E2E: sign-up + sign-in flow from /auth preserves ?w and ?tab through the
 * redirect into the workspace.
 *
 * Because Supabase requires email confirmation for real sign-ups, this test
 * provisions a confirmed account via the admin API (service role) instead of
 * hitting the /signup endpoint, then drives the /auth UI as a normal user.
 * Runs only when both a service-role key and a scratch email are provided.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TEST_EMAIL = process.env.TEST_SIGNUP_EMAIL; // e.g. e2e+YYYYMMDD@cyryxlabs.com
const TEST_PASSWORD = process.env.TEST_SIGNUP_PASSWORD;

const shouldRun = Boolean(SUPABASE_URL && SERVICE_ROLE_KEY && TEST_EMAIL && TEST_PASSWORD);

test.describe("auth → workspace preserves ?w and ?tab", () => {
  test.skip(!shouldRun, "requires SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TEST_SIGNUP_EMAIL, TEST_SIGNUP_PASSWORD");

  test("/auth?w=90&tab=overview → /workspace?w=90&tab=overview", async ({ page }) => {
    const admin = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!, {
      auth: { persistSession: false },
    });

    // Ensure a confirmed user exists (idempotent).
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 });
    const existing = list?.users.find((u) => u.email?.toLowerCase() === TEST_EMAIL!.toLowerCase());
    if (existing) {
      await admin.auth.admin.updateUserById(existing.id, {
        password: TEST_PASSWORD!,
        email_confirm: true,
      });
    } else {
      const { error } = await admin.auth.admin.createUser({
        email: TEST_EMAIL!,
        password: TEST_PASSWORD!,
        email_confirm: true,
      });
      expect(error).toBeNull();
    }

    // Verify the sign-up toggle is present on /auth before signing in.
    await page.goto("/auth?w=90&tab=overview");
    await expect(page.getByRole("button", { name: /Need an account\? Sign up/i })).toBeVisible();

    // Sign in with the confirmed test account.
    await page.getByLabel("Email").fill(TEST_EMAIL!);
    await page.getByLabel("Password").fill(TEST_PASSWORD!);
    await page.getByRole("button", { name: /^Sign in$/ }).click();

    // Assert we land on /workspace with ?w and ?tab preserved.
    await page.waitForURL(/\/workspace(\/|\?)/, { timeout: 15_000 });
    const url = new URL(page.url());
    expect(url.pathname).toMatch(/^\/workspace/);
    expect(url.searchParams.get("w")).toBe("90");
    expect(url.searchParams.get("tab")).toBe("overview");
  });
});