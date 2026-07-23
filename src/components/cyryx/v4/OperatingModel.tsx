import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";

const STAGES = [
  {
    n: "01",
    name: "Advise",
    promise: "Decide what deserves to be built.",
    body: "We examine the workflow, opportunity, data, authority, risk, and economic case before recommending a system.",
    receives: ["Opportunity assessment", "Architecture direction", "Prioritized roadmap"],
    href: "/solutions/ai-strategy-advisory",
  },
  {
    n: "02",
    name: "Build",
    promise: "Engineer the capability around real operations.",
    body: "Product experience, deterministic software, AI, integrations, and controls are designed as one operating system.",
    receives: ["Working system", "Acceptance evidence", "Operational documentation"],
    href: "/solutions",
  },
  {
    n: "03",
    name: "Operate",
    promise: "Keep the system useful after launch.",
    body: "When selected, Cyryx can monitor, maintain, optimize, and evolve the defined system under agreed responsibilities.",
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
      className="relative bg-[var(--graphite)] py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="cx-reveal grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end lg:gap-20">
          <div>
            <HudLabel withDot>Advise · Build · Operate</HudLabel>
            <h2
              id="operating-model-heading"
              className="mt-7 max-w-[12ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-[var(--silver)] sm:text-5xl lg:text-7xl"
            >
              One partner from decision to operation.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg lg:pb-2">
            Cyryx is an AI lab and systems company. We can help determine the right move, build the
            system, and remain accountable for defined operations when continuity matters.
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
              className="cx-stagger-item relative flex flex-col border-l border-[color-mix(in_oklab,var(--silver)_18%,transparent)] pl-6 lg:min-h-[29rem] lg:border-l-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
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
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-[var(--silver-dim)]">
                {stage.body}
              </p>
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
      </div>
    </section>
  );
}
