import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type State =
  | { kind: "loading" }
  | { kind: "ready" }
  | { kind: "done" }
  | { kind: "already" }
  | { kind: "invalid" };

function UnsubscribePage() {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [token, setToken] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token") ?? "";
    setToken(t);
    if (!t) {
      setState({ kind: "invalid" });
      return;
    }
    fetch(`/email/unsubscribe?token=${encodeURIComponent(t)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.valid) setState({ kind: "ready" });
        else if (d.reason === "already_unsubscribed") setState({ kind: "already" });
        else setState({ kind: "invalid" });
      })
      .catch(() => setState({ kind: "invalid" }));
  }, []);

  async function confirm() {
    setSubmitting(true);
    try {
      const r = await fetch("/email/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const d = await r.json();
      if (d.success) setState({ kind: "done" });
      else if (d.reason === "already_unsubscribed") setState({ kind: "already" });
      else setState({ kind: "invalid" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center px-4 py-16 bg-[var(--onyx)] text-[var(--silver)]">
      <div className="w-full max-w-md rounded-lg border border-[color-mix(in_oklab,var(--silver)_14%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_55%,transparent)] p-7">
        <p className="hud-label text-[var(--accent-glow)]">CYRYX LABS</p>
        <h1 className="mt-3 font-display text-2xl font-semibold uppercase">
          {state.kind === "done"
            ? "You're unsubscribed"
            : state.kind === "already"
              ? "Already unsubscribed"
              : state.kind === "invalid"
                ? "Invalid or expired link"
                : "Unsubscribe from updates"}
        </h1>
        <p className="mt-3 text-sm text-[var(--silver-dim)]">
          {state.kind === "ready" &&
            "Click confirm to stop receiving emails from Cyryx Labs."}
          {state.kind === "done" &&
            "You will no longer receive emails from Cyryx Labs. You can subscribe again any time."}
          {state.kind === "already" &&
            "This address is already unsubscribed — no further action needed."}
          {state.kind === "invalid" &&
            "This link is no longer valid. If you keep receiving unwanted emails, contact privacy@cyryxlabs.com."}
          {state.kind === "loading" && "Verifying your link…"}
        </p>
        {state.kind === "ready" && (
          <button
            disabled={submitting}
            onClick={confirm}
            className="cx-btn cx-cta cx-cta-primary mt-6 inline-flex h-11 w-full items-center justify-center rounded-md px-5 hud-label font-semibold text-[var(--accent-glow)]"
          >
            {submitting ? "Processing…" : "Confirm unsubscribe"}
          </button>
        )}
        <p className="mt-6 text-[11px] text-[var(--silver-dim)]">
          <a href="/" className="underline underline-offset-4 hover:text-[var(--accent-glow)]">
            Return to cyryxlabs.com
          </a>
        </p>
      </div>
    </main>
  );
}

export const Route = createFileRoute("/unsubscribe")({
  head: () => ({
    meta: [
      { title: "Unsubscribe — Cyryx Labs" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: UnsubscribePage,
});