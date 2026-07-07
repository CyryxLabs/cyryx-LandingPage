import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { buildHead } from "@/components/cyryx/seo/seo";
import { WorkspaceShell, WorkspaceCard, WsButton, WsInput, WsSelect } from "@/components/cyryx/workspace/WorkspaceShell";
import { drawerStore } from "@/lib/drawer-store";

type Stage = { id: string; name: string; position: number; is_won: boolean; is_lost: boolean };
type Deal = {
  id: string;
  title: string;
  stage_id: string;
  value: number | string;
  currency: string;
  status: string;
  company_id: string | null;
  contact_id: string | null;
  pipeline_id: string;
  expected_close_date: string | null;
};

export const Route = createFileRoute("/_authenticated/workspace/pipeline")({
  head: () => {
    const h = buildHead({ title: "Pipeline · Cyryx", description: "Commercial pipeline", path: "/workspace/pipeline" });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: PipelinePage,
});

function PipelinePage() {
  const qc = useQueryClient();
  const stagesQ = useQuery({
    queryKey: ["crm_stages"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("crm_stages").select("*").order("position", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Stage[];
    },
  });
  const dealsQ = useQuery({
    queryKey: ["crm_deals"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("crm_deals").select("*").order("updated_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Deal[];
    },
  });
  const stages = stagesQ.data ?? [];
  const deals = dealsQ.data ?? [];

  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  async function addDeal(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || stages.length === 0) return;
    const first = stages[0];
    await (supabase as any).from("crm_deals").insert({
      title,
      value: Number(value) || 0,
      currency: "USD",
      pipeline_id: first ? (await (supabase as any).from("crm_pipelines").select("id").limit(1).single()).data?.id : null,
      stage_id: first.id,
    });
    setTitle(""); setValue("");
    qc.invalidateQueries({ queryKey: ["crm_deals"] });
  }

  async function moveStage(id: string, stage: Stage) {
    const status = stage.is_won ? "won" : stage.is_lost ? "lost" : "open";
    await (supabase as any).from("crm_deals").update({ stage_id: stage.id, status }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["crm_deals"] });
  }

  async function removeDeal(id: string) {
    if (!confirm("Delete deal?")) return;
    await (supabase as any).from("crm_deals").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["crm_deals"] });
  }

  const totalOpen = deals.filter((d) => d.status === "open").reduce((s, d) => s + Number(d.value ?? 0), 0);
  const totalWon = deals.filter((d) => d.status === "won").reduce((s, d) => s + Number(d.value ?? 0), 0);

  return (
    <WorkspaceShell
      title="Pipeline"
      subtitle={`${deals.length} deals · $${totalOpen.toLocaleString()} open · $${totalWon.toLocaleString()} won`}
    >
      <form onSubmit={addDeal} className="flex flex-wrap gap-2 mb-6">
        <WsInput placeholder="Deal title" value={title} onChange={(e) => setTitle(e.target.value)} required className="flex-1 min-w-[200px]" />
        <WsInput placeholder="Value (USD)" type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-32" />
        <WsButton type="submit" variant="primary">Add deal</WsButton>
      </form>

      {(stagesQ.isLoading || dealsQ.isLoading) && <p className="text-sm text-[var(--silver-dim)]">Loading…</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stages.map((stage) => {
          const rows = deals.filter((d) => d.stage_id === stage.id);
          const total = rows.reduce((s, d) => s + Number(d.value ?? 0), 0);
          return (
            <WorkspaceCard
              key={stage.id}
              className={`p-3 transition-colors ${dragOverId === stage.id ? "bg-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)] border-[var(--accent-glow)]" : ""}`}
            >
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOverId(stage.id); }}
                onDragLeave={() => setDragOverId((s) => (s === stage.id ? null : s))}
                onDrop={(e) => {
                  e.preventDefault();
                  const id = e.dataTransfer.getData("text/deal-id");
                  setDragOverId(null);
                  if (id) moveStage(id, stage);
                }}
              >
              <div className="flex items-center justify-between mb-3">
                <p className="hud-label text-[var(--accent-glow)]">{stage.name}</p>
                <span className="text-xs text-[var(--silver-dim)]">{rows.length} · ${total.toLocaleString()}</span>
              </div>
              <ul className="space-y-2">
                {rows.map((d) => (
                  <li
                    key={d.id}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/deal-id", d.id)}
                    className="rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)] p-2.5 bg-white/[0.02] cursor-grab active:cursor-grabbing"
                  >
                    <button
                      type="button"
                      onClick={() => drawerStore.open({ entity_type: "crm_deals", entity_id: d.id, label: d.title })}
                      className="font-medium text-sm text-left hover:text-[var(--accent-glow)] transition-colors"
                    >
                      {d.title}
                    </button>
                    <p className="text-xs text-[var(--silver-dim)]">
                      ${Number(d.value ?? 0).toLocaleString()} {d.currency}
                    </p>
                    <div className="mt-2 flex gap-1.5">
                      <WsSelect
                        value={d.stage_id}
                        onChange={(e) => {
                          const s = stages.find((x) => x.id === e.target.value);
                          if (s) moveStage(d.id, s);
                        }}
                        className="flex-1 h-7 text-xs"
                      >
                        {stages.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </WsSelect>
                      <button
                        onClick={() => removeDeal(d.id)}
                        className="text-xs text-[var(--silver-dim)] hover:text-red-400 px-2"
                        aria-label="Delete"
                      >×</button>
                    </div>
                  </li>
                ))}
                {rows.length === 0 && <li className="text-xs text-[var(--silver-dim)] italic px-1 py-6 text-center">Drop here</li>}
              </ul>
              </div>
            </WorkspaceCard>
          );
        })}
      </div>
    </WorkspaceShell>
  );
}
