import { Rocket, Briefcase, Building2, Layers } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";

const AUDIENCE = [
  { icon: Rocket, title: "Founders & Startups", copy: "Build AI-powered products and MVPs with architecture that scales. Start with a working system. Grow without rebuilding." },
  { icon: Building2, title: "Small & Medium Businesses", copy: "Deploy AI across websites, operations, and internal knowledge with structure that keeps you in control." },
  { icon: Briefcase, title: "Agencies", copy: "Deliver client work with reusable AI systems, premium design, automation frameworks, and internal infrastructure." },
  { icon: Layers, title: "Product Teams", copy: "Add AI capabilities, workflow automation, and review layers to products already in market." },
];

const VALUES = [
  "Every build starts with a defined success criterion",
  "Architecture is designed for governance, not added later",
  "Cost and usage are visible from day one",
  "Human review is a structural feature, not an option",
  "Research informs every product and implementation",
  "We measure outcomes, not outputs",
  "Systems compound. Tools don't.",
  "AI does the work. Humans stay in command.",
];

export function WhoWeServe() {
  return (
    <section id="audience" className="relative py-14 sm:py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="max-w-3xl cx-reveal">
          <HudLabel withDot>Who we serve</HudLabel>
          <h2 className="mt-5 font-display text-[30px] sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-[1.05] tracking-tight text-silver-gradient uppercase">
            Built for companies serious about AI that compounds.
          </h2>
        </div>

        <div className="cx-stagger mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCE.map(({ icon: Icon, title, copy }) => (
            <article key={title} className="cx-stagger-item glass-panel rounded-md p-6">
              <span className="grid h-10 w-10 place-items-center rounded-sm border border-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)]">
                <Icon className="h-4 w-4 text-[var(--accent-glow)]" />
              </span>
              <h3 className="mt-5 font-display text-base font-semibold uppercase tracking-wider text-[var(--silver)]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">{copy}</p>
            </article>
          ))}
        </div>

        <div className="mt-20 lg:mt-28 grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16 lg:items-end cx-reveal">
          <div>
            <HudLabel withDot>Why Cyryx</HudLabel>
            <h2 className="mt-5 font-display text-[28px] sm:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-[1.1] tracking-tight text-silver-gradient uppercase">
              We do not automate processes. We build systems.
            </h2>
          </div>
          <p className="text-[15px] sm:text-base leading-relaxed text-[var(--silver-dim)] max-w-xl">
            The difference matters. An automation executes a task. A system
            tracks whether the task achieved its objective, learns from that
            outcome, and improves the next execution. Cyryx Labs builds
            systems.
          </p>
        </div>

        <div className="cx-stagger mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-md border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--silver)_10%,transparent)]">
          {VALUES.map((v) => (
            <div
              key={v}
              className="cx-stagger-item bg-[var(--graphite)] px-4 py-5 hud-label text-[var(--silver)]"
            >
              <span className="text-[var(--accent-glow)]">·</span> {v}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}