import { ShieldCheck, Cpu, Globe, Layers, Lock, Boxes, ArrowRight } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";

const CARDS = [
  { n: "01", icon: ShieldCheck, title: "Governed AI Systems", copy: "Policy-driven controls and compliance across the entire AI lifecycle." },
  { n: "02", icon: Cpu, title: "Execution Frameworks", copy: "Reliable orchestration engines built for speed, scale, and determinism." },
  { n: "03", icon: Globe, title: "Sovereign Infrastructure", copy: "Deploy anywhere with data residency, isolation, and full sovereignty." },
  { n: "04", icon: Layers, title: "Scalable Command Layer", copy: "Unified observability and control across people, systems, and agents." },
  { n: "05", icon: Lock, title: "Secure Operations", copy: "End-to-end security with zero-trust, encryption, and continuous monitoring." },
  { n: "06", icon: Boxes, title: "Modular Intelligence", copy: "Composable building blocks for domain-specific intelligence." },
];

export function CoreCapabilities() {
  return (
    <section id="infrastructure" className="relative py-20 lg:py-32 bg-[var(--graphite)]">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)] to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 cx-reveal">
          <div>
            <HudLabel withDot>Modules</HudLabel>
            <h2 className="mt-4 font-display text-[30px] sm:text-4xl lg:text-5xl xl:text-6xl font-semibold uppercase text-silver-gradient">
              Core Capabilities
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--silver-dim)]">
            Six engineered modules. One continuous command fabric. Built for the most demanding missions.
          </p>
        </div>

        <div className="cx-stagger mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 cx-hairline-grid border border-[color-mix(in_oklab,var(--silver)_10%,transparent)]">
          {CARDS.map(({ n, icon: Icon, title, copy }) => (
            <article
              key={title}
              className="cx-stagger-item group relative bg-[var(--graphite)] p-8 lg:p-10 transition-colors hover:bg-[var(--onyx)]"
            >
              <div className="flex items-center justify-between">
                <div className="cx-bracket-icon">
                  <span aria-hidden className="cx-bracket-icon-corners" />
                  <Icon className="h-5 w-5 text-[var(--accent-glow)]" />
                </div>
                <span className="font-display text-xs font-bold tracking-widest text-[var(--silver-dim)]">
                  {n}
                </span>
              </div>
              <h3 className="mt-8 font-display text-lg font-semibold uppercase tracking-wider text-[var(--silver)]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                {copy}
              </p>
              <a href="#" className="mt-6 inline-flex items-center gap-2 hud-label text-[var(--accent-glow)]">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </a>
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-px w-0 bg-[var(--accent-glow)] shadow-[0_0_8px_var(--accent-glow)] transition-all duration-500 group-hover:w-full"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}