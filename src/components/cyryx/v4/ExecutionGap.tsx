import { ArrowUpRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";

const EVIDENCE = [
  {
    value: "60%",
    label: "AI governance",
    body: "Gartner predicts that by 2027, 60% of organizations that don't address the cultural challenges of data and analytics governance will fail to govern AI successfully.",
    source: "Gartner · September 2026",
    href: "https://www.gartner.com/en/newsroom/press-releases/2026-09-21-gartner-predicts-60-percent-of-organizations-that-ignore-data-governance-culture-challenges-will-fail-to-govern-ai-successfully-by-2027",
  },
  {
    value: ">40%",
    label: "Agentic AI projects",
    body: "Gartner predicts more than 40% of agentic AI projects will be canceled by the end of 2027 because of escalating costs, unclear value, or inadequate risk controls.",
    source: "Gartner · June 2025",
    href: "https://www.gartner.com/en/newsroom/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects-will-be-canceled-by-end-of-2027",
  },
] as const;

export function ExecutionGap() {
  return (
    <section
      id="execution-gap"
      aria-labelledby="execution-gap-heading"
      data-story-section
      className="relative overflow-hidden border-y border-[color-mix(in_oklab,var(--silver)_12%,transparent)] bg-[var(--obsidian)] py-12 sm:py-20 lg:py-24"
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
        <div className="cx-reveal grid gap-8 sm:gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-24">
          <div>
            <HudLabel withDot>The problem</HudLabel>
            <p className="mt-7 max-w-md text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
              Most AI projects don't fail on the model. They fail on the data, permissions, costs
              and ownership around it.
            </p>
          </div>
          <h2
            id="execution-gap-heading"
            className="max-w-[16ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-silver-gradient sm:text-5xl lg:text-7xl"
          >
            AI initiatives stall between the model and the business.
          </h2>
        </div>

        <div className="cx-stagger mt-10 grid gap-px overflow-hidden rounded-lg border border-[color-mix(in_oklab,var(--silver)_14%,transparent)] bg-[color-mix(in_oklab,var(--silver)_14%,transparent)] sm:mt-16 lg:grid-cols-2">
          {EVIDENCE.map((item, index) => (
            <article
              key={item.value}
              className="cx-stagger-item group relative grid min-h-full gap-8 bg-[color-mix(in_oklab,var(--onyx)_94%,transparent)] p-6 transition-colors duration-300 hover:bg-[var(--graphite)] sm:p-8 lg:grid-cols-[0.72fr_1.28fr] lg:p-10"
            >
              <div className="flex items-start justify-between gap-5 lg:block">
                <span className="font-display text-5xl font-semibold tracking-[-0.055em] text-chrome-gradient sm:text-6xl">
                  {item.value}
                </span>
                <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--accent-glow)] lg:mt-5 lg:block">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-col">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--steel)]">
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
                  className="mt-7 inline-flex items-center gap-2 border-t border-white/10 pt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--silver-dim)] transition-colors hover:text-[var(--accent-glow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-glow)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--onyx)]"
                >
                  <span>{item.source}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="cx-reveal mt-10 grid gap-5 border-t border-[color-mix(in_oklab,var(--silver)_14%,transparent)] pt-7 sm:mt-16 sm:grid-cols-[auto_1fr] sm:items-center sm:gap-10 sm:pt-9">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accent-glow)]">
            Cyryx thesis
          </span>
          <p className="max-w-4xl font-display text-2xl font-medium leading-snug tracking-[-0.025em] text-[var(--silver)] sm:text-3xl">
            A capable model is not yet a working system. The missing layer is controlled
            execution, and that is what we build.
          </p>
        </div>
      </div>
    </section>
  );
}
