import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { WorkspaceCard } from "@/components/cyryx/workspace/WorkspaceShell";
import { drawerStore } from "@/lib/drawer-store";

type Kind = "finance" | "pipeline" | "dev" | "hr" | "marketing";
export type Range = "mtd" | "30d" | "90d" | "ytd";

const RANGE_OPTIONS: { key: Range; label: string }[] = [
  { key: "mtd", label: "MTD" },
  { key: "30d", label: "30d" },
  { key: "90d", label: "90d" },
  { key: "ytd", label: "YTD" },
];

export function rangeBounds(range: Range): { start: number; end: number } {
  const now = new Date();
  const end = Date.now();
  if (range === "mtd") return { start: new Date(now.getFullYear(), now.getMonth(), 1).getTime(), end };
  if (range === "ytd") return { start: new Date(now.getFullYear(), 0, 1).getTime(), end };
  const days = range === "30d" ? 30 : 90;
  return { start: end - days * 864e5, end };
}

export function rangeLabel(range: Range): string {
  return RANGE_OPTIONS.find((r) => r.key === range)?.label ?? range;
}

const AXIS = "color-mix(in oklab, var(--silver) 55%, transparent)";
const GRID = "color-mix(in oklab, var(--accent-glow) 15%, transparent)";
const ACCENT = "var(--accent-glow)";

function fmtMoney(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);
}

function toCSV(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const cols = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const esc = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

export function downloadCSV(name: string, rows: Record<string, unknown>[]) {
  const csv = toCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function useRealtimeInvalidate(tables: string[], keys: string[][]) {
  const qc = useQueryClient();
  useEffect(() => {
    const channel = supabase.channel(`dash-${tables.join("-")}`);
    tables.forEach((t) =>
      channel.on("postgres_changes", { event: "*", schema: "public", table: t }, () => {
        keys.forEach((k) => qc.invalidateQueries({ queryKey: k }));
      }),
    );
    channel.subscribe();
    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

function DashboardToolbar({
  range,
  setRange,
  onExport,
  extra,
}: {
  range: Range;
  setRange: (r: Range) => void;
  onExport: () => void;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <div className="flex gap-0.5 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)] p-0.5">
        {RANGE_OPTIONS.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => setRange(r.key)}
            className={`px-2.5 py-1 rounded hud-label text-[11px] transition-colors ${
              range === r.key
                ? "bg-[color-mix(in_oklab,var(--accent-glow)_18%,transparent)] text-[var(--accent-glow)]"
                : "text-[var(--silver-dim)] hover:text-[var(--silver)]"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div className="ml-auto flex gap-1">
        <button
          type="button"
          onClick={onExport}
          className="h-8 px-3 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] hud-label text-[11px] text-[var(--silver-dim)] hover:text-[var(--silver)]"
        >
          Export CSV
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="h-8 px-3 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] hud-label text-[11px] text-[var(--silver-dim)] hover:text-[var(--silver)]"
        >
          Print / PDF
        </button>
        {extra}
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <WorkspaceCard className="p-4">
      <div className="mb-2">
        <p className="hud-label text-[10px] text-[var(--silver-dim)]">{title}</p>
        {subtitle && <p className="text-[11px] text-[var(--silver-dim)]">{subtitle}</p>}
      </div>
      <div className="h-56">{children}</div>
    </WorkspaceCard>
  );
}

export function DeptDashboard({ kind, defaultRange = "30d" }: { kind: Kind; defaultRange?: Range }) {
  const [range, setRange] = useState<Range>(defaultRange);
  if (kind === "finance") return <FinanceDashboard range={range} setRange={setRange} />;
  if (kind === "pipeline") return <PipelineDashboard range={range} setRange={setRange} />;
  if (kind === "dev") return <DevDashboard range={range} setRange={setRange} />;
  if (kind === "hr") return <HRDashboard range={range} setRange={setRange} />;
  return <MarketingDashboard range={range} setRange={setRange} />;
}

type PaneProps = { range: Range; setRange: (r: Range) => void };

function useMonthlyBuckets(months = 12) {
  const now = new Date();
  const buckets: { key: string; label: string; start: number; end: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth() + 1}`,
      label: d.toLocaleDateString(undefined, { month: "short" }),
      start: d.getTime(),
      end: next.getTime(),
    });
  }
  return buckets;
}

function FinanceDashboard({ range, setRange }: PaneProps) {
  useRealtimeInvalidate(["fin_transactions", "fin_subscriptions", "fin_invoices"], [["dash-finance", range]]);
  const buckets = useMonthlyBuckets(12);
  const { start, end } = useMemo(() => rangeBounds(range), [range]);
  const q = useQuery({
    queryKey: ["dash-finance", range],
    queryFn: async () => {
      const [tx, subs] = await Promise.all([
        (supabase as any).from("fin_transactions").select("amount,kind,occurred_on")
          .gte("occurred_on", new Date(start).toISOString().slice(0, 10)),
        (supabase as any).from("fin_subscriptions").select("mrr,status,started_at,canceled_at"),
      ]);
      const rows = buckets.map((b) => {
        const rev = (tx.data ?? [])
          .filter((t: any) => t.kind === "income" && new Date(t.occurred_on).getTime() >= b.start && new Date(t.occurred_on).getTime() < b.end)
          .reduce((a: number, t: any) => a + Number(t.amount ?? 0), 0);
        const exp = (tx.data ?? [])
          .filter((t: any) => t.kind === "expense" && new Date(t.occurred_on).getTime() >= b.start && new Date(t.occurred_on).getTime() < b.end)
          .reduce((a: number, t: any) => a + Number(t.amount ?? 0), 0);
        const mrr = (subs.data ?? [])
          .filter((s: any) => {
            const started = s.started_at ? new Date(s.started_at).getTime() : 0;
            const canceled = s.canceled_at ? new Date(s.canceled_at).getTime() : Infinity;
            return started < b.end && canceled > b.start && ["active", "trial"].includes(s.status);
          })
          .reduce((a: number, s: any) => a + Number(s.mrr ?? 0), 0);
        return { month: b.label, revenue: rev, expenses: exp, mrr };
      });
      return rows;
    },
  });
  const data = q.data ?? [];
  const inRangeTotals = useMemo(() => {
    const inRange = data.filter((d: any, i: number) => buckets[i]?.end > start && buckets[i]?.start < end);
    return {
      revenue: inRange.reduce((a: number, r: any) => a + r.revenue, 0),
      expenses: inRange.reduce((a: number, r: any) => a + r.expenses, 0),
    };
  }, [data, buckets, start, end]);
  return (
    <section className="print:block">
      <DashboardToolbar
        range={range}
        setRange={setRange}
        onExport={() => downloadCSV(`finance-${range}.csv`, data)}
      />
      <div className="grid gap-4 md:grid-cols-2">
      <ChartCard title="MRR trend" subtitle="Active + trial subscriptions">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke={AXIS} fontSize={11} />
            <YAxis stroke={AXIS} fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => fmtMoney(v)} contentStyle={{ background: "#0a0a0a", border: `1px solid ${GRID}` }} />
            <Line type="monotone" dataKey="mrr" stroke={ACCENT} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Revenue vs Expenses" subtitle={`Range ${rangeLabel(range)} · Rev ${fmtMoney(inRangeTotals.revenue)} · Exp ${fmtMoney(inRangeTotals.expenses)}`}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke={AXIS} fontSize={11} />
            <YAxis stroke={AXIS} fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => fmtMoney(v)} contentStyle={{ background: "#0a0a0a", border: `1px solid ${GRID}` }} />
            <Bar dataKey="revenue" fill={ACCENT} />
            <Bar dataKey="expenses" fill="color-mix(in oklab, var(--silver) 40%, transparent)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      </div>
    </section>
  );
}

function PipelineDashboard({ range, setRange }: PaneProps) {
  useRealtimeInvalidate(["crm_deals", "crm_stages"], [["dash-pipeline", range]]);
  const navigate = useNavigate();
  const { start } = useMemo(() => rangeBounds(range), [range]);
  const q = useQuery({
    queryKey: ["dash-pipeline", range],
    queryFn: async () => {
      const [stages, deals] = await Promise.all([
        (supabase as any).from("crm_stages").select("id,name,position,is_won,is_lost").order("position"),
        (supabase as any).from("crm_deals").select("stage_id,value,updated_at,created_at")
          .gte("updated_at", new Date(start).toISOString()),
      ]);
      const byStage = (stages.data ?? []).map((s: any) => {
        const ds = (deals.data ?? []).filter((d: any) => d.stage_id === s.id);
        return {
          stage: s.name,
          count: ds.length,
          value: ds.reduce((a: number, d: any) => a + Number(d.value ?? 0), 0),
          is_won: s.is_won,
          is_lost: s.is_lost,
        };
      });
      const won = byStage.filter((s: any) => s.is_won).reduce((a: number, s: any) => a + s.count, 0);
      const lost = byStage.filter((s: any) => s.is_lost).reduce((a: number, s: any) => a + s.count, 0);
      const winRate = won + lost > 0 ? (won / (won + lost)) * 100 : 0;
      return { byStage, winRate };
    },
  });
  const rows = q.data?.byStage ?? [];
  const drill = () => navigate({ to: "/workspace/pipeline" });
  return (
    <section className="print:block">
      <DashboardToolbar
        range={range}
        setRange={setRange}
        onExport={() => downloadCSV(`pipeline-${range}.csv`, rows)}
      />
      <div className="grid gap-4 md:grid-cols-2">
      <ChartCard title="Pipeline by stage" subtitle="Deal value">
        <ResponsiveContainer>
          <BarChart data={rows} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} onClick={drill}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="stage" stroke={AXIS} fontSize={11} />
            <YAxis stroke={AXIS} fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => fmtMoney(v)} contentStyle={{ background: "#0a0a0a", border: `1px solid ${GRID}` }} />
            <Bar dataKey="value" fill={ACCENT} cursor="pointer" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Deals per stage" subtitle={`Win rate ${(q.data?.winRate ?? 0).toFixed(0)}%`}>
        <ResponsiveContainer>
          <BarChart data={rows} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} onClick={drill}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="stage" stroke={AXIS} fontSize={11} />
            <YAxis stroke={AXIS} fontSize={11} />
            <Tooltip contentStyle={{ background: "#0a0a0a", border: `1px solid ${GRID}` }} />
            <Bar dataKey="count" fill="color-mix(in oklab, var(--accent-glow) 70%, transparent)" cursor="pointer" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      </div>
    </section>
  );
}

function DevDashboard({ range, setRange }: PaneProps) {
  useRealtimeInvalidate(["pm_tasks"], [["dash-dev", range]]);
  const navigate = useNavigate();
  const { start } = useMemo(() => rangeBounds(range), [range]);
  const q = useQuery({
    queryKey: ["dash-dev", range],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("pm_tasks")
        .select("id,title,status,updated_at,created_at")
        .gte("updated_at", new Date(start).toISOString());
      const now = Date.now();
      const weeks: { week: string; done: number; created: number }[] = [];
      const spanWeeks = Math.max(4, Math.min(26, Math.ceil((now - start) / (7 * 864e5))));
      for (let i = spanWeeks - 1; i >= 0; i--) {
        const end = now - i * 7 * 864e5;
        const wStart = end - 7 * 864e5;
        const label = new Date(end).toLocaleDateString(undefined, { month: "short", day: "numeric" });
        const done = (data ?? []).filter((t: any) => t.status === "done" && new Date(t.updated_at).getTime() >= wStart && new Date(t.updated_at).getTime() < end).length;
        const created = (data ?? []).filter((t: any) => new Date(t.created_at).getTime() >= wStart && new Date(t.created_at).getTime() < end).length;
        weeks.push({ week: label, done, created });
      }
      const byStatus = ["backlog", "todo", "in_progress", "in_review", "done", "canceled"].map((s) => ({
        status: s,
        count: (data ?? []).filter((t: any) => t.status === s).length,
      }));
      return { weeks, byStatus };
    },
  });
  const drill = () => navigate({ to: "/workspace/dev" });
  return (
    <section className="print:block">
      <DashboardToolbar
        range={range}
        setRange={setRange}
        onExport={() => downloadCSV(`dev-${range}.csv`, q.data?.weeks ?? [])}
      />
      <div className="grid gap-4 md:grid-cols-2">
      <ChartCard title="Throughput" subtitle="Tasks created vs done / week">
        <ResponsiveContainer>
          <LineChart data={q.data?.weeks ?? []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="week" stroke={AXIS} fontSize={10} />
            <YAxis stroke={AXIS} fontSize={11} />
            <Tooltip contentStyle={{ background: "#0a0a0a", border: `1px solid ${GRID}` }} />
            <Line type="monotone" dataKey="done" stroke={ACCENT} strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="created" stroke="color-mix(in oklab, var(--silver) 60%, transparent)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Tasks by status">
        <ResponsiveContainer>
          <BarChart data={q.data?.byStatus ?? []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} onClick={drill}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="status" stroke={AXIS} fontSize={10} />
            <YAxis stroke={AXIS} fontSize={11} />
            <Tooltip contentStyle={{ background: "#0a0a0a", border: `1px solid ${GRID}` }} />
            <Bar dataKey="count" fill={ACCENT} cursor="pointer" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      </div>
    </section>
  );
}

function HRDashboard({ range, setRange }: PaneProps) {
  useRealtimeInvalidate(["hr_candidates"], [["dash-hr", range]]);
  const navigate = useNavigate();
  const { start } = useMemo(() => rangeBounds(range), [range]);
  const q = useQuery({
    queryKey: ["dash-hr", range],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("hr_candidates")
        .select("stage,applied_at")
        .gte("applied_at", new Date(start).toISOString());
      const stages = ["applied", "screening", "interview", "offer", "hired", "rejected", "withdrawn"];
      const byStage = stages.map((s) => ({
        stage: s,
        count: (data ?? []).filter((c: any) => c.stage === s).length,
      }));
      const months: { month: string; applied: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i, 1);
        const mStart = d.getTime();
        const mEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
        months.push({
          month: d.toLocaleDateString(undefined, { month: "short" }),
          applied: (data ?? []).filter((c: any) => c.applied_at && new Date(c.applied_at).getTime() >= mStart && new Date(c.applied_at).getTime() < mEnd).length,
        });
      }
      return { byStage, months };
    },
  });
  const drill = () => navigate({ to: "/workspace/hr" });
  return (
    <section className="print:block">
      <DashboardToolbar
        range={range}
        setRange={setRange}
        onExport={() => downloadCSV(`hr-${range}.csv`, q.data?.byStage ?? [])}
      />
      <div className="grid gap-4 md:grid-cols-2">
      <ChartCard title="Candidates by stage">
        <ResponsiveContainer>
          <BarChart data={q.data?.byStage ?? []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} onClick={drill}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="stage" stroke={AXIS} fontSize={10} />
            <YAxis stroke={AXIS} fontSize={11} />
            <Tooltip contentStyle={{ background: "#0a0a0a", border: `1px solid ${GRID}` }} />
            <Bar dataKey="count" fill={ACCENT} cursor="pointer" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Applications / month">
        <ResponsiveContainer>
          <LineChart data={q.data?.months ?? []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke={AXIS} fontSize={11} />
            <YAxis stroke={AXIS} fontSize={11} />
            <Tooltip contentStyle={{ background: "#0a0a0a", border: `1px solid ${GRID}` }} />
            <Line type="monotone" dataKey="applied" stroke={ACCENT} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      </div>
    </section>
  );
}

function MarketingDashboard({ range, setRange }: PaneProps) {
  useRealtimeInvalidate(
    ["mkt_leads", "mkt_campaigns", "crm_deals"],
    [["dash-marketing", range], ["mkt_attribution_v"]],
  );
  const q = useQuery({
    queryKey: ["dash-marketing", range],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("mkt_attribution_v")
        .select("*");
      const byChannel = new Map<string, { channel: string; leads: number; won_value: number; spend: number }>();
      for (const r of data ?? []) {
        const key = r.channel_name ?? "—";
        const cur = byChannel.get(key) ?? { channel: key, leads: 0, won_value: 0, spend: 0 };
        cur.leads += Number(r.leads_count ?? 0);
        cur.won_value += Number(r.won_value ?? 0);
        cur.spend += Number(r.spend ?? 0);
        byChannel.set(key, cur);
      }
      return { byChannel: Array.from(byChannel.values()), top: (data ?? []).slice(0, 8) };
    },
  });
  const rows = q.data?.byChannel ?? [];
  const openCampaign = (idx?: number) => {
    if (idx == null) return;
    const r = q.data?.top?.[idx];
    if (r?.campaign_id) drawerStore.open({ entity_type: "mkt_campaigns", entity_id: r.campaign_id, label: r.campaign_name });
  };
  return (
    <section className="print:block">
      <DashboardToolbar
        range={range}
        setRange={setRange}
        onExport={() => downloadCSV(`marketing-attribution-${range}.csv`, q.data?.top ?? [])}
      />
      <div className="grid gap-4 md:grid-cols-2">
      <ChartCard title="Leads by channel">
        <ResponsiveContainer>
          <BarChart data={rows} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="channel" stroke={AXIS} fontSize={11} />
            <YAxis stroke={AXIS} fontSize={11} />
            <Tooltip contentStyle={{ background: "#0a0a0a", border: `1px solid ${GRID}` }} />
            <Bar dataKey="leads" fill={ACCENT} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Won revenue vs spend by channel" subtitle="Click a bar to open top campaign">
        <ResponsiveContainer>
          <BarChart data={rows} margin={{ top: 5, right: 10, left: -10, bottom: 0 }} onClick={(s: any) => openCampaign(s?.activeTooltipIndex)}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="channel" stroke={AXIS} fontSize={11} />
            <YAxis stroke={AXIS} fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => fmtMoney(v)} contentStyle={{ background: "#0a0a0a", border: `1px solid ${GRID}` }} />
            <Bar dataKey="won_value" fill={ACCENT} cursor="pointer" />
            <Bar dataKey="spend" fill="color-mix(in oklab, var(--silver) 40%, transparent)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      </div>
    </section>
  );
}