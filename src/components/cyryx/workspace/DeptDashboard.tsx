import { useQuery } from "@tanstack/react-query";
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

type Kind = "finance" | "pipeline" | "dev" | "hr" | "marketing";

const AXIS = "color-mix(in oklab, var(--silver) 55%, transparent)";
const GRID = "color-mix(in oklab, var(--accent-glow) 15%, transparent)";
const ACCENT = "var(--accent-glow)";

function fmtMoney(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0);
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

export function DeptDashboard({ kind }: { kind: Kind }) {
  if (kind === "finance") return <FinanceDashboard />;
  if (kind === "pipeline") return <PipelineDashboard />;
  if (kind === "dev") return <DevDashboard />;
  if (kind === "hr") return <HRDashboard />;
  return <MarketingDashboard />;
}

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

function FinanceDashboard() {
  const buckets = useMonthlyBuckets(12);
  const q = useQuery({
    queryKey: ["dash-finance"],
    queryFn: async () => {
      const [tx, subs] = await Promise.all([
        (supabase as any).from("fin_transactions").select("amount,kind,occurred_on"),
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
  return (
    <section className="grid gap-4 md:grid-cols-2">
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
      <ChartCard title="Revenue vs Expenses" subtitle="Monthly, last 12 months">
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
    </section>
  );
}

function PipelineDashboard() {
  const q = useQuery({
    queryKey: ["dash-pipeline"],
    queryFn: async () => {
      const [stages, deals] = await Promise.all([
        (supabase as any).from("crm_stages").select("id,name,position,is_won,is_lost").order("position"),
        (supabase as any).from("crm_deals").select("stage_id,value,updated_at,created_at"),
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
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <ChartCard title="Pipeline by stage" subtitle="Deal value">
        <ResponsiveContainer>
          <BarChart data={rows} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="stage" stroke={AXIS} fontSize={11} />
            <YAxis stroke={AXIS} fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => fmtMoney(v)} contentStyle={{ background: "#0a0a0a", border: `1px solid ${GRID}` }} />
            <Bar dataKey="value" fill={ACCENT} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Deals per stage" subtitle={`Win rate ${(q.data?.winRate ?? 0).toFixed(0)}%`}>
        <ResponsiveContainer>
          <BarChart data={rows} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="stage" stroke={AXIS} fontSize={11} />
            <YAxis stroke={AXIS} fontSize={11} />
            <Tooltip contentStyle={{ background: "#0a0a0a", border: `1px solid ${GRID}` }} />
            <Bar dataKey="count" fill="color-mix(in oklab, var(--accent-glow) 70%, transparent)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </section>
  );
}

function DevDashboard() {
  const q = useQuery({
    queryKey: ["dash-dev"],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("pm_tasks")
        .select("status,updated_at,created_at");
      const now = Date.now();
      const weeks: { week: string; done: number; created: number }[] = [];
      for (let i = 11; i >= 0; i--) {
        const end = now - i * 7 * 864e5;
        const start = end - 7 * 864e5;
        const label = new Date(end).toLocaleDateString(undefined, { month: "short", day: "numeric" });
        const done = (data ?? []).filter((t: any) => t.status === "done" && new Date(t.updated_at).getTime() >= start && new Date(t.updated_at).getTime() < end).length;
        const created = (data ?? []).filter((t: any) => new Date(t.created_at).getTime() >= start && new Date(t.created_at).getTime() < end).length;
        weeks.push({ week: label, done, created });
      }
      const byStatus = ["backlog", "todo", "in_progress", "in_review", "done", "canceled"].map((s) => ({
        status: s,
        count: (data ?? []).filter((t: any) => t.status === s).length,
      }));
      return { weeks, byStatus };
    },
  });
  return (
    <section className="grid gap-4 md:grid-cols-2">
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
          <BarChart data={q.data?.byStatus ?? []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="status" stroke={AXIS} fontSize={10} />
            <YAxis stroke={AXIS} fontSize={11} />
            <Tooltip contentStyle={{ background: "#0a0a0a", border: `1px solid ${GRID}` }} />
            <Bar dataKey="count" fill={ACCENT} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </section>
  );
}

function HRDashboard() {
  const q = useQuery({
    queryKey: ["dash-hr"],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("hr_candidates")
        .select("stage,applied_at");
      const stages = ["applied", "screening", "interview", "offer", "hired", "rejected", "withdrawn"];
      const byStage = stages.map((s) => ({
        stage: s,
        count: (data ?? []).filter((c: any) => c.stage === s).length,
      }));
      const now = Date.now();
      const months: { month: string; applied: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i, 1);
        const start = d.getTime();
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
        months.push({
          month: d.toLocaleDateString(undefined, { month: "short" }),
          applied: (data ?? []).filter((c: any) => c.applied_at && new Date(c.applied_at).getTime() >= start && new Date(c.applied_at).getTime() < end).length,
        });
      }
      return { byStage, months };
    },
  });
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <ChartCard title="Candidates by stage">
        <ResponsiveContainer>
          <BarChart data={q.data?.byStage ?? []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="stage" stroke={AXIS} fontSize={10} />
            <YAxis stroke={AXIS} fontSize={11} />
            <Tooltip contentStyle={{ background: "#0a0a0a", border: `1px solid ${GRID}` }} />
            <Bar dataKey="count" fill={ACCENT} />
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
    </section>
  );
}

function MarketingDashboard() {
  const q = useQuery({
    queryKey: ["dash-marketing"],
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
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <ChartCard title="Leads by channel">
        <ResponsiveContainer>
          <BarChart data={q.data?.byChannel ?? []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="channel" stroke={AXIS} fontSize={11} />
            <YAxis stroke={AXIS} fontSize={11} />
            <Tooltip contentStyle={{ background: "#0a0a0a", border: `1px solid ${GRID}` }} />
            <Bar dataKey="leads" fill={ACCENT} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Won revenue vs spend by channel">
        <ResponsiveContainer>
          <BarChart data={q.data?.byChannel ?? []} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid stroke={GRID} strokeDasharray="3 3" />
            <XAxis dataKey="channel" stroke={AXIS} fontSize={11} />
            <YAxis stroke={AXIS} fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => fmtMoney(v)} contentStyle={{ background: "#0a0a0a", border: `1px solid ${GRID}` }} />
            <Bar dataKey="won_value" fill={ACCENT} />
            <Bar dataKey="spend" fill="color-mix(in oklab, var(--silver) 40%, transparent)" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </section>
  );
}