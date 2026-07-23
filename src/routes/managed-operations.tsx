import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead, buildServiceJsonLd } from "@/components/cyryx/seo/seo";
import { START_PROJECT_HREF } from "@/lib/cta";

const PATH = "/managed-operations";
const TITLE = "Managed Operations — Cyryx Labs";
const DESC =
  "Defined monitoring, maintenance, optimization, reporting, escalation, and transition support for selected digital and AI systems.";

const OPERATING_AREAS = [
  [
    "Digital systems",
    "Websites, applications, forms, analytics, integrations, and related digital infrastructure included in scope.",
  ],
  [
    "Workflow systems",
    "Connectors, exceptions, queues, approvals, and operational paths defined for the engagement.",
  ],
  [
    "AI-enabled systems",
    "Evaluation, usage, cost, provider, model, prompt, and control changes where supported by the architecture.",
  ],
] as const;

const LIFECYCLE = [
  ["Monitor", "Observe the agreed systems, signals, and thresholds."],
  ["Maintain", "Apply defined updates, repairs, and dependency changes."],
  ["Optimize", "Review quality, usability, cost, and operating friction on an agreed cadence."],
  ["Report", "Communicate material activity, findings, decisions, and open risk."],
  [
    "Escalate",
    "Route incidents and decisions according to written responsibility and response expectations.",
  ],
  [
    "Transition",
    "Support handover, provider change, or end of service with agreed access and documentation.",
  ],
] as const;

export const Route = createFileRoute("/managed-operations")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Managed Operations", path: PATH },
      ]),
      buildServiceJsonLd({
        name: "Cyryx Managed Operations",
        serviceType: "Managed digital and AI system operations",
        description: DESC,
        path: PATH,
      }),
    ]),
  component: ManagedOperationsPage,
});

function ManagedOperationsPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content">
        <section className="border-b border-white/10 px-5 pb-24 pt-32 sm:px-8 lg:pb-32 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <HudLabel withDot>Operate / Engagement-specific</HudLabel>
            <div className="mt-8 grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-24">
              <h1 className="max-w-[11ch] font-display text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-[var(--silver)] sm:text-6xl lg:text-8xl">
                Keep the system useful after launch.
              </h1>
              <div className="lg:pb-2">
                <p className="max-w-2xl text-lg leading-relaxed text-[var(--silver-dim)] sm:text-xl">
                  Cyryx can monitor, maintain, optimize, and evolve selected systems when continuing
                  operational responsibility is part of the engagement. Coverage is never assumed:
                  systems, owners, response expectations, exclusions, and transition are defined in
                  writing.
                </p>
                <a
                  href={START_PROJECT_HREF}
                  className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-md border border-[var(--accent-glow)] px-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent-glow)] transition hover:bg-[var(--accent-glow)] hover:text-[var(--onyx)]"
                >
                  Discuss managed coverage <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <HudLabel>What can be operated</HudLabel>
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 lg:grid-cols-3">
            {OPERATING_AREAS.map(([title, body], index) => (
              <article key={title} className="min-h-80 bg-[var(--obsidian)] p-8 sm:p-10">
                <span className="font-mono text-[9px] text-[var(--accent-glow)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-14 font-display text-3xl font-medium tracking-[-0.035em] text-[var(--silver)]">
                  {title}
                </h2>
                <p className="mt-5 text-[15px] leading-relaxed text-[var(--silver-dim)]">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[var(--graphite)] px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.65fr_1.35fr] lg:gap-24">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <HudLabel withDot>Operating lifecycle</HudLabel>
              <h2 className="mt-6 font-display text-4xl font-medium leading-[1.02] tracking-[-0.04em] text-[var(--silver)] sm:text-5xl">
                A service is a responsibility model, not a bundle of tickets.
              </h2>
            </div>
            <ol className="border-t border-white/10">
              {LIFECYCLE.map(([title, body], index) => (
                <li
                  key={title}
                  className="grid gap-5 border-b border-white/10 py-7 sm:grid-cols-[3rem_0.55fr_1.45fr] sm:py-9"
                >
                  <span className="font-mono text-[9px] text-[var(--accent-glow)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl font-medium text-[var(--silver)]">{title}</h3>
                  <p className="text-[15px] leading-relaxed text-[var(--silver-dim)]">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-2 lg:gap-24 lg:px-10 lg:py-40">
          <div>
            <HudLabel>Responsibility boundaries</HudLabel>
            <h2 className="mt-6 font-display text-4xl font-medium tracking-[-0.04em] text-[var(--silver)] sm:text-5xl">
              Both sides know what they own.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[var(--silver-dim)]">
              The operating agreement identifies included systems, access, client dependencies,
              decision owners, change approval, third-party providers, security responsibilities,
              escalation, exclusions, and the transition path.
            </p>
          </div>
          <div>
            <HudLabel>Service expectations</HudLabel>
            <p className="mt-6 text-lg leading-relaxed text-[var(--silver-dim)]">
              Monitoring coverage, reporting cadence, maintenance windows, response targets, support
              channels, pricing, and term are defined per engagement. Cyryx does not publish a
              universal managed-service scope or response guarantee.
            </p>
            <Link
              to="/engagement-model"
              className="mt-7 inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--silver)] transition hover:text-[var(--accent-glow)]"
            >
              Review the engagement lifecycle <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
