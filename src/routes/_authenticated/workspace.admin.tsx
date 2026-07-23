import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { buildHead } from "@/components/cyryx/seo/seo";
import { WorkspaceShell } from "@/components/cyryx/workspace/WorkspaceShell";
import {
  inviteWorkspaceUser,
  listWorkspaceUsers,
  resendMagicLink,
  setWorkspaceUserRole,
  type AdminUserRow,
  type AppRole,
} from "@/lib/admin-users.functions";

export const Route = createFileRoute("/_authenticated/workspace/admin")({
  head: () => {
    const h = buildHead({
      title: "Admin — users & roles",
      description: "Invite team members and manage workspace roles.",
      path: "/workspace/admin",
    });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const qc = useQueryClient();
  const list = useServerFn(listWorkspaceUsers);
  const invite = useServerFn(inviteWorkspaceUser);
  const setRole = useServerFn(setWorkspaceUserRole);
  const resend = useServerFn(resendMagicLink);

  const { data, isLoading, error, refetch, isFetching } = useQuery<{ rows: AdminUserRow[] }>({
    queryKey: ["workspace-users"],
    queryFn: () => list(),
  });

  const [email, setEmail] = useState("");
  const [role, setRoleValue] = useState<AppRole>("admin");
  const [w, setW] = useState("");
  const [tab, setTab] = useState("");
  const [flash, setFlash] = useState<{
    kind: "ok" | "err";
    msg: string;
    link?: string | null;
  } | null>(null);

  const inviteMutation = useMutation({
    mutationFn: (args: { email: string; role: AppRole; w?: string; tab?: string }) =>
      invite({ data: args }),
    onSuccess: (res) => {
      setFlash({
        kind: "ok",
        msg: `Invite sent to ${res.email}. Role: ${res.role}. Copy the link below to test the flow.`,
        link: res.action_link ?? null,
      });
      setEmail("");
      qc.invalidateQueries({ queryKey: ["workspace-users"] });
    },
    onError: (e: any) =>
      setFlash({ kind: "err", msg: e?.message || "Failed to invite user." }),
  });

  const roleMutation = useMutation({
    mutationFn: (args: { user_id: string; role: AppRole; grant: boolean }) =>
      setRole({ data: args }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["workspace-users"] }),
    onError: (e: any) =>
      setFlash({ kind: "err", msg: e?.message || "Failed to update role." }),
  });

  const resendMutation = useMutation({
    mutationFn: (args: { email: string; w?: string; tab?: string }) => resend({ data: args }),
    onSuccess: (res, v) =>
      setFlash({
        kind: "ok",
        msg: `Magic link resent to ${v.email}.`,
        link: (res as any)?.action_link ?? null,
      }),
    onError: (e: any) =>
      setFlash({ kind: "err", msg: e?.message || "Failed to resend link." }),
  });

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFlash(null);
    inviteMutation.mutate({ email, role, w, tab });
  }

  const actions = (
    <button
      type="button"
      onClick={() => refetch()}
      className="h-9 px-3 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] hud-label text-xs text-[var(--silver-dim)] hover:text-[var(--silver)]"
    >
      {isFetching ? "Refreshing…" : "Refresh"}
    </button>
  );

  return (
    <WorkspaceShell
      title="Admin"
      subtitle="Invite team members and manage workspace access"
      actions={actions}
    >
      <section
        aria-label="Invite user"
        className="mt-8 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)] p-5"
      >
        <h2 className="hud-label text-[var(--silver-dim)]">Invite a user</h2>
        <p className="mt-1 text-xs text-[var(--silver-dim)]">
          Sends a magic-link email. Only <code>@cyryxlabs.com</code> addresses are accepted.
        </p>
        <form onSubmit={submit} className="mt-4 flex flex-wrap items-end gap-3">
          <label className="flex-1 min-w-[240px]">
            <span className="block text-xs hud-label text-[var(--silver-dim)] mb-1">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@cyryxlabs.com"
              className="w-full h-10 rounded-md bg-transparent border border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] px-3 text-sm focus:outline-none focus:border-[var(--accent-glow)]"
            />
          </label>
          <label>
            <span className="block text-xs hud-label text-[var(--silver-dim)] mb-1">Role</span>
            <select
              value={role}
              onChange={(e) => setRoleValue(e.target.value as AppRole)}
              className="h-10 rounded-md bg-[var(--onyx)] border border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] px-3 text-sm"
            >
              <option value="admin">admin</option>
              <option value="user">user</option>
            </select>
          </label>
          <label>
            <span className="block text-xs hud-label text-[var(--silver-dim)] mb-1">
              w (optional)
            </span>
            <input
              type="text"
              value={w}
              onChange={(e) => setW(e.target.value)}
              placeholder="90d"
              className="h-10 w-28 rounded-md bg-transparent border border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] px-3 text-sm focus:outline-none focus:border-[var(--accent-glow)]"
            />
          </label>
          <label>
            <span className="block text-xs hud-label text-[var(--silver-dim)] mb-1">
              tab (optional)
            </span>
            <input
              type="text"
              value={tab}
              onChange={(e) => setTab(e.target.value)}
              placeholder="overview"
              className="h-10 w-32 rounded-md bg-transparent border border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] px-3 text-sm focus:outline-none focus:border-[var(--accent-glow)]"
            />
          </label>
          <button
            type="submit"
            disabled={inviteMutation.isPending}
            className="h-10 px-4 rounded-md border border-[var(--accent-glow)] hud-label text-xs text-[var(--accent-glow)] hover:bg-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)] disabled:opacity-50"
          >
            {inviteMutation.isPending ? "Sending…" : "Send invite"}
          </button>
        </form>
        {flash && (
          <div role="status" className="mt-3 space-y-2">
            <p
              className={`text-sm ${
                flash.kind === "ok" ? "text-emerald-400" : "text-[color:oklch(0.72_0.16_25)]"
              }`}
            >
              {flash.msg}
            </p>
            {flash.link && (
              <div className="rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_25%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_75%,transparent)] p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="hud-label text-[var(--silver-dim)] text-[10px]">
                    Magic link (for testing)
                  </span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(flash.link!)}
                    className="h-7 px-2 rounded border border-[var(--accent-glow)] hud-label text-[10px] text-[var(--accent-glow)] hover:bg-[color-mix(in_oklab,var(--accent-glow)_12%,transparent)]"
                  >
                    Copy
                  </button>
                </div>
                <p className="mt-2 break-all font-mono text-xs text-[var(--silver-dim)]">
                  {flash.link}
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      <section aria-label="Users" className="mt-10">
        <h2 className="hud-label text-[var(--silver-dim)]">Workspace users</h2>
        {error && (
          <p role="alert" className="mt-3 text-sm text-[color:oklch(0.72_0.16_25)]">
            {(error as Error).message || "Unable to load users."}
          </p>
        )}
        {isLoading && <p className="mt-3 text-sm text-[var(--silver-dim)]">Loading…</p>}
        {data && (
          <div className="mt-3 overflow-x-auto rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)]">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-[var(--silver-dim)]">
                <tr>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Roles</th>
                  <th className="px-3 py-2">Confirmed</th>
                  <th className="px-3 py-2">Last sign-in</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-4 text-[var(--silver-dim)]">
                      No users yet.
                    </td>
                  </tr>
                )}
                {data.rows.map((u) => {
                  const hasAdmin = u.roles.includes("admin");
                  return (
                    <tr
                      key={u.user_id}
                      className="border-t border-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)] align-top"
                    >
                      <td className="px-3 py-2">{u.email ?? "—"}</td>
                      <td className="px-3 py-2 text-[var(--silver-dim)]">
                        {u.roles.length ? u.roles.join(", ") : "—"}
                      </td>
                      <td className="px-3 py-2 text-[var(--silver-dim)]">
                        {u.email_confirmed_at
                          ? new Date(u.email_confirmed_at).toLocaleDateString()
                          : "pending"}
                      </td>
                      <td className="px-3 py-2 text-[var(--silver-dim)]">
                        {u.last_sign_in_at
                          ? new Date(u.last_sign_in_at).toLocaleString()
                          : "never"}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            disabled={roleMutation.isPending}
                            onClick={() =>
                              roleMutation.mutate({
                                user_id: u.user_id,
                                role: "admin",
                                grant: !hasAdmin,
                              })
                            }
                            className="h-8 px-3 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] hud-label text-xs text-[var(--silver-dim)] hover:text-[var(--silver)]"
                          >
                            {hasAdmin ? "Revoke admin" : "Grant admin"}
                          </button>
                          {u.email && (
                            <button
                              type="button"
                              disabled={resendMutation.isPending}
                              onClick={() =>
                                resendMutation.mutate({ email: u.email!, w, tab })
                              }
                              className="h-8 px-3 rounded-md border border-[var(--accent-glow)] hud-label text-xs text-[var(--accent-glow)] hover:bg-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)]"
                            >
                              Resend magic link
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </WorkspaceShell>
  );
}