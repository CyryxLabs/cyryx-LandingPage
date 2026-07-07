import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { buildHead } from "@/components/cyryx/seo/seo";
import { WorkspaceShell, WorkspaceCard, WsButton, WsInput, WsSelect } from "@/components/cyryx/workspace/WorkspaceShell";

const STAGES = ["lead", "qualified", "proposal", "negotiation", "won", "lost"] as const;
type Stage = (typeof STAGES)[number];

export const Route = createFileRoute("/_authenticated/workspace/pipeline")({
  head: () => {
    const h = buildHead({ title: "Pipeline · Cyryx", description: "Commercial pipeline", path: "/workspace/pipeline" });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: PipelinePage,
});

function PipelinePage() {
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ["ws_deals"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ws_deals").select("*").order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [value, setValue] = useState("");

  async function addDeal(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await supabase.from("ws_deals").insert({ title, company: company || null, value_usd: Number(value) || 0 });
    setTitle(""); setCompany(""); setValue("");
    qc.invalidateQueries({ queryKey: ["ws_deals"] });
  }

  async function moveStage(id: string, stage: Stage) {
    await supabase.from("ws_deals").update({ stage }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["ws_deals"] });
  }

  async function removeDeal(id: string) {
    if (!confirm("Delete deal?")) return;
    await supabase.from("ws_deals").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["ws_deals"] });
  }

  const totalOpen = data.filter((d) => !["won", "lost"].includes(d.stage)).reduce((s, d) => s + Number(d.value_usd ?? 0), 0);
  const totalWon = data.filter((d) => d.stage === "won").reduce((s, d) => s + Number(d.value_usd ?? 0), 0);

  return (
    <WorkspaceShell
      title="Pipeline"
      subtitle={`${data.length} deals · $${totalOpen.toLocaleString()} open · $${totalWon.toLocaleString()} won`}
    >
      <form onSubmit={addDeal} className="flex flex-wrap gap-2 mb-6">
        <WsInput placeholder="Deal title" value={title} onChange={(e) => setTitle(e.target.value)} required className="flex-1 min-w-[200px]" />
        <WsInput placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} className="min-w-[160px]" />
        <WsInput placeholder="Value (USD)" type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-32" />
        <WsButton type="submit" variant="primary">Add deal</WsButton>
      </form>

      {isLoading && <p className="text-sm text-[var(--silver-dim)]">Loading…</p>}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {STAGES.map((stage) => {
          const rows = data.filter((d) => d.stage === stage);
          const total = rows.reduce((s, d) => s + Number(d.value_usd ?? 0), 0);
          return (
            <WorkspaceCard key={stage} className="p-3">
              <div className="flex items-center justify-between mb-3">
                <p className="hud-label text-[var(--accent-glow)]">{stage}</p>
                <span className="text-xs text-[var(--silver-dim)]">{rows.length} · ${total.toLocaleString()}</span>
              </div>
              <ul className="space-y-2">
                {rows.map((d) => (
                  <li key={d.id} className="rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)] p-2.5 bg-white/[0.02]">
                    <p className="font-medium text-sm">{d.title}</p>
                    <p className="text-xs text-[var(--silver-dim)]">
                      {d.company || "—"} · ${Number(d.value_usd ?? 0).toLocaleString()}
                    </p>
                    <div className="mt-2 flex gap-1.5">
                      <WsSelect value={d.stage} onChange={(e) => moveStage(d.id, e.target.value as Stage)} className="flex-1 h-7 text-xs">
                        {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </WsSelect>
                      <button
                        onClick={() => removeDeal(d.id)}
                        className="text-xs text-[var(--silver-dim)] hover:text-red-400 px-2"
                        aria-label="Delete"
                      >×</button>
                    </div>
                  </li>
                ))}
                {rows.length === 0 && <li className="text-xs text-[var(--silver-dim)] italic px-1">Empty</li>}
              </ul>
            </WorkspaceCard>
          );
        })}
      </div>
    </WorkspaceShell>
  );
}
