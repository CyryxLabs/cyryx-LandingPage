import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { buildHead } from "@/components/cyryx/seo/seo";
import { WorkspaceShell } from "@/components/cyryx/workspace/WorkspaceShell";
import { DataTable } from "@/components/cyryx/workspace/DataTable";

// Repurposed: CRM (companies + contacts). Products catalog will be a phase-2 module.
export const Route = createFileRoute("/_authenticated/workspace/products")({
  head: () => {
    const h = buildHead({ title: "CRM · Cyryx", description: "Companies & contacts", path: "/workspace/products" });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: CRMPage,
});

const TABS = ["companies", "contacts", "activities"] as const;
type Tab = (typeof TABS)[number];

function CRMPage() {
  const [tab, setTab] = useState<Tab>("companies");
  return (
    <WorkspaceShell title="CRM directory" subtitle="Companies, contacts and outreach activities">
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
      {tab === "companies" && (
        <DataTable
          tableName="crm_companies"
          queryKey="crm_companies"
          fields={[
            { key: "name", label: "Name", type: "text", required: true },
            { key: "domain", label: "Domain", type: "text" },
            { key: "industry", label: "Industry", type: "text" },
            { key: "size", label: "Size", type: "text" },
            { key: "website", label: "Website", type: "text" },
            { key: "notes", label: "Notes", type: "text", className: "min-w-[240px]" },
          ]}
        />
      )}
      {tab === "contacts" && (
        <DataTable
          tableName="crm_contacts"
          queryKey="crm_contacts"
          fields={[
            { key: "full_name", label: "Name", type: "text", required: true },
            { key: "email", label: "Email", type: "text" },
            { key: "phone", label: "Phone", type: "text" },
            { key: "country", label: "Country", type: "text" },
            { key: "title", label: "Title", type: "text" },
            { key: "linkedin_url", label: "LinkedIn", type: "text" },
            { key: "notes", label: "Notes", type: "text", className: "min-w-[240px]" },
          ]}
        />
      )}
      {tab === "activities" && (
        <DataTable
          tableName="crm_activities"
          queryKey="crm_activities"
          orderBy="created_at"
          fields={[
            { key: "kind", label: "Kind", type: "select", options: ["call","email","meeting","task","note"] },
            { key: "subject", label: "Subject", type: "text", required: true, className: "min-w-[220px]" },
            { key: "body", label: "Notes", type: "text", className: "min-w-[240px]" },
            { key: "due_at", label: "Due", type: "date" },
            { key: "completed_at", label: "Completed", type: "date" },
          ]}
        />
      )}
    </WorkspaceShell>
  );
}
