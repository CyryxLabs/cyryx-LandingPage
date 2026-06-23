import { ArrowRight } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";
import { DashboardPanel } from "./DashboardPanel";
import { GridFloor } from "./primitives/GridFloor";
import { ScrollIndicator } from "./ScrollIndicator";
import { MonolithScene } from "./three/MonolithScene";
import { MagneticButton } from "./primitives/MagneticButton";
import heroBanner from "@/assets/cyryx-hero-banner.png.asset.json";

/**
 * Hero — monolith-anchored, centered.
 * Layout: brand mark → eyebrow → 2-line Orbitron headline → sub → CTAs.
 * Below: wide HUD console (DashboardPanel) acting as a low-mounted instrument bay.
 */
export function Hero() {
  return (
    <section
      id="top"
      data-hero
      className="relative isolate overflow-hidden pt-24 sm:pt-28 lg:pt-32 pb-16 lg:pb-24"
    >
      <GridFloor />
      <img
        src={heroBanner.url}
        alt=""
        aria-hidden
        loading="eager"
        className="pointer-events-none absolute inset-x-0 top-16 mx-auto h-[860px] w-full max-w-[1600px] object-cover object-center opacity-[0.18] mix-blend-screen"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--gradient-radial-teal)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[90%] opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 35%, color-mix(in oklab, var(--accent-glow) 14%, transparent), transparent 70%)",
        }}
      />

      {/* Stage: 3D monolith centered, copy overlays */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="relative h-[720px] sm:h-[780px] lg:h-[860px]">
          {/* Monolith canvas — bounded so any clear-color halo can't bleed outside the slab */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-full -translate-x-1/2" style={{ width: "min(520px, 55%)" }}>
            <MonolithScene className="h-full w-full" />
          </div>

          {/* Top eyebrow */}
          <div className="absolute left-1/2 top-6 -translate-x-1/2 z-10" data-hero-line>
            <HudLabel withDot className="text-[var(--accent-glow)]">
              CYRYX LABS / COMMAND LAYER · v1.04
            </HudLabel>
          </div>

          {/* Side telemetry coordinates (desktop) */}
          <div className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 flex-col gap-2 z-10" data-hero-line>
            <span className="hud-label text-[var(--silver-dim)]">LAT 41.014°N</span>
            <span className="hud-label text-[var(--silver-dim)]">LON 28.978°E</span>
            <span className="hud-label text-[var(--accent-glow)]">SECTOR 07</span>
          </div>
          <div className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 flex-col gap-2 items-end z-10" data-hero-line>
            <span className="hud-label text-[var(--silver-dim)]">CAM 03 · LIVE</span>
            <span className="hud-label text-[var(--silver-dim)]">CORE T+00:00</span>
            <span className="hud-label text-[var(--accent-glow)]">STATUS · OPTIMAL</span>
          </div>

          {/* Headline overlay */}
          <div className="absolute inset-x-0 bottom-0 z-10 text-center">
            <h1 className="font-display font-semibold leading-[0.92] tracking-tight">
              <span
                className="block text-silver-gradient text-[44px] sm:text-7xl lg:text-[120px] xl:text-[148px] uppercase mix-blend-screen"
                data-hero-headline
              >
                Command Layer
              </span>
              <span
                className="block text-[44px] sm:text-7xl lg:text-[120px] xl:text-[148px] uppercase italic font-light"
                style={{ color: "var(--accent-glow)" }}
                data-hero-headline
              >
                for Autonomy
              </span>
            </h1>
          </div>
        </div>

        {/* Subcopy + CTAs below the stage */}
        <div className="mx-auto mt-10 max-w-3xl text-center">
          <p
            className="text-[15px] sm:text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]"
            data-hero-line
          >
            Cyryx Labs builds reasoning engines, command architecture, and secure
            execution frameworks for organizations deploying AI at enterprise scale.
          </p>

          <div
            className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center"
            data-hero-line
          >
            <MagneticButton href="#systems" variant="primary">
              Explore Systems
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href="#command" variant="ghost">
              View Command Layer
              <ArrowRight className="h-4 w-4 text-[var(--accent-glow)]" />
            </MagneticButton>
          </div>
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