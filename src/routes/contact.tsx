import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { ContactSection } from "@/components/cyryx/ContactSection";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";

const PATH = "/contact";
const TITLE = "Contact — Cyryx Labs";
const DESC =
  "Contact Cyryx Labs to build an AI product, automate a workflow, explore MAAX Studio, or design governed AI execution systems.";

const SIGNALS = [
  { k: "Best fit", v: "Founders, agencies, product teams, and operators building with AI" },
  { k: "Engagement model", v: "Scoped, milestone-based, handover-ready" },
  { k: "Interests", v: "MAAX early access · Product · Automation · Agents · Knowledge · Governance" },
  { k: "Delivered on", v: "MAAX Runtime primitives" },
];

export const Route = createFileRoute("/contact")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Contact", path: PATH },
      ]),
    ]),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main className="relative">
        <section className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-12 pt-32 pb-12 lg:pt-44">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--silver-dim)]">
            <Link to="/" className="hover:text-[var(--accent-glow)]">Home</Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-[var(--silver)]">Contact</span>
          </nav>

          <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div>
              <HudLabel withDot className="text-[var(--accent-glow)]">
                Start a project
              </HudLabel>
              <h1 className="mt-4 font-display text-[40px] sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-[-0.02em] text-silver-gradient">
                Let's build your AI system.
              </h1>
              <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]">
                Share the outcome you're pursuing, the constraints that matter, and
                who will own the system after delivery. We reply with scope, risk
                posture, and a proposed engagement shape — not a sales sequence.
              </p>
            </div>

            <aside className="glass-panel rounded-md p-6 lg:p-7">
              <HudLabel>What to expect</HudLabel>
              <dl className="mt-4 divide-y divide-[color-mix(in_oklab,var(--silver)_12%,transparent)]">
                {SIGNALS.map((s) => (
                  <div key={s.k} className="flex items-start justify-between gap-4 py-3">
                    <dt className="text-xs uppercase tracking-[0.08em] text-[var(--silver-dim)]">
                      {s.k}
                    </dt>
                    <dd className="text-right text-sm text-[var(--silver)]">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </section>

        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}