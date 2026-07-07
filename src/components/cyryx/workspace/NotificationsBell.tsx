import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, CheckCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { drawerStore } from "@/lib/drawer-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Notif = {
  id: string;
  kind: string;
  entity_type: string | null;
  entity_id: string | null;
  title: string;
  body: string | null;
  url: string | null;
  read_at: string | null;
  created_at: string;
};

export function NotificationsBell() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const q = useQuery({
    queryKey: ["ws_notifications", "recent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ws_notifications")
        .select("id, kind, entity_type, entity_id, title, body, url, read_at, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return (data ?? []) as Notif[];
    },
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id;
      if (!uid || cancelled) return;
      const channel = supabase
        .channel("ws_notifications:me")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "ws_notifications",
            filter: `user_id=eq.${uid}`,
          },
          () => qc.invalidateQueries({ queryKey: ["ws_notifications", "recent"] }),
        )
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    })();
    return () => {
      cancelled = true;
    };
  }, [qc]);

  const rows = q.data ?? [];
  const unread = rows.filter((r) => !r.read_at).length;

  async function markRead(id: string) {
    await supabase.from("ws_notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["ws_notifications", "recent"] });
  }
  async function markAll() {
    const ids = rows.filter((r) => !r.read_at).map((r) => r.id);
    if (!ids.length) return;
    await supabase.from("ws_notifications").update({ read_at: new Date().toISOString() }).in("id", ids);
    qc.invalidateQueries({ queryKey: ["ws_notifications", "recent"] });
  }

  function activate(n: Notif) {
    if (!n.read_at) markRead(n.id);
    setOpen(false);
    if (n.entity_type && n.entity_id) {
      drawerStore.open({ entity_type: n.entity_type, entity_id: n.entity_id, label: n.title });
      return;
    }
    if (n.url) navigate({ to: n.url as any });
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
          className="relative h-9 w-9 flex items-center justify-center rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] text-[var(--silver-dim)] hover:text-[var(--silver)] transition-colors"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--accent-glow)] text-[var(--onyx)] text-[10px] font-semibold flex items-center justify-center shadow-[0_0_8px_var(--accent-glow)]">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="dark w-[360px] p-0 bg-[var(--onyx)]/95 backdrop-blur-xl border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] text-[var(--silver)]"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[color-mix(in_oklab,var(--accent-glow)_12%,transparent)]">
          <p className="hud-label text-[var(--accent-glow)] text-[11px]">Notifications</p>
          <button
            type="button"
            onClick={markAll}
            disabled={unread === 0}
            className="text-[11px] hud-label text-[var(--silver-dim)] hover:text-[var(--silver)] disabled:opacity-40 flex items-center gap-1"
          >
            <CheckCheck className="h-3 w-3" /> Mark all
          </button>
        </div>
        <ul className="max-h-[420px] overflow-y-auto">
          {rows.length === 0 && (
            <li className="px-4 py-8 text-center text-xs text-[var(--silver-dim)] italic">
              You're all caught up.
            </li>
          )}
          {rows.map((n) => (
            <li
              key={n.id}
              className={`border-b border-[color-mix(in_oklab,var(--accent-glow)_8%,transparent)] last:border-0 ${
                n.read_at ? "" : "bg-[color-mix(in_oklab,var(--accent-glow)_5%,transparent)]"
              }`}
            >
              <button
                type="button"
                onClick={() => activate(n)}
                className="w-full text-left px-4 py-3 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-[var(--silver)] truncate">{n.title}</p>
                    {n.body && (
                      <p className="text-xs text-[var(--silver-dim)] mt-0.5 line-clamp-2">{n.body}</p>
                    )}
                    <p className="hud-label text-[9px] text-[var(--accent-glow)] mt-1">
                      {n.kind} · {new Date(n.created_at).toLocaleString()}
                    </p>
                  </div>
                  {!n.read_at && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        markRead(n.id);
                      }}
                      className="shrink-0 mt-0.5 h-5 w-5 rounded flex items-center justify-center text-[var(--silver-dim)] hover:text-[var(--accent-glow)]"
                      aria-label="Mark as read"
                    >
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}