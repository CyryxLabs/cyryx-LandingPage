import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";

const PATH = "/products";
const TITLE = "Products — Cyryx Labs";
const DESC =
  "Explore the Cyryx Labs product ecosystem, including MAAX Studio and future Cyryx systems built around governed execution.";

const PRODUCTS = [
  {
    eyebrow: "Flagship · In development",
    name: "MAAX Studio",
    tagline: "Agentic execution environment for AI-native builders.",
    description:
      "Missions, command gates, goal-grounded generation, project context graph, and mission ledgers — the runtime we use to ship every Cyryx system.",
    bullets: [
      "Mission-based execution with explicit acceptance criteria",
      "Command gates for policy, structure, and task-quality control",
      "Audit ledgers: what ran, under whose authority, at what cost",
    ],
    href: "/products/maax-studio",
    cta: "Explore MAAX Studio",
    status: "Pre-release · early access",
  },
  {
    eyebrow: "Research program",
    name: "Cyryx Applied AI Lab",
    tagline: "Applied research feeding every product and engagement.",
    description:
      "Publications, evaluation harnesses, and reference implementations that make our claims about governed AI execution verifiable.",
    bullets: [
      "Evaluator design and regression suites for agentic systems",
      "Reference architectures for command gates and mission ledgers",
      "Public write-ups of methods used in Cyryx deliveries",
    ],
    href: "/research",
    cta: "Read the research",
    status: "Publishing",
  },
];

export const Route = createFileRoute("/products")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Products", path: PATH },
      ]),
    ]),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main className="relative">
        <section className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12 pt-32 pb-16 lg:pt-44">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--silver-dim)]">
            <Link to="/" className="hover:text-[var(--accent-glow)]">Home</Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-[var(--silver)]">Products</span>
          </nav>
          <HudLabel withDot className="mt-6 text-[var(--accent-glow)]">
            Cyryx Labs · Products
          </HudLabel>
          <h1 className="mt-4 max-w-3xl font-display text-[40px] sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-[-0.02em] text-silver-gradient">
            Proprietary systems for the agentic era.
          </h1>
          <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]">
            Cyryx products are the runtime and the research behind every engagement.
            Built for teams operationalizing AI under production standards — governance,
            audit, and human authority as defaults.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12 pb-24 lg:pb-32">
          <div className="grid gap-6 lg:grid-cols-2">
            {PRODUCTS.map((p) => (
              <article
                key={p.name}
                className="glass-panel flex flex-col rounded-md p-8 lg:p-10"
              >
                <HudLabel className="text-[var(--accent-glow)]">{p.eyebrow}</HudLabel>
                <h2 className="mt-4 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--silver)]">
                  {p.name}
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-[var(--silver)]">
                  {p.tagline}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-[var(--silver-dim)]">
                  {p.description}
                </p>
                <ul className="mt-6 space-y-2 text-sm leading-relaxed text-[var(--silver-dim)]">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span
                        aria-hidden
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent-glow)]"
                      />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex items-center justify-between gap-4 border-t border-[color-mix(in_oklab,var(--silver)_12%,transparent)] pt-6">
                  <span className="hud-label text-[var(--silver-dim)]">{p.status}</span>
                  <Link
                    to={p.href}
                    className="inline-flex items-center gap-2 hud-label text-[var(--accent-glow)] hover:opacity-80 transition-opacity"
                  >
                    {p.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_25%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_60%,transparent)] p-8 backdrop-blur-sm lg:p-10">
            <HudLabel withDot>Delivery arm</HudLabel>
            <h2 className="mt-4 font-display text-2xl sm:text-3xl font-semibold tracking-tight text-silver-gradient">
              Need a system built on this stack?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--silver-dim)]">
              Cyryx Solutions delivers custom systems built on the same primitives as
              our products — with governance, audit, and handover engineered in from
              day one.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/solutions"
                className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
              >
                View solutions
                <ArrowRight className="h-3.5 w-3.5 text-[var(--accent-glow)]" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors px-3 h-11"
              >
                Start a project
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}