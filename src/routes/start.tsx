import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import { MessageSquare } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { trackCta } from "@/lib/track-cta";
import {
  FIT_REVIEW_PROJECT_TYPES,
  FIT_REVIEW_STEP_ONE_FIELDS,
  FitReviewSchema,
  PROJECT_TYPE_BY_START_INTENT,
  type FitReviewInput,
} from "@/lib/contact.schema";
import {
  parseStartProjectContext,
  START_CONTEXT_INTENT_LABELS,
  START_CONTEXT_SOURCE_LABELS,
} from "@/lib/cta";
import { getLeadAttribution } from "@/lib/lead-attribution";
import { getActiveCopyVariant } from "@/lib/copy-variant";
import { isAssistantEnabled, openAssistant } from "@/lib/assistant-client";

const PATH = "/start";
const TITLE = "Start a Project — Cyryx Labs";
const DESC =
  "Tell us about the workflow, product or system you want to change. Two short steps; Cyryx Labs will tell you where to start, or recommend not to build.";

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

type FieldErrors = Partial<Record<keyof FitReviewInput, string>>;

export const Route = createFileRoute("/start")({
  validateSearch: (search) => parseStartProjectContext(search),
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
  const context = Route.useSearch();
  const assistantEnabled = isAssistantEnabled();
  const [step, setStep] = useState<1 | 2>(1);
  const [reachedStepTwo, setReachedStepTwo] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "err">("idle");
  const [error, setError] = useState<string | null>(null);
  // When the brief cannot be saved, the visitor can still send it by email.
  const [fallbackMailto, setFallbackMailto] = useState<string | null>(null);
  const [confirmationQueued, setConfirmationQueued] = useState(false);
  const [firstReply, setFirstReply] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const startedRef = useRef(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const successRef = useRef<HTMLDivElement | null>(null);
  const stepTwoHeadingRef = useRef<HTMLHeadingElement | null>(null);
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

  useEffect(() => {
    if (step === 2) requestAnimationFrame(() => stepTwoHeadingRef.current?.focus());
  }, [step]);

  function markStarted() {
    if (startedRef.current) return;
    startedRef.current = true;
    trackCta({ cta: "form_start", section: "start", href: PATH });
  }

  function readCandidate(form: HTMLFormElement) {
    const fd = new FormData(form);
    const text = (name: string) => String(fd.get(name) ?? "");
    return {
      name: text("name"),
      email: text("email"),
      company: text("company"),
      projectType: text("projectType"),
      problem: text("problem"),
      outcome: text("outcome"),
      whyNow: text("whyNow"),
      role: text("role"),
      companyWebsite: text("companyWebsite"),
      stage: text("stage"),
      investment: text("investment"),
      timeline: text("timeline"),
      systems: text("systems"),
      decision: text("decision"),
      notes: text("notes"),
      consent: fd.get("consent") === "on",
      website: text("website"),
      source: context.source,
      intent: context.intent,
      attribution: getLeadAttribution(getActiveCopyVariant()),
    };
  }

  function showErrors(
    form: HTMLFormElement,
    issues: { path: (string | number)[]; message: string }[],
  ) {
    const nextErrors: FieldErrors = {};
    for (const issue of issues) {
      const field = issue.path[0] as keyof FitReviewInput;
      if (!nextErrors[field]) nextErrors[field] = issue.message;
    }
    setFieldErrors(nextErrors);
    setStatus("err");
    setError("Check the highlighted fields and try again.");
    const firstField = issues[0]?.path[0];
    if (typeof firstField === "string") {
      requestAnimationFrame(() => {
        const control = form.elements.namedItem(firstField);
        if (control instanceof HTMLElement) control.focus();
      });
    }
  }

  function continueToStepTwo() {
    const form = formRef.current;
    if (!form) return;
    markStarted();
    setError(null);
    const parsed = FitReviewSchema.safeParse(readCandidate(form));
    const stepOneIssues = parsed.success
      ? []
      : parsed.error.issues.filter((issue) =>
          (FIT_REVIEW_STEP_ONE_FIELDS as readonly string[]).includes(String(issue.path[0])),
        );
    if (stepOneIssues.length) {
      showErrors(form, stepOneIssues);
      return;
    }
    setFieldErrors({});
    setStatus("idle");
    setStep(2);
    setReachedStepTwo(true);
    trackCta({ cta: "form_step_complete", section: "start", href: `${PATH}#step-1` });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (step === 1) {
      continueToStepTwo();
      return;
    }
    setError(null);
    setConfirmationQueued(false);
    setFieldErrors({});

    const parsed = FitReviewSchema.safeParse(readCandidate(form));
    if (!parsed.success) {
      const stepOneFailed = parsed.error.issues.some((issue) =>
        (FIT_REVIEW_STEP_ONE_FIELDS as readonly string[]).includes(String(issue.path[0])),
      );
      if (stepOneFailed) setStep(1);
      showErrors(form, parsed.error.issues);
      return;
    }

    setStatus("submitting");
    setFallbackMailto(null);

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
        firstReply?: string | null;
      };
      if (!response.ok || !result.ok) {
        throw new Error(result.error || "We could not send your brief. Please try again.");
      }
      trackCta({ cta: "generate_lead", section: "start", href: PATH });
      trackCta({ cta: "qualification_form_submitted", section: "start", href: PATH });
      setConfirmationQueued(result.confirmationQueued === true);
      setFirstReply(
        typeof result.firstReply === "string" && result.firstReply ? result.firstReply : null,
      );
      setStatus("ok");
    } catch (err) {
      setStatus("err");
      setError(
        err instanceof Error ? err.message : "We could not send your brief. Please try again.",
      );
      const brief = parsed.data;
      const body = [
        `Name: ${brief.name}`,
        `Company: ${brief.company}`,
        `Type of work: ${brief.projectType}`,
        "",
        "What we want to change:",
        brief.problem,
      ].join("\n");
      setFallbackMailto(
        `mailto:contact@cyryxlabs.com?subject=${encodeURIComponent(
          `Project brief — ${brief.company}`,
        )}&body=${encodeURIComponent(body.slice(0, 1500))}`,
      );
      trackCta({ cta: "qualification_form_error", section: "start", href: PATH });
    }
  }

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" className="relative">
        <section className="mx-auto max-w-4xl px-5 pb-20 pt-24 sm:px-8 sm:pb-24 sm:pt-32 lg:px-12 lg:pt-40">
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
          <h1 className="mt-4 max-w-[16ch] font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-silver-gradient sm:text-5xl lg:text-6xl">
            Tell us what you want AI to change.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] lg:text-lg">
            Two short steps. We'll tell you whether AI belongs there, where to start (Advise, Build,
            Control or Operate) or whether not to build at all.
          </p>

          <ol
            className="mt-8 grid gap-px overflow-hidden rounded-md border border-white/10 bg-white/10 text-sm sm:grid-cols-3"
            aria-label="What happens next"
          >
            <li className="bg-[var(--obsidian)] px-4 py-3">
              <span className="font-mono text-[11px] text-[var(--accent-glow)]">01</span>{" "}
              <span className="text-[var(--silver)]">You send a short brief.</span>
            </li>
            <li className="bg-[var(--obsidian)] px-4 py-3">
              <span className="font-mono text-[11px] text-[var(--accent-glow)]">02</span>{" "}
              <span className="text-[var(--silver)]">You get a first read right away.</span>
            </li>
            <li className="bg-[var(--obsidian)] px-4 py-3">
              <span className="font-mono text-[11px] text-[var(--accent-glow)]">03</span>{" "}
              <span className="text-[var(--silver)]">
                A person replies with fit, a question or the next step.
              </span>
            </li>
          </ol>

          <p className="mt-5 text-sm text-[var(--silver-dim)]">
            Already have detailed requirements, wireframes or documents?{" "}
            <Link to="/brief" className="text-[var(--accent-glow)] underline underline-offset-4">
              Send a full project brief
            </Link>
            .
          </p>

          {context.source || context.intent ? (
            <p className="mt-5 text-sm text-[var(--silver-dim)]">
              Coming from{" "}
              <span className="text-[var(--silver)]">
                {context.source ? START_CONTEXT_SOURCE_LABELS[context.source] : "a direct link"}
                {context.intent ? ` · ${START_CONTEXT_INTENT_LABELS[context.intent]}` : ""}
              </span>
            </p>
          ) : null}

          <div className="mt-10 flex flex-col lg:mt-12">
            {status === "ok" ? (
              <div
                ref={successRef}
                tabIndex={-1}
                role="status"
                aria-live="polite"
                className="rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_60%,transparent)] p-6 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)]"
              >
                <HudLabel className="text-[var(--accent-glow)]">Received</HudLabel>
                {firstReply ? (
                  <>
                    <p className="mt-3 font-display text-xl font-semibold text-[var(--silver)]">
                      Here is a first read of your request.
                    </p>
                    <p className="mt-4 whitespace-pre-wrap rounded-md border border-white/10 bg-[var(--onyx)] p-4 text-[15px] leading-relaxed text-[var(--silver)]">
                      {firstReply}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-[var(--steel)]">
                      Drafted instantly by the Cyryx AI system from what you wrote. A person on our
                      team reviews every brief before any proposal.
                    </p>
                  </>
                ) : (
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--silver)]">
                    Thank you. Your brief has been recorded. Our reply may confirm fit, ask for
                    context, recommend a different next step or decline the opportunity.
                  </p>
                )}
                {confirmationQueued ? (
                  <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                    A copy is on its way to the work email you provided.
                  </p>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-3">
                  {assistantEnabled && (
                    <button
                      type="button"
                      onClick={() => openAssistant("start")}
                      className="cx-btn-primary cx-btn-sm"
                    >
                      <MessageSquare className="h-4 w-4" aria-hidden /> Ask a follow-up now
                    </button>
                  )}
                  <Link to="/brief" className="cx-btn-secondary cx-btn-sm">
                    Add requirements and files
                  </Link>
                  <Link to="/engagement-model" className="cx-btn-secondary cx-btn-sm">
                    How engagements run
                  </Link>
                </div>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={onSubmit}
                onFocusCapture={markStarted}
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

                <p
                  className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--steel)]"
                  aria-live="polite"
                >
                  Step {step} of 2 · {step === 1 ? "The essentials" : "Add context (optional)"}
                </p>

                {/* Step 1 stays mounted (hidden) so its values submit with step 2. */}
                <div className={step === 1 ? "space-y-6" : "hidden"}>
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
                      label="What kind of work?"
                      name="projectType"
                      options={FIT_REVIEW_PROJECT_TYPES}
                      defaultValue={defaultProjectType}
                      required
                      error={fieldErrors.projectType}
                    />
                  </div>

                  <TextArea
                    label="What do you want to change?"
                    name="problem"
                    required
                    rows={4}
                    placeholder="The workflow, bottleneck or product idea, in a few sentences."
                    error={fieldErrors.problem}
                  />

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
                      I consent to Cyryx Labs contacting me about this brief in accordance with the{" "}
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
                </div>

                {/* Step 2 also stays mounted once reached, so "Back" keeps what was typed. */}
                {(step === 2 || reachedStepTwo) && (
                  <div className={step === 2 ? "space-y-6" : "hidden"}>
                    <h2
                      ref={stepTwoHeadingRef}
                      tabIndex={-1}
                      className="font-display text-2xl font-semibold tracking-[-0.02em] text-[var(--silver)] outline-none"
                    >
                      Anything else that helps us prepare?
                    </h2>
                    <p className="-mt-3 text-sm text-[var(--silver-dim)]">
                      All optional. Skip it and send now if you prefer.
                    </p>
                    <TextArea
                      label="Desired outcome"
                      name="outcome"
                      rows={3}
                      placeholder="What would be different if this works?"
                      error={fieldErrors.outcome}
                    />
                    <TextArea
                      label="Why now"
                      name="whyNow"
                      rows={2}
                      placeholder="What changed, or why this is worth looking at now."
                      error={fieldErrors.whyNow}
                    />
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Select
                        label="Budget range"
                        name="investment"
                        options={INVESTMENT_RANGES}
                        error={fieldErrors.investment}
                      />
                      <Select
                        label="Timeline"
                        name="timeline"
                        options={TIMELINES}
                        error={fieldErrors.timeline}
                      />
                      <Select
                        label="Your role in the decision"
                        name="decision"
                        options={DECISION}
                        error={fieldErrors.decision}
                      />
                      <Field
                        label="Role or title"
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
                        placeholder="e.g. exploring, pilot, in production"
                        error={fieldErrors.stage}
                      />
                    </div>
                    <TextArea
                      label="Systems or data involved"
                      name="systems"
                      rows={2}
                      placeholder="e.g. HubSpot, Postgres, Google Workspace"
                      error={fieldErrors.systems}
                    />
                    <TextArea
                      label="Anything else"
                      name="notes"
                      rows={2}
                      error={fieldErrors.notes}
                    />
                  </div>
                )}

                <p className="text-xs leading-relaxed text-[var(--steel)]">
                  Please don't include passwords, API keys or regulated personal data. We'll agree a
                  secure channel if we need anything sensitive later.
                </p>

                {status === "err" && error && (
                  <p
                    role="alert"
                    className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200"
                  >
                    {error}
                    {fallbackMailto ? (
                      <>
                        {" "}
                        You can also{" "}
                        <a
                          href={fallbackMailto}
                          className="font-medium text-white underline underline-offset-4"
                        >
                          send the brief by email
                        </a>
                        ; nothing you typed is lost.
                      </>
                    ) : null}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  {step === 1 ? (
                    <button type="submit" className="cx-btn-primary">
                      Continue <span aria-hidden>→</span>
                    </button>
                  ) : (
                    <>
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="cx-btn-primary disabled:opacity-60"
                      >
                        {status === "submitting" ? "Sending…" : "Send project brief"}{" "}
                        <span aria-hidden>→</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex min-h-11 items-center px-3 text-sm text-[var(--silver-dim)] hover:text-[var(--silver)]"
                      >
                        Back
                      </button>
                    </>
                  )}
                  {step === 1 && assistantEnabled && (
                    <button
                      type="button"
                      onClick={() => openAssistant("start")}
                      className="inline-flex min-h-11 items-center gap-2 px-2 text-sm text-[var(--silver-dim)] hover:text-[var(--accent-glow)]"
                    >
                      <MessageSquare className="h-4 w-4 text-[var(--accent-glow)]" aria-hidden />
                      Rather ask a question first?
                    </button>
                  )}
                </div>
                {step === 2 && status === "submitting" && (
                  <p className="text-xs text-[var(--steel)]" aria-live="polite">
                    Saving your brief and preparing a first read…
                  </p>
                )}
              </form>
            )}
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
      <span className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--silver)]">
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
      <span className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--silver)]">
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
      <span className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--silver)]">
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
