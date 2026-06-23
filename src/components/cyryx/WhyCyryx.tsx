import { Check } from "lucide-react";
import infra from "@/assets/cyryx-infrastructure.jpg";
import { HudLabel } from "./primitives/HudLabel";
import { GlassPanel } from "./primitives/GlassPanel";

const BULLETS = [
  "Reasoning-first architecture",
  "Command visibility",
  "Security by design",
  "Composable intelligence modules",
];

export function WhyCyryx() {
  return (
    <section id="intelligence" className="relative py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div className="cx-reveal">
            <HudLabel withDot>Why Cyryx</HudLabel>
            <h2 className="mt-5 font-display text-[30px] sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-[1.08] text-silver-gradient">
              Intelligence doesn&rsquo;t happen in isolation.
            </h2>
            <p className="mt-6 max-w-xl text-[15px] sm:text-base leading-relaxed text-[var(--silver-dim)]">
              Cyryx Labs is the infrastructure layer for autonomous intelligence. We
              unite reasoning, execution, and command under a secure, scalable, and
              observable architecture&mdash;purpose-built for enterprises that demand
              control, performance, and trust.
            </p>
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BULLETS.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm text-[var(--silver)]">
                  <span className="grid h-6 w-6 place-items-center rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_40%,transparent)] bg-[color-mix(in_oklab,var(--accent-glow)_10%,transparent)]">
                    <Check className="h-3 w-3 text-[var(--accent-glow)]" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="cx-reveal relative">
            <div className="relative overflow-hidden rounded-xl border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] aspect-[4/3] lg:aspect-[5/4]">
              <img
                src={infra}
                alt="Cyryx server infrastructure corridor"
                loading="lazy"
                width={1536}
                height={1024}
                className="h-full w-full object-cover"
                data-parallax
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--onyx)] via-transparent to-transparent" />
            </div>
            <GlassPanel glow className="cx-stagger absolute -bottom-6 left-4 right-4 sm:left-8 sm:right-8 lg:-left-10 lg:right-auto lg:w-[420px] p-5 grid grid-cols-3 gap-4">
              {[
                { l: "PB/s", v: 2.6, dec: 1 },
                { l: "% Uptime", v: 99.99, dec: 2 },
                { l: "Regions", v: 12, dec: 0 },
              ].map((s) => (
                <div key={s.l} className="cx-stagger-item">
                  <div className="font-display text-2xl font-semibold text-silver-gradient">
                    <span
                      data-countup={s.v}
                      data-countup-decimals={s.dec}
                      data-countup-format="{n}"
                    >
                      0
                    </span>
                  </div>
                  <div className="mt-1 hud-label text-[var(--silver-dim)]">{s.l}</div>
                </div>
              ))}
            </GlassPanel>
          </div>
        </div>
      </div>
    </section>
  );
}