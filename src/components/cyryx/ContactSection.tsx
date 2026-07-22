import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { HudLabel } from "./primitives/HudLabel";
import { GlassPanel } from "./primitives/GlassPanel";
import { submitContact } from "@/lib/contact.functions";
import { CONTACT_INTERESTS, type ContactInterest } from "@/lib/contact.schema";
import { CONTACT_INTENT_EVENT, getContactIntent } from "@/lib/contact-intent";

const FormSchema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  company: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(10, "At least 10 characters").max(2000),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please accept the Privacy Policy to continue" }),
  }),
});

type Errors = Partial<Record<keyof z.infer<typeof FormSchema>, string>>;

export function ContactSection() {
  const submit = useServerFn(submitContact);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [messageLen, setMessageLen] = useState(0);
  const [consent, setConsent] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [interest, setInterest] = useState<ContactInterest>("project");
  const successRef = useRef<HTMLDivElement | null>(null);

  // Preselect the interest when a CTA (e.g. "Request Early Access") sent the
  // visitor here — via sessionStorage on mount, via window event afterwards.
  useEffect(() => {
    setHydrated(true);
    const stored = getContactIntent();
    if (stored) setInterest(stored);
    const onIntent = (e: Event) => {
      const detail = (e as CustomEvent<ContactInterest>).detail;
      if (detail) setInterest(detail);
    };
    window.addEventListener(CONTACT_INTENT_EVENT, onIntent);
    return () => window.removeEventListener(CONTACT_INTENT_EVENT, onIntent);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const fd = new FormData(e.currentTarget);
    // Honeypot — bots usually fill all visible-looking fields.
    if (String(fd.get("website") ?? "").length > 0) {
      setStatus("success");
      return;
    }
    const raw = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      message: String(fd.get("message") ?? ""),
      consent: fd.get("consent") === "on",
      interest,
    };
    const parsed = FormSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Please fix the highlighted fields and try again.");
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      await submit({ data: parsed.data });
      setStatus("success");
      (e.target as HTMLFormElement).reset();
      setMessageLen(0);
      setConsent(false);
      toast.success("Message sent — we'll review it and follow up.");
      requestAnimationFrame(() => {
        successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    } catch (err) {
      setStatus("error");
      console.error("Contact form submission failed", err);
      setServerError("Something went wrong. Please try again later.");
      toast.error("Couldn't send your message. Please try again.");
    }
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-10">
        <div className="cx-reveal text-center">
          <HudLabel withDot>Start with the business constraint</HudLabel>
          <h2 className="mt-7 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-silver-gradient sm:text-5xl lg:text-7xl">
            Find out whether the opportunity is worth building.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-[15px] leading-relaxed text-[var(--silver-dim)] sm:text-base">
            Describe the workflow, product opportunity, or operational constraint. We will respond
            with fit, the clearest next step, or a direct no — before anyone commits to the wrong
            build.
          </p>
        </div>

        <GlassPanel liquid className="mt-8 p-5 sm:mt-10 sm:p-8 cx-reveal">
          {status === "success" ? (
            <div ref={successRef} className="flex flex-col items-center gap-3 py-10 text-center">
              <CheckCircle2 className="h-10 w-10 text-[var(--accent-glow)]" />
              <h3 className="font-display text-xl text-[var(--silver)]">Message received</h3>
              <p className="text-sm text-[var(--silver-dim)]">
                Thanks — we'll be in touch shortly.
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="cx-btn mt-2 inline-flex min-h-11 items-center px-3 hud-label text-[var(--accent-glow)] underline-offset-4 hover:underline"
              >
                Send another
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5"
              aria-describedby="contact-form-help"
            >
              <p id="contact-form-help" className="sr-only">
                Required fields are marked. Errors appear below each field.
              </p>

              {/* Honeypot — visually hidden, off-screen, autocomplete off. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="website">Leave this field empty</label>
                <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <Field
                label="Name"
                name="name"
                placeholder="Your full name"
                help="So we know who we're talking to."
                error={errors.name}
                autoComplete="name"
                onValidate={validateField}
                liveValidate={!!errors.name}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                inputMode="email"
                placeholder="you@company.com"
                help="We'll use this address to follow up on your inquiry."
                error={errors.email}
                autoComplete="email"
                onValidate={validateField}
                liveValidate={!!errors.email}
              />
              <Field
                label="Company"
                name="company"
                optional
                placeholder="Where you work (optional)"
                error={errors.company}
                autoComplete="organization"
                onValidate={validateField}
                liveValidate={!!errors.company}
              />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="interest" className="hud-label text-[var(--silver)]">
                  I'm interested in
                </label>
                <select
                  id="interest"
                  name="interest"
                  value={interest}
                  onChange={(e) => setInterest(e.currentTarget.value as ContactInterest)}
                  className="block h-12 w-full cursor-pointer rounded-md border border-[color-mix(in_oklab,var(--silver)_14%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_55%,transparent)] px-4 text-[15px] text-[var(--silver)] outline-none transition focus:border-[var(--accent-glow)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)]"
                >
                  {(Object.entries(CONTACT_INTERESTS) as [ContactInterest, string][]).map(
                    ([value, label]) => (
                      <option key={value} value={value} className="bg-[var(--onyx)]">
                        {label}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <Field
                as="textarea"
                label="Message"
                name="message"
                placeholder="What are you trying to build, automate, or govern?"
                help="A few sentences is enough — at least 10 characters."
                error={errors.message}
                onValidate={validateField}
                liveValidate={!!errors.message}
                onInputChange={(v) => setMessageLen(v.length)}
                counter={messageLen > 1500 ? `${messageLen}/2000` : undefined}
              />

              {serverError && (
                <p
                  className="rounded-md border border-[color-mix(in_oklab,var(--destructive,#ef4444)_45%,transparent)] bg-[color-mix(in_oklab,var(--destructive,#ef4444)_10%,transparent)] px-3 py-2 text-sm text-[color:var(--destructive,#ef4444)]"
                  role="alert"
                  aria-live="polite"
                >
                  {serverError}
                </p>
              )}

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="consent"
                  className="flex items-start gap-3 text-[13px] leading-relaxed text-[var(--silver-dim)]"
                >
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    disabled={!hydrated}
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.currentTarget.checked);
                      if (e.currentTarget.checked && errors.consent) {
                        setErrors((p) => ({ ...p, consent: undefined }));
                      }
                    }}
                    aria-invalid={!!errors.consent}
                    aria-describedby={errors.consent ? "consent-error" : undefined}
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-[color-mix(in_oklab,var(--silver)_30%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_55%,transparent)] accent-[var(--accent-glow)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_oklab,var(--accent-glow)_45%,transparent)]"
                  />
                  <span>
                    I agree to be contacted by Cyryx Labs about this inquiry and acknowledge the{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Cyryx Labs Privacy Policy (opens in a new tab)"
                      className="text-[var(--silver)] underline underline-offset-4 hover:text-[var(--accent-glow)]"
                    >
                      Privacy Policy
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                    . You can withdraw consent at any time by emailing{" "}
                    <a
                      href="mailto:privacy@cyryxlabs.com"
                      className="text-[var(--silver)] underline underline-offset-4 hover:text-[var(--accent-glow)]"
                    >
                      privacy@cyryxlabs.com
                    </a>
                    .
                  </span>
                </label>
                {errors.consent && (
                  <p
                    id="consent-error"
                    role="alert"
                    aria-live="polite"
                    className="text-xs font-medium text-[color:var(--destructive,#ef4444)]"
                  >
                    {errors.consent}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={!hydrated || status === "loading" || !consent}
                aria-disabled={!hydrated || status === "loading" || !consent}
                title={!consent ? "Accept the Privacy Policy to enable sending" : undefined}
                className="cx-btn cx-cta cx-cta-primary cx-liquid-glass mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md px-6 hud-label font-semibold text-[var(--accent-glow)] shadow-[var(--shadow-glow-teal)] sm:w-auto sm:self-start"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    Send message <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </GlassPanel>
      </div>
    </section>
  );

  function validateField(name: keyof Errors, value: string) {
    const schema = (FormSchema.shape as Record<string, z.ZodTypeAny>)[name as string];
    if (!schema) return;
    const r = schema.safeParse(value);
    setErrors((prev) => ({
      ...prev,
      [name]: r.success ? undefined : r.error.issues[0]?.message,
    }));
  }
}

function Field({
  as = "input",
  label,
  name,
  type = "text",
  error,
  help,
  placeholder,
  autoComplete,
  inputMode,
  optional,
  onValidate,
  liveValidate,
  onInputChange,
  counter,
}: {
  as?: "input" | "textarea";
  label: string;
  name: keyof Errors;
  type?: string;
  error?: string;
  help?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  optional?: boolean;
  onValidate?: (name: keyof Errors, value: string) => void;
  liveValidate?: boolean;
  onInputChange?: (value: string) => void;
  counter?: string;
}) {
  const helpId = help ? `${name}-help` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  const baseClass =
    "block w-full rounded-md border bg-[color-mix(in_oklab,var(--onyx)_55%,transparent)] px-4 text-[15px] text-[var(--silver)] placeholder:text-[color-mix(in_oklab,var(--silver-dim)_75%,transparent)] outline-none transition focus:border-[var(--accent-glow)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)]";
  const stateClass = error
    ? "border-[color-mix(in_oklab,var(--destructive,#ef4444)_60%,transparent)] focus:ring-[color-mix(in_oklab,var(--destructive,#ef4444)_35%,transparent)]"
    : "border-[color-mix(in_oklab,var(--silver)_14%,transparent)]";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = e.currentTarget.value;
    onInputChange?.(v);
    if (liveValidate) onValidate?.(name, v);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={name} className="hud-label text-[var(--silver)]">
          {label}
        </label>
        {optional && (
          <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--silver-dim)]">
            Optional
          </span>
        )}
      </div>

      {as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={5}
          required={!optional}
          maxLength={2000}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          onBlur={(e) => onValidate?.(name, e.currentTarget.value)}
          onChange={handleChange}
          className={`${baseClass} ${stateClass} min-h-[7.5rem] py-3 leading-relaxed`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          required={!optional}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          onBlur={(e) => onValidate?.(name, e.currentTarget.value)}
          onChange={handleChange}
          className={`${baseClass} ${stateClass} h-12`}
        />
      )}

      <div className="flex items-start justify-between gap-3">
        {error ? (
          <p
            id={errorId}
            role="alert"
            aria-live="polite"
            className="text-xs font-medium text-[color:var(--destructive,#ef4444)]"
          >
            {error}
          </p>
        ) : help ? (
          <p id={helpId} className="text-xs text-[var(--silver-dim)]">
            {help}
          </p>
        ) : (
          <span />
        )}
        {counter && (
          <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--silver-dim)] tabular-nums">
            {counter}
          </span>
        )}
      </div>
    </div>
  );
}
