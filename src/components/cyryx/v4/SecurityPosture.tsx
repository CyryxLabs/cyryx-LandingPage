import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";
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
      <CapabilityMonolith />
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="relative z-10 cx-reveal grid gap-6 sm:gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-20">
          <div>
            <HudLabel withDot>Governance</HudLabel>
            <h2
              id="security-heading"
              className="mt-7 max-w-[14ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-[var(--silver)] sm:text-5xl lg:text-7xl"
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
          <figure className="cx-reveal relative min-h-[26rem] overflow-hidden rounded-lg border border-[color-mix(in_oklab,var(--silver)_14%,transparent)] bg-[color-mix(in_oklab,var(--obsidian)_90%,transparent)] p-6 sm:min-h-[28rem] sm:p-10">
            <figcaption className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--steel)]">
              Control architecture / engagement-specific
            </figcaption>
            <div aria-hidden className="cx-governance-visual">
              <span className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent-glow)_9%,transparent),transparent_68%)] blur-2xl" />
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/10">
                <span
                  data-governance-core
                  className="absolute inset-0 origin-top bg-[linear-gradient(180deg,transparent,var(--accent-glow),white,var(--accent-glow),transparent)] opacity-80 shadow-[0_0_26px_color-mix(in_oklab,var(--accent-glow)_55%,transparent)]"
                />
                <span
                  data-governance-pulse
                  className="absolute left-1/2 top-0 h-24 w-[3px] -translate-x-1/2 bg-[linear-gradient(180deg,transparent,var(--accent-glow),white,var(--accent-glow),transparent)] opacity-0 shadow-[0_0_28px_color-mix(in_oklab,var(--accent-glow)_68%,transparent)]"
                />
              </span>
              {CONTROL_FLOW.map(([n, title], index) => {
                const top = [16, 39, 62, 85][index];
                const isLeft = index % 2 === 0;

                return (
                  <div key={n} className="cx-governance-level" style={{ top: `${top}%` }}>
                    <span
                      data-governance-gate
                      className="cx-governance-gate bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--silver)_45%,transparent),transparent)]"
                    />
                    <span
                      data-governance-node
                      className="cx-governance-node border border-[color-mix(in_oklab,var(--accent-glow)_74%,transparent)] bg-[var(--obsidian)] shadow-[0_0_16px_color-mix(in_oklab,var(--accent-glow)_32%,transparent)]"
                    />
                    <span
                      data-governance-label
                      className={`cx-governance-label ${
                        isLeft ? "cx-governance-label--left" : "cx-governance-label--right"
                      }`}
                    >
                      <span className="font-mono text-[10px] tracking-[0.16em] text-[var(--accent-glow)]">
                        {n}
                      </span>
                      <span className="font-display text-xs font-medium tracking-[0.01em] text-[var(--silver)] sm:text-sm">
                        {title}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </figure>

          <div>
            <ol className="cx-stagger border-t border-white/10">
              {CONTROL_FLOW.map(([n, title, body], index) => (
                <li
                  key={n}
                  data-governance-control
                  className="cx-stagger-item grid grid-cols-[2.5rem_1fr] gap-5 border-b border-white/10 py-6 sm:py-7"
                >
                  <span className="font-mono text-[11px] tracking-[0.18em] text-[var(--accent-glow)]">
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
              className="mt-7 inline-flex min-h-11 items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--silver)] transition hover:text-[var(--accent-glow)]"
            >
              Explore governance architecture <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
