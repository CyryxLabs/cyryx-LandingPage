import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";
import { trackCta } from "@/lib/track-cta";

export function CompactStart() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      data-story-section
      className="relative overflow-hidden py-12 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,color-mix(in_oklab,var(--accent-glow)_10%,transparent),transparent_42%)]"
      />
      <div className="relative mx-auto max-w-5xl px-5 text-center sm:px-8 lg:px-10">
        <div className="cx-reveal">
          <HudLabel withDot>Start with the constraint</HudLabel>
          <h2
            id="contact-heading"
            className="mx-auto mt-6 max-w-[15ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-silver-gradient sm:mt-7 sm:text-5xl lg:text-7xl"
          >
            Is the opportunity worth building?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:mt-7 sm:text-lg">
            Bring us the workflow, product opportunity, or operational constraint. We will identify
            the clearest next step — or recommend no build.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:mt-9 sm:flex-row">
            <Link
              to="/start"
              onClick={() =>
                trackCta({ cta: "start_project", section: "final_cta", href: "/start" })
              }
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[var(--silver)] px-6 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--onyx)] transition-colors hover:bg-white"
            >
              Start a qualified conversation <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to="/engagement-model"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/15 px-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--silver)] transition-colors hover:border-[var(--accent-glow)] hover:text-[var(--accent-glow)]"
            >
              Explore the engagement model <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
