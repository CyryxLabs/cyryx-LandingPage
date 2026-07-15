import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { buildHead } from "@/components/cyryx/seo/seo";
import { WorkspaceShell, WorkspaceCard, WsButton } from "@/components/cyryx/workspace/WorkspaceShell";
import { DataTable } from "@/components/cyryx/workspace/DataTable";
import { DeptDashboard, downloadCSV } from "@/components/cyryx/workspace/DeptDashboard";
import { rangeBounds, isRange, type Range } from "@/lib/dashboard-range";
import { drawerStore } from "@/lib/drawer-store";
import { reconcileAttribution, summarizeDiff, type ReconcileResult } from "@/lib/attribution";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";

const marketingSearchSchema = z.object({
  mktTab: z.enum(["dashboard", "campaigns", "channels", "leads", "attribution"]).optional(),
  range: z.string().refine(isRange).optional(),
  ch: z.string().optional(),
  cp: z.string().optional(),
  own: z.string().optional(),
  st: z.string().optional(),
  aq: z.string().optional(),
  ap: z.coerce.number().min(0).optional(),
});

export const Route = createFileRoute("/_authenticated/workspace/marketing")({
  head: () => {
    const h = buildHead({ title: "Marketing · Cyryx", description: "Campaigns, channels and attribution", path: "/workspace/marketing" });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  validateSearch: zodValidator(marketingSearchSchema),
  component: MarketingPage,
});

const TABS = ["dashboard", "campaigns", "channels", "leads", "attribution"] as const;
type Tab = (typeof TABS)[number];

function MarketingPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const tab: Tab = (search.mktTab as Tab) ?? "dashboard";
  const setTab = (t: Tab) =>
    navigate({
      search: (prev: any) => ({
        ...prev,
        mktTab: t === "dashboard" ? undefined : t,
      }),
      replace: true,
    });
  return (
    <WorkspaceShell title="Marketing" subtitle="Campaigns, channels and lead attribution">
      <nav className="mb-6 flex flex-wrap gap-2 border-b border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)] pb-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-md hud-label text-xs ${
              tab === t
                ? "bg-[color-mix(in_oklab,var(--accent-glow)_12%,transparent)] text-[var(--accent-glow)]"
                : "text-[var(--silver-dim)] hover:text-[var(--silver)]"
            }`}
          >
            {t}
          </button>
        ))}
      </nav>

      {tab === "dashboard" && <DeptDashboard kind="marketing" />}

      {tab === "campaigns" && (
        <DataTable
          tableName="mkt_campaigns"
          queryKey="mkt_campaigns"
          fields={[
            { key: "name", label: "Name", type: "text", required: true, className: "min-w-[200px]" },
            { key: "status", label: "Status", type: "select", options: ["planned","active","paused","done"] },
            { key: "start_at", label: "Start", type: "date" },
            { key: "end_at", label: "End", type: "date" },
            { key: "budget", label: "Budget", type: "number" },
            { key: "spend", label: "Spend", type: "number" },
            { key: "goal", label: "Goal", type: "text", className: "min-w-[180px]" },
            { key: "notes", label: "Notes", type: "text", className: "min-w-[200px]" },
          ]}
        />
      )}

      {tab === "channels" && (
        <DataTable
          tableName="mkt_channels"
          queryKey="mkt_channels"
          fields={[
            { key: "name", label: "Name", type: "text", required: true },
            { key: "kind", label: "Kind", type: "select", options: ["paid","organic","referral","outbound","event","partner"] },
            { key: "notes", label: "Notes", type: "text", className: "min-w-[240px]" },
          ]}
        />
      )}

      {tab === "leads" && (
        <DataTable
          tableName="mkt_leads"
          queryKey="mkt_leads"
          fields={[
            { key: "source", label: "Source", type: "text" },
            { key: "campaign_id", label: "Campaign ID", type: "text", className: "min-w-[180px]" },
            { key: "channel_id", label: "Channel ID", type: "text", className: "min-w-[180px]" },
            { key: "contact_id", label: "Contact ID", type: "text", className: "min-w-[180px]" },
            { key: "deal_id", label: "Deal ID", type: "text", className: "min-w-[180px]" },
            { key: "first_touch_at", label: "First touch", type: "date" },
            { key: "converted_at", label: "Converted", type: "date" },
            { key: "notes", label: "Notes", type: "text", className: "min-w-[200px]" },
          ]}
        />
      )}

      {tab === "attribution" && <AttributionTable />}
    </WorkspaceShell>
  );
}

function fmtMoney(v: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v || 0);
}

function AttributionTable() {
  const qc = useQueryClient();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const patchSearch = (patch: Record<string, unknown>) =>
    navigate({
      search: (prev: Record<string, unknown>) => ({ ...prev, ...patch }),
      replace: true,
    });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const range: Range = (search.range as Range) ?? "30d";
  const setRange = (r: Range) => patchSearch({ range: r === "30d" ? undefined : r });
  const [lastResult, setLastResult] = useState<ReconcileResult | null>(null);
  const chFilter = search.ch ?? "";
  const cpFilter = search.cp ?? "";
  const ownFilter = search.own ?? "";
  const stFilter = search.st ?? "";
  const setChFilter = (v: string) => patchSearch({ ch: v || undefined });
  const setCpFilter = (v: string) => patchSearch({ cp: v || undefined });
  const setOwnFilter = (v: string) => patchSearch({ own: v || undefined });
  const setStFilter = (v: string) => patchSearch({ st: v || undefined });
  const { data = [], isLoading } = useQuery({
    queryKey: ["mkt_attribution_v"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("mkt_attribution_v")
        .select("*")
        .order("won_value", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  const { data: campaignsMeta = [] } = useQuery({
    queryKey: ["mkt_campaigns_meta"],
    queryFn: async () => {
      const { data } = await (supabase as any).from("mkt_campaigns").select("id,owner_id");
      return data ?? [];
    },
  });
  const ownerById = useMemo(() => {
    const m = new Map<string, string>();
    (campaignsMeta as any[]).forEach((c) => { if (c.owner_id) m.set(c.id, c.owner_id); });
    return m;
  }, [campaignsMeta]);

  const filtered = useMemo(() => {
    return (data as any[]).filter((r) =>
      (!chFilter || r.channel_name === chFilter) &&
      (!cpFilter || r.campaign_id === cpFilter) &&
      (!ownFilter || ownerById.get(r.campaign_id) === ownFilter) &&
      (!stFilter || r.status === stFilter),
    );
  }, [data, chFilter, cpFilter, ownFilter, stFilter, ownerById]);

  const filterOptions = useMemo(() => {
    const rows = data as any[];
    return {
      channels: Array.from(new Set(rows.map((r) => r.channel_name).filter(Boolean))) as string[],
      campaigns: rows.map((r) => ({ id: r.campaign_id as string, name: r.campaign_name as string })),
      owners: Array.from(new Set((campaignsMeta as any[]).map((c) => c.owner_id).filter(Boolean))) as string[],
      statuses: Array.from(new Set(rows.map((r) => r.status).filter(Boolean))) as string[],
    };
  }, [data, campaignsMeta]);

  const auditPage = search.ap ?? 0;
  const auditQ = search.aq ?? "";
  const setAuditPage = (p: number) => patchSearch({ ap: p > 0 ? p : undefined });
  const setAuditQ = (v: string) => patchSearch({ aq: v || undefined, ap: undefined });
  const AUDIT_PAGE = 20;
  const auditBounds = useMemo(() => rangeBounds(range), [range]);
  const { data: auditRes } = useQuery({
    queryKey: ["mkt_attribution_audit", auditPage, auditQ, range],
    queryFn: async () => {
      let query = (supabase as any)
        .from("mkt_attribution_audit")
        .select("id,ran_at,ran_by,range_key,scanned,marked_won,cleared,pipeline_before,pipeline_after,revenue_before,revenue_after,affected_lead_ids,affected_deal_ids", { count: "exact" })
        .gte("ran_at", new Date(auditBounds.start).toISOString())
        .lte("ran_at", new Date(auditBounds.end).toISOString())
        .order("ran_at", { ascending: false });
      if (auditQ.trim()) query = query.ilike("range_key", `%${auditQ.trim()}%`);
      const from = auditPage * AUDIT_PAGE;
      const { data, error, count } = await query.range(from, from + AUDIT_PAGE - 1);
      if (error) throw error;
      return { rows: (data ?? []) as any[], count: count ?? 0 };
    },
  });
  const audit = auditRes?.rows ?? [];
  const auditTotal = auditRes?.count ?? 0;

  async function fetchAllAudit(): Promise<any[]> {
    let query = (supabase as any)
      .from("mkt_attribution_audit")
      .select("id,ran_at,ran_by,range_key,scanned,marked_won,cleared,pipeline_before,pipeline_after,revenue_before,revenue_after,affected_lead_ids,affected_deal_ids")
      .gte("ran_at", new Date(auditBounds.start).toISOString())
      .lte("ran_at", new Date(auditBounds.end).toISOString())
      .order("ran_at", { ascending: false });
    if (auditQ.trim()) query = query.ilike("range_key", `%${auditQ.trim()}%`);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as any[];
  }

  async function exportAuditCSVAll() {
    const rows = await fetchAllAudit();
    downloadCSV(`attribution-audit-${range}-all.csv`, rows);
  }

  async function exportAuditPDF() {
    const rows = await fetchAllAudit();
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) return;
    const totalPipelineDelta = rows.reduce((a, r) => a + (Number(r.pipeline_after) - Number(r.pipeline_before)), 0);
    const totalRevenueDelta = rows.reduce((a, r) => a + (Number(r.revenue_after) - Number(r.revenue_before)), 0);
    const totalScanned = rows.reduce((a, r) => a + Number(r.scanned || 0), 0);
    const totalWon = rows.reduce((a, r) => a + Number(r.marked_won || 0), 0);
    const totalCleared = rows.reduce((a, r) => a + Number(r.cleared || 0), 0);
    const fm = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);
    const trs = rows.map((r) => {
      const pd = Number(r.pipeline_after) - Number(r.pipeline_before);
      const rd = Number(r.revenue_after) - Number(r.revenue_before);
      return `<tr><td>${new Date(r.ran_at).toLocaleString()}</td><td>${r.range_key ?? "—"}</td><td style="text-align:right">${r.scanned}</td><td style="text-align:right">${r.marked_won}</td><td style="text-align:right">${r.cleared}</td><td style="text-align:right">${fm(pd)}</td><td style="text-align:right">${fm(rd)}</td><td style="text-align:right">${(r.affected_deal_ids ?? []).length}</td></tr>`;
    }).join("");
    win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Attribution audit ${range}</title><style>body{font:12px system-ui,sans-serif;padding:24px;color:#111}h1{margin:0 0 4px}h2{font-size:13px;margin:20px 0 8px}table{width:100%;border-collapse:collapse}th,td{padding:4px 6px;border-bottom:1px solid #ddd}thead th{border-bottom:2px solid #000;text-align:left}.kpis{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:10px}.kpi{border:1px solid #000;padding:6px}.kpi p{margin:0}.k-l{font-size:9px;text-transform:uppercase;letter-spacing:.05em}.k-v{font-size:14px;font-weight:700}.meta{font-size:11px;color:#444}.filters{font-size:11px;color:#444;margin-top:4px}</style></head><body><h1>Cyryx Labs · Attribution audit log</h1><p class="meta">Range ${range.toUpperCase()} · Generated ${new Date().toLocaleString()} · ${rows.length} runs</p><p class="filters">Search: ${auditQ ? `"${auditQ}"` : "—"} · Filters (channel/campaign/owner/stage): ${[chFilter,cpFilter,ownFilter,stFilter].filter(Boolean).join(" · ") || "—"}</p><div class="kpis"><div class="kpi"><p class="k-l">Scanned</p><p class="k-v">${totalScanned}</p></div><div class="kpi"><p class="k-l">Marked won</p><p class="k-v">${totalWon}</p></div><div class="kpi"><p class="k-l">Cleared</p><p class="k-v">${totalCleared}</p></div><div class="kpi"><p class="k-l">Pipeline Δ</p><p class="k-v">${fm(totalPipelineDelta)}</p></div><div class="kpi"><p class="k-l">Revenue Δ</p><p class="k-v">${fm(totalRevenueDelta)}</p></div></div><h2>Runs</h2><table><thead><tr><th>Ran at</th><th>Range</th><th style="text-align:right">Scanned</th><th style="text-align:right">Won</th><th style="text-align:right">Cleared</th><th style="text-align:right">Pipeline Δ</th><th style="text-align:right">Revenue Δ</th><th style="text-align:right">Deals</th></tr></thead><tbody>${trs || `<tr><td colspan="8" style="text-align:center;padding:20px">No runs in range.</td></tr>`}</tbody></table><script>window.onload=()=>setTimeout(()=>window.print(),150)</script></body></html>`);
    win.document.close();
  }

  async function onReconcile() {
    setBusy(true);
    setMsg(null);
    try {
      const b = rangeBounds(range);
      const r = await reconcileAttribution({
        rangeKey: range,
        rangeStart: new Date(b.start),
        rangeEnd: new Date(b.end),
      });
      setMsg(`Scanned ${r.scanned} · marked won ${r.marked_won} · cleared ${r.cleared}`);
      setLastResult(r);
      qc.invalidateQueries({ queryKey: ["mkt_attribution_v"] });
      qc.invalidateQueries({ queryKey: ["mkt_leads"] });
      qc.invalidateQueries({ queryKey: ["mkt_attribution_audit"] });
      setAuditPage(0);
    } catch (e: any) {
      setMsg(e.message ?? "Reconcile failed");
    } finally {
      setBusy(false);
    }
  }

  const fmt = fmtMoney;

  return (
    <div className="space-y-6">
    <WorkspaceCard>
      <div className="flex items-center justify-between px-3 py-2 border-b border-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)]">
        <div className="flex items-center gap-3">
          <p className="text-xs text-[var(--silver-dim)]">
            {msg ?? "Sync mkt_leads.converted_at with current CRM deal stage."}
          </p>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as Range)}
            className="h-8 px-2 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] bg-transparent hud-label text-[11px] text-[var(--silver-dim)]"
          >
            <option value="mtd">MTD</option>
            <option value="30d">30d</option>
            <option value="90d">90d</option>
            <option value="ytd">YTD</option>
          </select>
        </div>
        <div className="flex gap-2">
          <WsButton
            onClick={() => downloadCSV(`attribution-${new Date().toISOString().slice(0,10)}.csv`, filtered)}
            disabled={!filtered.length}
          >
            Export CSV
          </WsButton>
          <WsButton
            onClick={() => {
              if (lastResult) downloadCSV(`reconcile-diff-${lastResult.ran_at.slice(0,10)}.csv`, lastResult.diff);
            }}
            disabled={!lastResult}
          >
            Export diff
          </WsButton>
          <WsButton onClick={() => window.print()}>Print / PDF</WsButton>
          <WsButton onClick={onReconcile} disabled={busy} variant="primary">
            {busy ? "Reconciling…" : "Reconcile attribution"}
          </WsButton>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 px-3 py-2 border-b border-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)]">
        <FilterSelect label="Channel" value={chFilter} onChange={setChFilter} options={filterOptions.channels.map((v) => ({ value: v, label: v }))} />
        <FilterSelect label="Campaign" value={cpFilter} onChange={setCpFilter} options={filterOptions.campaigns.map((c) => ({ value: c.id, label: c.name }))} />
        <FilterSelect label="Owner" value={ownFilter} onChange={setOwnFilter} options={filterOptions.owners.map((v) => ({ value: v, label: v.slice(0, 8) }))} />
        <FilterSelect label="Stage" value={stFilter} onChange={setStFilter} options={filterOptions.statuses.map((v) => ({ value: v, label: v }))} />
        {(chFilter || cpFilter || ownFilter || stFilter) && (
          <button
            onClick={() => { setChFilter(""); setCpFilter(""); setOwnFilter(""); setStFilter(""); }}
            className="hud-label text-[11px] text-[var(--silver-dim)] hover:text-[var(--silver)] underline"
          >Clear</button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-[var(--silver-dim)] border-b border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)]">
              <th className="px-3 py-2">Campaign</th>
              <th className="px-3 py-2">Channel</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Budget</th>
              <th className="px-3 py-2 text-right">Spend</th>
              <th className="px-3 py-2 text-right">Leads</th>
              <th className="px-3 py-2 text-right">Deals</th>
              <th className="px-3 py-2 text-right">Won</th>
              <th className="px-3 py-2 text-right">Pipeline</th>
              <th className="px-3 py-2 text-right">Won value</th>
              <th className="px-3 py-2 text-right">ROI</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={11} className="px-3 py-6 text-center text-xs text-[var(--silver-dim)]">Loading…</td></tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={11} className="px-3 py-8 text-center text-xs text-[var(--silver-dim)]">No campaigns yet.</td></tr>
            )}
            {filtered.map((r: any) => {
              const roi = r.spend > 0 ? ((Number(r.won_value) - Number(r.spend)) / Number(r.spend)) * 100 : null;
              return (
                <tr
                  key={r.campaign_id}
                  onClick={() => drawerStore.open({ entity_type: "mkt_campaigns", entity_id: r.campaign_id, label: r.campaign_name })}
                  className="border-t border-[color-mix(in_oklab,var(--accent-glow)_8%,transparent)] cursor-pointer hover:bg-white/[0.03]"
                >
                  <td className="px-3 py-2 text-[var(--accent-glow)]">{r.campaign_name}</td>
                  <td className="px-3 py-2 text-[var(--silver-dim)]">{r.channel_name ?? "—"}</td>
                  <td className="px-3 py-2 text-[var(--silver-dim)]">{r.status}</td>
                  <td className="px-3 py-2 text-right">{fmt(Number(r.budget))}</td>
                  <td className="px-3 py-2 text-right">{fmt(Number(r.spend))}</td>
                  <td className="px-3 py-2 text-right">{r.leads_count}</td>
                  <td className="px-3 py-2 text-right">{r.deals_count}</td>
                  <td className="px-3 py-2 text-right">{r.won_deals}</td>
                  <td className="px-3 py-2 text-right">{fmt(Number(r.pipeline_value))}</td>
                  <td className="px-3 py-2 text-right text-[var(--accent-glow)]">{fmt(Number(r.won_value))}</td>
                  <td className="px-3 py-2 text-right">
                    {roi === null ? "—" : `${roi.toFixed(0)}%`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </WorkspaceCard>

    {lastResult && <ReconcileDiffPanel result={lastResult} range={range} />}
    <AuditLogPanel
      rows={audit}
      total={auditTotal}
      page={auditPage}
      pageSize={AUDIT_PAGE}
      onPage={setAuditPage}
      q={auditQ}
      onQ={(v) => { setAuditQ(v); }}
      onExportAllCSV={exportAuditCSVAll}
      onExportPDF={exportAuditPDF}
    />
    <PrintSummary result={lastResult} attribution={filtered} range={range} />
    </div>
  );
}

function FilterSelect({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 px-2 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] bg-transparent hud-label text-[11px] text-[var(--silver-dim)]"
    >
      <option value="">All {label.toLowerCase()}</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function ReconcileDiffPanel({ result, range }: { result: ReconcileResult; range: Range }) {
  const s = summarizeDiff(result);
  const { pipelineDelta: pDelta, revenueDelta: rDelta, pipelinePct: pPct, revenuePct: rPct, netLeads } = s;
  const summary = s.changes === 0
    ? `No changes: attribution is already in sync with CRM for range ${range.toUpperCase()}.`
    : `In range ${range.toUpperCase()}, ${s.changes} lead${s.changes === 1 ? "" : "s"} across ${s.affectedDeals} deal${s.affectedDeals === 1 ? "" : "s"} changed attribution — ${s.markedWon} marked won, ${s.cleared} cleared (net ${netLeads >= 0 ? "+" : ""}${netLeads} converted). Pipeline moved ${fmtMoney(pDelta)}${pPct !== null ? ` (${pPct >= 0 ? "+" : ""}${pPct.toFixed(1)}%)` : ""} and revenue moved ${fmtMoney(rDelta)}${rPct !== null ? ` (${rPct >= 0 ? "+" : ""}${rPct.toFixed(1)}%)` : ""}.`;
  return (
    <WorkspaceCard>
      <div className="px-3 py-2 border-b border-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)]">
        <p className="hud-label text-[10px] text-[var(--silver-dim)]">
          Reconciliation diff · {new Date(result.ran_at).toLocaleString()} · range {result.range_key ?? "—"}
        </p>
        <p className="text-xs text-[var(--silver)] mt-1">{summary}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 text-sm">
        <Kpi label="Scanned" value={String(result.scanned)} />
        <Kpi label="Marked won" value={String(result.marked_won)} tone="up" />
        <Kpi label="Cleared" value={String(result.cleared)} tone="down" />
        <Kpi label="Affected deals" value={String(result.affected_deal_ids.length)} />
        <Kpi label="Pipeline before" value={fmtMoney(result.pipeline_before)} />
        <Kpi label="Pipeline after" value={fmtMoney(result.pipeline_after)} tone={pDelta === 0 ? undefined : pDelta > 0 ? "up" : "down"} />
        <Kpi label="Revenue before" value={fmtMoney(result.revenue_before)} />
        <Kpi label="Revenue after" value={fmtMoney(result.revenue_after)} tone={rDelta === 0 ? undefined : rDelta > 0 ? "up" : "down"} />
      </div>
      {result.diff.length > 0 && (
        <div className="overflow-x-auto border-t border-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)]">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[var(--silver-dim)]">
                <th className="px-3 py-2">Action</th>
                <th className="px-3 py-2">Lead</th>
                <th className="px-3 py-2">Deal</th>
                <th className="px-3 py-2 text-right">Deal value</th>
                <th className="px-3 py-2">Before converted_at</th>
                <th className="px-3 py-2">After converted_at</th>
              </tr>
            </thead>
            <tbody>
              {result.diff.map((d) => (
                <tr key={d.lead_id} className="border-t border-[color-mix(in_oklab,var(--accent-glow)_8%,transparent)]">
                  <td className={`px-3 py-1.5 ${d.action === "marked_won" ? "text-[var(--accent-glow)]" : "text-[color-mix(in_oklab,var(--silver)_60%,transparent)]"}`}>
                    {d.action.replace("_", " ")}
                  </td>
                  <td className="px-3 py-1.5 font-mono text-[10px]">{d.lead_id.slice(0, 8)}</td>
                  <td className="px-3 py-1.5 font-mono text-[10px]">{d.deal_id.slice(0, 8)}</td>
                  <td className="px-3 py-1.5 text-right">{fmtMoney(d.deal_value)}</td>
                  <td className="px-3 py-1.5 text-[var(--silver-dim)]">{d.before_converted_at?.slice(0, 10) ?? "—"}</td>
                  <td className="px-3 py-1.5 text-[var(--silver-dim)]">{d.after_converted_at?.slice(0, 10) ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </WorkspaceCard>
  );
}

function AuditLogPanel({
  rows, total, page, pageSize, onPage, q, onQ, onExportAllCSV, onExportPDF,
}: {
  rows: any[]; total: number; page: number; pageSize: number;
  onPage: (p: number) => void; q: string; onQ: (v: string) => void;
  onExportAllCSV: () => void | Promise<void>;
  onExportPDF: () => void | Promise<void>;
}) {
  const from = total === 0 ? 0 : page * pageSize + 1;
  const to = Math.min(total, (page + 1) * pageSize);
  const hasPrev = page > 0;
  const hasNext = to < total;
  return (
    <WorkspaceCard>
      <div className="px-3 py-2 border-b border-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)] flex flex-wrap justify-between items-center gap-2">
        <p className="hud-label text-[10px] text-[var(--silver-dim)]">
          Audit log · showing {from}–{to} of {total}
        </p>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={q}
            onChange={(e) => onQ(e.target.value)}
            placeholder="Search range (mtd, 30d…)"
            className="h-8 px-2 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] bg-transparent text-xs text-[var(--silver)] placeholder:text-[var(--silver-dim)]"
          />
          <WsButton onClick={() => onPage(page - 1)} disabled={!hasPrev}>Prev</WsButton>
          <WsButton onClick={() => onPage(page + 1)} disabled={!hasNext}>Next</WsButton>
          <WsButton onClick={() => downloadCSV(`attribution-audit-p${page + 1}.csv`, rows)} disabled={!rows.length}>Export page</WsButton>
          <WsButton onClick={() => onExportAllCSV()} disabled={total === 0}>Export CSV (all)</WsButton>
          <WsButton onClick={() => onExportPDF()} disabled={total === 0}>Export PDF</WsButton>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-[var(--silver-dim)]">
              <th className="px-3 py-2">Ran at</th>
              <th className="px-3 py-2">Range</th>
              <th className="px-3 py-2 text-right">Scanned</th>
              <th className="px-3 py-2 text-right">Won</th>
              <th className="px-3 py-2 text-right">Cleared</th>
              <th className="px-3 py-2 text-right">Pipeline Δ</th>
              <th className="px-3 py-2 text-right">Revenue Δ</th>
              <th className="px-3 py-2 text-right">Deals affected</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={8} className="px-3 py-6 text-center text-[var(--silver-dim)]">No runs recorded yet.</td></tr>
            )}
            {rows.map((r) => {
              const pd = Number(r.pipeline_after) - Number(r.pipeline_before);
              const rd = Number(r.revenue_after) - Number(r.revenue_before);
              return (
                <tr key={r.id} className="border-t border-[color-mix(in_oklab,var(--accent-glow)_8%,transparent)]">
                  <td className="px-3 py-1.5">{new Date(r.ran_at).toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-[var(--silver-dim)]">{r.range_key ?? "—"}</td>
                  <td className="px-3 py-1.5 text-right">{r.scanned}</td>
                  <td className="px-3 py-1.5 text-right text-[var(--accent-glow)]">{r.marked_won}</td>
                  <td className="px-3 py-1.5 text-right">{r.cleared}</td>
                  <td className={`px-3 py-1.5 text-right ${pd > 0 ? "text-[var(--accent-glow)]" : pd < 0 ? "text-[color-mix(in_oklab,var(--silver)_50%,transparent)]" : ""}`}>{fmtMoney(pd)}</td>
                  <td className={`px-3 py-1.5 text-right ${rd > 0 ? "text-[var(--accent-glow)]" : rd < 0 ? "text-[color-mix(in_oklab,var(--silver)_50%,transparent)]" : ""}`}>{fmtMoney(rd)}</td>
                  <td className="px-3 py-1.5 text-right">{(r.affected_deal_ids ?? []).length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </WorkspaceCard>
  );
}

function Kpi({ label, value, tone }: { label: string; value: string; tone?: "up" | "down" }) {
  const color = tone === "up" ? "text-[var(--accent-glow)]" : tone === "down" ? "text-[color-mix(in_oklab,var(--silver)_55%,transparent)]" : "";
  return (
    <div>
      <p className="hud-label text-[10px] text-[var(--silver-dim)]">{label}</p>
      <p className={`text-lg font-medium ${color}`}>{value}</p>
    </div>
  );
}

// Branded, print-only summary page. Hidden on-screen; visible when the user
// prints/exports to PDF via the browser.
function PrintSummary({
  result,
  attribution,
  range,
}: {
  result: ReconcileResult | null;
  attribution: any[];
  range: Range;
}) {
  const totals = useMemo(() => {
    const t = { leads: 0, deals: 0, won_value: 0, pipeline: 0, spend: 0 };
    for (const r of attribution) {
      t.leads += Number(r.leads_count ?? 0);
      t.deals += Number(r.deals_count ?? 0);
      t.won_value += Number(r.won_value ?? 0);
      t.pipeline += Number(r.pipeline_value ?? 0);
      t.spend += Number(r.spend ?? 0);
    }
    return t;
  }, [attribution]);
  return (
    <div className="hidden print:block print:!bg-white print:!text-black">
      <div className="border-b-2 border-black pb-2 mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest">Cyryx Labs</p>
          <h1 className="text-2xl font-bold">Attribution Reconciliation Report</h1>
          <p className="text-xs">Range {range.toUpperCase()} · Generated {new Date().toLocaleString()}</p>
        </div>
        <div className="text-right text-xs">
          <p>cyryxlabs.com</p>
          <p>workspace</p>
        </div>
      </div>

      <section className="mb-6">
        <h2 className="text-sm font-bold mb-2">Key KPIs</h2>
        <div className="grid grid-cols-4 gap-3 text-sm">
          <PrintKpi label="Total leads" value={String(totals.leads)} />
          <PrintKpi label="Total deals" value={String(totals.deals)} />
          <PrintKpi label="Pipeline" value={fmtMoney(totals.pipeline)} />
          <PrintKpi label="Won revenue" value={fmtMoney(totals.won_value)} />
          <PrintKpi label="Spend" value={fmtMoney(totals.spend)} />
          <PrintKpi label="ROI" value={totals.spend > 0 ? `${(((totals.won_value - totals.spend) / totals.spend) * 100).toFixed(0)}%` : "—"} />
          {result && <PrintKpi label="Pipeline Δ" value={fmtMoney(result.pipeline_after - result.pipeline_before)} />}
          {result && <PrintKpi label="Revenue Δ" value={fmtMoney(result.revenue_after - result.revenue_before)} />}
        </div>
      </section>

      {result && result.diff.length > 0 && (
        <section className="mb-6 break-inside-avoid">
          <h2 className="text-sm font-bold mb-2">Changes ({result.diff.length})</h2>
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-black">
                <th className="text-left py-1">Action</th>
                <th className="text-left py-1">Lead</th>
                <th className="text-left py-1">Deal</th>
                <th className="text-right py-1">Value</th>
                <th className="text-left py-1">Before</th>
                <th className="text-left py-1">After</th>
              </tr>
            </thead>
            <tbody>
              {result.diff.map((d) => (
                <tr key={d.lead_id} className="border-b border-gray-300">
                  <td className="py-1">{d.action.replace("_", " ")}</td>
                  <td className="py-1 font-mono">{d.lead_id.slice(0, 8)}</td>
                  <td className="py-1 font-mono">{d.deal_id.slice(0, 8)}</td>
                  <td className="py-1 text-right">{fmtMoney(d.deal_value)}</td>
                  <td className="py-1">{d.before_converted_at?.slice(0, 10) ?? "—"}</td>
                  <td className="py-1">{d.after_converted_at?.slice(0, 10) ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {result && result.diff.length > 0 && (() => {
        const byCampaign = new Map<string, { marked_won: number; cleared: number; deal_value_delta: number; lead_ids: string[]; deal_ids: string[] }>();
        for (const d of result.diff) {
          const key = d.campaign_id ?? "—";
          const cur = byCampaign.get(key) ?? { marked_won: 0, cleared: 0, deal_value_delta: 0, lead_ids: [], deal_ids: [] };
          if (d.action === "marked_won") { cur.marked_won++; cur.deal_value_delta += d.deal_value; }
          else { cur.cleared++; cur.deal_value_delta -= d.deal_value; }
          cur.lead_ids.push(d.lead_id);
          if (!cur.deal_ids.includes(d.deal_id)) cur.deal_ids.push(d.deal_id);
          byCampaign.set(key, cur);
        }
        const nameById = new Map<string, string>();
        for (const r of attribution) nameById.set(r.campaign_id, r.campaign_name);
        const rows = Array.from(byCampaign.entries()).map(([cid, v]) => ({ campaign_id: cid, name: nameById.get(cid) ?? cid.slice(0, 8), ...v }));
        return (
          <section className="mb-6 break-before-page">
            <h2 className="text-sm font-bold mb-2">Per-campaign impact (before → after)</h2>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="border-b border-black">
                  <th className="text-left py-1">Campaign</th>
                  <th className="text-right py-1">Marked won</th>
                  <th className="text-right py-1">Cleared</th>
                  <th className="text-right py-1">Revenue Δ</th>
                  <th className="text-right py-1">Leads affected</th>
                  <th className="text-right py-1">Deals affected</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.campaign_id} className="border-b border-gray-300">
                    <td className="py-1">{r.name}</td>
                    <td className="py-1 text-right">{r.marked_won}</td>
                    <td className="py-1 text-right">{r.cleared}</td>
                    <td className="py-1 text-right">{fmtMoney(r.deal_value_delta)}</td>
                    <td className="py-1 text-right">{r.lead_ids.length}</td>
                    <td className="py-1 text-right">{r.deal_ids.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      })()}

      <section className="break-before-page">
        <h2 className="text-sm font-bold mb-2">Annex · Attribution by campaign</h2>
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="border-b border-black">
              <th className="text-left py-1">Campaign</th>
              <th className="text-left py-1">Channel</th>
              <th className="text-right py-1">Leads</th>
              <th className="text-right py-1">Deals</th>
              <th className="text-right py-1">Pipeline</th>
              <th className="text-right py-1">Won</th>
              <th className="text-right py-1">Spend</th>
            </tr>
          </thead>
          <tbody>
            {attribution.map((r) => (
              <tr key={r.campaign_id} className="border-b border-gray-300">
                <td className="py-1">{r.campaign_name}</td>
                <td className="py-1">{r.channel_name ?? "—"}</td>
                <td className="py-1 text-right">{r.leads_count}</td>
                <td className="py-1 text-right">{r.deals_count}</td>
                <td className="py-1 text-right">{fmtMoney(Number(r.pipeline_value))}</td>
                <td className="py-1 text-right">{fmtMoney(Number(r.won_value))}</td>
                <td className="py-1 text-right">{fmtMoney(Number(r.spend))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {result && (result.affected_lead_ids.length > 0 || result.affected_deal_ids.length > 0) && (
        <section className="mt-6 break-inside-avoid">
          <h2 className="text-sm font-bold mb-2">Affected IDs</h2>
          <div className="grid grid-cols-2 gap-3 text-[10px] font-mono break-all">
            <div>
              <p className="font-bold mb-1 font-sans">Leads ({result.affected_lead_ids.length})</p>
              {result.affected_lead_ids.join(", ")}
            </div>
            <div>
              <p className="font-bold mb-1 font-sans">Deals ({result.affected_deal_ids.length})</p>
              {result.affected_deal_ids.join(", ")}
            </div>
          </div>
        </section>
      )}

      <p className="mt-6 text-[9px] text-gray-500">Range totals by stage aggregated from mkt_attribution_v for the selected range · Cyryx Labs</p>
    </div>
  );
}

function PrintKpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-black p-2">
      <p className="text-[9px] uppercase tracking-wider">{label}</p>
      <p className="text-base font-bold">{value}</p>
    </div>
  );
}
