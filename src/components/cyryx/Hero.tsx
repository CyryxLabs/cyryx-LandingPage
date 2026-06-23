import { ArrowRight } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";
import { CyryxMark } from "./primitives/CyryxMark";
import { DashboardPanel } from "./DashboardPanel";
import { GridFloor } from "./primitives/GridFloor";
import { ScrollIndicator } from "./ScrollIndicator";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-16 lg:pb-24"
    >
      <GridFloor />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-radial-teal)" }}
      />
      {/* Teal core line */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[60%] w-px teal-core-line opacity-50 lg:opacity-30"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1.2fr] lg:gap-14 lg:items-center">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <div className="flex justify-center lg:justify-start" data-hero-line>
              <HudLabel withDot className="text-[var(--accent-glow)]">
                AI Infrastructure / Command Layer
              </HudLabel>
            </div>

            <div className="mt-6 flex justify-center lg:hidden" data-hero-line>
              <div className="relative">
                <CyryxMark size={88} className="drop-shadow-[0_0_24px_color-mix(in_oklab,var(--accent-glow)_40%,transparent)]" />
              </div>
            </div>

            <h1 className="mt-6 font-display font-semibold leading-[1.05] tracking-tight">
              <span className="block text-silver-gradient text-[40px] sm:text-5xl lg:text-[68px] xl:text-[80px]" data-hero-line>
                The intelligence
              </span>
              <span className="block text-silver-gradient text-[40px] sm:text-5xl lg:text-[68px] xl:text-[80px]" data-hero-line>
                infrastructure behind
              </span>
              <span
                className="block text-[40px] sm:text-5xl lg:text-[68px] xl:text-[80px]"
                style={{ color: "var(--accent-glow)" }}
                data-hero-line
              >
                autonomous execution.
              </span>
            </h1>

            <p
              className="mt-6 mx-auto lg:mx-0 max-w-xl text-[15px] sm:text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]"
              data-hero-line
            >
              Cyryx Labs builds reasoning engines, command architecture, and secure
              execution frameworks for organizations deploying AI at enterprise scale.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 lg:justify-start justify-center" data-hero-line>
              <a
                href="#systems"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[var(--accent-glow)] px-6 hud-label text-[var(--onyx)] font-semibold shadow-[var(--shadow-glow-teal)] hover:brightness-110 transition"
              >
                Explore Systems
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#command"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] px-6 hud-label text-[var(--silver)] hover:border-[var(--accent-glow)] hover:bg-[color-mix(in_oklab,var(--accent-glow)_8%,transparent)] transition"
              >
                View Command Layer
                <ArrowRight className="h-4 w-4 text-[var(--accent-glow)]" />
              </a>
            </div>
          </div>

          {/* Dashboard */}
          <div className="relative">
            <DashboardPanel />
          </div>
        </div>

        <div className="mt-12 lg:mt-20 flex justify-center">
          <ScrollIndicator />
        </div>
      </div>
    </section>
  );
}