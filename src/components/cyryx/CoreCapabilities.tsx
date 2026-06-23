import { ShieldCheck, Cpu, Globe, Layers, Lock, Boxes, ArrowRight } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";
import { GlassPanel } from "./primitives/GlassPanel";

const CARDS = [
  { icon: ShieldCheck, title: "Governed AI Systems", copy: "Policy-driven controls and compliance across the entire AI lifecycle." },
  { icon: Cpu, title: "Execution Frameworks", copy: "Reliable orchestration engines built for speed, scale, and determinism." },
  { icon: Globe, title: "Sovereign Infrastructure", copy: "Deploy anywhere with data residency, isolation, and full sovereignty." },
  { icon: Layers, title: "Scalable Command Layer", copy: "Unified observability and control across people, systems, and agents." },
  { icon: Lock, title: "Secure Operations", copy: "End-to-end security with zero-trust, encryption, and continuous monitoring." },
  { icon: Boxes, title: "Modular Intelligence", copy: "Composable building blocks for domain-specific intelligence." },
];

export function CoreCapabilities() {
  return (
    <section id="infrastructure" className="relative py-20 lg:py-32 bg-[var(--graphite)]">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)] to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto cx-reveal">
          <HudLabel withDot>Built for the most demanding missions</HudLabel>
          <h2 className="mt-5 font-display text-[30px] sm:text-4xl lg:text-5xl xl:text-6xl font-semibold text-silver-gradient">
            Our Core Capabilities
          </h2>
        </div>

        <div className="cx-stagger mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {CARDS.map(({ icon: Icon, title, copy }) => (
            <GlassPanel
              key={title}
              className="cx-stagger-item group p-6 lg:p-7 hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent-glow)_40%,transparent)] hover:shadow-[var(--shadow-glow-teal)] transition-all"
            >
              <div className="grid h-11 w-11 place-items-center rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)] bg-[color-mix(in_oklab,var(--accent-glow)_8%,transparent)] group-hover:bg-[color-mix(in_oklab,var(--accent-glow)_14%,transparent)]">
                <Icon className="h-5 w-5 text-[var(--accent-glow)]" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-[var(--silver)] uppercase tracking-wider">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                {copy}
              </p>
              <a href="#" className="mt-5 inline-flex items-center gap-2 hud-label text-[var(--accent-glow)]">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
}