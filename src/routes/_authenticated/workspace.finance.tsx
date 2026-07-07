import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { buildHead } from "@/components/cyryx/seo/seo";
import { WorkspaceShell, WorkspaceCard } from "@/components/cyryx/workspace/WorkspaceShell";
import { DataTable } from "@/components/cyryx/workspace/DataTable";

export const Route = createFileRoute("/_authenticated/workspace/finance")({
  head: () => {
    const h = buildHead({ title: "Finance · Cyryx", description: "Financial metrics", path: "/workspace/finance" });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: FinancePage,
});

function FinancePage() {
  const { data = [] } = useQuery({
    queryKey: ["ws_finance_metrics", "chart"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ws_finance_metrics").select("*").order("month", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((r: any) => ({
        month: new Date(r.month).toLocaleDateString(undefined, { month: "short", year: "2-digit" }),
        MRR: Number(r.mrr_usd ?? 0),
        Revenue: Number(r.new_revenue_usd ?? 0),
        Expenses: Number(r.expenses_usd ?? 0),
        Cash: Number(r.cash_usd ?? 0),
      }));
    },
  });
  return (
    <WorkspaceShell title="Finance" subtitle="Monthly MRR, revenue, expenses and cash">
      <WorkspaceCard className="p-4 mb-6">
        <p className="hud-label text-[var(--silver-dim)] mb-3">Trend</p>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--silver-dim)" fontSize={11} />
              <YAxis stroke="var(--silver-dim)" fontSize={11} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "var(--onyx)", border: "1px solid color-mix(in oklab, var(--accent-glow) 30%, transparent)", fontSize: 12 }}
                formatter={(v: any) => `$${Number(v).toLocaleString()}`}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="MRR" stroke="var(--accent-glow)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Revenue" stroke="#7dd3fc" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Expenses" stroke="#f87171" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Cash" stroke="#a78bfa" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </WorkspaceCard>
      <DataTable
        tableName="ws_finance_metrics"
        queryKey="ws_finance_metrics"
        orderBy="month"
        ascending={false}
        fields={[
          { key: "month", label: "Month", type: "date", required: true },
          { key: "mrr_usd", label: "MRR", type: "number" },
          { key: "new_revenue_usd", label: "New rev.", type: "number" },
          { key: "expenses_usd", label: "Expenses", type: "number" },
          { key: "cash_usd", label: "Cash", type: "number" },
          { key: "notes", label: "Notes", type: "text", className: "min-w-[200px]" },
        ]}
      />
    </WorkspaceShell>
  );
}
