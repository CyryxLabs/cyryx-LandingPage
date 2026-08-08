import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { InternalHero } from "@/components/cyryx/InternalHero";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { submitContact } from "@/lib/contact.functions";
import { trackCta } from "@/lib/track-cta";

const PATH = "/careers";
const TITLE = "Careers — Cyryx Labs Talent Network";
const DESC =
  "Cyryx Labs has no active openings. Join the talent network for possible future roles in applied research, product engineering, and client systems delivery.";
const CAREERS_EMAIL = "careers@cyryxlabs.com";

const AREAS = [
  "Applied Research",
  "Product Engineering",
  "Solutions & Systems Delivery",
  "Design & Product Experience",
  "Operations",
  "Other",
] as const;

const PRINCIPLES = [
  {
    n: "01",
    title: "Evidence over theater",
    body: "Clear reasoning, testable work, and honest limitations matter more than inflated AI claims.",
  },
  {
    n: "02",
    title: "Systems over demos",
    body: "The work is shaped around ownership, failure recovery, evaluation, and the operating reality around the product.",
  },
  {
    n: "03",
    title: "Judgment with agency",
    body: "Strong contributors can move independently while surfacing risk, constraints, and decisions early.",
  },
] as const;

const FAQ = [
  {
    q: "Are there active roles now?",
    a: "No. Cyryx Labs is not actively hiring and there are no published openings on this page.",
  },
  {
    q: "When will roles open?",
    a: "There is no published hiring calendar. Roles are opened only when there is a defined need and an approved role brief.",
  },
  {
    q: "What happens after I join the talent network?",
    a: "Your submission is reviewed as a future-talent inquiry. If a relevant role opens, Cyryx may contact you. Submission does not guarantee an interview or future outreach.",
  },
  {
    q: "Can I send a résumé or portfolio directly?",
    a: "Yes. Use the profile field below or email careers@cyryxlabs.com with a concise introduction, your location or time zone, area of interest, and links to your work.",
  },
] as const;

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
        <InternalHero
          eyebrow="Careers · Talent network"
          title="Build systems that deserve trust."
          body="Cyryx brings together applied research, product engineering, design, and systems delivery. There are no active openings today; the talent network is the honest starting point for future opportunities."
          primaryCta={{
            label: "Join the talent network",
            href: "#talent-network-heading",
            onClick: () =>
              trackCta({
                cta: "careers_talent_network",
                section: "hero",
                href: "#talent-network-heading",
              }),
          }}
          secondaryCta={{
            label: "Email careers",
            href: `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent("Talent network — introduction")}`,
            onClick: (event) =>
              trackCta({ cta: "careers_email", section: "hero", href: event.currentTarget.href }),
          }}
          boundaryNote="Current status · No open roles"
          lifecycleLabel="Working standard"
          lifecycle={[
            { number: "01", label: "Craft" },
            { number: "02", label: "Judgment" },
            { number: "03", label: "Evidence" },
            { number: "04", label: "Ownership" },
          ]}
          nextChapter={{
            title: "The standard comes before the headcount.",
            body: "We begin with the quality of the work, the clarity of the judgment, and the responsibility to operate what we build.",
          }}
        />

        <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 lg:px-12">
          <section aria-labelledby="careers-principles-heading" className="py-20 lg:py-28">
            <HudLabel>How we think about the work</HudLabel>
            <h2
              id="careers-principles-heading"
              className="mt-6 max-w-[15ch] font-display text-4xl tracking-[-0.04em] text-[var(--silver)] sm:text-5xl"
            >
              The standard comes before the headcount.
            </h2>
            <ol className="mt-12 grid border-y border-[color-mix(in_oklab,var(--silver)_14%,transparent)] lg:grid-cols-3">
              {PRINCIPLES.map((principle) => (
                <li
                  key={principle.n}
                  className="border-b border-[color-mix(in_oklab,var(--silver)_14%,transparent)] py-8 last:border-b-0 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
                >
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--accent-glow)]">
                    {principle.n}
                  </span>
                  <h3 className="mt-5 font-display text-2xl tracking-[-0.03em] text-[var(--silver)]">
                    {principle.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--silver-dim)] sm:text-base">
                    {principle.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section
            aria-labelledby="talent-network-heading"
            className="grid gap-12 border-t border-[color-mix(in_oklab,var(--silver)_14%,transparent)] py-20 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-20 lg:py-28"
          >
            <div>
              <HudLabel>Talent network</HudLabel>
              <h2
                id="talent-network-heading"
                className="mt-6 max-w-[12ch] font-display text-4xl tracking-[-0.04em] text-[var(--silver)] sm:text-5xl"
              >
                Introduce your work, not just your résumé.
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[var(--silver-dim)]">
                Share the discipline you work in and one link that best represents your judgment.
                Your information is used only to consider potential future roles under the Cyryx
                Labs Privacy Policy.
              </p>
              <a
                href={`mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent("Talent network — introduction")}`}
                className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm text-[var(--silver)] transition-colors hover:text-[var(--accent-glow)]"
              >
                {CAREERS_EMAIL}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
            <TalentNetworkForm />
          </section>

          <section
            aria-labelledby="careers-faq-heading"
            className="border-t border-[color-mix(in_oklab,var(--silver)_14%,transparent)] py-20 lg:py-28"
          >
            <HudLabel>Careers FAQ</HudLabel>
            <h2
              id="careers-faq-heading"
              className="mt-6 max-w-[13ch] font-display text-4xl tracking-[-0.04em] text-[var(--silver)] sm:text-5xl"
            >
              Clear expectations from the start.
            </h2>
            <dl className="mt-10 border-y border-[color-mix(in_oklab,var(--silver)_14%,transparent)]">
              {FAQ.map((item) => (
                <div
                  key={item.q}
                  className="grid gap-3 border-b border-[color-mix(in_oklab,var(--silver)_14%,transparent)] py-7 last:border-b-0 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:gap-16"
                >
                  <dt className="font-display text-xl text-[var(--silver)]">{item.q}</dt>
                  <dd className="text-sm leading-relaxed text-[var(--silver-dim)] sm:text-base">
                    {item.a}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

type FormState = "idle" | "submitting" | "success" | "error";

function TalentNetworkForm() {
  const [status, setStatus] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = event.currentTarget;
    const data = new FormData(form);
    if (String(data.get("website") ?? "")) {
      setStatus("success");
      return;
    }

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const area = String(data.get("area") ?? "").trim();
    const profile = String(data.get("profile") ?? "").trim();
    const context = String(data.get("context") ?? "").trim();
    const consent = data.get("consent") === "on";

    if (!name || !email || !area || !consent) {
      setStatus("error");
      setError("Complete the required fields and confirm the privacy consent.");
      return;
    }

    setStatus("submitting");
    try {
      await submitContact({
        data: {
          name,
          email,
          company: "",
          interest: "other",
          consent: true,
          website: "",
          message: [
            "Talent network introduction",
            `Area: ${area}`,
            `Profile: ${profile || "Not provided"}`,
            "",
            context || "No additional context provided.",
          ].join("\n"),
        },
      });
      trackCta({ cta: "talent_network_signup", section: "careers", href: PATH });
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
      setError(`We could not record the introduction. Try again or email ${CAREERS_EMAIL}.`);
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        tabIndex={-1}
        className="cx-material-panel border border-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)] p-7 sm:p-9"
      >
        <CheckCircle2 className="h-8 w-8 text-[var(--accent-glow)]" aria-hidden />
        <h3 className="mt-5 font-display text-2xl text-[var(--silver)]">Introduction received.</h3>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--silver-dim)]">
          Thank you. This records a future-talent inquiry; it is not an application to an active
          role and does not guarantee future contact.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex min-h-11 items-center hud-label text-[var(--accent-glow)] hover:underline"
        >
          Submit another introduction
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="cx-material-panel border p-6 sm:p-9">
      <div aria-hidden="true" className="absolute -left-[10000px] h-0 w-0 overflow-hidden">
        <label htmlFor="talent-website">Website</label>
        <input id="talent-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <TalentField label="Full name" name="name" autoComplete="name" required />
        <TalentField label="Email" name="email" type="email" autoComplete="email" required />
        <label className="block">
          <span className="hud-label text-[var(--silver)]">
            Area of interest{" "}
            <span aria-hidden className="text-[var(--accent-glow)]">
              *
            </span>
          </span>
          <select name="area" defaultValue="" required className={fieldClass}>
            <option value="" disabled>
              Select an area…
            </option>
            {AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </label>
        <TalentField
          label="Portfolio, GitHub, or LinkedIn"
          name="profile"
          type="url"
          placeholder="https://"
        />
      </div>

      <label className="mt-6 block">
        <span className="hud-label text-[var(--silver)]">Short introduction</span>
        <textarea
          name="context"
          rows={4}
          maxLength={1200}
          placeholder="What kind of problems do you solve best?"
          className={`${fieldClass} min-h-28 py-3`}
        />
      </label>

      <label className="mt-6 flex items-start gap-3 text-sm leading-relaxed text-[var(--silver-dim)]">
        <input
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent-glow)]"
        />
        <span>
          I agree to be contacted about possible future roles and acknowledge the{" "}
          <Link
            to="/privacy"
            className="text-[var(--silver)] underline underline-offset-4 hover:text-[var(--accent-glow)]"
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      {error && (
        <p role="alert" className="mt-5 text-sm text-[color:oklch(0.72_0.16_25)]">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="cx-btn cx-liquid-glass mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 hud-label text-[var(--silver)] disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Join the talent network"}
        <ArrowRight className="h-4 w-4 text-[var(--accent-glow)]" aria-hidden />
      </button>
    </form>
  );
}

const fieldClass =
  "mt-2 block h-12 w-full rounded-md border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] bg-[color-mix(in_oklab,var(--onyx)_65%,transparent)] px-4 text-sm text-[var(--silver)] placeholder:text-[var(--silver-dim)] outline-none focus:border-[var(--accent-glow)] focus:ring-2 focus:ring-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)]";

function TalentField({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="hud-label text-[var(--silver)]">
        {label}{" "}
        {required && (
          <span aria-hidden className="text-[var(--accent-glow)]">
            *
          </span>
        )}
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        className={fieldClass}
      />
    </label>
  );
}
