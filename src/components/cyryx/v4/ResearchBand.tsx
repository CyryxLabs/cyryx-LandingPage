import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";
import { trackCta } from "@/lib/track-cta";

const DIRECTIONS = ["Execution", "Context", "Evaluation", "Authority", "Cost", "Interaction"];

export function ResearchBand() {
  return (
    <section
      id="research"
      aria-labelledby="research-heading"
      data-story-section
      className="relative bg-[var(--graphite)] py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-24 lg:px-10">
        <div className="cx-reveal">
          <HudLabel withDot>Applied Research</HudLabel>
          <h2
            id="research-heading"
            className="mt-7 max-w-[13ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-silver-gradient sm:text-5xl lg:text-6xl"
          >
            Research for systems that must leave the lab.
          </h2>
        </div>
        <div className="cx-reveal">
          <p className="max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
            Cyryx investigates the engineering and operating questions behind useful AI systems.
            Public publication claims and identifiers remain withheld until their evidence,
            limitations, attribution, and release approval are complete.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Research directions">
            {DIRECTIONS.map((direction) => (
              <li
                key={direction}
                className="rounded-sm border border-white/10 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--silver-dim)]"
              >
                {direction}
              </li>
            ))}
          </ul>
          <Link
            to="/research"
            onClick={() =>
              trackCta({ cta: "view_research", section: "research_band", href: "/research" })
            }
            className="mt-8 inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent-glow)] transition hover:gap-3"
          >
            Explore applied research <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
