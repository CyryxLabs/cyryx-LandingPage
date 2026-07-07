import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/components/cyryx/seo/seo";
import { WorkspaceShell } from "@/components/cyryx/workspace/WorkspaceShell";
import { DataTable } from "@/components/cyryx/workspace/DataTable";

export const Route = createFileRoute("/_authenticated/workspace/marketing")({
  head: () => {
    const h = buildHead({ title: "Marketing · Cyryx", description: "Campaigns & leads", path: "/workspace/marketing" });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: () => (
    <WorkspaceShell title="Marketing" subtitle="Campaigns, spend and leads">
      <DataTable
        tableName="ws_campaigns"
        queryKey="ws_campaigns"
        fields={[
          { key: "name", label: "Name", type: "text", required: true },
          { key: "channel", label: "Channel", type: "text" },
          { key: "status", label: "Status", type: "select", options: ["planned","running","paused","completed"] },
          { key: "budget_usd", label: "Budget", type: "number" },
          { key: "spent_usd", label: "Spent", type: "number" },
          { key: "leads", label: "Leads", type: "number" },
        ]}
      />
    </WorkspaceShell>
  ),
});
