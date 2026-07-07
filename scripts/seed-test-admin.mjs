#!/usr/bin/env node
// Test-only helper to provision an admin user for the E2E /auth → /workspace flow.
// Uses the service role key locally; never bundle or ship to the client.
// Usage:
//   TEST_ADMIN_EMAIL=... TEST_ADMIN_PASSWORD=... \
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
//   node scripts/seed-test-admin.mjs
//
// Safe to run repeatedly: creates the user if missing, then upserts the
// admin role in public.user_roles.
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.TEST_ADMIN_EMAIL;
const password = process.env.TEST_ADMIN_PASSWORD;

if (!url || !key || !email || !password) {
  console.error(
    "Missing env. Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD",
  );
  process.exit(2);
}
// Refuse to run against a production-looking project without an explicit opt-in.
if (!process.env.ALLOW_SEED && /prod|production/i.test(url)) {
  console.error("Refusing to seed: URL looks like production. Set ALLOW_SEED=1 to override.");
  process.exit(3);
}

const admin = createClient(url, key, { auth: { persistSession: false } });

// 1) Find or create the auth user.
let userId;
const { data: list, error: listErr } = await admin.auth.admin.listUsers({ perPage: 200 });
if (listErr) throw listErr;
const existing = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
if (existing) {
  userId = existing.id;
  await admin.auth.admin.updateUserById(userId, { password, email_confirm: true });
} else {
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;
  userId = data.user.id;
}

// 2) Ensure the admin role row exists.
const { error: roleErr } = await admin
  .from("user_roles")
  .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
if (roleErr) throw roleErr;

console.log(`seed-test-admin: ok (user_id=${userId}, role=admin)`);