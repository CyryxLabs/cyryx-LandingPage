import { createFileRoute } from "@tanstack/react-router";
import { buildHead } from "@/components/cyryx/seo/seo";
import { WorkspaceShell, WorkspaceCard } from "@/components/cyryx/workspace/WorkspaceShell";

export const Route = createFileRoute("/_authenticated/workspace/marketing")({
  head: () => {
    const h = buildHead({ title: "Marketing · Cyryx", description: "Marketing module (next phase)", path: "/workspace/marketing" });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: () => (
    <WorkspaceShell title="Marketing" subtitle="Campaigns, spend and attribution (next phase)">
      <WorkspaceCard className="p-8 text-center">
        <p className="hud-label text-[var(--accent-glow)] mb-2">Phase 2</p>
        <p className="text-[var(--silver-dim)] max-w-md mx-auto">
          Campaigns, channels and lead attribution are being built next. Newsletter and CTA analytics remain available on the Overview tab.
        </p>
      </WorkspaceCard>
    </WorkspaceShell>
  ),
});
