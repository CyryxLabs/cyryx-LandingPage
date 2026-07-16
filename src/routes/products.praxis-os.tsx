import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { HudGrid } from "@/components/cyryx/primitives/HudGrid";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";

const PATH = "/products/praxis-os";
const TITLE = "Praxis OS — Enterprise Operational Intelligence | Cyryx Labs";
const DESC =
  "Praxis OS is the enterprise operational intelligence and execution platform — a unified operating layer for governed AI execution and mission management.";

export const Route = createFileRoute("/products/praxis-os")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH, ogType: "product" }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Products", path: "/products" },
        { name: "Praxis OS", path: PATH },
      ]),
    ]),
  component: PraxisOSPage,
});

function PraxisOSPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main className="relative">
        <HudGrid />
        <section className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10 lg:px-14 pt-32 pb-24 lg:pt-40">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--silver-dim)]">
            <Link to="/" className="hover:text-[var(--accent-glow)]">Home</Link>
            <span className="mx-2 opacity-60">/</span>
            <Link to="/products" className="hover:text-[var(--accent-glow)]">Products</Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-[var(--silver)]">Praxis OS</span>
          </nav>

          <HudLabel withDot className="mt-8 text-[var(--accent-glow)]">Enterprise Platform · In development</HudLabel>
          <h1 className="mt-4 max-w-4xl font-display text-[40px] sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-[-0.02em] text-silver-gradient">
            Praxis OS
          </h1>
          <p className="mt-6 max-w-2xl text-lg lg:text-xl leading-relaxed text-[var(--silver-dim)]">
            The enterprise operational intelligence and execution platform. 
            A unified operating layer for organizations running mission-critical work on agentic systems.
          </p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Operational Intelligence",
                body: "Real-time visibility into mission health, agent performance, and operational cost across the enterprise.",
              },
              {
                title: "Unified Governance",
                body: "Compile policy into runtime command gates. Enforce security and compliance standards by construction.",
              },
              {
                title: "Execution Audit",
                body: "Append-only mission ledgers provide a verifiable record of every candidate action and automated decision.",
              },
            ].map((feature) => (
              <div key={feature.title} className="glass-panel rounded-md p-6 lg:p-8">
                <h3 className="font-display text-lg font-semibold text-[var(--silver)]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">{feature.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_25%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_60%,transparent)] p-8 backdrop-blur-sm lg:p-12">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-silver-gradient">
              The Command Center for AI-Native Organizations.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--silver-dim)]">
              Praxis OS integrates MAAX Studio and Lyra into a cohesive enterprise environment. 
              While MAAX Studio provides the builder's cockpit, Praxis OS provides the organization's command and control layer.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-12 px-6 rounded-md text-[var(--silver)] hud-label"
              >
                Request Briefing
              </Link>
              <Link
                to="/products/maax-studio"
                className="inline-flex items-center gap-2 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)] transition-colors px-4 h-12"
              >
                See MAAX Studio →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
