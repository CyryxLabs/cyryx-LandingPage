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

        <div className="cx-stagger mt-14 lg:mt-20 flex flex-col gap-14 lg:gap-24">
          {PANELS.map((p, i) => {
            const reverse = i % 2 === 1;
            return (
              <article
                key={p.title}
                className={`cx-stagger-item group grid gap-8 lg:gap-14 items-center lg:grid-cols-2 ${reverse ? "lg:[&>div:first-child]:order-2" : ""}`}
              >
                <div className="relative overflow-hidden border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] aspect-[16/10]">
                  <img
                    src={p.img}
                    alt={p.alt}
                    loading="lazy"
                    width={1280}
                    height={800}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    data-parallax
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--onyx)] via-transparent to-transparent opacity-70" />
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="hud-label text-[var(--accent-glow)]">PHASE_{`0${i + 1}`}</span>
                    <span className="hud-label text-[var(--silver-dim)]">0{i + 1} / 03</span>
                  </div>
                </div>
                <div>
                  <span className="hud-label text-[var(--accent-glow)]">{`PHASE_${`0${i + 1}`}`}</span>
                  <h3 className="mt-4 font-display text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-semibold uppercase text-silver-gradient leading-[1.05]">
                    {p.title}
                  </h3>
                  <p className="mt-5 max-w-md text-sm sm:text-base leading-relaxed text-[var(--silver-dim)]">
                    {p.copy}
                  </p>
                  <div className="mt-6 h-px w-full bg-[color-mix(in_oklab,var(--silver)_10%,transparent)] relative overflow-hidden">
                    <span
                      className="absolute inset-y-0 left-0 bg-[var(--accent-glow)] shadow-[0_0_8px_var(--accent-glow)]"
                      style={{ width: `${33 * (i + 1)}%` }}
                    />
                  </div>
                  <a
                    href="#"
                    className="mt-6 inline-flex items-center gap-2 hud-label text-[var(--accent-glow)] hover:gap-3 transition-all"
                  >
                    {p.link} <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}