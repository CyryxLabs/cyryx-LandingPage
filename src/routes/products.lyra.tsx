import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { ArrowRight } from "lucide-react";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { CONTACT_EMAIL } from "@/lib/cta";

const PATH = "/products/lyra";
const TITLE = "Lyra — Cyryx Labs' Proprietary Model Family for Governed Execution";
const DESC =
  "Lyra is the Cyryx Labs model family powering MAAX Studio and Cyryx Solutions — tuned for agentic execution, command gates, and auditable enterprise workloads.";
const LYRA_EMAIL = `${CONTACT_EMAIL}?subject=${encodeURIComponent("Lyra early access")}`;

const MODEL_FAMILY = [
  {
    name: "Lyra Core",
    role: "General execution model",
    copy:
      "Balanced reasoning and tool-use model for day-to-day MAAX Studio missions, operator chains, and Cyryx Solutions workflows.",
  },
  {
    name: "Lyra Pro",
    role: "Long-horizon agentic runs",
    copy:
      "Higher-context variant tuned for multi-step missions, deep evaluator loops, and complex governance graphs across long sessions.",
  },
  {
    name: "Lyra Guard",
    role: "Policy & evaluator model",
    copy:
      "Specialised smaller model that powers command gates, structural checks, and evaluator scoring inside the MAAX Runtime.",
  },
];

const SURFACES = [
  {
    label: "MAAX Studio",
    copy: "Default model behind missions, operators, gates, and the evaluation terminal.",
  },
  {
    label: "Cyryx Solutions",
    copy: "Used inside custom AI systems we ship to clients — assistants, workflow automations, and integrations.",
  },
  {
    label: "Hosted Lyra API",
    copy: "A governed HTTPS endpoint on lyra.cyryxlabs.com for teams that want Lyra directly in their own stack.",
  },
  {
    label: "Self-hosted deployment",
    copy: "Private deployment for regulated environments that need Lyra inside their own perimeter.",
  },
];

const ROADMAP = [
  {
    phase: "Now",
    label: "Research preview",
    items: [
      "Internal training on governed-execution corpora",
      "Evaluator harness for agentic reliability",
    ],
  },
  {
    phase: "Next",
    label: "Design partners",
    items: [
      "Closed access for MAAX Studio customers",
      "Enterprise-grade audit and policy hooks",
    ],
  },
  {
    phase: "Later",
    label: "General availability",
    items: [
      "Hosted API on lyra.cyryxlabs.com",
      "Self-hosted deployment for regulated environments",
    ],
  },
];

export const Route = createFileRoute("/products/lyra")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH, ogType: "product" }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "Lyra", path: PATH },
      ]),
    ]),
  component: LyraPage,
});

function LyraPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" className="relative">
        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pt-32 pb-16 lg:pt-44">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--silver-dim)]">
            <Link to="/" className="hover:text-[var(--accent-glow)]">Home</Link>
            <span className="mx-2 opacity-60">/</span>
            <Link to="/products" className="hover:text-[var(--accent-glow)]">Products</Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-[var(--silver)]">Lyra</span>
          </nav>
          <HudLabel withDot className="mt-6 text-[var(--accent-glow)]">
            Cyryx Labs · Lyra · Coming soon
          </HudLabel>
          <h1 className="mt-4 max-w-3xl font-display text-[40px] sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-[-0.02em] text-silver-gradient">
            Lyra. The Cyryx model family for governed execution.
          </h1>
          <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]">
            Lyra is the proprietary model layer of the Cyryx stack — a family
            of models trained and evaluated against the same command gates,
            mission ledgers, and evidence graphs our customers ship with.
            Reliability, auditability, and cost control are first-class
            training signals, not afterthoughts.
          </p>
          <p className="mt-4 max-w-2xl text-sm lg:text-base leading-relaxed text-[var(--silver-dim)]">
            Lyra powers MAAX Studio out of the box and is embedded across
            Cyryx Solutions engagements. It is designed for enterprise
            execution — not open-ended chat — with structured tool-use,
            policy-aware generation, and evaluator-friendly outputs.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`mailto:${LYRA_EMAIL}`}
              className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
            >
              Request early access
              <ArrowRight className="h-3.5 w-3.5 text-[var(--accent-glow)]" />
            </a>
            <Link
              to="/products/maax-studio"
              className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors px-3 h-11"
            >
              See MAAX Studio
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-16">
          <HudLabel className="text-[var(--accent-glow)]">Model family</HudLabel>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {MODEL_FAMILY.map((m) => (
              <article key={m.name} className="glass-panel rounded-md p-6">
                <div className="hud-label text-[var(--accent-glow)]">{m.role}</div>
                <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-[var(--silver)]">
                  {m.name}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                  {m.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-16">
          <HudLabel className="text-[var(--accent-glow)]">Where Lyra runs</HudLabel>
          <h2 className="mt-4 max-w-2xl font-display text-2xl sm:text-3xl font-semibold tracking-[-0.01em] text-[var(--silver)]">
            One model family. Multiple governed surfaces.
          </h2>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            {SURFACES.map((s) => (
              <div key={s.label} className="glass-panel rounded-md p-6">
                <dt className="hud-label text-[var(--accent-glow)]">{s.label}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[var(--silver-dim)]">
                  {s.copy}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-16">
          <HudLabel className="text-[var(--accent-glow)]">Operational positioning</HudLabel>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <p className="text-sm lg:text-base leading-relaxed text-[var(--silver-dim)]">
              Lyra is not a general-purpose consumer assistant. It is built to
              operate inside governed pipelines: goal-grounded generation,
              command gates, evaluator scoring, and human review checkpoints
              are part of how the model is trained and served.
            </p>
            <p className="text-sm lg:text-base leading-relaxed text-[var(--silver-dim)]">
              For teams moving from scattered AI experiments to structured
              operations, Lyra is the model layer beneath that shift —
              consistent behaviour across missions, transparent evidence for
              every step, and predictable cost and latency envelopes.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-24 lg:pb-32">
          <HudLabel className="text-[var(--accent-glow)]">Roadmap</HudLabel>
          <ol className="mt-6 grid gap-4 lg:grid-cols-3">
            {ROADMAP.map((r) => (
              <li key={r.phase} className="glass-panel rounded-md p-6">
                <div className="hud-label text-[var(--accent-glow)]">{r.phase}</div>
                <h2 className="mt-2 font-display text-xl font-semibold tracking-tight text-[var(--silver)]">
                  {r.label}
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-[var(--silver-dim)]">
                  {r.items.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span
                        aria-hidden
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent-glow)]"
                      />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <Footer />
    </div>
  );
}