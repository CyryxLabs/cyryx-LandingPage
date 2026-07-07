import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/components/cyryx/seo/seo";
import { WorkspaceShell } from "@/components/cyryx/workspace/WorkspaceShell";
import { DataTable } from "@/components/cyryx/workspace/DataTable";

export const Route = createFileRoute("/_authenticated/workspace/dev")({
  head: () => {
    const h = buildHead({ title: "Development · Cyryx", description: "Engineering tasks", path: "/workspace/dev" });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: () => (
    <WorkspaceShell title="Development" subtitle="Engineering tasks and priorities">
      <DataTable
        tableName="ws_dev_tasks"
        queryKey="ws_dev_tasks"
        fields={[
          { key: "title", label: "Title", type: "text", required: true, className: "min-w-[240px]" },
          { key: "status", label: "Status", type: "select", options: ["backlog","todo","in_progress","review","done"] },
          { key: "priority", label: "Priority", type: "select", options: ["low","medium","high","urgent"] },
          { key: "assignee_email", label: "Assignee", type: "text" },
          { key: "notes", label: "Notes", type: "text", className: "min-w-[200px]" },
        ]}
      />
    </WorkspaceShell>
  ),
});
