import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { BackgroundMonolith } from "@/components/cyryx/primitives/BackgroundMonolith";
import { buildHead } from "@/components/cyryx/seo/seo";

export const Route = createFileRoute("/auth")({
  head: () => {
    const h = buildHead({
      title: "Sign in — Cyryx Labs",
      description: "Sign-in for Cyryx Labs internal tools.",
      path: "/auth",
    });
    return { ...h, meta: [...h.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{ kind: "idle" | "loading" | "error"; message?: string }>({
    kind: "idle",
  });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/workspace/careers" });
    });
  }, [navigate]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!normalized.endsWith("@cyryxlabs.com")) {
      return setStatus({
        kind: "error",
        message: "Access restricted to @cyryxlabs.com accounts.",
      });
    }
    setStatus({ kind: "loading" });
    const { error } = await supabase.auth.signInWithPassword({ email: normalized, password });
    if (error) return setStatus({ kind: "error", message: error.message });
    navigate({ to: "/workspace/careers" });
  }

  return (
    <div className="dark relative min-h-dvh overflow-hidden bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <BackgroundMonolith />
      {/* Ambient accent glows to echo the landing hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(60% 45% at 50% 30%, color-mix(in oklab, var(--accent-glow) 12%, transparent) 0%, transparent 70%), radial-gradient(80% 60% at 50% 100%, color-mix(in oklab, var(--accent-glow) 8%, transparent) 0%, transparent 70%)",
        }}
      />
      <main
        id="main-content"
        className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col items-center justify-center px-5 pt-28 pb-20 lg:pt-36"
      >
        <div className="w-full max-w-md">
          <div className="text-center">
            <HudLabel withDot className="text-[var(--accent-glow)]">
              Cyryx Labs · Secure workspace
            </HudLabel>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold text-silver-gradient">
              Enter the workspace
            </h1>
            <p className="mt-3 text-sm text-[var(--silver-dim)]">
              Authorized personnel only. All access is logged and auditable.
            </p>
          </div>

          <div
            className="cx-liquid-glass mt-10 rounded-xl border border-[color-mix(in_oklab,var(--accent-glow)_20%,transparent)] p-6 sm:p-8 backdrop-blur-md"
            style={{
              boxShadow:
                "0 0 0 1px color-mix(in oklab, var(--accent-glow) 8%, transparent), 0 30px 80px -40px rgba(0,230,208,0.25)",
            }}
          >
            <form onSubmit={onSubmit} className="space-y-4">
              <label className="block">
                <span className="hud-label text-[var(--silver)]">Email</span>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_25%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_85%,transparent)] px-4 text-sm text-[var(--silver)] focus:outline-none focus:border-[var(--accent-glow)]"
                />
              </label>
              <label className="block">
                <span className="hud-label text-[var(--silver)]">Password</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_25%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_85%,transparent)] px-4 text-sm text-[var(--silver)] focus:outline-none focus:border-[var(--accent-glow)]"
                />
              </label>
              <button
                type="submit"
                disabled={status.kind === "loading"}
                className="cx-btn cx-liquid-glass inline-flex h-11 w-full items-center justify-center gap-2 rounded-md px-5 text-[var(--silver)] hud-label disabled:opacity-60"
              >
                {status.kind === "loading" ? "Signing in…" : "Sign in"}
              </button>
              {status.kind === "error" && (
                <p role="alert" className="text-xs text-[color:oklch(0.72_0.16_25)]">
                  {status.message}
                </p>
              )}
            </form>
          </div>

          <p className="mt-6 text-center text-[11px] tracking-widest uppercase text-[var(--silver-dim)]">
            workspace.cyryxlabs.com
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}