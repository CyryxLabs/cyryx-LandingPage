import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";

export function LyraSpotlight() {
  return (
    <section
      className="relative overflow-hidden py-24 sm:py-32 lg:py-44"
      aria-labelledby="lyra-heading"
    >
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-24 lg:px-10">
        <div className="cx-reveal">
          <HudLabel withDot>Lyra / Private development</HudLabel>
          <h2
            id="lyra-heading"
            className="mt-7 max-w-[13ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-[var(--silver)] sm:text-5xl lg:text-7xl"
          >
            Private intelligence infrastructure, designed to remain model-agnostic.
          </h2>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
            Lyra is a private intelligence and execution runtime under development inside Cyryx. Its
            current focus is controlled orchestration across models, tools, context, and local
            execution boundaries.
          </p>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[var(--steel)]">
            This is a development direction, not a generally available product or a proprietary
            foundation model. Access and capabilities are evaluated privately.
          </p>
          <Link
            to="/products/lyra"
            className="mt-9 inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--silver)] transition hover:text-[var(--accent-glow)]"
          >
            Understand Lyra's current focus <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>

        <div
          className="cx-reveal relative aspect-square overflow-hidden rounded-full border border-[color-mix(in_oklab,var(--silver)_14%,transparent)] bg-[var(--obsidian)]"
          aria-label="Conceptual diagram showing Lyra coordinating models, tools, context, and execution"
          role="img"
        >
          <div aria-hidden className="absolute inset-[10%] rounded-full border border-white/10" />
          <div
            aria-hidden
            className="absolute inset-[24%] rounded-full border border-[color-mix(in_oklab,var(--accent-glow)_28%,transparent)]"
          />
          <div
            aria-hidden
            className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 h-px w-[80%] bg-white/10"
          />
          <div
            aria-hidden
            className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 h-[80%] w-px bg-white/10"
          />
          <div className="absolute inset-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--accent-glow)] bg-[var(--graphite)] shadow-[0_0_55px_color-mix(in_oklab,var(--accent-glow)_20%,transparent)]">
            <span className="font-display text-2xl font-medium tracking-[0.08em] text-[var(--silver)]">
              LYRA
            </span>
          </div>
          {[
            ["Models", "left-[8%] top-1/2 -translate-y-1/2"],
            ["Tools", "right-[10%] top-1/2 -translate-y-1/2"],
            ["Context", "left-1/2 top-[9%] -translate-x-1/2"],
            ["Execution", "bottom-[9%] left-1/2 -translate-x-1/2"],
          ].map(([label, position]) => (
            <span
              key={label}
              className={`absolute ${position} rounded-sm border border-white/10 bg-black/55 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--steel)]`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
