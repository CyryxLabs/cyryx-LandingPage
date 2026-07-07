import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data: roles, error } = await ctx.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.userId);
  if (error) throw new Error("Unable to read roles");
  if (!roles?.some((r: { role: string }) => r.role === "admin")) {
    throw new Response("Forbidden", { status: 403 });
  }
}

export type ContactRow = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  created_at: string;
  handled_at: string | null;
  notes: string | null;
};

export type SubscriberRow = {
  id: string;
  email: string;
  status: string;
  consent_given_at: string;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
};

export type AdminOverview = {
  windowDays: number;
  since: string;
  totals: {
    contactsTotal: number;
    contactsWindow: number;
    contactsPending: number;
    subscribersTotal: number;
    subscribersConfirmed: number;
    subscribersPending: number;
    ctaEventsWindow: number;
  };
  topCtas: Array<{ cta: string; section: string; count: number }>;
  recentContacts: ContactRow[];
  recentSubscribers: SubscriberRow[];
};

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown): { windowDays: number } => {
    const w = Number((raw as { windowDays?: unknown })?.windowDays ?? 30);
    const windowDays = Number.isFinite(w) ? Math.min(90, Math.max(1, Math.floor(w))) : 30;
    return { windowDays };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - data.windowDays * 86400_000).toISOString();

    async function count(table: string, filters: Record<string, string> = {}, gteCol?: string, isNullCol?: string) {
      let q = (supabaseAdmin as any).from(table).select("id", { count: "exact", head: true });
      if (gteCol) q = q.gte(gteCol, since);
      for (const [k, v] of Object.entries(filters)) q = q.eq(k, v);
      if (isNullCol) q = q.is(isNullCol, null);
      const { count, error } = await q;
      if (error) return 0;
      return count ?? 0;
    }

    const [
      contactsTotal,
      contactsWindow,
      contactsPending,
      subscribersTotal,
      subscribersConfirmed,
      subscribersPending,
      ctaEventsWindow,
      ctaGrouped,
      recentContacts,
      recentSubscribers,
    ] = await Promise.all([
      count("contact_submissions"),
      count("contact_submissions", {}, "created_at"),
      count("contact_submissions", {}, undefined, "handled_at"),
      count("newsletter_subscribers"),
      count("newsletter_subscribers", { status: "confirmed" }),
      count("newsletter_subscribers", { status: "pending" }),
      count("cta_events", {}, "created_at"),
      supabaseAdmin.from("cta_events").select("cta,section").gte("created_at", since).limit(2000),
      supabaseAdmin
        .from("contact_submissions")
        .select("id,name,email,company,message,created_at,handled_at,notes")
        .order("created_at", { ascending: false })
        .limit(25),
      supabaseAdmin
        .from("newsletter_subscribers")
        .select("id,email,status,consent_given_at,confirmed_at,unsubscribed_at,created_at")
        .order("created_at", { ascending: false })
        .limit(25),
    ]);

    const buckets = new Map<string, number>();
    for (const r of (ctaGrouped.data ?? []) as Array<{ cta: string; section: string }>) {
      const k = `${r.section}::${r.cta}`;
      buckets.set(k, (buckets.get(k) ?? 0) + 1);
    }
    const topCtas = Array.from(buckets.entries())
      .map(([k, count]) => {
        const [section, cta] = k.split("::");
        return { section, cta, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const overview: AdminOverview = {
      windowDays: data.windowDays,
      since,
      totals: {
        contactsTotal,
        contactsWindow,
        contactsPending,
        subscribersTotal,
        subscribersConfirmed,
        subscribersPending,
        ctaEventsWindow,
      },
      topCtas,
      recentContacts: (recentContacts.data ?? []) as ContactRow[],
      recentSubscribers: (recentSubscribers.data ?? []) as SubscriberRow[],
    };
    return overview;
  });

export const markContactHandled = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: unknown) => {
    const r = raw as { id?: string; handled?: boolean; notes?: string | null };
    if (!r?.id || typeof r.id !== "string") throw new Error("id required");
    return {
      id: r.id,
      handled: Boolean(r.handled),
      notes: typeof r.notes === "string" ? r.notes.slice(0, 2000) : null,
    };
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("contact_submissions")
      .update({ handled_at: data.handled ? new Date().toISOString() : null, notes: data.notes })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });