import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CapabilityMonolith } from "../primitives/CapabilityMonolith";

const CONTROL_FLOW = [
  ["01", "Authority", "Define what the system may access, decide, spend, and change."],
  ["02", "Boundaries", "Hold high-impact actions for the required human decision."],
  ["03", "Evidence", "Preserve the context behind consequential decisions and actions."],
  ["04", "Value", "Monitor quality, cost, and exceptions before deciding what should scale."],
] as const;

export function SecurityPosture() {
  return (
    <section
      id="security"
      aria-labelledby="security-heading"
      data-story-section
      data-governance-system
      className="relative overflow-hidden py-12 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="relative z-10 cx-reveal grid gap-6 sm:gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-20">
          <div>
            <h2
              id="security-heading"
              className="max-w-[14ch] font-display text-[1.75rem] sm:text-[2.125rem] lg:text-[2.75rem] xl:text-[3.5rem] font-semibold leading-[0.98] tracking-[-0.045em] text-[var(--silver)]"
            >
              Governance is architecture.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg lg:pb-2">
            Before AI can act inside an operation, its authority, limits, evidence, cost, and owner
            must be explicit.
          </p>
        </div>

        <div className="relative z-10 mt-10 grid gap-10 sm:mt-20 sm:gap-12 lg:grid-cols-[0.96fr_1.04fr] lg:gap-20">
          {/* One governance visual: the monolith core scrubs with the scroll. */}
          <div className="cx-reveal relative h-80 sm:h-96 lg:h-auto lg:min-h-[34rem]">
            <CapabilityMonolith
              className="pointer-events-none absolute inset-0 overflow-hidden"
              surfaceOpacity="opacity-[0.22]"
            />
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent-glow)_12%,transparent),transparent_68%)] blur-2xl"
            />
          </div>

          <div>
            <ol className="cx-stagger border-t border-white/10">
              {CONTROL_FLOW.map(([n, title, body], index) => (
                <li
                  key={n}
                  data-governance-control
                  className="cx-stagger-item grid grid-cols-[2.5rem_1fr] gap-5 border-b border-white/10 py-6 sm:py-7"
                >
                  <span className="font-mono text-[12px] tracking-[0.18em] text-[var(--accent-glow)]">
                    {n}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-medium text-[var(--silver)]">
                      {title}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-[var(--silver-dim)]">
                      {body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 font-display text-2xl tracking-[-0.025em] text-[var(--silver)]">
              Control before scale.
            </p>
            <Link
              to="/solutions/ai-governance-cost-control"
              className="mt-7 inline-flex min-h-11 items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--silver)] transition hover:text-[var(--accent-glow)]"
            >
              Explore governance architecture <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
