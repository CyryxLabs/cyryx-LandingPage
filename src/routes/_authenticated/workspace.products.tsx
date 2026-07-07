import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/components/cyryx/seo/seo";
import { WorkspaceShell } from "@/components/cyryx/workspace/WorkspaceShell";
import { DataTable } from "@/components/cyryx/workspace/DataTable";

export const Route = createFileRoute("/_authenticated/workspace/products")({
  head: () => {
    const h = buildHead({ title: "Products · Cyryx", description: "Product catalog", path: "/workspace/products" });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: () => (
    <WorkspaceShell title="Products" subtitle="Catalog, status and roadmap notes">
      <DataTable
        tableName="ws_products"
        queryKey="ws_products"
        fields={[
          { key: "name", label: "Name", type: "text", required: true },
          { key: "status", label: "Status", type: "select", options: ["idea","building","beta","live","sunset"] },
          { key: "health", label: "Health", type: "number" },
          { key: "owner_email", label: "Owner", type: "text" },
          { key: "roadmap_note", label: "Roadmap note", type: "text", className: "min-w-[240px]" },
        ]}
      />
    </WorkspaceShell>
  ),
});
