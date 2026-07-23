import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead, buildServiceJsonLd } from "@/components/cyryx/seo/seo";
import { START_PROJECT_HREF } from "@/lib/cta";

const PATH = "/solutions";
const TITLE = "AI Advisory, Digital Systems & Engineering — Cyryx Labs";
const DESC =
  "Explore Cyryx Labs advisory, digital systems, automation, internal assistants, custom AI products, governance, and managed operations.";

const CAPABILITIES = [
  {
    n: "01",
    stage: "Advise",
    name: "AI Strategy & Advisory",
    proposition:
      "Determine what is worth building and what the operating system around it requires.",
    deliverables: ["Opportunity assessment", "Architecture direction", "Implementation roadmap"],
    href: "/solutions/ai-strategy-advisory",
  },
  {
    n: "02",
    stage: "Build",
    name: "Digital & Web Systems",
    proposition:
      "Create a credible, measurable digital foundation connected to the operation behind it.",
    deliverables: ["Corporate websites", "Web applications", "Lead and intake systems"],
    href: "/solutions/digital-web-systems",
  },
  {
    n: "03",
    stage: "Build",
    name: "Workflow Automation",
    proposition:
      "Redesign recurring work across systems, decisions, exceptions, and human approvals.",
    deliverables: ["Workflow design", "System integrations", "Exception and approval paths"],
    href: "/solutions/workflow-automation",
  },
  {
    n: "04",
    stage: "Build",
    name: "Internal AI Assistants",
    proposition:
      "Support employees with bounded access to the knowledge and actions their roles require.",
    deliverables: ["Knowledge access", "Role boundaries", "Evaluation and escalation"],
    href: "/solutions/internal-ai-assistants",
  },
  {
    n: "05",
    stage: "Build",
    name: "Custom AI Product Development",
    proposition: "Move from product opportunity to a testable, integrated AI-enabled capability.",
    deliverables: ["Product discovery", "Experience and system design", "Build and validation"],
    href: "/solutions/custom-ai-product-development",
  },
  {
    n: "06",
    stage: "Control",
    name: "AI Governance & Cost Control",
    proposition:
      "Define authority, evidence, evaluation, and resource controls around consequential execution.",
    deliverables: ["Control requirements", "Usage visibility", "Review and approval design"],
    href: "/solutions/ai-governance-cost-control",
  },
  {
    n: "07",
    stage: "Operate",
    name: "Managed Operations",
    proposition:
      "Maintain and evolve defined systems under written responsibilities and service expectations.",
    deliverables: ["Monitoring and maintenance", "Optimization cadence", "Transition or handover"],
    href: "/managed-operations",
  },
] as const;

export const Route = createFileRoute("/solutions")({
  head: ({ matches }) => {
    const leafPath = matches.at(-1)?.pathname.replace(/\/$/, "") || "/";
    if (leafPath !== PATH) return {};
    return buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Solutions", path: PATH },
      ]),
      buildServiceJsonLd({
        name: "Cyryx Labs Advisory and Systems Engineering",
        serviceType: "AI advisory and systems engineering",
        description: DESC,
        path: PATH,
      }),
    ]);
  },
  component: SolutionsHub,
});

function SolutionsHub() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname !== "/solutions" && pathname !== "/solutions/") return <Outlet />;

  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main id="main-content">
        <section className="border-b border-white/10 px-5 pb-24 pt-32 sm:px-8 lg:pb-32 lg:pt-44">
          <div className="mx-auto max-w-7xl">
            <HudLabel withDot>Cyryx Labs / Commercial capabilities</HudLabel>
            <div className="mt-8 grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-end lg:gap-24">
              <h1 className="max-w-[12ch] font-display text-5xl font-semibold leading-[0.96] tracking-[-0.05em] text-[var(--silver)] sm:text-6xl lg:text-8xl">
                From unresolved AI opportunity to an owned operating system.
              </h1>
              <div className="lg:pb-2">
                <p className="max-w-2xl text-lg leading-relaxed text-[var(--silver-dim)] sm:text-xl">
                  Cyryx combines advisory, digital and AI engineering, proprietary product work,
                  applied research, and optional managed operations. The engagement begins with the
                  business constraint — not a predetermined tool.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={START_PROJECT_HREF}
                    className="inline-flex min-h-12 items-center gap-2 rounded-md bg-[var(--silver)] px-6 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--onyx)] transition hover:bg-white"
                  >
                    Discuss the opportunity <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                  <Link
                    to="/engagement-model"
                    className="inline-flex min-h-12 items-center gap-2 rounded-md border border-white/15 px-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--silver)] transition hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)]"
                  >
                    How we work
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:px-10 lg:py-40">
          <div className="grid gap-12 lg:grid-cols-[0.62fr_1.38fr] lg:gap-24">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <HudLabel>Capability map</HudLabel>
              <h2 className="mt-6 font-display text-4xl font-medium leading-[1.02] tracking-[-0.04em] text-[var(--silver)] sm:text-5xl">
                Choose the operating need, then shape the engagement.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-[var(--silver-dim)]">
                Capabilities can stand alone or connect across a larger program. Integrations,
                ownership, licensing, support, and operational responsibilities depend on the
                selected systems and written scope.
              </p>
            </div>
            <ol className="border-t border-white/10">
              {CAPABILITIES.map((capability) => (
                <li key={capability.n} className="group border-b border-white/10 py-8 sm:py-10">
                  <Link
                    to={capability.href}
                    className="grid gap-5 sm:grid-cols-[3rem_1fr_auto] sm:gap-8"
                  >
                    <span className="font-mono text-[9px] tracking-[0.22em] text-[var(--accent-glow)]">
                      {capability.n}
                    </span>
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--steel)]">
                        {capability.stage}
                      </p>
                      <h3 className="mt-3 font-display text-2xl font-medium tracking-[-0.025em] text-[var(--silver)] sm:text-3xl">
                        {capability.name}
                      </h3>
                      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--silver-dim)]">
                        {capability.proposition}
                      </p>
                      <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[var(--steel)]">
                        {capability.deliverables.map((item) => (
                          <li
                            key={item}
                            className="before:mr-2 before:text-[var(--accent-glow)] before:content-['/']"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <ArrowRight
                      className="hidden h-5 w-5 text-[var(--steel)] transition group-hover:translate-x-1 group-hover:text-[var(--accent-glow)] sm:block"
                      aria-hidden
                    />
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[var(--graphite)] px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <HudLabel>Decision rule</HudLabel>
            <div>
              <h2 className="font-display text-3xl font-medium tracking-[-0.035em] text-[var(--silver)] sm:text-4xl">
                AI where it is useful. Deterministic software where it is better.
              </h2>
              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-[var(--silver-dim)]">
                A credible system may combine conventional software, automation, human decision, and
                multiple AI providers. Cyryx selects the mechanism according to predictability,
                authority, data, cost, and the operating outcome — not novelty.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
