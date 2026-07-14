import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { trackCta } from "@/lib/track-cta";
import { submitContact } from "@/lib/contact.functions";

const PATH = "/start";
const TITLE = "Start a Project — Cyryx Labs";
const DESC =
  "Describe the workflow, product, digital foundation, or operational problem. Cyryx Labs will determine the right engagement — website, automation, AI system, product build, or none.";

const PROJECT_TYPES = [
  "Digital & Web Systems",
  "Workflow Automation",
  "Applied AI System",
  "AI Product Engineering",
  "Governance & Optimization",
  "Managed Operations",
  "MAAX Studio Early Access",
  "Lyra Briefing",
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
          interest: projectType === "MAAX Studio Early Access" ? "maax-early-access" : "project",
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
            <Link to="/" className="hover:text-[var(--accent-glow)]">Home</Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-[var(--silver)]">Start a Project</span>
          </nav>
          <HudLabel withDot className="mt-6 text-[var(--accent-glow)]">Start with the problem</HudLabel>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-silver-gradient">
            From fragmented operations to governed execution.
          </h1>
          <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]">
            Describe the workflow, product, digital foundation, or operational problem. Cyryx will determine whether it requires a website, automation, AI system, product engagement, or no system at all.
          </p>

          {status === "ok" ? (
            <div className="mt-10 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_60%,transparent)] p-6 backdrop-blur-sm">
              <HudLabel className="text-[var(--accent-glow)]">Received</HudLabel>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--silver)]">
                Thank you. Your submission has been recorded. A member of the Cyryx team will review it and respond directly if the engagement is a fit for both sides.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/engagement-model" className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label">
                  Read our engagement model
                  <span aria-hidden className="text-[var(--accent-glow)]">→</span>
                </Link>
                <Link to="/" className="inline-flex items-center h-11 px-3 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)]">
                  Back to home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-10 space-y-6" noValidate>
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
                <Field label="Role" name="role" autoComplete="organization-title" />
                <Field label="Company website" name="companyWebsite" type="url" placeholder="https://" className="sm:col-span-2" />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <Select label="Project type" name="projectType" required options={PROJECT_TYPES} />
                <Field label="Current stage" name="stage" placeholder="e.g. exploring, defined problem, in production" />
              </div>

              <TextArea label="Primary problem" name="problem" required rows={4} placeholder="What's broken, missing, or slowing you down?" />
              <TextArea label="Desired outcome" name="outcome" rows={3} placeholder="What does success look like in 90 days?" />

              <div className="grid gap-6 sm:grid-cols-2">
                <Select label="Investment range" name="investment" required options={INVESTMENT_RANGES} />
                <Select label="Desired timeline" name="timeline" required options={TIMELINES} />
              </div>

              <TextArea label="Systems or data involved" name="systems" rows={2} placeholder="e.g. HubSpot CRM, Postgres warehouse, Google Workspace" />

              <Select label="Decision-maker status" name="decision" required options={DECISION} />

              <TextArea label="Additional context" name="notes" rows={3} />

              <label className="flex items-start gap-3 text-sm text-[var(--silver-dim)]">
                <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[var(--accent-glow)]" />
                <span>
                  I consent to Cyryx Labs contacting me about this submission in accordance with the{" "}
                  <Link to="/privacy" className="text-[var(--accent-glow)] hover:underline">Privacy Policy</Link>.
                </span>
              </label>

              {status === "err" && error && (
                <p role="alert" className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
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
                  <span aria-hidden className="text-[var(--accent-glow)]">→</span>
                </button>
                <p className="text-xs text-[var(--silver-dim)]">
                  We do not promise acceptance or a fixed response window. You will hear from us only if the engagement is a fit.
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
      <span className="hud-label text-[var(--silver)]">{label}{required && <span aria-hidden className="ml-1 text-[var(--accent-glow)]">*</span>}</span>
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
      <span className="hud-label text-[var(--silver)]">{label}{required && <span aria-hidden className="ml-1 text-[var(--accent-glow)]">*</span>}</span>
      <textarea
        name={name}
        required={required}
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
      <span className="hud-label text-[var(--silver)]">{label}{required && <span aria-hidden className="ml-1 text-[var(--accent-glow)]">*</span>}</span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="mt-2 w-full rounded-md border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_55%,transparent)] px-4 py-3 text-sm text-[var(--silver)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
      >
        <option value="" disabled>Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}