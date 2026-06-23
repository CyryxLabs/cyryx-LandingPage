import infra from "@/assets/cyryx-infrastructure.jpg";
import { HudLabel } from "./primitives/HudLabel";

const STATS = [
  { l: "PB/s Throughput", v: 2.6, dec: 1 },
  { l: "% Uptime", v: 99.99, dec: 2 },
  { l: "Active Regions", v: 12, dec: 0 },
];

export function WhyCyryx() {
  return (
    <section id="intelligence" className="relative py-20 lg:py-32">
      {/* Telemetry rail */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="cx-stagger grid grid-cols-3 divide-x divide-[color-mix(in_oklab,var(--silver)_10%,transparent)] border-y border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_60%,transparent)]">
          {STATS.map((s) => (
            <div key={s.l} className="cx-stagger-item flex flex-col items-start gap-1 px-4 sm:px-6 py-5">
              <span className="hud-label text-[var(--silver-dim)]">{s.l}</span>
              <span className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-silver-gradient">
                <span
                  data-countup={s.v}
                  data-countup-decimals={s.dec}
                  data-countup-format="{n}"
                >
                  0
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 mt-16 lg:mt-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 lg:items-end">
          <div className="cx-reveal">
            <HudLabel withDot>Why Cyryx</HudLabel>
            <h2 className="mt-5 font-display text-[32px] sm:text-4xl lg:text-6xl xl:text-7xl font-semibold leading-[1.04] tracking-tight text-silver-gradient uppercase">
              Intelligence doesn&rsquo;t happen in isolation.
            </h2>
          </div>
          <div className="cx-reveal flex flex-col gap-6">
            <p className="text-[15px] sm:text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]">
              Cyryx Labs is the infrastructure layer for autonomous intelligence. We
              unite reasoning, execution, and command under a secure, scalable, and
              observable architecture&mdash;purpose-built for enterprises that demand
              control, performance, and trust.
            </p>
            <div className="h-px w-16 bg-[var(--accent-glow)] shadow-[0_0_8px_var(--accent-glow)]" />
            <a
              href="#command"
              className="hud-label inline-flex items-center gap-3 text-[var(--silver)] hover:text-[var(--accent-glow)] transition-colors"
            >
              Read the manifesto
              <span aria-hidden className="block h-px w-8 bg-current" />
            </a>
          </div>
        </div>

        <div className="cx-reveal mt-14 lg:mt-20 relative overflow-hidden border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] aspect-[16/7]">
          <img
            src={infra}
            alt="Cyryx server infrastructure corridor"
            loading="lazy"
            width={1920}
            height={840}
            className="h-full w-full object-cover"
            data-parallax
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--onyx)] via-[var(--onyx)]/30 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="hud-label text-[var(--accent-glow)]">SECTOR_07 / INFRA_CORE</span>
            <span className="hud-label text-[var(--silver-dim)]">CAM_03 · LIVE</span>
          </div>
        </div>
      </div>
    </section>
  );
}