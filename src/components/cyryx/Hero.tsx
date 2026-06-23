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

      <div className="relative mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-10 px-4 pb-14 sm:px-6 sm:pb-18 lg:grid-cols-[minmax(0,0.98fr)_minmax(420px,0.82fr)] lg:gap-8 lg:px-10 lg:pb-20">
        <div className="relative z-10 flex max-w-4xl flex-col items-start text-left lg:pt-6">
          <div className="mb-6" data-hero-line>
            <HudLabel withDot className="text-[var(--accent-glow)]">
              CYRYX LABS / COMMAND LAYER · v1.04
            </HudLabel>
          </div>

          <h1 className="font-display font-semibold uppercase leading-[0.9] text-[var(--silver)]">
            <span
              className="block text-[44px] sm:text-[72px] lg:text-[96px] xl:text-[116px]"
              data-hero-headline
            >
              Command Layer
            </span>
            <span
              className="mt-2 block text-[44px] font-light italic text-[var(--accent-glow)] sm:text-[72px] lg:text-[96px] xl:text-[116px]"
              data-hero-headline
            >
              for Autonomy
            </span>
          </h1>

          <p
            className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--silver-dim)] sm:text-base lg:text-lg"
            data-hero-line
          >
            Cyryx Labs builds reasoning engines, command architecture, and secure
            execution frameworks for organizations deploying AI at enterprise scale.
          </p>

          <div
            className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4"
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

          <div className="mt-10 grid w-full max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-md border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--silver)_10%,transparent)] sm:mt-12" data-hero-line>
            {[
              ["Latency", "8ms"],
              ["Nodes", "2,468"],
              ["Uptime", "99.99%"],
            ].map(([label, value]) => (
              <div key={label} className="bg-[color-mix(in_oklab,var(--graphite)_88%,var(--onyx))] px-3 py-4 sm:px-5">
                <div className="hud-label text-[var(--silver-dim)]">{label}</div>
                <div className="mt-2 font-display text-base font-semibold text-[var(--silver)] sm:text-xl">
                  {value}
                </div>
              </div>
            ))}
          </div>
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
            <span className="hud-label text-[var(--silver-dim)]">LAT 41.014°N</span>
            <span className="hud-label text-[var(--silver-dim)]">LON 28.978°E</span>
            <span className="hud-label text-[var(--accent-glow)]">SECTOR 07</span>
          </div>
          <div className="absolute right-0 bottom-20 hidden flex-col items-end gap-2 lg:flex" data-hero-line>
            <span className="hud-label text-[var(--silver-dim)]">CAM 03 · LIVE</span>
            <span className="hud-label text-[var(--silver-dim)]">CORE T+00:00</span>
            <span className="hud-label text-[var(--accent-glow)]">STATUS · OPTIMAL</span>
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