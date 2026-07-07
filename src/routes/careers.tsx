import { createFileRoute, Link } from "@tanstack/react-router";
import { useId, useState, type FormEvent } from "react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { ArrowRight } from "lucide-react";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { CONTACT_EMAIL } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";

const PATH = "/careers";
const TITLE = "Careers — Cyryx Labs Talent Network";
const DESC =
  "Cyryx Labs is not actively hiring right now. Join our talent network to hear first when we open roles across applied research, product engineering, and agentic runtime.";
const CAREERS_EMAIL = "careers@cyryxlabs.com";
const TALENT_NETWORK_MAILTO = `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(
  "Talent network — introduction",
)}&body=${encodeURIComponent(
  [
    "Hi Cyryx team,",
    "",
    "I'd like to join your talent network for future roles.",
    "",
    "• Name:",
    "• Location / time zone:",
    "• Area of interest (applied AI, product engineering, research, solutions):",
    "• LinkedIn / GitHub / portfolio:",
    "• Short intro:",
    "",
    "Thanks,",
  ].join("\n"),
)}`;

const FAQ: { q: string; a: string }[] = [
  {
    q: "Are you hiring right now?",
    a: "Not actively. Cyryx Labs is a small, senior team and we open roles deliberately as the work requires it. When we do open a role, talent-network members hear first.",
  },
  {
    q: "When will new roles open?",
    a: "We expect to open the next roles across applied AI, product engineering, research, and solutions over the coming quarters. There is no fixed calendar — we hire against real work, not headcount targets.",
  },
  {
    q: "How will I be contacted when a relevant role opens?",
    a: "You'll receive an email from careers@cyryxlabs.com with the role brief and a short intake. Only roles that match the interests you shared will be sent to you — no newsletter, no bulk mail.",
  },
  {
    q: "Can I still send my CV or portfolio?",
    a: "Yes. Email careers@cyryxlabs.com with a short intro, your location / time zone, area of interest, and links to your work. We keep it on file for future openings.",
  },
];

export const Route = createFileRoute("/careers")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Careers", path: PATH },
      ]),
    ]),
  component: CareersPage,
});

function CareersPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" className="relative">
        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pt-32 pb-16 lg:pt-44">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--silver-dim)]">
            <Link to="/" className="hover:text-[var(--accent-glow)]">Home</Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-[var(--silver)]">Careers</span>
          </nav>
          <HudLabel withDot className="mt-6 text-[var(--accent-glow)]">
            Cyryx Labs · Careers · Talent network
          </HudLabel>
          <h1 className="mt-4 max-w-3xl font-display text-[40px] sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-[-0.02em] text-silver-gradient">
            Build the agentic era with us.
          </h1>
          <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]">
            We are a small, senior team shipping governed AI execution systems
            for production. Remote-first, high-agency, engineering-led.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-24 lg:pb-32">
          <HudLabel className="text-[var(--accent-glow)]">Open roles</HudLabel>
          <div className="mt-6 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_25%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_60%,transparent)] p-8 backdrop-blur-sm">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--silver)]">
              No open roles right now.
            </h2>
            <p className="mt-3 max-w-2xl text-sm lg:text-base leading-relaxed text-[var(--silver-dim)]">
              Cyryx Labs is not actively hiring at the moment. New positions
              across applied AI, product engineering, research, and solutions
              will open as the team grows.
            </p>
            <p className="mt-3 max-w-2xl text-sm lg:text-base leading-relaxed text-[var(--silver-dim)]">
              Join our talent network and we&apos;ll reach out first when a
              relevant role opens.
            </p>

            <TalentNetworkForm />

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={TALENT_NETWORK_MAILTO}
                onClick={() =>
                  trackCta({ cta: "careers_talent_network", section: "careers", href: TALENT_NETWORK_MAILTO })
                }
                className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors px-3 h-11"
              >
                Prefer email? Send a full intro
                <ArrowRight className="h-3.5 w-3.5 text-[var(--accent-glow)]" />
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Careers inquiry")}`}
                onClick={() =>
                  trackCta({ cta: "careers_email", section: "careers", href: `mailto:${CONTACT_EMAIL}` })
                }
                className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors px-3 h-11"
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="careers-faq-heading"
          className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-24 lg:pb-32"
        >
          <HudLabel className="text-[var(--accent-glow)]">Careers FAQ</HudLabel>
          <h2
            id="careers-faq-heading"
            className="mt-4 font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[var(--silver)]"
          >
            Hiring timeline &amp; how we&apos;ll reach out.
          </h2>
          <dl className="mt-8 divide-y divide-[color-mix(in_oklab,var(--accent-glow)_18%,transparent)] border-y border-[color-mix(in_oklab,var(--accent-glow)_18%,transparent)]">
            {FAQ.map((item) => (
              <div key={item.q} className="grid gap-2 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-10">
                <dt className="font-display text-lg font-medium text-[var(--silver)]">{item.q}</dt>
                <dd className="text-sm lg:text-base leading-relaxed text-[var(--silver-dim)]">{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <Footer />
    </div>
  );
}

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string }
  | { status: "success" };

function TalentNetworkForm() {
  const emailId = useId();
  const consentId = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<FormState>({ status: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !consent) {
      setState({ status: "error", message: "Please enter your email and confirm consent." });
      return;
    }
    setState({ status: "submitting" });
    trackCta({ cta: "talent_network_signup", section: "careers" });
    try {
      const res = await fetch("/api/public/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true, website }),
      });
      if (!res.ok) throw new Error("Request failed");
      setState({ status: "success" });
      setEmail("");
      setConsent(false);
    } catch {
      setState({
        status: "error",
        message: "We couldn't submit that. Please try again or email careers@cyryxlabs.com.",
      });
    }
  }

  if (state.status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mt-8 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)] bg-[color-mix(in_oklab,var(--accent-glow)_8%,transparent)] p-6"
      >
        <div className="hud-label text-[var(--accent-glow)]">You&apos;re on the list</div>
        <p className="mt-2 text-sm lg:text-base text-[var(--silver)]">
          Check your inbox to confirm. We&apos;ll reach out from{" "}
          <span className="text-[var(--accent-glow)]">{CAREERS_EMAIL}</span> when a role that
          fits opens up.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 max-w-xl">
      <label htmlFor={emailId} className="hud-label text-[var(--silver)]">
        Join the talent network
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          id={emailId}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="flex-1 h-11 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_25%,transparent)] bg-[var(--onyx)] px-4 text-sm text-[var(--silver)] placeholder:text-[var(--silver-dim)] focus:outline-none focus:border-[var(--accent-glow)]"
        />
        <button
          type="submit"
          disabled={state.status === "submitting"}
          className="cx-btn cx-liquid-glass inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label disabled:opacity-60"
        >
          {state.status === "submitting" ? "Joining…" : "Join"}
          <ArrowRight className="h-3.5 w-3.5 text-[var(--accent-glow)]" />
        </button>
      </div>
      {/* Honeypot */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-0 w-0 overflow-hidden">
        <label htmlFor="cx-website">Website</label>
        <input
          id="cx-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div className="mt-4 flex items-start gap-2">
        <input
          id={consentId}
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)] bg-[var(--onyx)] accent-[var(--accent-glow)]"
        />
        <label htmlFor={consentId} className="text-xs leading-relaxed text-[var(--silver-dim)]">
          I agree to be contacted about future Cyryx Labs roles that match my interests. No newsletter, no bulk mail.
        </label>
      </div>
      {state.status === "error" && (
        <p role="alert" aria-live="assertive" className="mt-3 text-xs text-[color:oklch(0.72_0.16_25)]">
          {state.message}
        </p>
      )}
    </form>
  );
}