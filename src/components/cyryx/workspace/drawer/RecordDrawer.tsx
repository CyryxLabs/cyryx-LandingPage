import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { drawerStore, useDrawerTarget } from "@/lib/drawer-store";
import { WsButton } from "@/components/cyryx/workspace/WorkspaceShell";
import { Eye, EyeOff, Paperclip, Trash2, Download, Upload } from "lucide-react";
import { uploadAttachment, getAttachmentUrl, deleteAttachment, formatBytes } from "@/lib/attachments";
import { useRef } from "react";

const BASE_TABS = ["overview", "comments", "attachments", "watchers", "activity"] as const;
type Tab = (typeof BASE_TABS)[number] | "timeline";

const TITLE_KEYS = ["title", "full_name", "name", "subject", "code"];

function labelFor(entity_type: string) {
  return entity_type.replace(/^([a-z]+)_/, "$1 · ").replace(/_/g, " ");
}

export function RecordDrawer() {
  const target = useDrawerTarget();
  const open = !!target;
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    if (open) setTab("overview");
  }, [target?.entity_id]);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && drawerStore.close()}>
      <SheetContent
        side="right"
        className="dark w-full sm:max-w-xl bg-[var(--onyx)]/95 backdrop-blur-xl border-l border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] text-[var(--silver)] p-0 flex flex-col"
      >
        {target && <DrawerBody target={target} tab={tab} setTab={setTab} />}
      </SheetContent>
    </Sheet>
  );
}

function DrawerBody({
  target,
  tab,
  setTab,
}: {
  target: { entity_type: string; entity_id: string; label?: string };
  tab: Tab;
  setTab: (t: Tab) => void;
}) {
  const isCampaign = target.entity_type === "mkt_campaigns";
  const tabs: Tab[] = isCampaign
    ? ["overview", "timeline", "comments", "attachments", "watchers", "activity"]
    : [...BASE_TABS];
  const rowQ = useQuery({
    queryKey: ["drawer", target.entity_type, target.entity_id],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from(target.entity_type)
        .select("*")
        .eq("id", target.entity_id)
        .maybeSingle();
      if (error) throw error;
      return data as Record<string, any> | null;
    },
  });
  const row = rowQ.data ?? null;
  const titleKey = TITLE_KEYS.find((k) => row && row[k]) ?? "id";
  const heading = target.label ?? (row ? row[titleKey] : "Loading…");

  return (
    <>
      <SheetHeader className="px-6 pt-6 pb-4 border-b border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)] space-y-1">
        <p className="hud-label text-[var(--accent-glow)] text-[11px]">{labelFor(target.entity_type)}</p>
        <SheetTitle className="font-display text-xl text-silver-gradient text-left">
          {heading || "Record"}
        </SheetTitle>
      </SheetHeader>

      <nav className="flex gap-1 px-4 py-2 border-b border-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)]">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-md hud-label text-[11px] capitalize transition-colors ${
              tab === t
                ? "bg-[color-mix(in_oklab,var(--accent-glow)_12%,transparent)] text-[var(--accent-glow)]"
                : "text-[var(--silver-dim)] hover:text-[var(--silver)]"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {tab === "overview" && <OverviewPane row={row} loading={rowQ.isLoading} />}
        {tab === "timeline" && isCampaign && <CampaignTimelinePane campaignId={target.entity_id} />}
        {tab === "comments" && <CommentsPane target={target} />}
        {tab === "attachments" && <AttachmentsPane target={target} />}
        {tab === "watchers" && <WatchersPane target={target} />}
        {tab === "activity" && <ActivityPane target={target} />}
      </div>
    </>
  );
}

function OverviewPane({ row, loading }: { row: Record<string, any> | null; loading: boolean }) {
  if (loading) return <p className="text-sm text-[var(--silver-dim)]">Loading…</p>;
  if (!row) return <p className="text-sm text-[var(--silver-dim)]">Record not found.</p>;
  const hidden = new Set(["id", "created_at", "updated_at"]);
  const rows = Object.entries(row).filter(([k]) => !hidden.has(k));
  return (
    <dl className="grid grid-cols-1 gap-3">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-[140px_1fr] gap-3 items-start">
          <dt className="hud-label text-[10px] text-[var(--silver-dim)] pt-0.5">{k.replace(/_/g, " ")}</dt>
          <dd className="text-sm text-[var(--silver)] break-words">
            {v === null || v === "" ? <span className="text-[var(--silver-dim)]">—</span> : String(v)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

type Comment = { id: string; body: string; author_id: string; created_at: string };

function CommentsPane({ target }: { target: { entity_type: string; entity_id: string } }) {
  const qc = useQueryClient();
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const key = ["ws_comments", target.entity_type, target.entity_id];
  const q = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ws_comments")
        .select("id, body, author_id, created_at")
        .eq("entity_type", target.entity_type)
        .eq("entity_id", target.entity_id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Comment[];
    },
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setPosting(true);
    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) { setPosting(false); return; }
    const { error } = await supabase.from("ws_comments").insert({
      entity_type: target.entity_type,
      entity_id: target.entity_id,
      author_id: uid,
      body: body.trim(),
    });
    setPosting(false);
    if (error) { alert(error.message); return; }
    setBody("");
    qc.invalidateQueries({ queryKey: key });
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={submit} className="space-y-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write a comment…"
          rows={3}
          className="w-full rounded-md bg-transparent border border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)] p-3 text-sm text-[var(--silver)] focus:outline-none focus:border-[var(--accent-glow)] resize-none"
        />
        <div className="flex justify-end">
          <WsButton type="submit" variant="primary" disabled={posting || !body.trim()}>
            {posting ? "Posting…" : "Post comment"}
          </WsButton>
        </div>
      </form>
      {q.isLoading && <p className="text-sm text-[var(--silver-dim)]">Loading…</p>}
      <ul className="space-y-3">
        {(q.data ?? []).map((c) => (
          <li key={c.id} className="rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)] bg-white/[0.02] p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="hud-label text-[10px] text-[var(--accent-glow)]">{c.author_id.slice(0, 8)}</span>
              <time className="text-[10px] text-[var(--silver-dim)]">
                {new Date(c.created_at).toLocaleString()}
              </time>
            </div>
            <p className="text-sm whitespace-pre-wrap">{c.body}</p>
          </li>
        ))}
        {(q.data ?? []).length === 0 && !q.isLoading && (
          <li className="text-xs text-[var(--silver-dim)] italic text-center py-6">No comments yet.</li>
        )}
      </ul>
    </div>
  );
}

function WatchersPane({ target }: { target: { entity_type: string; entity_id: string } }) {
  const qc = useQueryClient();
  const isTask = target.entity_type === "pm_tasks";
  const key = ["ws_watchers", target.entity_type, target.entity_id];
  const q = useQuery({
    queryKey: key,
    queryFn: async () => {
      if (isTask) {
        const { data, error } = await supabase
          .from("pm_task_watchers")
          .select("user_id, created_at")
          .eq("task_id", target.entity_id);
        if (error) throw error;
        return (data ?? []) as { user_id: string; created_at: string }[];
      }
      const { data, error } = await supabase
        .from("ws_watchers")
        .select("user_id, created_at")
        .eq("entity_type", target.entity_type)
        .eq("entity_id", target.entity_id);
      if (error) throw error;
      return (data ?? []) as { user_id: string; created_at: string }[];
    },
  });
  const meQ = useQuery({
    queryKey: ["me"],
    queryFn: async () => (await supabase.auth.getUser()).data.user?.id ?? null,
  });
  const me = meQ.data ?? null;
  const isWatching = !!(q.data ?? []).find((w) => w.user_id === me);

  async function toggle() {
    if (!me) return;
    if (isWatching) {
      if (isTask) {
        await supabase.from("pm_task_watchers").delete().eq("task_id", target.entity_id).eq("user_id", me);
      } else {
        await supabase.from("ws_watchers").delete()
          .eq("entity_type", target.entity_type)
          .eq("entity_id", target.entity_id)
          .eq("user_id", me);
      }
    } else {
      if (isTask) {
        await supabase.from("pm_task_watchers").insert({ task_id: target.entity_id, user_id: me });
      } else {
        await supabase.from("ws_watchers").insert({
          entity_type: target.entity_type,
          entity_id: target.entity_id,
          user_id: me,
        });
      }
    }
    qc.invalidateQueries({ queryKey: key });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--silver-dim)]">
          {(q.data ?? []).length} watcher{(q.data ?? []).length === 1 ? "" : "s"}
        </p>
        <WsButton onClick={toggle} variant={isWatching ? "ghost" : "primary"}>
          {isWatching ? <><EyeOff className="h-3.5 w-3.5 mr-1.5 inline" /> Unwatch</> : <><Eye className="h-3.5 w-3.5 mr-1.5 inline" /> Watch</>}
        </WsButton>
      </div>
      <ul className="space-y-1.5">
        {(q.data ?? []).map((w) => (
          <li key={w.user_id} className="text-sm text-[var(--silver)] flex justify-between border-b border-[color-mix(in_oklab,var(--accent-glow)_8%,transparent)] pb-1.5">
            <span className="font-mono text-xs">{w.user_id.slice(0, 8)}…</span>
            <time className="text-[10px] text-[var(--silver-dim)]">{new Date(w.created_at).toLocaleDateString()}</time>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Activity = { id: string; action: string; actor_id: string | null; changes: any; created_at: string };

type Attachment = {
  id: string;
  file_name: string;
  file_path: string;
  content_type: string | null;
  size_bytes: number | null;
  uploaded_by: string;
  created_at: string;
};

function AttachmentsPane({ target }: { target: { entity_type: string; entity_id: string } }) {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const key = ["ws_attachments", target.entity_type, target.entity_id];
  const q = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ws_attachments")
        .select("id, file_name, file_path, content_type, size_bytes, uploaded_by, created_at")
        .eq("entity_type", target.entity_type)
        .eq("entity_id", target.entity_id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Attachment[];
    },
  });

  async function onFiles(files: FileList | null) {
    if (!files || !files.length) return;
    setBusy(true);
    try {
      for (const f of Array.from(files)) {
        await uploadAttachment(target.entity_type, target.entity_id, f);
      }
      qc.invalidateQueries({ queryKey: key });
    } catch (e: any) {
      alert(e.message ?? "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function onDownload(a: Attachment) {
    try {
      const url = await getAttachmentUrl(a.file_path);
      window.open(url, "_blank", "noopener");
    } catch (e: any) {
      alert(e.message ?? "Failed to generate link");
    }
  }

  async function onDelete(a: Attachment) {
    if (!confirm(`Delete "${a.file_name}"?`)) return;
    try {
      await deleteAttachment(a.id, a.file_path);
      qc.invalidateQueries({ queryKey: key });
    } catch (e: any) {
      alert(e.message ?? "Delete failed");
    }
  }

  const rows = q.data ?? [];
  return (
    <div className="space-y-4">
      <label
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFiles(e.dataTransfer.files);
        }}
        className="flex flex-col items-center justify-center gap-2 py-6 rounded-md border border-dashed border-[color-mix(in_oklab,var(--accent-glow)_25%,transparent)] cursor-pointer hover:border-[var(--accent-glow)] transition-colors"
      >
        <Upload className="h-5 w-5 text-[var(--accent-glow)]" />
        <span className="hud-label text-[11px] text-[var(--silver-dim)]">
          {busy ? "Uploading…" : "Drop files or click to upload"}
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          onChange={(e) => onFiles(e.target.files)}
          disabled={busy}
        />
      </label>

      {q.isLoading && <p className="text-sm text-[var(--silver-dim)]">Loading…</p>}
      <ul className="space-y-1.5">
        {rows.map((a) => (
          <li
            key={a.id}
            className="flex items-center gap-2 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)] bg-white/[0.02] px-3 py-2"
          >
            <Paperclip className="h-3.5 w-3.5 text-[var(--accent-glow)] shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-[var(--silver)] truncate">{a.file_name}</p>
              <p className="text-[10px] text-[var(--silver-dim)]">
                {formatBytes(a.size_bytes)} · {new Date(a.created_at).toLocaleDateString()}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onDownload(a)}
              className="h-7 w-7 flex items-center justify-center rounded text-[var(--silver-dim)] hover:text-[var(--accent-glow)]"
              aria-label="Download"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(a)}
              className="h-7 w-7 flex items-center justify-center rounded text-[var(--silver-dim)] hover:text-red-400"
              aria-label="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
        {rows.length === 0 && !q.isLoading && (
          <li className="text-xs text-[var(--silver-dim)] italic text-center py-4">No attachments yet.</li>
        )}
      </ul>
    </div>
  );
}

function ActivityPane({ target }: { target: { entity_type: string; entity_id: string } }) {
  const q = useQuery({
    queryKey: ["ws_activity_log", target.entity_type, target.entity_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ws_activity_log")
        .select("id, action, actor_id, changes, created_at")
        .eq("entity_type", target.entity_type)
        .eq("entity_id", target.entity_id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Activity[];
    },
  });
  const rows = q.data ?? [];
  if (q.isLoading) return <p className="text-sm text-[var(--silver-dim)]">Loading…</p>;
  if (rows.length === 0) return <p className="text-xs text-[var(--silver-dim)] italic text-center py-6">No activity yet.</p>;
  return (
    <ol className="space-y-3">
      {rows.map((a) => (
        <li key={a.id} className="relative pl-4 border-l border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)]">
          <span className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-[var(--accent-glow)] shadow-[0_0_6px_var(--accent-glow)]" />
          <div className="flex items-center justify-between">
            <span className="hud-label text-[10px] text-[var(--accent-glow)]">{a.action}</span>
            <time className="text-[10px] text-[var(--silver-dim)]">{new Date(a.created_at).toLocaleString()}</time>
          </div>
          <p className="text-xs text-[var(--silver-dim)] mt-0.5">
            {a.actor_id ? `by ${a.actor_id.slice(0, 8)}…` : "system"}
          </p>
          {a.changes && (
            <pre className="mt-2 text-[10px] text-[var(--silver-dim)] bg-white/[0.02] rounded p-2 overflow-x-auto">
              {JSON.stringify(a.changes, null, 2)}
            </pre>
          )}
        </li>
      ))}
    </ol>
  );
}

type CampaignLead = {
  id: string;
  source: string | null;
  first_touch_at: string | null;
  converted_at: string | null;
  contact_id: string | null;
  deal_id: string | null;
};
type CampaignDeal = { id: string; title: string; value: number | string; status: string; stage_id: string; updated_at: string };

function CampaignTimelinePane({ campaignId }: { campaignId: string }) {
  const [range, setRange] = useState<"mtd" | "30d" | "90d" | "ytd">("30d");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [stageId, setStageId] = useState("");
  const rangeStart = (() => {
    const now = new Date();
    if (range === "mtd") return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    if (range === "ytd") return new Date(now.getFullYear(), 0, 1).getTime();
    return Date.now() - (range === "30d" ? 30 : 90) * 864e5;
  })();
  const q = useQuery({
    queryKey: ["mkt-campaign-timeline", campaignId],
    queryFn: async () => {
      const leadsRes = await supabase
        .from("mkt_leads")
        .select("id, source, first_touch_at, converted_at, contact_id, deal_id, channel_id")
        .eq("campaign_id", campaignId);
      if (leadsRes.error) throw leadsRes.error;
      const leads = (leadsRes.data ?? []) as CampaignLead[];
      const dealIds = Array.from(new Set(leads.map((l) => l.deal_id).filter((v): v is string => !!v)));
      let deals: CampaignDeal[] = [];
      if (dealIds.length) {
        const dealsRes = await supabase
          .from("crm_deals")
          .select("id, title, value, status, stage_id, updated_at, owner_id")
          .in("id", dealIds);
        if (dealsRes.error) throw dealsRes.error;
        deals = (dealsRes.data ?? []) as CampaignDeal[];
      }
      return { leads, deals };
    },
  });
  if (q.isLoading) return <p className="text-sm text-[var(--silver-dim)]">Loading…</p>;
  const raw = q.data;
  if (!raw) return null;
  const dealMap = new Map(raw.deals.map((d: any) => [d.id, d]));
  // Apply filters preserving range
  const filteredLeads = raw.leads.filter((l: any) => {
    if (source && l.source !== source) return false;
    const dl: any = l.deal_id ? dealMap.get(l.deal_id) : null;
    if (status && (!dl || dl.status !== status)) return false;
    if (ownerId && (!dl || dl.owner_id !== ownerId)) return false;
    if (stageId && (!dl || dl.stage_id !== stageId)) return false;
    const t = l.first_touch_at ? new Date(l.first_touch_at).getTime() : (dl?.updated_at ? new Date(dl.updated_at).getTime() : 0);
    if (t && t < rangeStart) return false;
    return true;
  });
  const filteredDeals = raw.deals.filter((dl: any) => filteredLeads.some((l: any) => l.deal_id === dl.id));
  const events = filteredLeads.flatMap((l: any) => {
        const items: { at: string; kind: "touch" | "converted" | "deal"; label: string; sub?: string }[] = [];
        if (l.first_touch_at) items.push({ at: l.first_touch_at, kind: "touch", label: `Lead touch · ${l.source ?? "—"}` });
        if (l.converted_at) items.push({ at: l.converted_at, kind: "converted", label: "Converted to deal" });
        const d: any = l.deal_id ? dealMap.get(l.deal_id) : null;
        if (d) items.push({ at: d.updated_at, kind: "deal", label: `Deal · ${d.status}`, sub: `${d.title} · $${Number(d.value ?? 0).toLocaleString()}` });
        return items;
      }).sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  const pipeline = filteredDeals.filter((d: any) => d.status !== "won" && d.status !== "lost").reduce((a: number, d: any) => a + Number(d.value ?? 0), 0);
  const won = filteredDeals.filter((d: any) => d.status === "won").reduce((a: number, d: any) => a + Number(d.value ?? 0), 0);
  const d = { events, pipeline, won, leadsCount: filteredLeads.length, convertedCount: filteredLeads.filter((l: any) => l.converted_at).length };
  const sources = Array.from(new Set(raw.leads.map((l: any) => l.source).filter(Boolean))) as string[];
  const statuses = Array.from(new Set(raw.deals.map((dl: any) => dl.status).filter(Boolean))) as string[];
  const owners = Array.from(new Set(raw.deals.map((dl: any) => dl.owner_id).filter(Boolean))) as string[];
  const stages = Array.from(new Set(raw.deals.map((dl: any) => dl.stage_id).filter(Boolean))) as string[];
  const fmt = (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v || 0);
  const sel = "h-7 px-1.5 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] bg-transparent hud-label text-[10px] text-[var(--silver-dim)]";
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-1.5">
        {(["mtd","30d","90d","ytd"] as const).map((r) => (
          <button key={r} onClick={() => setRange(r)}
            className={`px-2 py-0.5 rounded hud-label text-[10px] ${range === r ? "bg-[color-mix(in_oklab,var(--accent-glow)_18%,transparent)] text-[var(--accent-glow)]" : "text-[var(--silver-dim)] hover:text-[var(--silver)]"}`}>
            {r.toUpperCase()}
          </button>
        ))}
        <select value={source} onChange={(e) => setSource(e.target.value)} className={sel}>
          <option value="">All source (channel)</option>
          {sources.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={ownerId} onChange={(e) => setOwnerId(e.target.value)} className={sel}>
          <option value="">All owner</option>
          {owners.map((s) => <option key={s} value={s}>{s.slice(0, 8)}</option>)}
        </select>
        <select value={stageId} onChange={(e) => setStageId(e.target.value)} className={sel}>
          <option value="">All stage</option>
          {stages.map((s) => <option key={s} value={s}>{s.slice(0, 8)}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={sel}>
          <option value="">All status</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Leads", value: d.leadsCount },
          { label: "Converted", value: d.convertedCount },
          { label: "Pipeline", value: fmt(d.pipeline) },
          { label: "Won", value: fmt(d.won) },
        ].map((k) => (
          <div key={k.label} className="rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_12%,transparent)] p-3">
            <p className="hud-label text-[10px] text-[var(--silver-dim)]">{k.label}</p>
            <p className="font-display text-lg text-[var(--silver)] mt-1">{k.value}</p>
          </div>
        ))}
      </div>
      {d.events.length === 0 ? (
        <p className="text-xs text-[var(--silver-dim)] italic text-center py-6">No attribution events yet.</p>
      ) : (
        <ol className="space-y-3">
          {d.events.map((e, i) => (
            <li key={i} className="relative pl-4 border-l border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)]">
              <span className={`absolute -left-[5px] top-1.5 h-2 w-2 rounded-full ${e.kind === "converted" || e.kind === "deal" ? "bg-[var(--accent-glow)] shadow-[0_0_6px_var(--accent-glow)]" : "bg-[color-mix(in_oklab,var(--silver)_50%,transparent)]"}`} />
              <div className="flex items-center justify-between">
                <span className="hud-label text-[10px] text-[var(--accent-glow)]">{e.label}</span>
                <time className="text-[10px] text-[var(--silver-dim)]">{new Date(e.at).toLocaleString()}</time>
              </div>
              {e.sub && <p className="text-xs text-[var(--silver-dim)] mt-0.5">{e.sub}</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}