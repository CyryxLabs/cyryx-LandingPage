import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";
import { START_PROJECT_HREF } from "@/lib/cta";

const PATH = "/engagement-model";
const TITLE = "Engagement Model — Cyryx Labs";
const DESC =
  "How Cyryx Labs engagements operate: diagnose, scope, build, verify, transfer, and optionally operate. Fixed scope, verifiable delivery, full transfer.";

const STEPS = [
  { n: "01", title: "Diagnose", body: "Establish the workflow, current systems, data, risk, ownership, and economic case." },
  { n: "02", title: "Scope", body: "Define deliverables, exclusions, acceptance criteria, timeline, price, responsibilities, and ownership in writing." },
  { n: "03", title: "Build", body: "Implement with production discipline, controlled access, documented decisions, observability, and fallback." },
  { n: "04", title: "Verify", body: "Test material claims and system behavior against written acceptance criteria." },
  { n: "05", title: "Transfer", body: "Provide documentation, training, account ownership, access records, and operational control." },
  { n: "06", title: "Operate", body: "When selected, provide managed coverage under defined systems, response windows, and exclusions." },
];

export const Route = createFileRoute("/engagement-model")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Engagement Model", path: PATH },
      ]),
    ]),
  component: EngagementModelPage,
});

function EngagementModelPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content" className="relative">
        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pt-32 pb-16 lg:pt-44">
          <nav aria-label="Breadcrumb" className="text-xs text-[var(--silver-dim)]">
            <Link to="/" className="hover:text-[var(--accent-glow)]">Home</Link>
            <span className="mx-2 opacity-60">/</span>
            <span className="text-[var(--silver)]">Engagement Model</span>
          </nav>
          <HudLabel withDot className="mt-6 text-[var(--accent-glow)]">Engagement Model</HudLabel>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-silver-gradient">
            Fixed scope. Verifiable delivery. Full transfer.
          </h1>
          <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]">
            Every Cyryx engagement is built around a bounded problem, an accountable owner, and a verifiable outcome. Every system is built on the same architecture as Praxis OS and MAAX Studio.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-16">
          <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.title} className="glass-panel rounded-md p-6">
                <span className="hud-label text-[var(--accent-glow)]">{s.n}</span>
                <h2 className="mt-3 font-display text-lg font-semibold uppercase tracking-wider text-[var(--silver)]">
                  {s.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 pb-24">
          <div className="rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_18%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_55%,transparent)] p-6 backdrop-blur-sm">
            <h2 className="font-display text-xl font-semibold text-[var(--silver)]">Operating principles</h2>
            <ul className="mt-4 grid gap-2 text-sm leading-relaxed text-[var(--silver-dim)] sm:grid-cols-2">
              <li>· Outcomes over output.</li>
              <li>· Verification over generation.</li>
              <li>· Systems over tools.</li>
              <li>· Humans in command.</li>
              <li>· Fixed scope, defined acceptance.</li>
              <li>· Documented transfer.</li>
              <li>· Conservative claims.</li>
            </ul>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={START_PROJECT_HREF} className="cx-btn cx-liquid-glass inline-flex items-center gap-2 h-11 px-5 rounded-md text-[var(--silver)] hud-label">
              Start a project
              <span aria-hidden className="text-[var(--accent-glow)]">→</span>
            </a>
            <Link to="/solutions" className="inline-flex items-center h-11 px-3 hud-label text-[var(--silver-dim)] hover:text-[var(--accent-glow)]">
              Explore solutions
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}