import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { buildHead } from "@/components/cyryx/seo/seo";
import { WorkspaceShell, WorkspaceCard, WsSelect } from "@/components/cyryx/workspace/WorkspaceShell";
import { DataTable } from "@/components/cyryx/workspace/DataTable";
import { drawerStore } from "@/lib/drawer-store";
import { DeptDashboard } from "@/components/cyryx/workspace/DeptDashboard";

export const Route = createFileRoute("/_authenticated/workspace/dev")({
  head: () => {
    const h = buildHead({ title: "Development · Cyryx", description: "Projects, sprints & tasks", path: "/workspace/dev" });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: DevPage,
});

const TABS = ["dashboard", "board", "projects", "tasks", "sprints"] as const;
type Tab = (typeof TABS)[number];
const STATUSES = ["backlog", "todo", "in_progress", "in_review", "done", "canceled"] as const;
type Status = (typeof STATUSES)[number];

function DevPage() {
  const [tab, setTab] = useState<Tab>("dashboard");
  return (
    <WorkspaceShell title="Development" subtitle="Projects, sprints, tasks & kanban">
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
      {tab === "dashboard" && <DeptDashboard kind="dev" />}
      {tab === "board" && <TaskBoard />}
      {tab === "projects" && (
        <DataTable
          tableName="pm_projects"
          queryKey="pm_projects"
          fields={[
            { key: "name", label: "Name", type: "text", required: true },
            { key: "key", label: "Key", type: "text", required: true },
            { key: "status", label: "Status", type: "select", options: ["active","archived","on_hold"] },
            { key: "color", label: "Color", type: "text" },
            { key: "description", label: "Description", type: "text", className: "min-w-[260px]" },
          ]}
        />
      )}
      {tab === "tasks" && (
        <DataTable
          tableName="pm_tasks"
          queryKey="pm_tasks"
          fields={[
            { key: "title", label: "Title", type: "text", required: true, className: "min-w-[240px]" },
            { key: "type", label: "Type", type: "select", options: ["task","bug","feature","story","epic"] },
            { key: "status", label: "Status", type: "select", options: [...STATUSES] },
            { key: "priority", label: "Priority", type: "select", options: ["low","medium","high","urgent"] },
            { key: "estimate_hours", label: "Est h", type: "number" },
            { key: "spent_hours", label: "Spent h", type: "number" },
            { key: "due_at", label: "Due", type: "date" },
          ]}
        />
      )}
      {tab === "sprints" && (
        <DataTable
          tableName="pm_sprints"
          queryKey="pm_sprints"
          fields={[
            { key: "name", label: "Name", type: "text", required: true },
            { key: "status", label: "Status", type: "select", options: ["planned","active","completed"] },
            { key: "start_at", label: "Start", type: "date" },
            { key: "end_at", label: "End", type: "date" },
            { key: "goal", label: "Goal", type: "text", className: "min-w-[240px]" },
          ]}
        />
      )}
    </WorkspaceShell>
  );
}

type Task = { id: string; title: string; status: Status; priority: string; project_id: string; assignee_id: string | null };
type Project = { id: string; name: string; key: string };

function TaskBoard() {
  const qc = useQueryClient();
  const [projectId, setProjectId] = useState<string>("");

  const projectsQ = useQuery({
    queryKey: ["pm_projects", "list"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("pm_projects").select("id,name,key").eq("status", "active").order("name");
      if (error) throw error;
      return (data ?? []) as Project[];
    },
  });
  const projects = projectsQ.data ?? [];
  const activeId = projectId || projects[0]?.id || "";

  const tasksQ = useQuery({
    queryKey: ["pm_tasks", "board", activeId],
    enabled: !!activeId,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("pm_tasks").select("id,title,status,priority,project_id,assignee_id")
        .eq("project_id", activeId).order("position", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Task[];
    },
  });
  const tasks = tasksQ.data ?? [];

  async function move(id: string, status: Status) {
    await (supabase as any).from("pm_tasks").update({ status }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["pm_tasks", "board", activeId] });
  }

  if (projects.length === 0) {
    return <p className="text-sm text-[var(--silver-dim)]">No active projects yet — create one in the Projects tab.</p>;
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <label className="hud-label text-[11px] text-[var(--silver-dim)]">Project</label>
        <WsSelect value={activeId} onChange={(e) => setProjectId(e.target.value)}>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.key})</option>)}
        </WsSelect>
      </div>
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {STATUSES.map((s) => {
          const rows = tasks.filter((t) => t.status === s);
          return (
            <WorkspaceCard key={s} className="p-3">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const id = e.dataTransfer.getData("text/task-id");
                  if (id) move(id, s);
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="hud-label text-[var(--accent-glow)] text-[11px]">{s.replace("_", " ")}</p>
                  <span className="text-xs text-[var(--silver-dim)]">{rows.length}</span>
                </div>
                <ul className="space-y-2 min-h-[80px]">
                  {rows.map((t) => (
                    <li
                      key={t.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("text/task-id", t.id)}
                      className="rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)] p-2.5 bg-white/[0.02] cursor-grab"
                    >
                      <button
                        type="button"
                        onClick={() => drawerStore.open({ entity_type: "pm_tasks", entity_id: t.id, label: t.title })}
                        className="text-sm text-left hover:text-[var(--accent-glow)] transition-colors"
                      >
                        {t.title}
                      </button>
                      <p className="text-[11px] text-[var(--silver-dim)] mt-1">{t.priority}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </WorkspaceCard>
          );
        })}
      </div>
    </>
  );
}
