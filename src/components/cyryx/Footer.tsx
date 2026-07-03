import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { CyryxWordmark } from "./primitives/CyryxMark";
import { HudLabel } from "./primitives/HudLabel";

const COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/company" },
      { label: "Products", href: "/products" },
      { label: "Solutions", href: "/solutions" },
      { label: "Applied AI Lab", href: "/research" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "MAAX Studio", href: "/products/maax-studio" },
      { label: "Applied AI Lab", href: "/research" },
      { label: "Solutions", href: "/solutions" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Research", href: "/research" },
      { label: "Early Access", href: "/contact" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    if (!consent) {
      setErrorMsg("Please accept the Privacy Policy to subscribe.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/public/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true, website }),
      });
      if (!res.ok) throw new Error("network");
      setStatus("sent");
      setEmail("");
      setConsent(false);
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again later.");
    }
  }

  return (
    <footer className="relative border-t border-[color-mix(in_oklab,var(--accent-glow)_18%,transparent)] bg-[var(--graphite)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-12 pb-[max(env(safe-area-inset-bottom),3rem)] lg:py-20">
        <div className="cx-stagger grid gap-10 lg:grid-cols-[1.3fr_2.2fr_1.5fr]">
          {/* Brand */}
          <div className="cx-stagger-item">
            <CyryxWordmark className="h-10" />
            <p className="mt-5 text-sm leading-relaxed text-[var(--silver-dim)] max-w-xs">
              AI products, execution systems, and applied research.
            </p>
            <p className="mt-6 font-display text-sm tracking-[0.32em] uppercase text-[var(--silver-dim)]">
              Built to achieve. <span className="text-[var(--accent-glow)]">Not just to generate.</span>
            </p>
            <p className="mt-8 text-xs text-[var(--silver-dim)]">
              &copy; 2026 Cyryx Labs. All rights reserved.
            </p>
          </div>

          {/* Link columns */}
          <div className="cx-stagger-item grid grid-cols-1 sm:grid-cols-3 gap-8">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <HudLabel>{col.title}</HudLabel>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-sm text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="cx-stagger-item">
            <HudLabel>Stay Connected</HudLabel>
            <p className="mt-4 text-sm text-[var(--silver-dim)]">
              Get updates on our latest systems, research, and launches.
            </p>
            {status === "sent" ? (
              <div className="mt-5 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)] bg-[color-mix(in_oklab,var(--accent-glow)_8%,transparent)] p-3 text-sm text-[var(--silver)]">
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-[var(--accent-glow)]" />
                  <span>
                    Check your inbox — we sent a confirmation link to finish your subscription (GDPR/LGPD double opt-in).
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubscribe} className="mt-5 flex flex-col gap-2.5" noValidate>
                {/* Honeypot */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="nl-website">Leave empty</label>
                  <input id="nl-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>
                <div className="flex items-stretch gap-0 rounded-md border border-[color-mix(in_oklab,var(--silver)_14%,transparent)] focus-within:border-[var(--accent-glow)] focus-within:shadow-[var(--shadow-glow-teal)] transition-all">
                  <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 min-w-0 bg-transparent px-4 py-3 text-sm text-[var(--silver)] placeholder:text-[var(--silver-dim)] outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    disabled={status === "loading" || !consent || !email}
                    className="grid w-12 place-items-center bg-[color-mix(in_oklab,var(--accent-glow)_14%,transparent)] hover:bg-[var(--accent-glow)] hover:text-[var(--onyx)] text-[var(--accent-glow)] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>
                <label htmlFor="nl-consent" className="flex items-start gap-2 text-[11px] leading-relaxed text-[var(--silver-dim)]">
                  <input
                    id="nl-consent"
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer accent-[var(--accent-glow)]"
                  />
                  <span>
                    I agree to receive emails from Cyryx Labs and accept the{" "}
                    <a href="/privacy" className="underline underline-offset-2 hover:text-[var(--accent-glow)]">Privacy Policy</a>.
                    Unsubscribe any time.
                  </span>
                </label>
                {errorMsg && (
                  <p role="alert" className="text-[11px] text-[color:var(--destructive,#ef4444)]">{errorMsg}</p>
                )}
              </form>
            )}

          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[color-mix(in_oklab,var(--silver)_8%,transparent)] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <span className="hud-label text-[var(--silver-dim)]">
              Cyryx Labs — AI products and execution systems for the agentic era.
            </span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="/privacy" className="hud-label text-[var(--silver-dim)] hover:text-[var(--silver)] transition">
              Privacy Policy
            </a>
            <a href="/terms" className="hud-label text-[var(--silver-dim)] hover:text-[var(--silver)] transition">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}