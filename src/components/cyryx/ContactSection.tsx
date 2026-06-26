import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";
import { GlassPanel } from "./primitives/GlassPanel";
import { submitContact } from "@/lib/contact.functions";

const FormSchema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  company: z.string().trim().max(120).optional().default(""),
  message: z.string().trim().min(10, "At least 10 characters").max(2000),
});

type Errors = Partial<Record<keyof z.infer<typeof FormSchema>, string>>;

export function ContactSection() {
  const submit = useServerFn(submitContact);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      message: String(fd.get("message") ?? ""),
    };
    const parsed = FormSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      await submit({ data: parsed.data });
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      console.error("Contact form submission failed", err);
      setServerError("Something went wrong. Please try again later.");
    }
  }

  return (
    <section id="contact" className="relative py-14 sm:py-20 lg:py-32">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal text-center">
          <HudLabel withDot>Contact</HudLabel>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-[1.05] text-silver-gradient">
            Start a <span style={{ color: "var(--accent-glow)" }}>conversation</span>
          </h2>
          <p className="mt-4 text-[15px] sm:text-base text-[var(--silver-dim)]">
            Tell us what you want to build. We typically reply within 24h.
          </p>
        </div>

        <GlassPanel liquid className="mt-8 p-5 sm:mt-10 sm:p-8 cx-reveal">
          {status === "success" ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <CheckCircle2 className="h-10 w-10 text-[var(--accent-glow)]" />
              <h3 className="font-display text-xl uppercase text-[var(--silver)]">Message received</h3>
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

              <Field
                label="Name"
                name="name"
                placeholder="Your full name"
                help="So we know who we're talking to."
                error={errors.name}
                autoComplete="name"
                onValidate={validateField}
              />
              <Field
                label="Email"
                name="email"
                type="email"
                inputMode="email"
                placeholder="you@company.com"
                help="We'll reply here within 24h."
                error={errors.email}
                autoComplete="email"
                onValidate={validateField}
              />
              <Field
                label="Company"
                name="company"
                optional
                placeholder="Where you work (optional)"
                error={errors.company}
                autoComplete="organization"
                onValidate={validateField}
              />
              <Field
                as="textarea"
                label="Message"
                name="message"
                placeholder="What are you trying to build, automate, or govern?"
                help="A few sentences is enough — at least 10 characters."
                error={errors.message}
                onValidate={validateField}
              />

              {serverError && (
                <p
                  className="rounded-md border border-[color-mix(in_oklab,var(--destructive,#ef4444)_45%,transparent)] bg-[color-mix(in_oklab,var(--destructive,#ef4444)_10%,transparent)] px-3 py-2 text-sm text-[color:var(--destructive,#ef4444)]"
                  role="alert"
                >
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="cx-btn cx-liquid-glass mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md px-6 hud-label font-semibold text-[var(--accent-glow)] shadow-[var(--shadow-glow-teal)] disabled:opacity-60 sm:w-auto sm:self-start"
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
    const schema = (
      FormSchema.shape as Record<string, z.ZodTypeAny>
    )[name as string];
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
}) {
  const helpId = help ? `${name}-help` : undefined;
  const errorId = error ? `${name}-error` : undefined;
  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  const baseClass =
    "block w-full rounded-md border bg-[color-mix(in_oklab,var(--onyx)_55%,transparent)] px-4 text-[15px] text-[var(--silver)] placeholder:text-[color-mix(in_oklab,var(--silver-dim)_75%,transparent)] outline-none transition focus:border-[var(--accent-glow)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)]";
  const stateClass = error
    ? "border-[color-mix(in_oklab,var(--destructive,#ef4444)_60%,transparent)] focus:ring-[color-mix(in_oklab,var(--destructive,#ef4444)_35%,transparent)]"
    : "border-[color-mix(in_oklab,var(--silver)_14%,transparent)]";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor={name}
          className="hud-label text-[var(--silver)]"
        >
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
          className={`${baseClass} ${stateClass} h-12`}
        />
      )}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-medium text-[color:var(--destructive,#ef4444)]"
        >
          {error}
        </p>
      ) : help ? (
        <p id={helpId} className="text-xs text-[var(--silver-dim)]">
          {help}
        </p>
      ) : null}
    </div>
  );
}