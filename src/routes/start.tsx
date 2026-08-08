import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { trackCta } from "@/lib/track-cta";
import {
  FIT_REVIEW_PROJECT_TYPES,
  FitReviewSchema,
  PROJECT_TYPE_BY_START_INTENT,
  type FitReviewInput,
} from "@/lib/contact.schema";
import {
  parseStartProjectContext,
  START_CONTEXT_INTENT_LABELS,
  START_CONTEXT_SOURCE_LABELS,
} from "@/lib/cta";

const PATH = "/start";
const TITLE = "Start a Fit Review — Cyryx Labs";
const DESC =
  "Describe the workflow, product, digital foundation, or operational problem. Cyryx Labs will identify the right engagement or recommend no build.";

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
  "I own or approve this initiative",
  "I am part of the evaluation",
  "I am exploring for a team or stakeholder",
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
  validateSearch: (search) => parseStartProjectContext(search),
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Start a Fit Review", path: PATH },
      ]),
    ]),
  component: StartPage,
});

function StartPage() {
  const context = Route.useSearch();
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "err">("idle");
  const [error, setError] = useState<string | null>(null);
  const [confirmationQueued, setConfirmationQueued] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FitReviewInput, string>>>({});
  const successRef = useRef<HTMLDivElement | null>(null);
  const defaultProjectType = context.intent
    ? PROJECT_TYPE_BY_START_INTENT[context.intent]
    : undefined;

  useLayoutEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (status !== "ok") return;
    requestAnimationFrame(() => successRef.current?.focus());
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setError(null);
    setConfirmationQueued(false);
    setFieldErrors({});
    const fd = new FormData(form);
    const candidate = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      projectType: String(fd.get("projectType") ?? ""),
      problem: String(fd.get("problem") ?? ""),
      outcome: String(fd.get("outcome") ?? ""),
      whyNow: String(fd.get("whyNow") ?? ""),
      role: String(fd.get("role") ?? ""),
      companyWebsite: String(fd.get("companyWebsite") ?? ""),
      stage: String(fd.get("stage") ?? ""),
      investment: String(fd.get("investment") ?? ""),
      timeline: String(fd.get("timeline") ?? ""),
      systems: String(fd.get("systems") ?? ""),
      decision: String(fd.get("decision") ?? ""),
      notes: String(fd.get("notes") ?? ""),
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
      source: context.source,
      intent: context.intent,
    };

    const parsed = FitReviewSchema.safeParse(candidate);
    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof FitReviewInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof FitReviewInput;
        if (!nextErrors[field]) nextErrors[field] = issue.message;
      }
      setFieldErrors(nextErrors);
      setStatus("err");
      setError("Check the highlighted fields and try again.");
      const firstField = parsed.error.issues[0]?.path[0];
      if (typeof firstField === "string") {
        requestAnimationFrame(() => {
          const control = form.elements.namedItem(firstField);
          if (control instanceof HTMLElement) control.focus();
        });
      }
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        confirmationQueued?: boolean;
      };
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "We could not save your fit review. Please try again.");
      }
      trackCta({
        cta: "qualification_form_submitted",
        section: "start",
        href: PATH,
      });
      setConfirmationQueued(result.confirmationQueued === true);
      setStatus("ok");
    } catch (err) {
      setStatus("err");
      setError(
        err instanceof Error ? err.message : "We could not save your fit review. Please try again.",
      );
      trackCta({ cta: "qualification_form_error", section: "start", href: PATH });
    }
  }

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" className="relative">
        <section className="mx-auto max-w-4xl px-5 pb-20 pt-24 sm:px-8 sm:pb-24 sm:pt-32 lg:px-12 lg:pt-44">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--silver-dim)]">
            <Link to="/" className="hover:text-[var(--accent-glow)]">
              Home
            </Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-[var(--silver)]">Start a Fit Review</span>
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
            automation, governance, managed operations, or no build at all. MAAX Studio access has
            its own early-access review on the product page.
          </p>

          {context.source || context.intent ? (
            <aside className="mt-7 rounded-md border border-white/10 bg-[var(--graphite)] p-4 text-sm text-[var(--silver-dim)]">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--accent-glow)]">
                Context carried into this review
              </p>
              <p className="mt-2">
                {context.source ? START_CONTEXT_SOURCE_LABELS[context.source] : "Direct entry"}
                {context.intent ? ` / ${START_CONTEXT_INTENT_LABELS[context.intent]}` : ""}
              </p>
            </aside>
          ) : null}

          <div className="mt-10 flex flex-col lg:mt-12">
            {status === "ok" ? (
              <div
                ref={successRef}
                tabIndex={-1}
                role="status"
                aria-live="polite"
                className="rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_60%,transparent)] p-6 outline-none backdrop-blur-sm focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)]"
              >
                <HudLabel className="text-[var(--accent-glow)]">Received</HudLabel>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--silver)]">
                  Thank you. Your submission has been recorded. Our response may confirm fit, ask
                  for context, recommend a different next step, or decline the opportunity.
                </p>
                {confirmationQueued ? (
                  <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                    A confirmation email is being processed for the work email you provided.
                  </p>
                ) : null}
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
              <form
                onSubmit={onSubmit}
                noValidate
                aria-busy={status === "submitting"}
                className="space-y-6"
              >
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
                  <Field
                    label="Full name"
                    name="name"
                    required
                    autoComplete="name"
                    error={fieldErrors.name}
                  />
                  <Field
                    label="Work email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    error={fieldErrors.email}
                  />
                  <Field
                    label="Company"
                    name="company"
                    required
                    autoComplete="organization"
                    error={fieldErrors.company}
                  />
                  <Select
                    label="Project type"
                    name="projectType"
                    options={FIT_REVIEW_PROJECT_TYPES}
                    defaultValue={defaultProjectType}
                    required
                    error={fieldErrors.projectType}
                  />
                </div>

                <TextArea
                  label="Primary problem"
                  name="problem"
                  required
                  rows={4}
                  placeholder="What's broken, missing, or slowing you down?"
                  error={fieldErrors.problem}
                />
                <TextArea
                  label="Desired outcome"
                  name="outcome"
                  required
                  rows={3}
                  placeholder="What would be materially different if this work succeeds?"
                  error={fieldErrors.outcome}
                />
                <TextArea
                  label="Why now or timing context"
                  name="whyNow"
                  required
                  rows={3}
                  placeholder="What changed—or why is this worth evaluating now? ‘No fixed timing’ is a valid answer."
                  error={fieldErrors.whyNow}
                />

                <details className="group rounded-md border border-white/10 bg-[color-mix(in_oklab,var(--graphite)_35%,transparent)]">
                  <summary className="cursor-pointer list-none px-5 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--silver)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent-glow)]">
                    Add planning context{" "}
                    <span className="text-[var(--accent-glow)]">/ optional</span>
                  </summary>
                  <div className="grid gap-6 border-t border-white/10 p-5 sm:grid-cols-2">
                    <Field
                      label="Role"
                      name="role"
                      autoComplete="organization-title"
                      error={fieldErrors.role}
                    />
                    <Field
                      label="Company website"
                      name="companyWebsite"
                      type="url"
                      placeholder="https://"
                      error={fieldErrors.companyWebsite}
                    />
                    <Field
                      label="Current stage"
                      name="stage"
                      placeholder="e.g. exploring or in production"
                      error={fieldErrors.stage}
                    />
                    <Select
                      label="Investment range"
                      name="investment"
                      options={INVESTMENT_RANGES}
                      error={fieldErrors.investment}
                    />
                    <Select
                      label="Desired timeline"
                      name="timeline"
                      options={TIMELINES}
                      error={fieldErrors.timeline}
                    />
                    <Select
                      label="Your involvement in this review"
                      name="decision"
                      options={DECISION}
                      error={fieldErrors.decision}
                    />
                    <div className="sm:col-span-2">
                      <TextArea
                        label="Systems or data involved"
                        name="systems"
                        rows={2}
                        placeholder="e.g. HubSpot CRM, Postgres warehouse, Google Workspace"
                        error={fieldErrors.systems}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <TextArea
                        label="Additional context"
                        name="notes"
                        rows={3}
                        error={fieldErrors.notes}
                      />
                    </div>
                  </div>
                </details>

                <div
                  role="note"
                  className="rounded-md border border-amber-300/25 bg-amber-300/5 p-4 text-sm leading-relaxed text-amber-100"
                >
                  Do not submit passwords, API keys, credentials, regulated data, or other sensitive
                  information. We can agree an appropriate channel if a later fit review requires
                  protected details.
                </div>

                <label className="flex items-start gap-3 text-sm text-[var(--silver-dim)]">
                  <input
                    type="checkbox"
                    name="consent"
                    required
                    className="mt-1 h-4 w-4 accent-[var(--accent-glow)]"
                    aria-invalid={Boolean(fieldErrors.consent)}
                    aria-describedby={fieldErrors.consent ? "consent-error" : undefined}
                  />
                  <span>
                    I consent to Cyryx Labs contacting me about this submission in accordance with
                    the{" "}
                    <Link to="/privacy" className="text-[var(--accent-glow)] hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                {fieldErrors.consent ? (
                  <p id="consent-error" className="text-sm text-red-300">
                    {fieldErrors.consent}
                  </p>
                ) : null}

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
                    {status === "submitting" ? "Sending…" : "Start a fit review"}
                    <span aria-hidden className="text-[var(--accent-glow)]">
                      →
                    </span>
                  </button>
                  <p className="text-xs text-[var(--silver-dim)]">
                    Acceptance, scope, timing, ownership, licensing, support, and commercial terms
                    are defined separately for each engagement.
                  </p>
                </div>
              </form>
            )}

            <ol className="mt-14 grid border-y border-[color-mix(in_oklab,var(--silver)_14%,transparent)] lg:grid-cols-3">
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
                  <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
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
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
  error?: string;
}) {
  const errorId = `${name}-error`;
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
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 w-full rounded-md border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_55%,transparent)] px-4 py-3 text-sm text-[var(--silver)] placeholder:text-[var(--silver-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
      />
      {error ? (
        <span id={errorId} className="mt-2 block text-sm text-red-300">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function TextArea({
  label,
  name,
  required,
  rows = 3,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  error?: string;
}) {
  const errorId = `${name}-error`;
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
        id={name}
        name={name}
        required={required}
        minLength={required ? 10 : undefined}
        rows={rows}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 w-full rounded-md border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_55%,transparent)] px-4 py-3 text-sm text-[var(--silver)] placeholder:text-[var(--silver-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-glow)]"
      />
      {error ? (
        <span id={errorId} className="mt-2 block text-sm text-red-300">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function Select({
  label,
  name,
  required,
  options,
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  required?: boolean;
  options: readonly string[];
  defaultValue?: string;
  error?: string;
}) {
  const errorId = `${name}-error`;
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
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue ?? ""}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
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
      {error ? (
        <span id={errorId} className="mt-2 block text-sm text-red-300">
          {error}
        </span>
      ) : null}
    </label>
  );
}
