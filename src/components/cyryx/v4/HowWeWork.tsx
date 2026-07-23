import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";

const STEPS = [
  {
    n: "01",
    label: "Discover",
    title: "Understand the business problem before defining the system.",
    body: "We examine the current workflow, data availability, security constraints, economics, ownership, and the decisions the system must support.",
    outcome: "A qualified opportunity and a shared definition of the problem.",
  },
  {
    n: "02",
    label: "Design",
    title: "Make architecture, authority, and acceptance explicit.",
    body: "The solution, integrations, failure paths, human boundaries, scope, and acceptance criteria are designed around the operating environment.",
    outcome: "A buildable system plan with responsibilities and exclusions defined.",
  },
  {
    n: "03",
    label: "Build",
    title: "Engineer the working capability as one integrated system.",
    body: "Product experience, deterministic software, AI, data, integrations, and controls are implemented against the written criteria.",
    outcome: "A working system supported by implementation evidence.",
  },
  {
    n: "04",
    label: "Validate",
    title: "Test material behavior before operational trust expands.",
    body: "We evaluate expected outcomes, critical failure cases, permissions, handoffs, and operational readiness using the agreed acceptance approach.",
    outcome: "A clear decision about what is ready, limited, or still unresolved.",
  },
  {
    n: "05",
    label: "Launch and operate",
    title: "Establish ownership, handover, and the next operating state.",
    body: "Access, documentation, training, transition, support, and optional managed operations are established according to the engagement.",
    outcome: "A named ownership path after launch — not an ambiguous handoff.",
  },
] as const;

export function HowWeWork() {
  return (
    <section
      id="how-we-work"
      aria-labelledby="how-we-work-heading"
      data-story-section
      className="relative overflow-hidden py-20 sm:py-24 lg:py-36"
    >
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24 lg:px-10">
        <div className="cx-reveal lg:sticky lg:top-32 lg:self-start">
          <HudLabel withDot>How we work</HudLabel>
          <h2
            id="how-we-work-heading"
            className="mt-7 max-w-[12ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-silver-gradient sm:text-5xl lg:text-7xl"
          >
            A disciplined path from decision to operation.
          </h2>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
            Each engagement creates progressively stronger evidence. Commercial terms, ownership,
            licensing, support, and responsibilities remain explicit and engagement-specific.
          </p>
          <Link
            to="/engagement-model"
            className="mt-8 inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--silver)] transition hover:text-[var(--accent-glow)]"
          >
            See the engagement model <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>

          <div
            aria-hidden="true"
            className="relative mt-10 hidden min-h-28 border-t border-white/10 pt-6 lg:block"
          >
            {STEPS.map((step, index) => (
              <div
                key={step.n}
                data-story-caption
                className={`absolute inset-x-0 top-6 ${index === 0 ? "opacity-100" : "opacity-0"}`}
                style={{
                  opacity: index === 0 ? 1 : 0,
                  visibility: index === 0 ? "visible" : "hidden",
                }}
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent-glow)]">
                  Active outcome / {step.n}
                </span>
                <p className="mt-3 max-w-md font-display text-xl leading-snug tracking-[-0.02em] text-[var(--silver)]">
                  {step.outcome}
                </p>
              </div>
            ))}
          </div>
        </div>

        <ol className="cx-stagger relative border-l border-[color-mix(in_oklab,var(--steel)_24%,transparent)] pl-7 sm:pl-10">
          {STEPS.map((step) => (
            <li
              key={step.n}
              data-story-step
              className="cx-stagger-item group relative border-b border-[color-mix(in_oklab,var(--steel)_16%,transparent)] py-9 first:pt-0 last:border-b-0 last:pb-0 sm:py-12 lg:flex lg:min-h-[36vh] lg:flex-col lg:justify-center"
            >
              <span
                aria-hidden
                className="absolute -left-[2.08rem] top-11 h-2.5 w-2.5 rounded-full border border-[var(--accent-glow)] bg-[var(--onyx)] sm:-left-[2.83rem] first:top-2"
              />
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] tracking-[0.24em] text-[var(--accent-glow)]">
                  {step.n}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--steel)]">
                  {step.label}
                </span>
              </div>
              <h3 className="mt-5 max-w-[21ch] font-display text-2xl font-medium tracking-[-0.03em] text-[var(--silver)] sm:text-3xl">
                {step.title}
              </h3>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--silver-dim)] sm:text-base">
                {step.body}
              </p>
              <p className="mt-5 text-sm text-[var(--steel)] lg:hidden">Outcome: {step.outcome}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
