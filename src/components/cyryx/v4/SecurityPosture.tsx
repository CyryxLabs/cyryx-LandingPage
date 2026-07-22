import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";

const CONTROL_FLOW = [
  ["01", "Authority", "Define who or what may initiate consequential work."],
  ["02", "Boundaries", "Limit data, tools, spend, and downstream actions according to risk."],
  ["03", "Evaluation", "Check material output before it advances where the system supports it."],
  ["04", "Evidence", "Preserve the operating record needed for review and improvement."],
  ["05", "Ownership", "Assign human responsibility for decisions, exceptions, and change."],
] as const;

const ARCHITECTURE_NOTES = [
  [
    "Approval boundaries",
    "High-impact actions can be held for the named human decision the engagement requires.",
  ],
  [
    "Decision evidence",
    "The operating context needed to understand what happened can be preserved for review.",
  ],
  [
    "Cost visibility",
    "Usage and spend can be made visible where selected infrastructure supports it.",
  ],
] as const;

export function SecurityPosture() {
  return (
    <section id="security" className="relative overflow-hidden py-24 sm:py-32 lg:py-44">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="cx-reveal grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end lg:gap-20">
          <div>
            <HudLabel withDot>Governance and evidence</HudLabel>
            <h2 className="mt-7 max-w-[14ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-[var(--silver)] sm:text-5xl lg:text-7xl">
              Governance is architecture.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg lg:pb-2">
            Know what the system may do, who owns consequential decisions, what evidence remains,
            and what execution costs. Cyryx designs those controls according to authority, risk,
            infrastructure, and the engagement — without implying automatic compliance.
          </p>
        </div>

        <div className="mt-16 grid gap-12 sm:mt-20 lg:grid-cols-[1.12fr_0.88fr] lg:gap-20">
          <figure className="cx-reveal relative overflow-hidden rounded-lg border border-[color-mix(in_oklab,var(--silver)_14%,transparent)] bg-[var(--obsidian)] p-6 sm:p-10">
            <figcaption className="font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--steel)]">
              Conceptual control path / engagement-specific
            </figcaption>
            <ol className="mt-10">
              {CONTROL_FLOW.map(([n, title, body], index) => (
                <li key={n} className="relative grid grid-cols-[2.5rem_1fr] gap-4 pb-8 last:pb-0">
                  {index < CONTROL_FLOW.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-[1.18rem] top-8 h-[calc(100%-1.1rem)] w-px bg-[color-mix(in_oklab,var(--accent-glow)_24%,transparent)]"
                    />
                  )}
                  <span className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--accent-glow)_45%,transparent)] bg-[var(--obsidian)] font-mono text-[9px] text-[var(--accent-glow)]">
                    {n}
                  </span>
                  <div className="pt-1">
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
          </figure>

          <div className="cx-stagger lg:pt-3">
            <HudLabel>Architecture before automation</HudLabel>
            <h3 className="mt-6 max-w-[14ch] font-display text-3xl font-medium leading-[1.04] tracking-[-0.035em] text-[var(--silver)] sm:text-4xl">
              Controls follow authority and risk — not a universal checklist.
            </h3>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--silver-dim)]">
              The appropriate control path depends on what a system can access, decide, spend, and
              change. Cyryx defines those boundaries with the client and selected infrastructure.
            </p>
            <dl className="mt-9 border-t border-[color-mix(in_oklab,var(--silver)_14%,transparent)]">
              {ARCHITECTURE_NOTES.map(([term, description]) => (
                <div
                  key={term}
                  className="cx-stagger-item border-b border-[color-mix(in_oklab,var(--silver)_14%,transparent)] py-6"
                >
                  <dt className="font-display text-lg font-medium text-[var(--silver)]">{term}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-[var(--silver-dim)]">
                    {description}
                  </dd>
                </div>
              ))}
            </dl>
            <Link
              to="/solutions/ai-governance-cost-control"
              className="mt-7 inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--silver)] transition hover:text-[var(--accent-glow)]"
            >
              Explore governance architecture <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
