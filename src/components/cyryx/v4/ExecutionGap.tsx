import { ArrowUpRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";

const EVIDENCE = [
  {
    value: "60%",
    label: "Data readiness",
    body: "Gartner predicts organizations will abandon 60% of AI projects unsupported by AI-ready data through 2026.",
    source: "Gartner · February 2025",
    href: "https://www.gartner.com/en/newsroom/press-releases/2025-02-26-lack-of-ai-ready-data-puts-ai-projects-at-risk",
  },
  {
    value: "40%",
    label: "Governance in production",
    body: "Gartner predicts that by 2027, 40% of enterprises will demote or decommission autonomous AI agents after governance gaps surface in production incidents.",
    source: "Gartner · May 2026",
    href: "https://www.gartner.com/en/newsroom/press-releases/2026-05-26-gartner-says-applying-uniform-governance-across-ai-agents-will-lead-to-enterprise-ai-agent-failure",
  },
  {
    value: "57% / 14%",
    label: "Organizational trust",
    body: "Business units trusted and were ready to use new AI solutions in 57% of high-maturity organizations, compared with 14% of low-maturity organizations in a Gartner survey.",
    source: "Gartner · June 2025",
    href: "https://www.gartner.com/en/newsroom/press-releases/2025-06-30-gartner-survey-finds-forty-five-percent-of-organizations-with-high-artificial-intelligence-maturity-keep-artificial-intelligence-projects-operational-for-at-least-three-years",
  },
] as const;

export function ExecutionGap() {
  return (
    <section
      id="execution-gap"
      aria-labelledby="execution-gap-heading"
      data-story-section
      className="relative overflow-hidden border-y border-[color-mix(in_oklab,var(--silver)_12%,transparent)] bg-[var(--obsidian)] py-20 sm:py-24 lg:py-32"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(circle at 12% 15%, color-mix(in oklab, var(--accent-glow) 10%, transparent), transparent 32%), linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--silver) 4%, transparent) 50%, transparent 100%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="cx-reveal grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-24">
          <div>
            <HudLabel withDot>The enterprise AI execution gap</HudLabel>
            <p className="mt-7 max-w-md text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
              Models are advancing quickly. Durable business value still depends on the operating
              system around them: prepared data, bounded authority, measurable value, and teams that
              trust the result.
            </p>
          </div>
          <h2
            id="execution-gap-heading"
            className="max-w-[16ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-silver-gradient sm:text-5xl lg:text-7xl"
          >
            The model is only one part of the risk.
          </h2>
        </div>

        <div className="cx-stagger mt-14 grid gap-px overflow-hidden rounded-lg border border-[color-mix(in_oklab,var(--silver)_14%,transparent)] bg-[color-mix(in_oklab,var(--silver)_14%,transparent)] sm:mt-16 lg:grid-cols-3">
          {EVIDENCE.map((item, index) => (
            <article
              key={item.value}
              className="cx-stagger-item group relative flex min-h-full flex-col bg-[color-mix(in_oklab,var(--onyx)_94%,transparent)] p-6 transition-colors duration-300 hover:bg-[var(--graphite)] sm:p-8 lg:p-10"
            >
              <div className="flex items-start justify-between gap-5">
                <span className="font-display text-5xl font-semibold tracking-[-0.055em] text-chrome-gradient sm:text-6xl">
                  {item.value}
                </span>
                <span className="font-mono text-[9px] tracking-[0.22em] text-[var(--accent-glow)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--steel)]">
                {item.label}
              </p>
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-[var(--silver-dim)]">
                {item.body}
              </p>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.source}: open the original Gartner publication`}
                className="mt-8 inline-flex items-center gap-2 border-t border-white/10 pt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--silver-dim)] transition-colors hover:text-[var(--accent-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--onyx)]"
              >
                <span>{item.source}</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>

        <div className="cx-reveal mt-12 grid gap-6 border-t border-[color-mix(in_oklab,var(--silver)_14%,transparent)] pt-9 sm:mt-16 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent-glow)]">
            Cyryx thesis
          </span>
          <p className="max-w-4xl font-display text-2xl font-medium leading-snug tracking-[-0.025em] text-[var(--silver)] sm:text-3xl">
            The missing layer is controlled execution: the structure that turns AI capability into
            accountable business operations.
          </p>
        </div>
      </div>
    </section>
  );
}
