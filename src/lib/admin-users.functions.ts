import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type AppRole = "admin" | "user";

export type AdminUserRow = {
  user_id: string;
  email: string | null;
  roles: AppRole[];
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
};

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error) throw new Response("Unable to verify role", { status: 500 });
  if (!data) throw new Response("Forbidden", { status: 403 });
}

function normalizeEmail(email: string): string {
  const e = email.trim().toLowerCase();
  if (!/^[^\s@]+@cyryxlabs\.com$/i.test(e)) {
    throw new Response("Only @cyryxlabs.com emails are allowed.", { status: 400 });
  }
  return e;
}

export const listWorkspaceUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: rolesRows, error: rolesErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role");
    if (rolesErr) throw new Error(rolesErr.message);

    const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 200,
    });
    if (listErr) throw new Error(listErr.message);

    const byUser = new Map<string, AppRole[]>();
    for (const r of rolesRows ?? []) {
      const arr = byUser.get(r.user_id) ?? [];
      arr.push(r.role as AppRole);
      byUser.set(r.user_id, arr);
    }
    const rows: AdminUserRow[] = list.users.map((u) => ({
      user_id: u.id,
      email: u.email ?? null,
      roles: byUser.get(u.id) ?? [],
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
      email_confirmed_at: u.email_confirmed_at ?? null,
    }));
    rows.sort((a, b) => (a.email ?? "").localeCompare(b.email ?? ""));
    return { rows };
  });

export const inviteWorkspaceUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: { email: string; role: AppRole; w?: string; tab?: string }) => ({
    email: String(raw.email ?? ""),
    role: (raw.role === "admin" ? "admin" : "user") as AppRole,
    w: raw.w ? String(raw.w) : "",
    tab: raw.tab ? String(raw.tab) : "",
  }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    const email = normalizeEmail(data.email);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Look up existing user first (invite fails if user already exists).
    const { data: list, error: listErr } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 200,
    });
    if (listErr) throw new Error(listErr.message);
    let user = list.users.find((u) => u.email?.toLowerCase() === email);

    const origin = process.env.APP_URL || "https://workspace.cyryxlabs.com";
    const qs = new URLSearchParams();
    if (data.w) qs.set("w", data.w);
    if (data.tab) qs.set("tab", data.tab);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    const redirectTo = `${origin}/auth${suffix}`;
    let action_link: string | null = null;

    if (!user) {
      const { data: invited, error: inviteErr } =
        await supabaseAdmin.auth.admin.inviteUserByEmail(email, { redirectTo });
      if (inviteErr) throw new Error(inviteErr.message);
      user = invited.user;
      // Also generate an action link so the admin can copy it for testing.
      const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
        type: "invite",
        email,
        options: { redirectTo },
      });
      action_link = linkData?.properties?.action_link ?? null;
    } else {
      // Existing user: send a magic link so they can sign in immediately.
      const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: { redirectTo },
      });
      if (linkErr) throw new Error(linkErr.message);
      action_link = linkData?.properties?.action_link ?? null;
    }

    // Assign role.
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: user!.id, role: data.role }, { onConflict: "user_id,role" });
    if (roleErr) throw new Error(roleErr.message);

    return { ok: true, user_id: user!.id, email, role: data.role, action_link };
  });

export const setWorkspaceUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: { user_id: string; role: AppRole; grant: boolean }) => ({
    user_id: String(raw.user_id),
    role: (raw.role === "admin" ? "admin" : "user") as AppRole,
    grant: !!raw.grant,
  }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.grant) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: data.user_id, role: data.role }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      // Prevent removing your own last admin role.
      if (data.role === "admin" && data.user_id === (context as any).userId) {
        const { count } = await supabaseAdmin
          .from("user_roles")
          .select("*", { count: "exact", head: true })
          .eq("role", "admin");
        if ((count ?? 0) <= 1) {
          throw new Response("Refusing to remove the last admin.", { status: 400 });
        }
      }
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.user_id)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const resendMagicLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: { email: string; w?: string; tab?: string }) => ({
    email: String(raw.email ?? ""),
    w: raw.w ? String(raw.w) : "",
    tab: raw.tab ? String(raw.tab) : "",
  }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    const email = normalizeEmail(data.email);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const origin = process.env.APP_URL || "https://workspace.cyryxlabs.com";
    const qs = new URLSearchParams();
    if (data.w) qs.set("w", data.w);
    if (data.tab) qs.set("tab", data.tab);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    const { data: linkData, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${origin}/auth${suffix}` },
    });
    if (error) throw new Error(error.message);
    return { ok: true, action_link: linkData?.properties?.action_link ?? null };
  });