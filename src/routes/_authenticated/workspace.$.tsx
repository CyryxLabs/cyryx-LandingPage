import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildHead } from "@/components/cyryx/seo/seo";

export const Route = createFileRoute("/_authenticated/workspace/$")({
  head: () => {
    const h = buildHead({
      title: "Forbidden — Cyryx Labs",
      description: "This workspace route is not available.",
      path: "/workspace",
    });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  // The parent _authenticated gate already blocks unauthenticated users.
  // Any authenticated user reaching an unknown /workspace/* path gets 403,
  // not the generic 404, so invalid internal URLs are clearly rejected.
  component: WorkspaceForbidden,
});

function WorkspaceForbidden() {
  if (typeof document !== "undefined") {
    // Best-effort: signal 403 semantics to any monitoring that reads the title.
    document.title = "403 — Forbidden";
  }
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main
        id="main-content"
        role="main"
        aria-labelledby="wf-heading"
        className="mx-auto max-w-2xl px-5 pt-32 pb-24 lg:pt-44"
      >
        <HudLabel withDot className="text-[var(--accent-glow)]">
          Cyryx Labs · Workspace
        </HudLabel>
        <h1
          id="wf-heading"
          className="mt-4 font-display text-3xl font-semibold text-silver-gradient"
        >
          403 — Forbidden
        </h1>
        <p className="mt-4 text-sm text-[var(--silver-dim)]">
          This workspace route does not exist or you don&apos;t have access to it.
        </p>
        <div className="mt-8">
          <Link
            to="/workspace"
            className="cx-btn cx-liquid-glass inline-flex h-11 items-center justify-center rounded-md px-5 text-[var(--silver)] hud-label"
          >
            Back to workspace
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}