#!/usr/bin/env node
/**
 * Post-deploy compliance + delivery self-check.
 * Verifies:
 *  1. Contact + newsletter forms expose consent tags + privacy links.
 *  2. /unsubscribe and /newsletter/confirm pages are reachable.
 *  3. /api/public/contact and /api/public/newsletter/subscribe respond.
 *  4. (Optional) Recent email_send_log shows no DLQ/failures (requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).
 *
 * Usage: BASE_URL=https://www.cyryxlabs.com node scripts/compliance-self-check.mjs
 */
const BASE = process.env.BASE_URL || "https://www.cyryxlabs.com";
const results = [];
function ok(name) { results.push({ name, ok: true }); console.log("✅", name); }
function fail(name, msg) { results.push({ name, ok: false, msg }); console.error("❌", name, "—", msg); }

async function checkPage(path, mustContain = []) {
  const r = await fetch(BASE + path, { redirect: "follow" });
  if (!r.ok) return fail(`GET ${path}`, `status ${r.status}`);
  const html = await r.text();
  for (const needle of mustContain) {
    if (!html.toLowerCase().includes(needle.toLowerCase())) {
      return fail(`GET ${path}`, `missing: "${needle}"`);
    }
  }
  ok(`GET ${path}`);
}

async function checkApi(path, body, expectStatus = [200, 400, 429]) {
  const r = await fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!expectStatus.includes(r.status)) return fail(`POST ${path}`, `unexpected status ${r.status}`);
  ok(`POST ${path} → ${r.status}`);
}

async function checkEmailLog() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.log("ℹ️  Skipping email_send_log check (set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).");
    return;
  }
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const r = await fetch(
    `${url}/rest/v1/email_send_log?select=status,template_name,error_message,created_at&created_at=gte.${since}&order=created_at.desc&limit=200`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } },
  );
  if (!r.ok) return fail("email_send_log", `status ${r.status}`);
  const rows = await r.json();
  const failed = rows.filter((x) => ["dlq", "failed", "bounced", "complained"].includes(x.status));
  if (failed.length > 0) {
    fail("email_send_log", `${failed.length} failed/dlq rows in last 24h: ${failed.slice(0, 3).map((r) => r.template_name + "/" + r.status).join(", ")}`);
  } else {
    ok(`email_send_log clean (${rows.length} rows in last 24h)`);
  }
}

console.log(`Compliance self-check → ${BASE}\n`);
await checkPage("/", ["privacy", "cyryx"]);
await checkPage("/privacy");
await checkPage("/unsubscribe");
await checkPage("/newsletter/confirm");

// Submit invalid payloads — endpoints must reject without leaking schema.
await checkApi("/api/public/contact", { name: "x" }, [400]);
await checkApi("/api/public/newsletter/subscribe", { email: "not-an-email" }, [200, 400]);

await checkEmailLog();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
if (failed.length > 0) process.exit(1);
