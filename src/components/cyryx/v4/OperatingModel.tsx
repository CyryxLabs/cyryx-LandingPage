import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";

const STAGES = [
  {
    n: "01",
    name: "Decide",
    promise: "Qualify the opportunity before committing capital.",
    receives: ["Opportunity assessment", "Architecture direction", "Prioritized roadmap"],
    href: "/solutions/ai-strategy-advisory",
  },
  {
    n: "02",
    name: "Build",
    promise: "Engineer the capability around real workflows and controls.",
    receives: ["Working system", "Acceptance evidence", "Operational documentation"],
    href: "/solutions",
  },
  {
    n: "03",
    name: "Operate",
    promise: "Maintain defined systems under explicit responsibilities.",
    receives: ["Defined coverage", "Review cadence", "Transition path"],
    href: "/managed-operations",
  },
] as const;

export function OperatingModel() {
  return (
    <section
      id="operating-model"
      aria-labelledby="operating-model-heading"
      data-story-section
      className="relative bg-[var(--graphite)] py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="cx-reveal grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-20">
          <div>
            <HudLabel withDot>How Cyryx works</HudLabel>
            <h2
              id="operating-model-heading"
              className="mt-7 max-w-[12ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-[var(--silver)] sm:text-5xl lg:text-7xl"
            >
              One operating model from decision to operation.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg lg:pb-2">
            Engage Cyryx to qualify the opportunity, engineer the system, and establish the
            operating path after launch.
          </p>
        </div>

        <ol className="cx-stagger relative mt-14 grid gap-10 sm:mt-16 lg:grid-cols-3 lg:gap-0">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-4 hidden h-px bg-[color-mix(in_oklab,var(--silver)_18%,transparent)] lg:block"
          />
          {STAGES.map((stage) => (
            <li
              key={stage.name}
              className="cx-stagger-item relative flex flex-col border-l border-[color-mix(in_oklab,var(--silver)_18%,transparent)] pl-6 lg:min-h-[25rem] lg:border-l-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
            >
              <div className="relative z-10 flex items-center gap-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--accent-glow)] bg-[var(--graphite)] font-mono text-[9px] text-[var(--accent-glow)]">
                  {stage.n}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--steel)]">
                  {stage.name}
                </span>
              </div>
              <h3 className="mt-10 max-w-[14ch] font-display text-3xl font-medium leading-[1.02] tracking-[-0.035em] text-[var(--silver)]">
                {stage.promise}
              </h3>
              <div className="mt-8 border-t border-[color-mix(in_oklab,var(--silver)_12%,transparent)] pt-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--steel)]">
                  What the client receives
                </p>
                <ul className="mt-4 space-y-2 text-sm text-[var(--silver-dim)]">
                  {stage.receives.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span aria-hidden className="text-[var(--accent-glow)]">
                        /
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                to={stage.href}
                className="mt-auto inline-flex min-h-11 items-center gap-2 pt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--silver)] transition hover:text-[var(--accent-glow)]"
              >
                Explore {stage.name} <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ol>
        <div className="cx-reveal mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-8">
          <Link
            to="/engagement-model"
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-glow)]"
          >
            Explore the engagement model <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
          <Link
            to="/solutions"
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--silver-dim)] transition-colors hover:text-[var(--silver)]"
          >
            Explore capabilities <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
