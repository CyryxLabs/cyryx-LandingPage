import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import {
  buildBreadcrumbJsonLd,
  buildHead,
  buildServiceJsonLd,
} from "@/components/cyryx/seo/seo";
import { START_PROJECT_HREF } from "@/lib/cta";

const PATH = "/solutions";
const TITLE = "AI Solutions — Cyryx Labs";
const DESC =
  "Cyryx Solutions designs and builds AI products, workflow automation, internal agents, knowledge systems, integrations, and governance layers for operational AI.";

const OFFERINGS = [
  {
    slug: "digital-web-systems",
    name: "Digital & Web Systems",
    blurb: "Conversion-ready websites and connected digital systems — the credible foundation before automation and AI.",
  },
  {
    slug: "ai-websites-lead-systems",
    name: "AI websites & lead systems",
    blurb: "AI-native websites with structured intake, governed conversations, and qualified routing.",
  },
  {
    slug: "workflow-automation",
    name: "Workflow automation",
    blurb: "Goal-driven workflows with command gates and mission ledgers — not brittle pipelines.",
  },
  {
    slug: "internal-ai-assistants",
    name: "Internal AI assistants",
    blurb: "Grounded, role-scoped assistants measured against real task outcomes.",
  },
  {
    slug: "custom-ai-product-development",
    name: "Custom AI product development",
    blurb: "End-to-end AI product engineering on the same primitives as MAAX Studio.",
  },
  {
    slug: "ai-integrations",
    name: "AI integrations",
    blurb: "Production-grade connectors with contracts, gates, and observability.",
  },
  {
    slug: "ai-governance-cost-control",
    name: "AI governance & cost control",
    blurb: "Governance and FinOps for AI as a single layer — defensible and tunable.",
  },
];

export const Route = createFileRoute("/solutions")({
  head: () =>
    buildHead(
      { title: TITLE, description: DESC, path: PATH },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Solutions", path: PATH },
        ]),
        buildServiceJsonLd({
          name: "Cyryx Solutions",
          serviceType: "Custom AI system engineering",
          description: DESC,
          path: PATH,
        }),
      ],
    ),
  component: SolutionsHub,
});

function SolutionsHub() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Parent route: render <Outlet /> for any /solutions/* child; render hub on exact /solutions.
  if (pathname !== "/solutions" && pathname !== "/solutions/") {
    return <Outlet />;
  }
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pt-32 pb-24 lg:pt-44">
        <HudLabel withDot className="text-[var(--accent-glow)]">Cyryx Solutions</HudLabel>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-silver-gradient">
          Custom AI systems built for execution, not hype.
        </h1>
        <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]">
          Cyryx Solutions is the implementation layer of Cyryx Labs. Every engagement is built on the same governance primitives as our flagship products <Link to="/products/praxis-os" className="text-[var(--accent-glow)] hover:underline">Praxis OS</Link> and <Link to="/products/maax-studio" className="text-[var(--accent-glow)] hover:underline">MAAX Studio</Link>, and informed by ongoing work in <Link to="/research" className="text-[var(--accent-glow)] hover:underline">Applied Research</Link>: missions, command gates, goal-grounded generation, and mission ledgers.
        </p>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {OFFERINGS.map((o) => (
            <li key={o.slug}>
              <a
                href={`/solutions/${o.slug}`}
                className="group block h-full rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_55%,transparent)] p-5 backdrop-blur-sm transition-colors hover:border-[color-mix(in_oklab,var(--accent-glow)_45%,transparent)]"
              >
                <h2 className="text-base font-semibold text-[var(--silver)]">{o.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--silver-dim)]">{o.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-[var(--accent-glow)]">
                  Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            </li>
          ))}
        </ul>

        <section className="mt-16 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_18%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_55%,transparent)] p-6 backdrop-blur-sm">
          <h2 className="font-display text-xl font-semibold text-[var(--silver)]">How we engage</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[var(--silver-dim)] marker:text-[var(--accent-glow)]">
            <li>Discovery — define missions, acceptance criteria, and the systems we need to touch.</li>
            <li>Architecture — propose runtime, gates, and integration plan.</li>
            <li>Build — ship in iterations, instrumented from day one.</li>
            <li>Handover — your team owns operability with dashboards and runbooks.</li>
          </ol>
        </section>

        <div className="mt-12">
          <a
            href={START_PROJECT_HREF}
            className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
          >
            Start a project
            <span aria-hidden className="text-[var(--accent-glow)]">→</span>
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}