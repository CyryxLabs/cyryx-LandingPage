import { ArrowRight } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";
import { CyryxMark } from "./primitives/CyryxMark";
import { DashboardPanel } from "./DashboardPanel";
import { GridFloor } from "./primitives/GridFloor";
import { ScrollIndicator } from "./ScrollIndicator";

/**
 * Hero — monolith-anchored, centered.
 * Layout: brand mark → eyebrow → 2-line Orbitron headline → sub → CTAs.
 * Below: wide HUD console (DashboardPanel) acting as a low-mounted instrument bay.
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pt-28 sm:pt-32 lg:pt-40 pb-16 lg:pb-24"
    >
      <GridFloor />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-radial-teal)" }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-10 text-center">
        {/* Brand monolith */}
        <div
          className="flex justify-center"
          data-hero-line
        >
          <div className="relative">
            <CyryxMark
              size={132}
              className="drop-shadow-[0_0_36px_color-mix(in_oklab,var(--accent-glow)_50%,transparent)]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-full mt-2 h-10 w-px -translate-x-1/2 teal-core-line opacity-70"
            />
          </div>
        </div>

        <div className="mt-10 flex justify-center" data-hero-line>
          <HudLabel withDot className="text-[var(--accent-glow)]">
            AI Infrastructure / Command Layer
          </HudLabel>
        </div>

        <h1 className="mt-6 font-display font-semibold leading-[1.04] tracking-tight">
          <span
            className="block text-silver-gradient text-[40px] sm:text-6xl lg:text-[84px] xl:text-[104px] uppercase"
            data-hero-line
          >
            Command Layer
          </span>
          <span
            className="block text-[40px] sm:text-6xl lg:text-[84px] xl:text-[104px] uppercase"
            style={{ color: "var(--accent-glow)" }}
            data-hero-line
          >
            for Autonomy
          </span>
        </h1>

        <p
          className="mt-8 mx-auto max-w-2xl text-[15px] sm:text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]"
          data-hero-line
        >
          Cyryx Labs builds reasoning engines, command architecture, and secure
          execution frameworks for organizations deploying AI at enterprise scale.
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
          data-hero-line
        >
          <a
            href="#systems"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[var(--accent-glow)] px-7 hud-label text-[var(--onyx)] font-semibold shadow-[var(--shadow-glow-teal)] hover:brightness-110 transition"
          >
            Explore Systems
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#command"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-[color-mix(in_oklab,var(--silver)_18%,transparent)] px-7 hud-label text-[var(--silver)] hover:border-[var(--accent-glow)] hover:bg-[color-mix(in_oklab,var(--accent-glow)_8%,transparent)] transition"
          >
            View Command Layer
            <ArrowRight className="h-4 w-4 text-[var(--accent-glow)]" />
          </a>
        </div>
      </div>

      {/* Lower-mounted console */}
      <div className="relative mx-auto mt-16 lg:mt-24 max-w-7xl px-4 sm:px-6 lg:px-10">
        <DashboardPanel />
      </div>

      <div className="mt-12 lg:mt-20 flex justify-center">
        <ScrollIndicator />
      </div>
    </section>
  );
}