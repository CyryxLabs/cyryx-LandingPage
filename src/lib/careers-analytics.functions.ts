import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type CareersFunnel = {
  windowDays: number;
  since: string;
  clicks: number;
  submissions: number;
  rateLimitHits: number;
  confirmationsQueued: number;
  confirmationsSent: number;
  confirmationsFailed: number;
  confirmed: number;
  daily: Array<{
    day: string;
    submissions: number;
    confirmed: number;
    rateLimitHits: number;
  }>;
};

export const getCareersFunnel = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown): { windowDays: number } => {
    const w = Number((raw as { windowDays?: unknown })?.windowDays ?? 30);
    const windowDays = Number.isFinite(w) ? Math.min(90, Math.max(1, Math.floor(w))) : 30;
    return { windowDays };
  })
  .handler(async ({ data, context }) => {
    // Admin gate — read own roles via RLS-scoped user client.
    const { data: roles, error: rolesErr } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (rolesErr) throw new Error("Unable to read roles");
    if (!roles?.some((r) => r.role === "admin")) {
      throw new Response("Forbidden", { status: 403 });
    }

    // Server-only privileged reads for cross-table analytics.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - data.windowDays * 24 * 60 * 60 * 1000).toISOString();

    async function count(
      table: string,
      filters: Record<string, string> = {},
      gteCol = "created_at",
    ): Promise<number> {
      let q = (supabaseAdmin as any)
        .from(table)
        .select("id", { count: "exact", head: true })
        .gte(gteCol, since);
      for (const [k, v] of Object.entries(filters)) q = q.eq(k, v);
      const { count, error } = await q;
      if (error) return 0;
      return count ?? 0;
    }

    const [
      clicks,
      submissions,
      rateLimitHits,
      confirmationsQueued,
      confirmationsSent,
      confirmationsFailed,
      confirmed,
    ] = await Promise.all([
      count("cta_events", { section: "careers", cta: "careers_talent_network" }),
      count("cta_events", { section: "careers", cta: "talent_network_signup" }),
      count("rate_limit_events", { endpoint: "/api/public/newsletter/subscribe" }),
      count("email_send_log", { template_name: "newsletter-confirm", status: "pending" }),
      count("email_send_log", { template_name: "newsletter-confirm", status: "sent" }),
      count("email_send_log", { template_name: "newsletter-confirm", status: "dlq" }),
      count("newsletter_subscribers", { status: "confirmed" }, "consent_given_at"),
    ]);

    // Per-day rollup for submissions / confirmations / rate-limit hits.
    const [subRows, confRows, rlRows] = await Promise.all([
      supabaseAdmin
        .from("cta_events")
        .select("created_at")
        .eq("section", "careers")
        .eq("cta", "talent_network_signup")
        .gte("created_at", since),
      supabaseAdmin
        .from("newsletter_subscribers")
        .select("consent_given_at")
        .eq("status", "confirmed")
        .gte("consent_given_at", since),
      supabaseAdmin
        .from("rate_limit_events")
        .select("created_at")
        .eq("endpoint", "/api/public/newsletter/subscribe")
        .gte("created_at", since),
    ]);

    const byDay = new Map<string, { submissions: number; confirmed: number; rateLimitHits: number }>();
    for (let i = 0; i < data.windowDays; i++) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      byDay.set(d, { submissions: 0, confirmed: 0, rateLimitHits: 0 });
    }
    for (const r of subRows.data ?? []) {
      const d = (r.created_at as string).slice(0, 10);
      const b = byDay.get(d);
      if (b) b.submissions++;
    }
    for (const r of confRows.data ?? []) {
      const raw = r.consent_given_at as string | null;
      if (!raw) continue;
      const b = byDay.get(raw.slice(0, 10));
      if (b) b.confirmed++;
    }
    for (const r of rlRows.data ?? []) {
      const d = (r.created_at as string).slice(0, 10);
      const b = byDay.get(d);
      if (b) b.rateLimitHits++;
    }
    const daily = Array.from(byDay.entries())
      .map(([day, v]) => ({ day, ...v }))
      .sort((a, b) => a.day.localeCompare(b.day));

    const funnel: CareersFunnel = {
      windowDays: data.windowDays,
      since,
      clicks,
      submissions,
      rateLimitHits,
      confirmationsQueued,
      confirmationsSent,
      confirmationsFailed,
      confirmed,
      daily,
    };
    return funnel;
  });