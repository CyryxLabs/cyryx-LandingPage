import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { HudLabel } from "../primitives/HudLabel";
import { trackCta } from "@/lib/track-cta";
import { START_PROJECT_HREF } from "@/lib/cta";

export function FinalCTA() {
  return (
    <section id="final-cta" className="relative py-20 sm:py-28 lg:py-40 bg-[var(--graphite)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-radial-teal)" }}
      />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-10 text-center">
        <HudLabel withDot>Start with the problem</HudLabel>
        <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold uppercase leading-[1.02] tracking-tight text-silver-gradient">
          From fragmented operations to <span style={{ color: "var(--accent-glow)" }}>governed execution.</span>
        </h2>
        <p className="mt-6 text-[15px] sm:text-base leading-relaxed text-[var(--silver-dim)]">
          Describe the workflow, product, digital foundation, or operational problem. Cyryx will determine whether it requires a website, automation, AI system, product engagement, or no system at all.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href={START_PROJECT_HREF}
            onClick={() =>
              trackCta({ cta: "start_project", section: "final_cta", href: START_PROJECT_HREF })
            }
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[var(--accent-glow)] px-6 hud-label text-[var(--onyx)] font-semibold shadow-[var(--shadow-glow-teal)] hover:brightness-110 transition sm:w-auto"
          >
            Start a project
            <ArrowRight className="h-4 w-4" />
          </a>
          <Link
            to="/engagement-model"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_45%,transparent)] px-6 hud-label text-[var(--accent-glow)] hover:bg-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)] transition sm:w-auto"
          >
            Explore the engagement model
          </Link>
        </div>
        <p className="mt-8 hud-label text-[var(--silver-dim)]">
          Outcomes over output. Verification over generation.
        </p>
      </div>
    </section>
  );
}