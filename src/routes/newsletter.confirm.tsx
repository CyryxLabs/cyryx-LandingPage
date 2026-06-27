import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type State = "loading" | "ok" | "already" | "expired" | "invalid";

function ConfirmPage() {
  const [state, setState] = useState<State>("loading");
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("token") ?? "";
    if (!t) {
      setState("invalid");
      return;
    }
    fetch(`/api/public/newsletter/confirm?token=${encodeURIComponent(t)}`)
      .then(async (r) => {
        const d = await r.json();
        if (r.ok && d.ok) setState(d.already ? "already" : "ok");
        else if (d.reason === "expired") setState("expired");
        else setState("invalid");
      })
      .catch(() => setState("invalid"));
  }, []);

  const title = {
    loading: "Confirming…",
    ok: "Subscription confirmed",
    already: "Already confirmed",
    expired: "Link expired",
    invalid: "Invalid link",
  }[state];

  const body = {
    loading: "Hang tight — we're validating your confirmation link.",
    ok: "You're in. We'll send updates only when there's something signal-grade to share.",
    already: "This email is already subscribed — no further action needed.",
    expired: "This link has expired. Re-subscribe from the footer of cyryxlabs.com to receive a new one.",
    invalid: "This link is no longer valid. Re-subscribe from cyryxlabs.com if you'd like to receive updates.",
  }[state];

  return (
    <main className="min-h-screen grid place-items-center px-4 py-16 bg-[var(--onyx)] text-[var(--silver)]">
      <div className="w-full max-w-md rounded-lg border border-[color-mix(in_oklab,var(--silver)_14%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_55%,transparent)] p-7">
        <p className="hud-label text-[var(--accent-glow)]">CYRYX LABS</p>
        <h1 className="mt-3 font-display text-2xl font-semibold uppercase">{title}</h1>
        <p className="mt-3 text-sm text-[var(--silver-dim)]">{body}</p>
        <p className="mt-6 text-[11px] text-[var(--silver-dim)]">
          <a href="/" className="underline underline-offset-4 hover:text-[var(--accent-glow)]">
            Return to cyryxlabs.com
          </a>
        </p>
      </div>
    </main>
  );
}

export const Route = createFileRoute("/newsletter/confirm")({
  head: () => ({
    meta: [
      { title: "Confirm subscription — Cyryx Labs" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: ConfirmPage,
});