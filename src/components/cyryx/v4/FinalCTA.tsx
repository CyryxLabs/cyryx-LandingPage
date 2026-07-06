import { ArrowRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";
import { trackCta } from "@/lib/track-cta";

export function FinalCTA() {
  return (
    <section id="final-cta" className="relative py-14 sm:py-20 lg:py-28 bg-[var(--graphite)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-radial-teal)" }}
      />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-10 text-center">
        <HudLabel withDot>Get Started</HudLabel>
        <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-[1.05] tracking-tight text-silver-gradient">
          Ready to turn AI into <span style={{ color: "var(--accent-glow)" }}>execution?</span>
        </h2>
        <p className="mt-6 text-[15px] sm:text-base leading-relaxed text-[var(--silver-dim)]">
          Build your AI product, automate a workflow, or join the MAAX Studio
          early access program.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="#contact"
            onClick={() =>
              trackCta({ cta: "start_project", section: "final_cta", href: "#contact" })
            }
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[var(--accent-glow)] px-6 hud-label text-[var(--onyx)] font-semibold shadow-[var(--shadow-glow-teal)] hover:brightness-110 transition sm:w-auto"
          >
            Start a project
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#maax"
            onClick={() =>
              trackCta({ cta: "request_early_access", section: "final_cta", href: "#maax" })
            }
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_45%,transparent)] px-6 hud-label text-[var(--accent-glow)] hover:bg-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)] transition sm:w-auto"
          >
            Request access
          </a>
        </div>
        <p className="mt-8 hud-label text-[var(--silver-dim)]">
          From prompt chaos to governed AI execution.
        </p>
      </div>
    </section>
  );
}