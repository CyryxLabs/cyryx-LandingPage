import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { buildHead } from "@/components/cyryx/seo/seo";
import { WorkspaceShell, WorkspaceCard } from "@/components/cyryx/workspace/WorkspaceShell";
import { DataTable } from "@/components/cyryx/workspace/DataTable";

export const Route = createFileRoute("/_authenticated/workspace/marketing")({
  head: () => {
    const h = buildHead({ title: "Marketing · Cyryx", description: "Campaigns, channels and attribution", path: "/workspace/marketing" });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: MarketingPage,
});

const TABS = ["campaigns", "channels", "leads", "attribution"] as const;
type Tab = (typeof TABS)[number];

function MarketingPage() {
  const [tab, setTab] = useState<Tab>("campaigns");
  return (
    <WorkspaceShell title="Marketing" subtitle="Campaigns, channels and lead attribution">
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

      {tab === "campaigns" && (
        <DataTable
          tableName="mkt_campaigns"
          queryKey="mkt_campaigns"
          fields={[
            { key: "name", label: "Name", type: "text", required: true, className: "min-w-[200px]" },
            { key: "status", label: "Status", type: "select", options: ["planned","active","paused","done"] },
            { key: "start_at", label: "Start", type: "date" },
            { key: "end_at", label: "End", type: "date" },
            { key: "budget", label: "Budget", type: "number" },
            { key: "spend", label: "Spend", type: "number" },
            { key: "goal", label: "Goal", type: "text", className: "min-w-[180px]" },
            { key: "notes", label: "Notes", type: "text", className: "min-w-[200px]" },
          ]}
        />
      )}

      {tab === "channels" && (
        <DataTable
          tableName="mkt_channels"
          queryKey="mkt_channels"
          fields={[
            { key: "name", label: "Name", type: "text", required: true },
            { key: "kind", label: "Kind", type: "select", options: ["paid","organic","referral","outbound","event","partner"] },
            { key: "notes", label: "Notes", type: "text", className: "min-w-[240px]" },
          ]}
        />
      )}

      {tab === "leads" && (
        <DataTable
          tableName="mkt_leads"
          queryKey="mkt_leads"
          fields={[
            { key: "source", label: "Source", type: "text" },
            { key: "campaign_id", label: "Campaign ID", type: "text", className: "min-w-[180px]" },
            { key: "channel_id", label: "Channel ID", type: "text", className: "min-w-[180px]" },
            { key: "contact_id", label: "Contact ID", type: "text", className: "min-w-[180px]" },
            { key: "deal_id", label: "Deal ID", type: "text", className: "min-w-[180px]" },
            { key: "first_touch_at", label: "First touch", type: "date" },
            { key: "converted_at", label: "Converted", type: "date" },
            { key: "notes", label: "Notes", type: "text", className: "min-w-[200px]" },
          ]}
        />
      )}

      {tab === "attribution" && <AttributionTable />}
    </WorkspaceShell>
  );
}

function AttributionTable() {
  const { data = [], isLoading } = useQuery({
    queryKey: ["mkt_attribution_v"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("mkt_attribution_v")
        .select("*")
        .order("won_value", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v || 0);

  return (
    <WorkspaceCard>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-[var(--silver-dim)] border-b border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)]">
              <th className="px-3 py-2">Campaign</th>
              <th className="px-3 py-2">Channel</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Budget</th>
              <th className="px-3 py-2 text-right">Spend</th>
              <th className="px-3 py-2 text-right">Leads</th>
              <th className="px-3 py-2 text-right">Deals</th>
              <th className="px-3 py-2 text-right">Won</th>
              <th className="px-3 py-2 text-right">Pipeline</th>
              <th className="px-3 py-2 text-right">Won value</th>
              <th className="px-3 py-2 text-right">ROI</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={11} className="px-3 py-6 text-center text-xs text-[var(--silver-dim)]">Loading…</td></tr>
            )}
            {!isLoading && data.length === 0 && (
              <tr><td colSpan={11} className="px-3 py-8 text-center text-xs text-[var(--silver-dim)]">No campaigns yet.</td></tr>
            )}
            {data.map((r: any) => {
              const roi = r.spend > 0 ? ((Number(r.won_value) - Number(r.spend)) / Number(r.spend)) * 100 : null;
              return (
                <tr key={r.campaign_id} className="border-t border-[color-mix(in_oklab,var(--accent-glow)_8%,transparent)]">
                  <td className="px-3 py-2">{r.campaign_name}</td>
                  <td className="px-3 py-2 text-[var(--silver-dim)]">{r.channel_name ?? "—"}</td>
                  <td className="px-3 py-2 text-[var(--silver-dim)]">{r.status}</td>
                  <td className="px-3 py-2 text-right">{fmt(Number(r.budget))}</td>
                  <td className="px-3 py-2 text-right">{fmt(Number(r.spend))}</td>
                  <td className="px-3 py-2 text-right">{r.leads_count}</td>
                  <td className="px-3 py-2 text-right">{r.deals_count}</td>
                  <td className="px-3 py-2 text-right">{r.won_deals}</td>
                  <td className="px-3 py-2 text-right">{fmt(Number(r.pipeline_value))}</td>
                  <td className="px-3 py-2 text-right text-[var(--accent-glow)]">{fmt(Number(r.won_value))}</td>
                  <td className="px-3 py-2 text-right">
                    {roi === null ? "—" : `${roi.toFixed(0)}%`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </WorkspaceCard>
  );
}
