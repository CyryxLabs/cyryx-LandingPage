import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";

const CAPABILITIES = [
  {
    n: "01",
    title: "AI Strategy & Advisory",
    proposition: "Decide where AI belongs before committing capital or operational trust.",
    deliverables: ["Readiness assessment", "Opportunity map", "Architecture roadmap"],
    href: "/solutions/ai-strategy-advisory",
  },
  {
    n: "02",
    title: "Digital & Web Systems",
    proposition: "Turn the public digital experience into a measurable operating system.",
    deliverables: ["Corporate platforms", "Web applications", "Lead systems"],
    href: "/solutions/digital-web-systems",
  },
  {
    n: "03",
    title: "Workflow Automation",
    proposition: "Redesign repetitive work around clear decisions, exceptions, and ownership.",
    deliverables: ["Workflow design", "Routing and approvals", "System synchronization"],
    href: "/solutions/workflow-automation",
  },
  {
    n: "04",
    title: "Internal AI Assistants",
    proposition: "Give teams useful access to knowledge and tools without hiding authority.",
    deliverables: ["Knowledge access", "Tool-connected assistants", "Escalation paths"],
    href: "/solutions/internal-ai-assistants",
  },
  {
    n: "05",
    title: "Custom AI Product Development",
    proposition: "Engineer an AI-enabled product around real users and acceptance criteria.",
    deliverables: ["Product discovery", "Working application", "Evaluation framework"],
    href: "/solutions/custom-ai-product-development",
  },
  {
    n: "06",
    title: "AI Governance & Cost Control",
    proposition: "Design authority, evidence, evaluation, and cost visibility into execution.",
    deliverables: ["Approval boundaries", "Execution records", "Usage telemetry"],
    href: "/solutions/ai-governance-cost-control",
  },
  {
    n: "07",
    title: "Managed Operations",
    proposition: "Keep defined systems monitored, maintained, and improving after launch.",
    deliverables: ["Defined coverage", "Operational reviews", "Transition planning"],
    href: "/managed-operations",
  },
] as const;

export function Capabilities() {
  return (
    <section
      id="what-we-build"
      aria-labelledby="capabilities-heading"
      className="relative overflow-hidden py-24 sm:py-32 lg:py-44"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="cx-reveal grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-20">
          <div>
            <HudLabel withDot>Capabilities</HudLabel>
            <h2
              id="capabilities-heading"
              className="mt-7 max-w-[13ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-silver-gradient sm:text-5xl lg:text-7xl"
            >
              What a company can hire Cyryx to do.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg lg:pb-2">
            Advisory, engineering, and optional operations are composed around the business problem.
            AI is used where it adds value; deterministic software remains the better choice where
            predictability matters more.
          </p>
        </div>

        <ol className="cx-stagger mt-16 border-t border-[color-mix(in_oklab,var(--silver)_16%,transparent)] sm:mt-20">
          {CAPABILITIES.map((capability) => (
            <li
              key={capability.n}
              className="cx-stagger-item group border-b border-[color-mix(in_oklab,var(--silver)_16%,transparent)] transition-colors hover:bg-[color-mix(in_oklab,var(--silver)_3%,transparent)]"
            >
              <Link
                to={capability.href}
                className="grid min-h-11 gap-5 px-1 py-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent-glow)] sm:py-10 lg:grid-cols-[3rem_0.8fr_1.2fr_auto] lg:items-start lg:gap-10"
              >
                <span className="font-mono text-[9px] tracking-[0.22em] text-[var(--accent-glow)]">
                  {capability.n}
                </span>
                <h3 className="max-w-[18ch] font-display text-xl font-medium tracking-[-0.025em] text-[var(--silver)] sm:text-2xl">
                  {capability.title}
                </h3>
                <div>
                  <p className="max-w-xl text-[15px] leading-relaxed text-[var(--silver-dim)] sm:text-base">
                    {capability.proposition}
                  </p>
                  <ul
                    className="mt-5 flex flex-wrap gap-x-5 gap-y-2"
                    aria-label={`${capability.title} representative deliverables`}
                  >
                    {capability.deliverables.map((deliverable) => (
                      <li
                        key={deliverable}
                        className="flex items-center gap-2 text-xs text-[var(--steel)]"
                      >
                        <span aria-hidden className="text-[var(--accent-glow)]">
                          /
                        </span>
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>
                <span className="inline-flex min-h-11 items-center gap-2 self-center font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--steel)] transition group-hover:text-[var(--accent-glow)] lg:justify-self-end">
                  Explore <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ol>

        <p className="cx-reveal mt-7 max-w-3xl text-xs leading-relaxed text-[var(--steel)]">
          Integrations, deliverables, support, ownership, licensing, and operating responsibilities
          are defined per engagement and depend on available systems, APIs, access, and risk.
        </p>
      </div>
    </section>
  );
}
