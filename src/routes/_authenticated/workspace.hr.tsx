import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/components/cyryx/seo/seo";
import { WorkspaceShell } from "@/components/cyryx/workspace/WorkspaceShell";
import { DataTable } from "@/components/cyryx/workspace/DataTable";

export const Route = createFileRoute("/_authenticated/workspace/hr")({
  head: () => {
    const h = buildHead({ title: "HR · Cyryx", description: "Candidates & recruiting", path: "/workspace/hr" });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: () => (
    <WorkspaceShell title="HR" subtitle="Candidates in the recruiting pipeline">
      <DataTable
        tableName="ws_candidates"
        queryKey="ws_candidates"
        fields={[
          { key: "name", label: "Name", type: "text", required: true },
          { key: "email", label: "Email", type: "text" },
          { key: "role", label: "Role", type: "text" },
          { key: "stage", label: "Stage", type: "select", options: ["applied","screening","interview","offer","hired","rejected"] },
          { key: "source", label: "Source", type: "text" },
          { key: "notes", label: "Notes", type: "text", className: "min-w-[200px]" },
        ]}
      />
    </WorkspaceShell>
  ),
});
