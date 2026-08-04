import { FormEvent, useRef, useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { MAAX_WAITLIST_CONSENT_VERSION, MaaxWaitlistSchema } from "@/lib/maax-waitlist.schema";
import { publicReferrer } from "@/lib/public-location";
import { trackCta } from "@/lib/track-cta";

type FieldErrors = Partial<
  Record<
    | "fullName"
    | "email"
    | "company"
    | "role"
    | "useCase"
    | "operatingConstraint"
    | "phone"
    | "country"
    | "consent",
    string
  >
>;

const INPUT_CLASS =
  "mt-2 min-h-12 w-full rounded-md border border-white/15 bg-[var(--onyx)] px-4 text-base text-[var(--silver)] outline-none transition placeholder:text-[var(--steel)] focus:border-[var(--accent-glow)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--accent-glow)_18%,transparent)]";

export function MaaxWaitlistForm() {
  const formStartedAt = useRef(Date.now());
  const trackedStart = useRef(false);
  const [busy, setBusy] = useState(false);
  const [complete, setComplete] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");

  const trackStart = () => {
    if (trackedStart.current) return;
    trackedStart.current = true;
    trackCta({ cta: "maax_waitlist_started", section: "maax_product" });
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setErrors({});

    const form = event.currentTarget;
    const data = new FormData(form);
    const search = new URLSearchParams(window.location.search);
    const candidate = {
      fullName: String(data.get("fullName") ?? ""),
      email: String(data.get("email") ?? ""),
      company: String(data.get("company") ?? ""),
      role: String(data.get("role") ?? ""),
      useCase: String(data.get("useCase") ?? ""),
      operatingConstraint: String(data.get("operatingConstraint") ?? ""),
      phone: String(data.get("phone") ?? ""),
      country: String(data.get("country") ?? ""),
      consent: data.get("consent") === "on",
      consentVersion: MAAX_WAITLIST_CONSENT_VERSION,
      website: String(data.get("website") ?? ""),
      formStartedAt: formStartedAt.current,
      source: "maax_studio_waitlist",
      landingPath: window.location.pathname,
      referrer: publicReferrer(document.referrer),
      utmSource: search.get("utm_source") || undefined,
      utmMedium: search.get("utm_medium") || undefined,
      utmCampaign: search.get("utm_campaign") || undefined,
      utmContent: search.get("utm_content") || undefined,
      utmTerm: search.get("utm_term") || undefined,
    };

    const parsed = MaaxWaitlistSchema.safeParse(candidate);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof FieldErrors;
        if (field in candidate && !next[field]) next[field] = issue.message;
      }
      setErrors(next);
      setFormError("Check the highlighted fields and try again.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/public/maax-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as { ok?: boolean; message?: string };
      if (!response.ok || !result.ok) {
        throw new Error(result.message || "We could not save your request.");
      }
      trackCta({ cta: "maax_waitlist_submitted", section: "maax_product" });
      setComplete(true);
      form.reset();
    } catch (error) {
      trackCta({ cta: "maax_waitlist_error", section: "maax_product" });
      setFormError(
        error instanceof Error
          ? error.message
          : "We could not save your request. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (complete) {
    return (
      <div
        className="rounded-lg border border-[color-mix(in_oklab,var(--accent-glow)_34%,transparent)] bg-[color-mix(in_oklab,var(--accent-glow)_6%,var(--obsidian))] p-7 sm:p-9"
        role="status"
        tabIndex={-1}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--accent-glow)] text-[var(--accent-glow)]">
          <Check className="h-5 w-5" aria-hidden />
        </span>
        <h3 className="mt-6 font-display text-3xl font-semibold tracking-[-0.035em] text-[var(--silver)]">
          Early-access request received.
        </h3>
        <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--silver-dim)]">
          We recorded the use case and operating constraints for review. If a future review group is
          a fit, Cyryx may contact you. Submission does not guarantee access, timing, or product
          availability.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} onFocus={trackStart} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" id="maax-full-name" error={errors.fullName}>
          <input
            id="maax-full-name"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            maxLength={120}
            className={INPUT_CLASS}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? "maax-full-name-error" : undefined}
            placeholder="Your name"
          />
        </Field>
        <Field label="Work email" id="maax-email" error={errors.email}>
          <input
            id="maax-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={254}
            className={INPUT_CLASS}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "maax-email-error" : undefined}
            placeholder="you@company.com"
          />
        </Field>
        <Field label="Company" id="maax-company" error={errors.company}>
          <input
            id="maax-company"
            name="company"
            type="text"
            autoComplete="organization"
            required
            maxLength={160}
            className={INPUT_CLASS}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={errors.company ? "maax-company-error" : undefined}
            placeholder="Company or team"
          />
        </Field>
        <Field label="Role" id="maax-role" error={errors.role}>
          <input
            id="maax-role"
            name="role"
            type="text"
            autoComplete="organization-title"
            required
            maxLength={120}
            className={INPUT_CLASS}
            aria-invalid={Boolean(errors.role)}
            aria-describedby={errors.role ? "maax-role-error" : undefined}
            placeholder="Your role"
          />
        </Field>
        <Field label="Telephone (optional)" id="maax-phone" error={errors.phone}>
          <input
            id="maax-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={40}
            className={INPUT_CLASS}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "maax-phone-error" : undefined}
            placeholder="+1 305 555 0123"
          />
        </Field>
        <Field
          label="Country"
          id="maax-country"
          error={errors.country}
          hint="Used to evaluate regional availability and review constraints."
        >
          <input
            id="maax-country"
            name="country"
            type="text"
            autoComplete="country-name"
            required
            maxLength={80}
            className={INPUT_CLASS}
            aria-invalid={Boolean(errors.country)}
            aria-describedby={errors.country ? "maax-country-error" : undefined}
            placeholder="United States"
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-5">
        <LongField
          label="Intended use case"
          id="maax-use-case"
          name="useCase"
          error={errors.useCase}
          placeholder="What software work would your team evaluate with MAAX Studio?"
        />
        <LongField
          label="Primary operating constraint"
          id="maax-operating-constraint"
          name="operatingConstraint"
          error={errors.operatingConstraint}
          placeholder="What authority, review, context, integration, or delivery constraint matters most?"
        />
      </div>

      <p className="mt-5 rounded-md border border-amber-300/25 bg-amber-300/5 px-4 py-3 text-sm leading-relaxed text-amber-100">
        Do not include passwords, API keys, credentials, regulated data, source code, or other
        sensitive information in this early-access request.
      </p>

      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden>
        <label htmlFor="maax-website">Website</label>
        <input id="maax-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[var(--silver-dim)]">
        <input
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent-glow)]"
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={errors.consent ? "maax-consent-error" : undefined}
        />
        <span>
          I agree that Cyryx Labs may use these details to evaluate this early-access request and
          contact me about it by email and, if I provide a number, telephone. I can withdraw consent
          at any time. See the{" "}
          <Link
            to="/privacy"
            className="text-[var(--silver)] underline underline-offset-4 transition hover:text-[var(--accent-glow)]"
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {errors.consent ? (
        <p id="maax-consent-error" className="mt-2 text-sm text-red-300">
          {errors.consent}
        </p>
      ) : null}

      {formError ? (
        <p
          className="mt-5 rounded-md border border-red-400/25 bg-red-400/5 px-4 py-3 text-sm text-red-200"
          role="alert"
        >
          {formError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="mt-7 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-md bg-[var(--silver)] px-7 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--onyx)] transition hover:bg-white disabled:cursor-wait disabled:opacity-65 sm:w-auto"
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Joining…
          </>
        ) : (
          <>
            Request early-access review <ArrowRight className="h-4 w-4" aria-hidden />
          </>
        )}
      </button>
      <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--steel)]">
        No public launch date · Any access is limited and review-based
      </p>
    </form>
  );
}

function LongField({
  label,
  id,
  name,
  error,
  placeholder,
}: {
  label: string;
  id: string;
  name: "useCase" | "operatingConstraint";
  error?: string;
  placeholder: string;
}) {
  return (
    <label
      htmlFor={id}
      className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--silver-dim)]"
    >
      {label}
      <textarea
        id={id}
        name={name}
        required
        minLength={10}
        maxLength={2000}
        rows={4}
        className={`${INPUT_CLASS} py-3`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        placeholder={placeholder}
      />
      {error ? (
        <span
          id={`${id}-error`}
          className="mt-2 block font-sans text-sm normal-case tracking-normal text-red-300"
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}

function Field({
  label,
  id,
  error,
  hint,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--silver-dim)]"
    >
      {label}
      {children}
      {hint ? (
        <span className="mt-2 block font-sans text-xs normal-case tracking-normal text-[var(--steel)]">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span
          id={`${id}-error`}
          className="mt-2 block font-sans text-sm normal-case tracking-normal text-red-300"
        >
          {error}
        </span>
      ) : null}
    </label>
  );
}
