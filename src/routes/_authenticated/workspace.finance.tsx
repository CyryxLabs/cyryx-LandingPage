import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/components/cyryx/seo/seo";
import { WorkspaceShell } from "@/components/cyryx/workspace/WorkspaceShell";
import { DataTable } from "@/components/cyryx/workspace/DataTable";

export const Route = createFileRoute("/_authenticated/workspace/finance")({
  head: () => {
    const h = buildHead({ title: "Finance · Cyryx", description: "Financial metrics", path: "/workspace/finance" });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: () => (
    <WorkspaceShell title="Finance" subtitle="Monthly MRR, revenue, expenses and cash">
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
  ),
});
