import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead, buildServiceJsonLd } from "@/components/cyryx/seo/seo";
import { START_PROJECT_HREF } from "@/lib/cta";

const PATH = "/solutions/ai-strategy-advisory";
const TITLE = "AI Strategy & Advisory — Cyryx Labs";
const DESC =
  "AI strategy, readiness, workflow discovery, architecture, governance requirements, and implementation planning for controlled execution.";

const QUESTIONS = [
  "Which workflows or product opportunities are worth pursuing?",
  "What data, integrations, and operating changes would the system require?",
  "Where should AI be used — and where is deterministic software the better choice?",
  "What authority, approval, evaluation, and cost controls should be defined?",
  "Should the organization build, buy, integrate, or defer?",
] as const;

const CAPABILITIES = [
  [
    "Opportunity assessment",
    "Frame candidate use cases against value, feasibility, data, ownership, and operating risk.",
  ],
  [
    "Workflow discovery",
    "Map the current work, exceptions, handoffs, decisions, and systems before proposing automation.",
  ],
  [
    "AI readiness review",
    "Assess the organizational, technical, data, security, and governance conditions required to proceed.",
  ],
  [
    "Solution architecture",
    "Define a qualified target architecture, provider options, integration boundaries, and operating model.",
  ],
  [
    "Governance requirements",
    "Specify authority, human approval, evaluation, evidence, and cost controls appropriate to the proposed system.",
  ],
  [
    "Implementation roadmap",
    "Sequence decisions, experiments, build stages, acceptance criteria, and ownership into an executable plan.",
  ],
] as const;

const DELIVERABLES = [
  "Opportunity and constraint assessment",
  "Current-state workflow map",
  "AI readiness findings",
  "Architecture recommendation",
  "Provider or build-versus-buy evaluation",
  "Governance requirements",
  "Prioritized implementation roadmap",
  "Technical decision memo",
] as const;

const FORMATS = [
  [
    "Focused decision sprint",
    "A bounded question, defined stakeholders, and a written recommendation.",
  ],
  [
    "Readiness and roadmap engagement",
    "A broader assessment leading to prioritized opportunities and an implementation sequence.",
  ],
  [
    "Architecture advisory",
    "Technical decision support for a product, workflow, provider, or system already under consideration.",
  ],
  [
    "Continuing advisory",
    "Optional support for decisions and reviews under a separately defined cadence and scope.",
  ],
] as const;

export const Route = createFileRoute("/solutions/ai-strategy-advisory")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Solutions", path: "/solutions" },
        { name: "AI Strategy & Advisory", path: PATH },
      ]),
      buildServiceJsonLd({
        name: "AI Strategy & Advisory",
        serviceType: "AI strategy and technical advisory",
        description: DESC,
        path: PATH,
      }),
    ]),
  component: AiStrategyAdvisoryPage,
});

function AiStrategyAdvisoryPage() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content">
        <section className="relative overflow-hidden border-b border-white/10 px-5 pb-24 pt-32 sm:px-8 lg:pb-32 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <nav
              aria-label="Breadcrumb"
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--steel)]"
            >
              <Link to="/" className="transition hover:text-[var(--silver)]">
                Home
              </Link>
              <span className="mx-3 opacity-40">/</span>
              <Link to="/solutions" className="transition hover:text-[var(--silver)]">
                Solutions
              </Link>
              <span className="mx-3 opacity-40">/</span>
              <span className="text-[var(--silver)]">Advisory</span>
            </nav>
            <div className="mt-14 grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-24">
              <div>
                <HudLabel withDot>AI Strategy &amp; Advisory</HudLabel>
                <h1 className="mt-7 max-w-[12ch] font-display text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-[var(--silver)] sm:text-6xl lg:text-8xl">
                  Make the right AI decision before funding the build.
                </h1>
              </div>
              <div className="lg:pb-2">
                <p className="max-w-2xl text-lg leading-relaxed text-[var(--silver-dim)] sm:text-xl">
                  Cyryx helps leadership teams qualify opportunities, understand operating
                  constraints, define architecture, and establish a path from interest to controlled
                  execution.
                </p>
                <a
                  href={START_PROJECT_HREF}
                  className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-md border border-[var(--accent-glow)] px-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent-glow)] transition hover:bg-[var(--accent-glow)] hover:text-[var(--onyx)]"
                >
                  Start an advisory conversation <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24 lg:px-10 lg:py-40">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <HudLabel>When advisory is useful</HudLabel>
            <h2 className="mt-6 font-display text-4xl font-medium leading-[1.02] tracking-[-0.04em] text-[var(--silver)] sm:text-5xl">
              The organization has urgency, but the system decision is still unclear.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[var(--silver-dim)]">
              Advisory is appropriate when committing to a vendor, architecture, automation, or AI
              product would be premature without understanding the work around it.
            </p>
          </div>
          <ol className="border-t border-white/10">
            {QUESTIONS.map((question, index) => (
              <li
                key={question}
                className="grid gap-5 border-b border-white/10 py-7 sm:grid-cols-[3rem_1fr] sm:py-9"
              >
                <span className="font-mono text-[9px] tracking-[0.22em] text-[var(--accent-glow)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="max-w-[34ch] font-display text-2xl font-medium leading-tight tracking-[-0.02em] text-[var(--silver)] sm:text-3xl">
                  {question}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="bg-[var(--graphite)] px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
          <div className="mx-auto max-w-7xl">
            <HudLabel withDot>Advisory capabilities</HudLabel>
            <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
              {CAPABILITIES.map(([title, body], index) => (
                <article key={title} className="min-h-72 bg-[var(--obsidian)] p-7 sm:p-9">
                  <span className="font-mono text-[9px] text-[var(--accent-glow)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="mt-12 font-display text-2xl font-medium tracking-[-0.025em] text-[var(--silver)]">
                    {title}
                  </h2>
                  <p className="mt-4 text-[15px] leading-relaxed text-[var(--silver-dim)]">
                    {body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-2 lg:gap-24 lg:px-10 lg:py-40">
          <div>
            <HudLabel>Representative deliverables</HudLabel>
            <h2 className="mt-6 max-w-[14ch] font-display text-4xl font-medium leading-[1.02] tracking-[-0.04em] text-[var(--silver)] sm:text-5xl">
              Decision artifacts your team can use.
            </h2>
            <ul className="mt-10 grid gap-0 border-t border-white/10 sm:grid-cols-2">
              {DELIVERABLES.map((item) => (
                <li
                  key={item}
                  className="border-b border-white/10 py-4 pr-5 text-sm text-[var(--silver-dim)]"
                >
                  <span aria-hidden className="mr-3 text-[var(--accent-glow)]">
                    /
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <HudLabel>Engagement formats</HudLabel>
            <dl className="mt-8 border-t border-white/10">
              {FORMATS.map(([term, detail]) => (
                <div key={term} className="border-b border-white/10 py-6">
                  <dt className="font-display text-xl font-medium text-[var(--silver)]">{term}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-[var(--silver-dim)]">
                    {detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[var(--obsidian)] px-5 py-20 sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
            <HudLabel>Boundaries</HudLabel>
            <div>
              <h2 className="font-display text-3xl font-medium tracking-[-0.035em] text-[var(--silver)] sm:text-4xl">
                Advisory informs the decision. It does not certify the organization.
              </h2>
              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[var(--silver-dim)]">
                Cyryx does not provide legal, financial, regulatory, or compliance certification.
                Findings depend on the information and access included in the engagement. If Cyryx
                proceeds into implementation, scope, ownership, licensing, acceptance, support, and
                operational responsibilities are defined separately in writing.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-8 sm:py-32">
          <HudLabel withDot>Start with the decision</HudLabel>
          <h2 className="mt-7 font-display text-4xl font-semibold leading-[1] tracking-[-0.045em] text-[var(--silver)] sm:text-6xl">
            Bring the opportunity, workflow, or unresolved architecture question.
          </h2>
          <a
            href={START_PROJECT_HREF}
            className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-md bg-[var(--silver)] px-7 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--onyx)] transition hover:bg-white"
          >
            Start a conversation <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
