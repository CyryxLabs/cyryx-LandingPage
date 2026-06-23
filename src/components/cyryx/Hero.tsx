import { ArrowRight } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";
import { DashboardPanel } from "./DashboardPanel";
import { GridFloor } from "./primitives/GridFloor";
import { ScrollIndicator } from "./ScrollIndicator";
import { MonolithScene } from "./three/MonolithScene";
import { MagneticButton } from "./primitives/MagneticButton";

export function Hero() {
  return (
    <section
      id="top"
      data-hero
      className="relative isolate overflow-hidden bg-[var(--onyx)] pt-20 sm:pt-24 lg:pt-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,var(--onyx)_0%,var(--graphite)_48%,var(--onyx)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[72vh] opacity-80"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--accent-glow) 10%, transparent), transparent 62%)",
        }}
      />
      <GridFloor className="opacity-30" />

      <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-start gap-10 px-4 pb-14 pt-8 sm:px-6 sm:pb-18 sm:pt-12 lg:min-h-[820px] lg:grid-cols-[minmax(0,0.98fr)_minmax(420px,0.82fr)] lg:gap-8 lg:px-10 lg:pt-16 lg:pb-20">
        <div className="relative z-10 flex max-w-4xl flex-col items-start text-left lg:pt-6">
          <div className="mb-6" data-hero-line>
            <HudLabel withDot className="text-[var(--accent-glow)]">
              CYRYX LABS / AGENTIC EXECUTION · v1.04
            </HudLabel>
          </div>

          <h1 className="font-display font-semibold uppercase leading-[0.9] text-[var(--silver)]">
            <span
              className="block text-[36px] sm:text-[60px] lg:text-[84px] xl:text-[100px]"
              data-hero-headline
            >
              AI Products &
            </span>
            <span
              className="block text-[36px] sm:text-[60px] lg:text-[84px] xl:text-[100px]"
              data-hero-headline
            >
              Execution Systems
            </span>
            <span
              className="mt-2 block text-[28px] font-light italic text-[var(--accent-glow)] sm:text-[44px] lg:text-[56px] xl:text-[64px]"
              data-hero-headline
            >
              for the agentic era.
            </span>
          </h1>

          <p
            className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--silver-dim)] sm:text-base lg:text-lg"
            data-hero-line
          >
            Cyryx Labs builds proprietary AI products, custom automation systems,
            and agentic workflows that help founders, agencies, and businesses
            turn AI into governed execution.
          </p>

          <div
            className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4"
            data-hero-line
          >
            <MagneticButton href="#maax" variant="primary">
              Explore MAAX Studio
              <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href="#cta" variant="ghost">
              Build with Cyryx
              <ArrowRight className="h-4 w-4 text-[var(--accent-glow)]" />
            </MagneticButton>
          </div>

          <p
            className="mt-10 hud-label text-[var(--accent-glow)]"
            data-hero-line
          >
            From prompt chaos to governed AI execution.
          </p>
        </div>

        <div className="relative z-0 mx-auto h-[360px] w-full max-w-[440px] sm:h-[500px] lg:h-[640px] lg:max-w-none">
          <div
            aria-hidden
            className="absolute inset-x-4 bottom-0 h-[28%] border-t border-[color-mix(in_oklab,var(--accent-glow)_28%,transparent)]"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--accent-glow) 14%, transparent), transparent 68%)",
              transform: "perspective(520px) rotateX(64deg)",
              transformOrigin: "bottom center",
            }}
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-0 h-full w-[min(100%,520px)] -translate-x-1/2"
          >
            <MonolithScene className="h-full w-full" />
          </div>

          <div className="absolute left-0 top-8 hidden flex-col gap-2 lg:flex" data-hero-line>
            <span className="hud-label text-[var(--silver-dim)]">ACTIVE MISSION</span>
            <span className="hud-label text-[var(--silver-dim)]">SOUL KERNEL · LOADED</span>
            <span className="hud-label text-[var(--accent-glow)]">ATLAS CONTEXT · OK</span>
          </div>
          <div className="absolute right-0 bottom-20 hidden flex-col items-end gap-2 lg:flex" data-hero-line>
            <span className="hud-label text-[var(--silver-dim)]">OPERATORS · ACTIVE</span>
            <span className="hud-label text-[var(--silver-dim)]">COMMAND GATES · ARMED</span>
            <span className="hud-label text-[var(--accent-glow)]">HUMAN APPROVAL READY</span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-10">
        <DashboardPanel />
      </div>

      <div className="relative flex justify-center pb-12">
        <ScrollIndicator />
      </div>
    </section>
  );
}