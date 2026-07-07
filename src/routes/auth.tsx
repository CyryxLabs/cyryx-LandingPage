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
  // Preserve workspace search params (?w, ?tab) through the auth round-trip.
  function afterAuthTarget(): { to: "/workspace"; search: Record<string, string> } | { to: "/workspace/careers" } {
    if (typeof window === "undefined") return { to: "/workspace/careers" };
    const sp = new URLSearchParams(window.location.search);
    const w = sp.get("w");
    const tab = sp.get("tab");
    if (w || tab) {
      const search: Record<string, string> = {};
      if (w) search.w = w;
      if (tab) search.tab = tab;
      return { to: "/workspace", search };
    }
    return { to: "/workspace/careers" };
  }
  function goPostAuth(replace = false) {
    const target = afterAuthTarget();
    navigate({ ...(target as any), replace });
  }
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<{
    kind: "idle" | "loading" | "error" | "info" | "success";
    message?: string;
  }>({ kind: "idle" });
  // Prevent any flash of the sign-in form (and any redirect flash to /workspace)
  // while we resolve the current session.
  const [sessionChecked, setSessionChecked] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      if (data.user) {
        goPostAuth(true);
        return;
      }
      setSessionChecked(true);
    });
    // Detect confirmation-link return (Supabase parses the URL hash and
    // creates a session automatically → SIGNED_IN fires).
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (/type=(signup|magiclink|recovery|invite)/.test(hash)) {
      setStatus({ kind: "info", message: "Confirming your email…" });
    } else if (/error=/.test(hash) || /error_description=/.test(hash)) {
      const desc = new URLSearchParams(hash.replace(/^#/, "")).get("error_description");
      setStatus({
        kind: "error",
        message: desc ? decodeURIComponent(desc) : "Email verification failed. Request a new link.",
      });
    }
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        goPostAuth(true);
      }
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const DOMAIN_ERROR =
    "Invalid domain. Please use your @cyryxlabs.com company email to sign in.";
  const HELP_MAILTO =
    "mailto:it@cyryxlabs.com?subject=Workspace%20access%20request&body=I%20need%20access%20to%20the%20Cyryx%20Labs%20workspace.";

  function isCyryxEmail(value: string) {
    return /^[^\s@]+@cyryxlabs\.com$/i.test(value.trim());
  }

  async function recordBlockedAttempt(email: string, reason: "sign_in" | "password_recovery") {
    try {
      await fetch("/api/public/auth/domain-block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, reason }),
        keepalive: true,
      });
    } catch {
      /* best-effort audit; do not surface network errors to the user */
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!isCyryxEmail(normalized)) {
      console.warn("[auth] blocked sign-in: invalid domain", { email: normalized });
      void recordBlockedAttempt(normalized, "sign_in");
      return setStatus({ kind: "error", message: DOMAIN_ERROR });
    }
    setStatus({ kind: "loading" });
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: normalized,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth` },
      });
      if (error) return setStatus({ kind: "error", message: error.message });
      if (!data.session) {
        return setStatus({
          kind: "info",
          message: `Confirmation email sent to ${normalized}. Open the link from that inbox — this page will unlock automatically once verified.`,
        });
      }
      goPostAuth(false);
      return;
    }
    const { error } = await supabase.auth.signInWithPassword({ email: normalized, password });
    if (error) {
      const isUnconfirmed = /confirm|not.*confirmed|email.*not/i.test(error.message);
      return setStatus({
        kind: "error",
        message: isUnconfirmed
          ? "Your email isn't confirmed yet. Check your inbox for the verification link, or click 'Forgot password?' to resend."
          : error.message,
      });
    }
    goPostAuth(false);
  }

  async function onForgotPassword() {
    const normalized = email.trim().toLowerCase();
    if (!isCyryxEmail(normalized)) {
      console.warn("[auth] blocked password recovery: invalid domain", { email: normalized });
      void recordBlockedAttempt(normalized, "password_recovery");
      return setStatus({ kind: "error", message: DOMAIN_ERROR });
    }
    setStatus({ kind: "loading" });
    // Route through the server so the domain rule is enforced even when the
    // client is bypassed (crafted request / direct hit to the endpoint).
    const res = await fetch("/api/public/auth/recover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalized }),
    });
    if (!res.ok) {
      const payload = (await res.json().catch(() => ({}))) as { error?: string };
      return setStatus({ kind: "error", message: payload.error ?? DOMAIN_ERROR });
    }
    setStatus({ kind: "error", message: "If that account exists, a reset link is on its way." });
  }

  if (!sessionChecked) {
    return (
      <div
        data-testid="auth-session-check"
        className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver-dim)] flex items-center justify-center text-xs tracking-widest uppercase"
      >
        Checking session…
      </div>
    );
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
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
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
                {status.kind === "loading"
                  ? mode === "signup"
                    ? "Creating account…"
                    : "Signing in…"
                  : mode === "signup"
                    ? "Create account"
                    : "Sign in"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatus({ kind: "idle" });
                  setMode((m) => (m === "signin" ? "signup" : "signin"));
                }}
                className="block w-full text-center text-[11px] tracking-widest uppercase text-[var(--silver-dim)] hover:text-[var(--accent-glow)]"
              >
                {mode === "signin"
                  ? "Need an account? Sign up"
                  : "Have an account? Sign in"}
              </button>
              <button
                type="button"
                onClick={onForgotPassword}
                className="block w-full text-center text-[11px] tracking-widest uppercase text-[var(--silver-dim)] hover:text-[var(--accent-glow)]"
              >
                Forgot password?
              </button>
              {(status.kind === "error" ||
                status.kind === "info" ||
                status.kind === "success") && (
                <div
                  role={status.kind === "error" ? "alert" : "status"}
                  className={`text-xs space-y-1 ${
                    status.kind === "error"
                      ? "text-[color:oklch(0.72_0.16_25)]"
                      : status.kind === "success"
                        ? "text-emerald-400"
                        : "text-[var(--accent-glow)]"
                  }`}
                >
                  <p>{status.message}</p>
                  {status.message?.startsWith("Invalid domain") && (
                    <p className="text-[var(--silver-dim)]">
                      Need access?{" "}
                      <a
                        href={HELP_MAILTO}
                        className="underline hover:text-[var(--accent-glow)]"
                      >
                        Contact IT
                      </a>
                      .
                    </p>
                  )}
                </div>
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