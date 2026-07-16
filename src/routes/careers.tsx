import { createFileRoute, Link } from "@tanstack/react-router";
import { useId, useRef, useState, type FormEvent } from "react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { CONTACT_EMAIL } from "@/lib/cta";
import { trackCta } from "@/lib/track-cta";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    "• Area of interest (Applied Research, Product Engineering, Cyryx Solutions):",
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

type FieldErrors = { email?: string; consent?: string; form?: string };
type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; errors: FieldErrors }
  | { status: "success" };

// RFC 5322-ish practical check; matches HTML5 input[type=email] semantics closely.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(email: string, consent: boolean): FieldErrors {
  const errors: FieldErrors = {};
  const trimmed = email.trim();
  if (!trimmed) errors.email = "Please enter your email address.";
  else if (trimmed.length > 255) errors.email = "Email is too long (255 characters max).";
  else if (!EMAIL_RE.test(trimmed)) errors.email = "Enter a valid email like you@company.com.";
  if (!consent) errors.consent = "Please confirm you agree to be contacted.";
  return errors;
}

function TalentNetworkForm() {
  const emailId = useId();
  const consentId = useId();
  const emailErrId = useId();
  const consentErrId = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [successOpen, setSuccessOpen] = useState(false);
  const openerRef = useRef<HTMLButtonElement>(null);
  // Time-trap: forms submitted <1.2s after render are almost always bots.
  const mountedAt = useRef<number>(Date.now());

  const errors = state.status === "error" ? state.errors : {};

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fieldErrors = validate(email, consent);
    if (Object.keys(fieldErrors).length > 0) {
      setState({ status: "error", errors: fieldErrors });
      return;
    }
    // Silent honeypot: pretend success without hitting the endpoint.
    if (website.length > 0 || Date.now() - mountedAt.current < 1200) {
      setState({ status: "success" });
      setSuccessOpen(true);
      return;
    }
    setState({ status: "submitting" });
    trackCta({ cta: "talent_network_signup", section: "careers" });
    try {
      const res = await fetch("/api/public/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), consent: true, website }),
      });
      if (!res.ok) {
        // Endpoint intentionally returns a generic 200 for duplicates / already-
        // subscribed emails to prevent email enumeration, so non-OK is a real
        // failure. Handle common statuses with specific, friendly copy.
        let message =
          "We couldn't submit that. Please try again or email careers@cyryxlabs.com.";
        if (res.status === 429) {
          message =
            "Too many attempts from your network. Please wait a minute and try again.";
        } else if (res.status === 413) {
          message = "That email address is too long. Please shorten it and retry.";
        } else if (res.status >= 500) {
          message =
            "Our signup service is temporarily unavailable. Please try again shortly or email careers@cyryxlabs.com.";
        } else if (res.status === 400) {
          message =
            "That email doesn't look valid. Please check the address and try again.";
        }
        setState({ status: "error", errors: { form: message } });
        return;
      }
      setState({ status: "success" });
      setSuccessOpen(true);
      setEmail("");
      setConsent(false);
    } catch {
      setState({
        status: "error",
        errors: {
          form:
            typeof navigator !== "undefined" && navigator.onLine === false
              ? "You appear to be offline. Please check your connection and try again."
              : "We couldn't reach the signup service. Please try again or email careers@cyryxlabs.com.",
        },
      });
    }
  }

  return (
    <>
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
          inputMode="email"
          maxLength={255}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? emailErrId : undefined}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state.status === "error" && errors.email) {
              setState({ status: "idle" });
            }
          }}
          placeholder="you@company.com"
          className={cnField(!!errors.email)}
        />
        <button
          ref={openerRef}
          type="submit"
          disabled={state.status === "submitting"}
          className="cx-btn cx-liquid-glass inline-flex items-center justify-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label disabled:opacity-60"
        >
          {state.status === "submitting" ? "Joining…" : "Join"}
          <ArrowRight className="h-3.5 w-3.5 text-[var(--accent-glow)]" />
        </button>
      </div>
      {errors.email && (
        <p id={emailErrId} role="alert" className="mt-2 text-xs text-[color:oklch(0.72_0.16_25)]">
          {errors.email}
        </p>
      )}
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
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? consentErrId : undefined}
          onChange={(e) => {
            setConsent(e.target.checked);
            if (state.status === "error" && errors.consent) {
              setState({ status: "idle" });
            }
          }}
          className="mt-1 h-4 w-4 rounded border-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)] bg-[var(--onyx)] accent-[var(--accent-glow)]"
        />
        <label htmlFor={consentId} className="text-xs leading-relaxed text-[var(--silver-dim)]">
          I agree to be contacted about future Cyryx Labs roles that match my interests. No newsletter, no bulk mail.
        </label>
      </div>
      {errors.consent && (
        <p id={consentErrId} role="alert" className="mt-2 text-xs text-[color:oklch(0.72_0.16_25)]">
          {errors.consent}
        </p>
      )}
      {errors.form && (
        <p role="alert" aria-live="assertive" className="mt-3 text-xs text-[color:oklch(0.72_0.16_25)]">
          {errors.form}
        </p>
      )}
    </form>

    <Dialog
      open={successOpen}
      onOpenChange={(open) => {
        setSuccessOpen(open);
        if (!open) {
          mountedAt.current = Date.now();
          setState({ status: "idle" });
          // Radix returns focus to the opener automatically, but reset for safety.
          window.requestAnimationFrame(() => openerRef.current?.focus());
        }
      }}
    >
      <DialogContent className="border-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)] bg-[var(--graphite)] text-[var(--silver)]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-[var(--accent-glow)]" aria-hidden />
            <DialogTitle className="font-display text-xl text-[var(--silver)]">
              Check your inbox to confirm
            </DialogTitle>
          </div>
          <DialogDescription className="mt-2 text-sm lg:text-base text-[var(--silver-dim)]">
            Your email was captured. We just sent a confirmation link to complete
            your double opt-in. Click the link in that email to finish joining the
            talent network — until you confirm, you won&apos;t receive anything.
          </DialogDescription>
        </DialogHeader>
        <p className="text-xs text-[var(--silver-dim)]">
          Confirmations come from <span className="text-[var(--accent-glow)]">{CAREERS_EMAIL}</span>.
          If you don&apos;t see it within a few minutes, check spam or promotions.
        </p>
        <DialogFooter>
          <button
            type="button"
            onClick={() => setSuccessOpen(false)}
            className="cx-btn cx-liquid-glass inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md text-[var(--silver)] hud-label"
          >
            Got it
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

function cnField(hasError: boolean) {
  const base =
    "flex-1 h-11 rounded-md border bg-[var(--onyx)] px-4 text-sm text-[var(--silver)] placeholder:text-[var(--silver-dim)] focus:outline-none";
  return hasError
    ? `${base} border-[color:oklch(0.72_0.16_25)] focus:border-[color:oklch(0.72_0.16_25)]`
    : `${base} border-[color-mix(in_oklab,var(--accent-glow)_25%,transparent)] focus:border-[var(--accent-glow)]`;
}