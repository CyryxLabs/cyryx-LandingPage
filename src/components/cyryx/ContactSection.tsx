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
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal text-center">
          <HudLabel withDot>Contact</HudLabel>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-[1.05] text-silver-gradient">
            Start a <span style={{ color: "var(--accent-glow)" }}>conversation</span>
          </h2>
          <p className="mt-4 text-[15px] sm:text-base text-[var(--silver-dim)]">
            Tell us what you want to build. We typically reply within 24h.
          </p>
        </div>

        <GlassPanel liquid className="mt-10 p-5 sm:p-8 cx-reveal">
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
                className="mt-2 inline-flex min-h-11 items-center px-3 hud-label text-[var(--accent-glow)] underline-offset-4 hover:underline"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="grid gap-4">
              <Field label="Name" name="name" error={errors.name} autoComplete="name" />
              <Field
                label="Email"
                name="email"
                type="email"
                inputMode="email"
                error={errors.email}
                autoComplete="email"
              />
              <Field label="Company (optional)" name="company" error={errors.company} autoComplete="organization" />
              <div>
                <label htmlFor="message" className="hud-label text-[var(--silver-dim)]">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  maxLength={2000}
                  className="mt-2 w-full rounded-md border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_70%,transparent)] px-4 py-3 text-[15px] text-[var(--silver)] outline-none transition focus:border-[var(--accent-glow)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)]"
                  placeholder="What are you trying to build, automate, or govern?"
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-[color:var(--destructive,#ef4444)]">{errors.message}</p>
                )}
              </div>

              {serverError && (
                <p className="text-sm text-[color:var(--destructive,#ef4444)]" role="alert">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-2 inline-flex h-12 min-h-[44px] w-full items-center justify-center gap-2 rounded-md bg-[var(--accent-glow)] px-6 hud-label font-semibold text-[var(--onyx)] shadow-[var(--shadow-glow-teal)] transition hover:brightness-110 disabled:opacity-60 sm:w-auto sm:self-start"
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
}

function Field({
  label,
  name,
  type = "text",
  error,
  autoComplete,
  inputMode,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div>
      <label htmlFor={name} className="hud-label text-[var(--silver-dim)]">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        required={!label.includes("optional")}
        className="mt-2 h-12 min-h-[44px] w-full rounded-md border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_70%,transparent)] px-4 text-[15px] text-[var(--silver)] outline-none transition focus:border-[var(--accent-glow)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)]"
      />
      {error && <p className="mt-1.5 text-xs text-[color:var(--destructive,#ef4444)]">{error}</p>}
    </div>
  );
}