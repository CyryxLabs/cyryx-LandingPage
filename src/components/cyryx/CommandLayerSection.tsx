import { ArrowRight } from "lucide-react";
import observe from "@/assets/cyryx-observe.jpg";
import orchestrate from "@/assets/cyryx-orchestrate.jpg";
import resilience from "@/assets/cyryx-resilience.jpg";
import { HudLabel } from "./primitives/HudLabel";

const PANELS = [
  {
    title: "Observe Everything",
    img: observe,
    alt: "Real-time telemetry dashboard",
    copy: "Real-time telemetry and deep visibility across every layer—models, data, infrastructure, and agents.",
    link: "Explore Observability",
  },
  {
    title: "Orchestrate With Precision",
    img: orchestrate,
    alt: "Server corridor",
    copy: "Coordinate complex workflows with intelligent routing, dependency resolution, and guardrails.",
    link: "Explore Orchestration",
  },
  {
    title: "Operate With Resilience",
    img: resilience,
    alt: "Command center operations display",
    copy: "Built for continuity with fault tolerance, redundancy, and adaptive recovery at global scale.",
    link: "Explore Resilience",
  },
];

export function CommandLayerSection() {
  return (
    <section id="command" className="relative py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl cx-reveal">
          <HudLabel withDot>Inside the Command Layer</HudLabel>
          <h2 className="mt-5 font-display text-[30px] sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-[1.08] text-silver-gradient">
            Observe. Orchestrate. Operate.
          </h2>
          <p className="mt-5 max-w-xl text-[15px] sm:text-base text-[var(--silver-dim)]">
            Three pillars of the Cyryx command layer, working as one continuous fabric across your stack.
          </p>
        </div>

        <div className="cx-stagger mt-12 lg:mt-16 grid gap-6 lg:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PANELS.map((p, i) => (
            <article
              key={p.title}
              className={`cx-stagger-item group ${i === 1 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              <div className="relative overflow-hidden rounded-xl border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] aspect-[4/3]">
                <img
                  src={p.img}
                  alt={p.alt}
                  loading="lazy"
                  width={1280}
                  height={960}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--onyx)] via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 left-3 hud-label text-[var(--accent-glow)]">
                  0{i + 1} / 03
                </div>
              </div>
              <h3 className="mt-5 font-display text-xl lg:text-2xl font-semibold text-[var(--silver)]">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                {p.copy}
              </p>
              <a href="#" className="mt-4 inline-flex items-center gap-2 hud-label text-[var(--accent-glow)] hover:gap-3 transition-all">
                {p.link} <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}