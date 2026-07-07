import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { ArrowRight } from "lucide-react";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { CONTACT_EMAIL } from "@/lib/cta";

const PATH = "/products/lyra";
const TITLE = "Lyra — Cyryx Labs' Proprietary AI Model";
const DESC =
  "Lyra is Cyryx Labs' upcoming proprietary AI model, built for governed enterprise execution. Join the early access list.";
const LYRA_EMAIL = `${CONTACT_EMAIL}?subject=${encodeURIComponent("Lyra early access")}`;

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
            A proprietary model, built for governed execution.
          </h1>
          <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]">
            Lyra is the model layer of the Cyryx stack. Trained and evaluated
            against the same command gates and mission ledgers our customers ship
            with — reliability, auditability, and cost control as first-class
            training signals.
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