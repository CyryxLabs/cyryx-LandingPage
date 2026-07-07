import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { buildHead } from "@/components/cyryx/seo/seo";
import { WorkspaceShell } from "@/components/cyryx/workspace/WorkspaceShell";
import { DataTable } from "@/components/cyryx/workspace/DataTable";

export const Route = createFileRoute("/_authenticated/workspace/hr")({
  head: () => {
    const h = buildHead({ title: "HR · Cyryx", description: "People, hiring & reviews", path: "/workspace/hr" });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: HRPage,
});

const TABS = ["candidates", "openings", "employees", "departments", "timeoff"] as const;
type Tab = (typeof TABS)[number];

function HRPage() {
  const [tab, setTab] = useState<Tab>("candidates");
  return (
    <WorkspaceShell title="HR" subtitle="Hiring, people, departments & time off">
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

      {tab === "candidates" && (
        <DataTable
          tableName="hr_candidates"
          queryKey="hr_candidates"
          orderBy="applied_at"
          fields={[
            { key: "full_name", label: "Name", type: "text", required: true },
            { key: "email", label: "Email", type: "text" },
            { key: "phone", label: "Phone", type: "text" },
            { key: "stage", label: "Stage", type: "select", options: ["applied","screening","interview","offer","hired","rejected","withdrawn"] },
            { key: "source", label: "Source", type: "text" },
            { key: "rating", label: "★", type: "number" },
            { key: "notes", label: "Notes", type: "text", className: "min-w-[200px]" },
          ]}
        />
      )}
      {tab === "openings" && (
        <DataTable
          tableName="hr_job_openings"
          queryKey="hr_job_openings"
          fields={[
            { key: "title", label: "Title", type: "text", required: true },
            { key: "location", label: "Location", type: "text" },
            { key: "employment_type", label: "Type", type: "select", options: ["full_time","part_time","contractor","intern"] },
            { key: "status", label: "Status", type: "select", options: ["draft","open","on_hold","closed"] },
            { key: "salary_min", label: "Min $", type: "number" },
            { key: "salary_max", label: "Max $", type: "number" },
            { key: "description", label: "Description", type: "text", className: "min-w-[240px]" },
          ]}
        />
      )}
      {tab === "employees" && (
        <DataTable
          tableName="hr_employees"
          queryKey="hr_employees"
          fields={[
            { key: "full_name", label: "Name", type: "text", required: true },
            { key: "email", label: "Email", type: "text", required: true },
            { key: "title", label: "Title", type: "text" },
            { key: "employment_type", label: "Type", type: "select", options: ["full_time","part_time","contractor","intern"] },
            { key: "status", label: "Status", type: "select", options: ["active","on_leave","terminated"] },
            { key: "start_date", label: "Start", type: "date" },
            { key: "location", label: "Location", type: "text" },
            { key: "salary", label: "Salary", type: "number" },
          ]}
        />
      )}
      {tab === "departments" && (
        <DataTable
          tableName="hr_departments"
          queryKey="hr_departments"
          orderBy="name"
          ascending
          fields={[{ key: "name", label: "Name", type: "text", required: true }]}
        />
      )}
      {tab === "timeoff" && (
        <DataTable
          tableName="hr_time_off"
          queryKey="hr_time_off"
          orderBy="start_date"
          fields={[
            { key: "kind", label: "Kind", type: "select", options: ["vacation","sick","personal","other"] },
            { key: "start_date", label: "Start", type: "date", required: true },
            { key: "end_date", label: "End", type: "date", required: true },
            { key: "status", label: "Status", type: "select", options: ["pending","approved","rejected","canceled"] },
            { key: "reason", label: "Reason", type: "text", className: "min-w-[200px]" },
          ]}
        />
      )}
    </WorkspaceShell>
  );
}
