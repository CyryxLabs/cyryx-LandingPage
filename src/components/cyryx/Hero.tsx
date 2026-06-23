import { ArrowRight } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";
import { DashboardPanel } from "./DashboardPanel";
import { GridFloor } from "./primitives/GridFloor";
import { ScrollIndicator } from "./ScrollIndicator";
import { MonolithScene } from "./three/MonolithScene";
import { MagneticButton } from "./primitives/MagneticButton";
import heroBanner from "@/assets/cyryx-hero-banner.png.asset.json";

/**
 * Hero — clean vertical hierarchy, mobile-first.
 * Layer order (back → front):
 *   GridFloor · transparent banner glow · radial teal wash ·
 *   monolith 3D backdrop · (content column) eyebrow → headline → sub → CTAs.
 * No element overlaps another at any breakpoint; monolith sits behind the
 * headline and the headline owns its own flow space.
 */
export function Hero() {
  return (
    <section
      id="top"
      data-hero
      className="relative isolate overflow-hidden pt-20 sm:pt-28 lg:pt-32 pb-16 lg:pb-24"
    >
      <GridFloor />

      {/* Soft cinematic banner — transparent PNG, blended into the dark stage */}
      <img
        src={heroBanner.url}
        alt=""
        aria-hidden
        loading="eager"
        decoding="async"
        fetchPriority="high"
        width={1920}
        height={640}
        className="pointer-events-none absolute inset-x-0 top-24 mx-auto h-auto w-full max-w-[1600px] object-contain opacity-40 mix-blend-screen [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_45%,transparent_85%)]"
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

      {/* Stage */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Monolith 3D — decorative backdrop, sits behind the text column */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 z-0 opacity-70 sm:opacity-80"
          style={{ width: "min(460px, 70%)", height: "min(560px, 78vh)" }}
        >
          <MonolithScene className="h-full w-full" />
        </div>

        {/* Desktop-only telemetry rails */}
        <div className="hidden lg:flex absolute left-4 top-32 flex-col gap-2 z-10" data-hero-line>
          <span className="hud-label text-[var(--silver-dim)]">LAT 41.014°N</span>
          <span className="hud-label text-[var(--silver-dim)]">LON 28.978°E</span>
          <span className="hud-label text-[var(--accent-glow)]">SECTOR 07</span>
        </div>
        <div className="hidden lg:flex absolute right-4 top-32 flex-col gap-2 items-end z-10" data-hero-line>
          <span className="hud-label text-[var(--silver-dim)]">CAM 03 · LIVE</span>
          <span className="hud-label text-[var(--silver-dim)]">CORE T+00:00</span>
          <span className="hud-label text-[var(--accent-glow)]">STATUS · OPTIMAL</span>
        </div>

        {/* Content column — mobile-first vertical flow, no overlaps */}
        <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
          <div data-hero-line>
            <HudLabel withDot className="text-[var(--accent-glow)]">
              CYRYX LABS / COMMAND LAYER · v1.04
            </HudLabel>
          </div>

          <h1 className="mt-8 sm:mt-10 font-display font-semibold leading-[0.95] tracking-tight">
            <span
              className="block text-[40px] sm:text-6xl lg:text-8xl xl:text-[120px] uppercase"
              style={{ color: "var(--silver)" }}
              data-hero-headline
            >
              Command Layer
            </span>
            <span
              className="mt-1 block text-[40px] sm:text-6xl lg:text-8xl xl:text-[120px] uppercase italic font-light"
              style={{ color: "var(--accent-glow)" }}
              data-hero-headline
            >
              for Autonomy
            </span>
          </h1>

          <p
            className="mt-6 sm:mt-8 max-w-2xl text-[15px] sm:text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]"
            data-hero-line
          >
            Cyryx Labs builds reasoning engines, command architecture, and secure
            execution frameworks for organizations deploying AI at enterprise scale.
          </p>

          <div
            className="mt-8 sm:mt-10 flex w-full flex-col sm:w-auto sm:flex-row gap-3 sm:gap-4 justify-center"
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