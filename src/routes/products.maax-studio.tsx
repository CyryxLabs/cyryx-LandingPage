import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import {
  buildBreadcrumbJsonLd,
  buildHead,
} from "@/components/cyryx/seo/seo";

const PATH = "/products/maax-studio";
const TITLE = "MAAX Studio — Agentic execution OS · Cyryx Labs";
const DESC = "MAAX Studio is the agentic execution OS from Cyryx Labs: missions, command gates, goal-grounded generation, mission ledgers, human-governed delivery.";

const softwareAppLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MAAX Studio",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Agentic AI execution environment",
  operatingSystem: "Web, macOS, Windows",
  description: DESC,
  url: "https://cyryxlabs.com/products/maax-studio",
  publisher: {
    "@type": "Organization",
    name: "Cyryx Labs",
    url: "https://cyryxlabs.com",
  },
  featureList: [
    "Mission-based execution",
    "Command gates",
    "Goal-grounded generation",
    "Project context graph",
    "Mission ledgers and audit trails",
    "Human-governed delivery",
  ],
};

export const Route = createFileRoute("/products/maax-studio")({
  head: () =>
    buildHead(
      { title: TITLE, description: DESC, path: PATH, ogType: "product" },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: "MAAX Studio", path: PATH },
        ]),
        softwareAppLd,
      ],
    ),
  component: MaaxStudioPage,
});

function MaaxStudioPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main className="mx-auto max-w-3xl px-5 sm:px-8 lg:px-12 pt-32 pb-24 lg:pt-44">
        <nav aria-label="Breadcrumb" className="text-xs text-[var(--silver-dim)]">
          <Link to="/" className="hover:text-[var(--accent-glow)]">Home</Link>
          <span className="mx-2 opacity-60">/</span>
          <Link to="/products" className="hover:text-[var(--accent-glow)]">Products</Link>
          <span className="mx-2 opacity-60">/</span>
          <span className="text-[var(--silver)]">MAAX Studio</span>
        </nav>

        <HudLabel withDot className="mt-6 text-[var(--accent-glow)]">Flagship Product</HudLabel>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-silver-gradient">
          MAAX Studio
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[var(--silver-dim)]">
          The agentic execution OS from Cyryx Labs.
        </p>

        <div className="mt-8 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_25%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_60%,transparent)] p-6 backdrop-blur-sm">
          <p className="text-[15px] leading-relaxed text-[var(--silver)]">
            MAAX Studio runs AI work as missions, not pipelines. Every step is a candidate action that passes through command gates and is recorded in a mission ledger. The model is one component; the system holds the goal, the context, the gates, and the audit trail.
          </p>
        </div>

        <Sec heading="What MAAX Studio is">
          <p>
            A governed execution environment for agentic AI workflows. Built on the <strong className="text-[var(--silver)]">MAAX Runtime</strong> — the underlying architecture that coordinates agents, gates, context resolution, and evaluation.
          </p>
        </Sec>

        <Sec heading="Core primitives">
          <ul className="mt-2 list-disc space-y-2 pl-5 marker:text-[var(--accent-glow)]">
            <li><strong className="text-[var(--silver)]">Missions</strong> — explicit goals with acceptance criteria, owners, and escalation rules.</li>
            <li><strong className="text-[var(--silver)]">Project context graph</strong> — the structured knowledge each mission draws from.</li>
            <li><strong className="text-[var(--silver)]"><Link to="/answers/what-is-goal-grounded-generation" className="hover:text-[var(--accent-glow)]">Goal-grounded generation</Link></strong> — every model call carries mission, context, and acceptance criteria.</li>
            <li><strong className="text-[var(--silver)]"><Link to="/answers/what-are-command-gates-in-ai-systems" className="hover:text-[var(--accent-glow)]">Command gates</Link></strong> — independent checkpoints between candidate output and downstream action.</li>
            <li><strong className="text-[var(--silver)]">Mission ledger</strong> — full audit and regression replay of every decision.</li>
            <li><strong className="text-[var(--silver)]">Human-governed delivery</strong> — explicit escalation paths, not implicit overrides.</li>
          </ul>
        </Sec>

        <Sec heading="Who it's for">
          <ul className="mt-2 list-disc space-y-2 pl-5 marker:text-[var(--accent-glow)]">
            <li>Teams shipping AI-native products who need a runtime they can audit.</li>
            <li>Operators replacing ungoverned agent stacks with a governed execution layer.</li>
            <li>Engineering leads who want missions, gates, and ledgers as first-class objects, not custom code.</li>
          </ul>
        </Sec>

        <Sec heading="How it differs">
          <p>
            MAAX Studio is not a chat UI, an automation builder, or a generic agent framework. It is an execution OS: the system holds the mission and verifies every action. The model is replaceable; the governance is the product.
          </p>
        </Sec>

        <Sec heading="Status">
          <p>
            MAAX Studio is in active development at <Link to="/" className="text-[var(--accent-glow)] hover:underline">Cyryx Labs</Link>. Early access engagements are coordinated through <Link to="/solutions" className="text-[var(--accent-glow)] hover:underline">Cyryx Solutions</Link>. The underlying frameworks are published openly by the <Link to="/research" className="text-[var(--accent-glow)] hover:underline">Cyryx Applied AI Lab</Link>.
          </p>
        </Sec>

        <div className="mt-12 flex flex-wrap gap-3">
          <a
            href="/#contact"
            className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label"
          >
            Request early access
            <span aria-hidden className="text-[var(--accent-glow)]">→</span>
          </a>
          <Link
            to="/research"
            className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors px-3 h-11"
          >
            Read the research
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Sec({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-xl sm:text-2xl font-semibold tracking-tight text-[var(--silver)]">
        {heading}
      </h2>
      <div className="mt-4 text-base leading-relaxed text-[var(--silver-dim)]">{children}</div>
    </section>
  );
}