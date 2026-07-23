import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { trackCta } from "@/lib/track-cta";
import { submitContact } from "@/lib/contact.functions";

const PATH = "/start";
const TITLE = "Start a Project — Cyryx Labs";
const DESC =
  "Describe the workflow, product, digital foundation, or operational problem. Cyryx Labs will identify the right engagement or recommend no build.";

const PROJECT_TYPES = [
  "AI Strategy & Advisory",
  "Digital & Web Systems",
  "Workflow Automation",
  "Internal AI Assistant",
  "Custom AI Product Development",
  "AI Governance & Cost Control",
  "Managed Operations",
  "MAAX Studio — access inquiry",
  "Other",
] as const;

const INVESTMENT_RANGES = [
  "Under $5,000",
  "$5,000–$15,000",
  "$15,000–$40,000",
  "$40,000–$100,000",
  "$100,000–$250,000",
  "$250,000+",
  "Not yet defined",
] as const;

const TIMELINES = [
  "Immediately",
  "Within 30 days",
  "Within 60–90 days",
  "This quarter",
  "Researching for later",
] as const;

const DECISION = [
  "I am the decision-maker",
  "I am part of the decision team",
  "I am researching for another stakeholder",
  "Not yet defined",
] as const;

const NEXT_STEPS = [
  {
    n: "01",
    title: "Fit review",
    body: "We review the business problem, available context, timing, and whether Cyryx is the right partner.",
  },
  {
    n: "02",
    title: "Initial response",
    body: "We respond with fit, a focused question, or the clearest next step after reviewing the available context.",
  },
  {
    n: "03",
    title: "Discovery if warranted",
    body: "When there is a fit, we define the discovery needed before proposing scope, architecture, commercial terms, or delivery.",
  },
] as const;

export const Route = createFileRoute("/start")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Start a Project", path: PATH },
      ]),
    ]),
  component: StartPage,
});

function StartPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "err">("idle");
  const [error, setError] = useState<string | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status !== "ok") return;
    requestAnimationFrame(() => successRef.current?.focus());
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    const fd = new FormData(e.currentTarget);
    // Honeypot
    if ((fd.get("website") as string | null)?.length) {
      setStatus("ok");
      return;
    }
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const company = String(fd.get("company") ?? "").trim();
    const role = String(fd.get("role") ?? "").trim();
    const companyWebsite = String(fd.get("companyWebsite") ?? "").trim();
    const projectType = String(fd.get("projectType") ?? "").trim();
    const stage = String(fd.get("stage") ?? "").trim();
    const problem = String(fd.get("problem") ?? "").trim();
    const outcome = String(fd.get("outcome") ?? "").trim();
    const investment = String(fd.get("investment") ?? "").trim();
    const timeline = String(fd.get("timeline") ?? "").trim();
    const systems = String(fd.get("systems") ?? "").trim();
    const decision = String(fd.get("decision") ?? "").trim();
    const notes = String(fd.get("notes") ?? "").trim();
    const consent = fd.get("consent") === "on";

    // Compose a structured message; the existing contact pipeline stores it.
    // No PII is echoed to analytics.
    const message = [
      `Project type: ${projectType || "—"}`,
      `Current stage: ${stage || "—"}`,
      `Investment range: ${investment || "—"}`,
      `Timeline: ${timeline || "—"}`,
      `Decision status: ${decision || "—"}`,
      `Role: ${role || "—"}`,
      `Company website: ${companyWebsite || "—"}`,
      `Systems / data involved: ${systems || "—"}`,
      "",
      "Primary problem:",
      problem || "—",
      "",
      "Desired outcome:",
      outcome || "—",
      "",
      "Additional context:",
      notes || "—",
    ].join("\n");

    try {
      await submitContact({
        data: {
          name,
          email,
          company,
          message,
          interest:
            projectType === "MAAX Studio — access inquiry" ? "maax-early-access" : "project",
          consent: consent as true,
          website: "",
        },
      });
      trackCta({
        cta: "qualification_form_submitted",
        section: "start",
        href: PATH,
        // Only non-PII metadata
        metadata: { projectType, investment, timeline, decision },
      });
      setStatus("ok");
    } catch (err) {
      setStatus("err");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      trackCta({ cta: "qualification_form_error", section: "start", href: PATH });
    }
  }

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" className="relative">
        <section className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-12 pt-32 pb-24 lg:pt-44">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--silver-dim)]">
            <Link to="/" className="hover:text-[var(--accent-glow)]">
              Home
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-[var(--silver)]">Start a Project</span>
          </nav>
          <HudLabel withDot className="mt-6 text-[var(--accent-glow)]">
            Start with the problem
          </HudLabel>
          <h1 className="mt-4 max-w-[14ch] font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-silver-gradient">
            Bring us the workflow, bottleneck, or system.
          </h1>
          <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]">
            Describe the business problem, current workflow, constraints, and desired outcome. We
            will determine whether the right starting point is advisory, a digital system,
            automation, an AI product, managed operations, or no build at all.
          </p>

          <ol className="mt-12 grid border-y border-[color-mix(in_oklab,var(--silver)_14%,transparent)] lg:grid-cols-3">
            {NEXT_STEPS.map((step) => (
              <li
                key={step.n}
                className="border-b border-[color-mix(in_oklab,var(--silver)_14%,transparent)] py-7 last:border-b-0 lg:border-b-0 lg:border-r lg:px-7 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
              >
                <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--accent-glow)]">
                  {step.n}
                </span>
                <h2 className="mt-4 font-display text-xl tracking-[-0.02em] text-[var(--silver)]">
                  {step.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">{step.body}</p>
              </li>
            ))}
          </ol>

          {status === "ok" ? (
            <div
              ref={successRef}
              tabIndex={-1}
              role="status"
              aria-live="polite"
              className="mt-10 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_60%,transparent)] p-6 outline-none backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)]"
            >
              <HudLabel className="text-[var(--accent-glow)]">Received</HudLabel>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--silver)]">
                Thank you. Your submission has been recorded. Our response may confirm fit, ask for
                context, recommend a different next step, or decline the opportunity.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/engagement-model"
                  className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
                >
                  Read our engagement model
                  <span aria-hidden className="text-[var(--accent-glow)]">
                    →
                  </span>
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center h-11 px-3 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)]"
                >
                  Back to home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-10 space-y-6">
              {/* Honeypot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Full name" name="name" required autoComplete="name" />
                <Field label="Work email" name="email" type="email" required autoComplete="email" />
                <Field label="Company" name="company" required autoComplete="organization" />
                <Select label="Project type" name="projectType" options={PROJECT_TYPES} />
              </div>

              <TextArea
                label="Primary problem"
                name="problem"
                required
                rows={4}
                placeholder="What's broken, missing, or slowing you down?"
              />
              <TextArea
                label="Desired outcome"
                name="outcome"
                rows={3}
                placeholder="What would be materially different if this work succeeds?"
              />

              <details className="group rounded-md border border-white/10 bg-[color-mix(in_oklab,var(--graphite)_35%,transparent)]">
                <summary className="cursor-pointer list-none px-5 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--silver)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent-glow)]">
                  Add planning context <span className="text-[var(--accent-glow)]">/ optional</span>
                </summary>
                <div className="grid gap-6 border-t border-white/10 p-5 sm:grid-cols-2">
                  <Field label="Role" name="role" autoComplete="organization-title" />
                  <Field
                    label="Company website"
                    name="companyWebsite"
                    type="url"
                    placeholder="https://"
                  />
                  <Field
                    label="Current stage"
                    name="stage"
                    placeholder="e.g. exploring or in production"
                  />
                  <Select label="Investment range" name="investment" options={INVESTMENT_RANGES} />
                  <Select label="Desired timeline" name="timeline" options={TIMELINES} />
                  <Select label="Decision-maker status" name="decision" options={DECISION} />
                  <div className="sm:col-span-2">
                    <TextArea
                      label="Systems or data involved"
                      name="systems"
                      rows={2}
                      placeholder="e.g. HubSpot CRM, Postgres warehouse, Google Workspace"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <TextArea label="Additional context" name="notes" rows={3} />
                  </div>
                </div>
              </details>

              <label className="flex items-start gap-3 text-sm text-[var(--silver-dim)]">
                <input
                  type="checkbox"
                  name="consent"
                  required
                  className="mt-1 h-4 w-4 accent-[var(--accent-glow)]"
                />
                <span>
                  I consent to Cyryx Labs contacting me about this submission in accordance with the{" "}
                  <Link to="/privacy" className="text-[var(--accent-glow)] hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              {status === "err" && error && (
                <p
                  role="alert"
                  className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200"
                >
                  {error}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-12 px-6 rounded-md text-[var(--silver)] hud-label disabled:opacity-60"
                >
                  {status === "submitting" ? "Sending…" : "Submit for review"}
                  <span aria-hidden className="text-[var(--accent-glow)]">
                    →
                  </span>
                </button>
                <p className="text-xs text-[var(--silver-dim)]">
                  Acceptance, scope, timing, ownership, licensing, support, and commercial terms are
                  defined separately for each engagement.
                </p>
              </div>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
  className,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="hud-label text-[var(--silver)]">
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-[var(--accent-glow)]">
            *
          </span>
        )}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-md border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_55%,transparent)] px-4 py-3 text-sm text-[var(--silver)] placeholder:text-[var(--silver-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  required,
  rows = 3,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="hud-label text-[var(--silver)]">
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-[var(--accent-glow)]">
            *
          </span>
        )}
      </span>
      <textarea
        name={name}
        required={required}
        minLength={required ? 10 : undefined}
        rows={rows}
        placeholder={placeholder}
        className="mt-2 w-full rounded-md border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_55%,transparent)] px-4 py-3 text-sm text-[var(--silver)] placeholder:text-[var(--silver-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
      />
    </label>
  );
}

function Select({
  label,
  name,
  required,
  options,
}: {
  label: string;
  name: string;
  required?: boolean;
  options: readonly string[];
}) {
  return (
    <label className="block">
      <span className="hud-label text-[var(--silver)]">
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-[var(--accent-glow)]">
            *
          </span>
        )}
      </span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="mt-2 w-full rounded-md border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_55%,transparent)] px-4 py-3 text-sm text-[var(--silver)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
