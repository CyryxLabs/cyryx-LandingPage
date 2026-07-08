import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { buildHead } from "@/components/cyryx/seo/seo";
import { WorkspaceShell, WorkspaceCard, WsButton } from "@/components/cyryx/workspace/WorkspaceShell";
import { DataTable } from "@/components/cyryx/workspace/DataTable";
import { DeptDashboard, downloadCSV, rangeBounds, type Range } from "@/components/cyryx/workspace/DeptDashboard";
import { drawerStore } from "@/lib/drawer-store";
import { reconcileAttribution, type ReconcileResult } from "@/lib/attribution";

export const Route = createFileRoute("/_authenticated/workspace/marketing")({
  head: () => {
    const h = buildHead({ title: "Marketing · Cyryx", description: "Campaigns, channels and attribution", path: "/workspace/marketing" });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: MarketingPage,
});

const TABS = ["dashboard", "campaigns", "channels", "leads", "attribution"] as const;
type Tab = (typeof TABS)[number];

function MarketingPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
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
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [range, setRange] = useState<Range>("30d");
  const [lastResult, setLastResult] = useState<ReconcileResult | null>(null);
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

  const { data: audit = [] } = useQuery({
    queryKey: ["mkt_attribution_audit"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("mkt_attribution_audit")
        .select("id,ran_at,ran_by,range_key,scanned,marked_won,cleared,pipeline_before,pipeline_after,revenue_before,revenue_after,affected_lead_ids,affected_deal_ids")
        .order("ran_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
  });

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
            onClick={() => downloadCSV(`attribution-${new Date().toISOString().slice(0,10)}.csv`, data)}
            disabled={!data.length}
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
            {!isLoading && data.length === 0 && (
              <tr><td colSpan={11} className="px-3 py-8 text-center text-xs text-[var(--silver-dim)]">No campaigns yet.</td></tr>
            )}
            {data.map((r: any) => {
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

    {lastResult && <ReconcileDiffPanel result={lastResult} />}
    <AuditLogPanel rows={audit as any[]} />
    <PrintSummary result={lastResult} attribution={data as any[]} range={range} />
    </div>
  );
}

function ReconcileDiffPanel({ result }: { result: ReconcileResult }) {
  const pDelta = result.pipeline_after - result.pipeline_before;
  const rDelta = result.revenue_after - result.revenue_before;
  return (
    <WorkspaceCard>
      <div className="px-3 py-2 border-b border-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)]">
        <p className="hud-label text-[10px] text-[var(--silver-dim)]">
          Reconciliation diff · {new Date(result.ran_at).toLocaleString()} · range {result.range_key ?? "—"}
        </p>
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

function AuditLogPanel({ rows }: { rows: any[] }) {
  return (
    <WorkspaceCard>
      <div className="px-3 py-2 border-b border-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)] flex justify-between items-center">
        <p className="hud-label text-[10px] text-[var(--silver-dim)]">Audit log · last {rows.length} runs</p>
        <WsButton onClick={() => downloadCSV(`attribution-audit.csv`, rows)} disabled={!rows.length}>Export</WsButton>
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
