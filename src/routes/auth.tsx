import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildHead } from "@/components/cyryx/seo/seo";

export const Route = createFileRoute("/auth")({
  head: () =>
    buildHead({
      title: "Sign in — Cyryx Labs",
      description: "Admin sign-in for Cyryx Labs internal tools.",
      path: "/auth",
    }),
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
    setStatus({ kind: "loading" });
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return setStatus({ kind: "error", message: error.message });
    navigate({ to: "/workspace/careers" });
  }

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" className="mx-auto max-w-md px-5 pt-32 pb-24 lg:pt-44">
        <HudLabel withDot className="text-[var(--accent-glow)]">Cyryx Labs · Sign in</HudLabel>
        <h1 className="mt-4 font-display text-3xl font-semibold text-silver-gradient">
          Admin sign in
        </h1>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="hud-label text-[var(--silver)]">Email</span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 h-11 w-full rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_25%,transparent)] bg-[var(--onyx)] px-4 text-sm text-[var(--silver)]"
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
              className="mt-2 h-11 w-full rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_25%,transparent)] bg-[var(--onyx)] px-4 text-sm text-[var(--silver)]"
            />
          </label>
          <button
            type="submit"
            disabled={status.kind === "loading"}
            className="cx-btn cx-liquid-glass inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-[var(--silver)] hud-label disabled:opacity-60"
          >
            {status.kind === "loading" ? "Signing in…" : "Sign in"}
          </button>
          {status.kind === "error" && (
            <p role="alert" className="text-xs text-[color:oklch(0.72_0.16_25)]">
              {status.message}
            </p>
          )}
        </form>
      </main>
      <Footer />
    </div>
  );
}