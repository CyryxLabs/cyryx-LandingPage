import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { ArrowRight } from "lucide-react";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { CONTACT_EMAIL } from "@/lib/cta";
import { useMemo, useState } from "react";
import { z } from "zod";

const PATH = "/careers";
const TITLE = "Careers — Build the Agentic Era at Cyryx Labs";
const DESC =
  "Join Cyryx Labs to build governed AI execution systems. Open roles across applied research, product engineering, and agentic runtime.";
const CAREERS_EMAIL = "careers@cyryxlabs.com";
const RECIPIENTS = `${CONTACT_EMAIL},${CAREERS_EMAIL}`;

const ApplicationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  role: z.string().trim().min(1, "Select a role").max(120),
  location: z.string().trim().max(120).optional().default(""),
  links: z.string().trim().max(500).optional().default(""),
  message: z.string().trim().min(20, "Tell us a bit more (20+ chars)").max(2000),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
  website: z.string().max(0).optional().default(""), // honeypot
});
type ApplicationInput = z.infer<typeof ApplicationSchema>;

const ROLES = [
  {
    title: "Founding Applied AI Engineer",
    location: "Remote · Global",
    type: "Full-time",
    summary:
      "Design and ship agentic runtimes: mission execution, command gates, evaluators. Strong Python/TypeScript and LLM systems experience.",
  },
  {
    title: "Senior Product Engineer (MAAX Studio)",
    location: "Remote · Global",
    type: "Full-time",
    summary:
      "Own end-to-end features of MAAX Studio. Deep React/TypeScript, thoughtful about UX for high-stakes tooling.",
  },
  {
    title: "AI Research Engineer — Lyra",
    location: "Remote · Global",
    type: "Full-time",
    summary:
      "Contribute to the training and evaluation stack behind Lyra, our proprietary model line. Background in ML research, RL, or post-training.",
  },
  {
    title: "Solutions Architect",
    location: "Remote · Americas / EMEA",
    type: "Full-time",
    summary:
      "Partner with enterprise customers to design governed AI systems on top of MAAX. Consulting mindset, strong technical breadth.",
  },
];

function applyHref(role: string) {
  return `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(
    `Application — ${role}`,
  )}&body=${encodeURIComponent(
    [
      "Hi Cyryx team,",
      "",
      `I'd like to apply for the ${role} role.`,
      "",
      "• Name:",
      "• Location / time zone:",
      "• LinkedIn / GitHub / portfolio:",
      "• Short intro (why Cyryx, relevant experience):",
      "",
      "Resume attached.",
      "",
      "Thanks,",
    ].join("\n"),
  )}`;
}

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
            Cyryx Labs · Careers
          </HudLabel>
          <h1 className="mt-4 max-w-3xl font-display text-[40px] sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-[-0.02em] text-silver-gradient">
            Build the agentic era with us.
          </h1>
          <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]">
            We are a small, senior team shipping governed AI execution systems for
            production. Remote-first, high-agency, engineering-led.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent("General application")}`}
              className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
            >
              General application
              <ArrowRight className="h-3.5 w-3.5 text-[var(--accent-glow)]" />
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Careers inquiry")}`}
              className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors px-3 h-11"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-24 lg:pb-32">
          <HudLabel className="text-[var(--accent-glow)]">Open roles</HudLabel>
          <ul className="mt-6 grid gap-4">
            {ROLES.map((r) => (
              <li
                key={r.title}
                className="glass-panel flex flex-col gap-4 rounded-md p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8"
              >
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[var(--silver)]">
                    {r.title}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--silver-dim)]">{r.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em] text-[var(--silver-dim)]">
                    <span className="rounded-sm border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] px-2 py-1">
                      {r.location}
                    </span>
                    <span className="rounded-sm border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] px-2 py-1">
                      {r.type}
                    </span>
                  </div>
                </div>
                <a
                  href={`#apply?role=${encodeURIComponent(r.title)}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("apply");
                    const select = document.getElementById("apply-role") as HTMLSelectElement | null;
                    if (select) select.value = r.title;
                    el?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="inline-flex items-center gap-2 hud-label text-[var(--accent-glow)] hover:opacity-80 transition-opacity"
                >
                  Apply
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
          </ul>

          <ApplicationForm />
        </section>
      </main>
      <Footer />
    </div>
  );
}

function ApplicationForm() {
  const [values, setValues] = useState<ApplicationInput>({
    name: "",
    email: "",
    role: ROLES[0]?.title ?? "General application",
    location: "",
    links: "",
    message: "",
    consent: true as const,
    website: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationInput, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const roleOptions = useMemo(
    () => [...ROLES.map((r) => r.title), "Open application"],
    [],
  );

  function update<K extends keyof ApplicationInput>(key: K, v: ApplicationInput[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = ApplicationSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrs: Partial<Record<keyof ApplicationInput, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof ApplicationInput;
        if (!fieldErrs[k]) fieldErrs[k] = issue.message;
      }
      setErrors(fieldErrs);
      return;
    }
    if (parsed.data.website && parsed.data.website.length > 0) {
      setSubmitted(true);
      return;
    }
    setErrors({});
    const d = parsed.data;
    const subject = `Application — ${d.role}`;
    const body = [
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      `Location: ${d.location || "—"}`,
      `Links: ${d.links || "—"}`,
      "",
      "Message:",
      d.message,
      "",
      "— Sent from cyryxlabs.com/careers",
    ].join("\n");
    const href = `mailto:${RECIPIENTS}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setSubmitted(true);
  }

  const fieldCls =
    "mt-1 w-full rounded-sm border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_60%,transparent)] px-3 py-2 text-sm text-[var(--silver)] placeholder:text-[var(--silver-dim)] focus:outline-none focus:border-[var(--accent-glow)]";
  const labelCls = "hud-label text-[var(--silver-dim)]";
  const errCls = "mt-1 text-xs text-[color:oklch(0.72_0.16_25)]";

  return (
    <div
      id="apply"
      className="mt-12 scroll-mt-32 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_25%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_60%,transparent)] p-8 backdrop-blur-sm"
    >
      <HudLabel withDot>Apply</HudLabel>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--silver-dim)]">
        Send your application to {CONTACT_EMAIL} and {CAREERS_EMAIL}. We read
        every message.
      </p>

      {submitted ? (
        <div
          role="status"
          aria-live="polite"
          className="mt-6 rounded-sm border border-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)] p-4 text-sm text-[var(--silver)]"
        >
          Your email draft is opening now. If nothing happened, write to{" "}
          <a className="text-[var(--accent-glow)]" href={`mailto:${RECIPIENTS}`}>
            {CAREERS_EMAIL}
          </a>
          .
        </div>
      ) : (
        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={onSubmit} noValidate>
          <div
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            className="sr-only sm:col-span-2"
          >
            {Object.values(errors).filter(Boolean).length > 0
              ? `Form has ${Object.values(errors).filter(Boolean).length} error${Object.values(errors).filter(Boolean).length === 1 ? "" : "s"}. ${Object.values(errors).filter(Boolean).join(". ")}`
              : ""}
          </div>
          <div>
            <label htmlFor="apply-name" className={labelCls}>Name</label>
            <input
              id="apply-name"
              className={fieldCls}
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              autoComplete="name"
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "apply-name-err" : undefined}
            />
            {errors.name && <p id="apply-name-err" role="alert" className={errCls}>{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="apply-email" className={labelCls}>Email</label>
            <input
              id="apply-email"
              type="email"
              className={fieldCls}
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              autoComplete="email"
              required
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "apply-email-err" : undefined}
            />
            {errors.email && <p id="apply-email-err" role="alert" className={errCls}>{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="apply-role" className={labelCls}>Role</label>
            <select
              id="apply-role"
              className={fieldCls}
              value={values.role}
              onChange={(e) => update("role", e.target.value)}
              aria-invalid={!!errors.role}
              aria-describedby={errors.role ? "apply-role-err" : undefined}
            >
              {roleOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.role && <p id="apply-role-err" role="alert" className={errCls}>{errors.role}</p>}
          </div>
          <div>
            <label htmlFor="apply-location" className={labelCls}>Location / time zone</label>
            <input
              id="apply-location"
              className={fieldCls}
              value={values.location}
              onChange={(e) => update("location", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="apply-links" className={labelCls}>Links (LinkedIn, GitHub, portfolio)</label>
            <input
              id="apply-links"
              className={fieldCls}
              value={values.links}
              onChange={(e) => update("links", e.target.value)}
              placeholder="https://…"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="apply-message" className={labelCls}>Why Cyryx & relevant experience</label>
            <textarea
              id="apply-message"
              rows={5}
              className={fieldCls}
              value={values.message}
              onChange={(e) => update("message", e.target.value)}
              required
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "apply-message-err" : undefined}
            />
            {errors.message && <p id="apply-message-err" role="alert" className={errCls}>{errors.message}</p>}
          </div>

          {/* Honeypot */}
          <div className="hidden" aria-hidden>
            <label>
              Website
              <input
                tabIndex={-1}
                autoComplete="off"
                value={values.website}
                onChange={(e) => update("website", e.target.value)}
              />
            </label>
          </div>

          <div className="sm:col-span-2 flex items-start gap-2">
            <input
              id="apply-consent"
              type="checkbox"
              checked={values.consent}
              onChange={(e) => update("consent", e.target.checked as true)}
              className="mt-1"
            />
            <label htmlFor="apply-consent" className="text-xs text-[var(--silver-dim)]">
              I agree that Cyryx Labs may process the information above to
              evaluate my application.
            </label>
          </div>
          {errors.consent && <p role="alert" className={`sm:col-span-2 ${errCls}`}>{errors.consent}</p>}

          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
            >
              Send application
              <ArrowRight className="h-3.5 w-3.5 text-[var(--accent-glow)]" />
            </button>
            <a
              href={applyHref(values.role)}
              className="hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors"
            >
              Or open in your email client
            </a>
          </div>
        </form>
      )}
    </div>
  );
}