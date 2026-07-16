import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead, buildServiceJsonLd } from "@/components/cyryx/seo/seo";
import { START_PROJECT_HREF } from "@/lib/cta";

const PATH = "/managed-operations";
const TITLE = "Managed Intelligence & Operations — Cyryx Labs";
const DESC =
  "Defined operational coverage for websites, automations, and AI systems: evaluations, incident handling, model and cost tuning, and continuous improvement.";

const COVERAGE = [
  { title: "Website & digital care", body: "Uptime monitoring, security patches, content updates, form and analytics integrity, and quarterly review." },
  { title: "Automation care", body: "Runbook execution, exception triage, connector maintenance, and quarterly workflow review." },
  { title: "AI systems care", body: "Evaluation runs, drift and cost monitoring, model regression testing, prompt and gate tuning, and incident support." },
  { title: "Enterprise coverage", body: "Custom scope for multi-workflow or multi-department deployments, including named response windows." },
];

const PRINCIPLES = [
  "Defined systems, response windows, and exclusions in writing.",
  "Named human owners on both sides.",
  "Evaluation and cost reports published on a fixed cadence.",
  "Change requests logged, priced, and approved before work begins.",
];

export const Route = createFileRoute("/managed-operations")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Managed Operations", path: PATH },
      ]),
      buildServiceJsonLd({
        name: "Cyryx Managed Intelligence & Operations",
        serviceType: "Managed AI operations",
        description: DESC,
        path: PATH,
      }),
    ]),
  component: ManagedOpsPage,
});

function ManagedOpsPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" className="relative">
        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pt-32 pb-16 lg:pt-44">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--silver-dim)]">
            <Link to="/" className="hover:text-[var(--accent-glow)]">Home</Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-[var(--silver)]">Managed Operations</span>
          </nav>
          <HudLabel withDot className="mt-6 text-[var(--accent-glow)]">Managed Intelligence & Operations</HudLabel>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-silver-gradient">
            Operate systems, not tickets.
          </h1>
          <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]">
            Managed coverage for websites, workflows, and AI systems built on the architectures. Delivered under defined scope, exclusions, and response windows. Not an unlimited retainer.
          </p>
          <p className="mt-4 max-w-2xl text-sm text-[var(--silver-dim)]">
            Managed AI Operations starts at $2,500 per month. Enterprise coverage is custom scope.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-16">
          <h2 className="font-display text-xl font-semibold text-[var(--silver)]">Coverage areas</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {COVERAGE.map((c) => (
              <li key={c.title} className="glass-panel rounded-md p-6">
                <h3 className="font-display text-base font-semibold uppercase tracking-wider text-[var(--silver)]">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">{c.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-16">
          <h2 className="font-display text-xl font-semibold text-[var(--silver)]">Operating principles</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--silver-dim)]">
            {PRINCIPLES.map((p) => (
              <li key={p} className="flex gap-2"><span aria-hidden className="text-[var(--accent-glow)]">·</span><span>{p}</span></li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-24">
          <div className="flex flex-wrap gap-3">
            <a href={START_PROJECT_HREF} className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label">
              Discuss managed coverage
              <span aria-hidden className="text-[var(--accent-glow)]">→</span>
            </a>
            <Link to="/engagement-model" className="inline-flex items-center h-11 px-3 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)]">
              Engagement model
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}