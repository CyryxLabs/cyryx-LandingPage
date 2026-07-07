import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

/**
 * E2E: admin generates a magic link that lands the invitee directly on
 * /workspace, preserving ?w and ?tab.
 *
 * We drive the Supabase Admin API directly (mirroring what the
 * `inviteWorkspaceUser` server fn does when called from /workspace/admin),
 * open the returned action_link, and assert the browser lands on
 * /workspace?w=..&tab=.. with an authenticated session.
 *
 * Runs only when the required credentials are provided.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TEST_EMAIL = process.env.TEST_INVITE_EMAIL; // e.g. e2e-invite@cyryxlabs.com
const APP_ORIGIN = process.env.APP_URL || "http://localhost:8080";

const shouldRun = Boolean(SUPABASE_URL && SERVICE_ROLE_KEY && TEST_EMAIL);

test.describe("admin magic-link invite → /workspace preserves ?w and ?tab", () => {
  test.skip(
    !shouldRun,
    "requires SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TEST_INVITE_EMAIL",
  );

  test("magic link with ?w & ?tab redirects into /workspace", async ({ page }) => {
    const admin = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!, {
      auth: { persistSession: false },
    });

    // Ensure the target user exists and is confirmed (magic link requires it).
    const { data: list } = await admin.auth.admin.listUsers({ perPage: 200 });
    let user = list?.users.find(
      (u) => u.email?.toLowerCase() === TEST_EMAIL!.toLowerCase(),
    );
    if (!user) {
      const { data, error } = await admin.auth.admin.createUser({
        email: TEST_EMAIL!,
        email_confirm: true,
      });
      expect(error).toBeNull();
      user = data.user!;
    } else if (!user.email_confirmed_at) {
      await admin.auth.admin.updateUserById(user.id, { email_confirm: true });
    }

    // Grant a role so /_authenticated is meaningful.
    await admin
      .from("user_roles")
      .upsert({ user_id: user!.id, role: "user" }, { onConflict: "user_id,role" });

    // Generate the magic link the way the admin UI does.
    const redirectTo = `${APP_ORIGIN}/auth?w=90d&tab=overview`;
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: "magiclink",
      email: TEST_EMAIL!,
      options: { redirectTo },
    });
    expect(linkErr).toBeNull();
    const actionLink = linkData?.properties?.action_link;
    expect(actionLink).toBeTruthy();

    // Open the link — Supabase verifies the OTP then redirects to redirectTo
    // with the session in the URL hash; /auth then redirects into /workspace.
    await page.goto(actionLink!);
    await page.waitForURL(/\/workspace(\/|\?)/, { timeout: 20_000 });

    const url = new URL(page.url());
    expect(url.pathname).toMatch(/^\/workspace/);
    expect(url.searchParams.get("w")).toBe("90d");
    expect(url.searchParams.get("tab")).toBe("overview");

    // Session should be live in the browser.
    const hasSession = await page.evaluate(() =>
      Object.keys(window.localStorage).some((k) => k.startsWith("sb-") && k.endsWith("-auth-token")),
    );
    expect(hasSession).toBe(true);
  });
});
