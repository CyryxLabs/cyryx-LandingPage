import { Boxes, Workflow, FlaskConical, ArrowRight } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";

const PILLARS = [
  {
    n: "01",
    icon: Boxes,
    tag: "Products",
    title: "Proprietary AI products for the agentic era.",
    copy: "We build software products that help builders, founders, agencies, and teams operate with more intelligence, speed, and control — starting with MAAX Studio.",
    href: "#maax",
    cta: "Explore MAAX Studio",
  },
  {
    n: "02",
    icon: Workflow,
    tag: "Solutions",
    title: "Custom AI systems for real business workflows.",
    copy: "We design and deploy AI-powered internal tools, copilots, automation platforms, intelligent workflows, and integrations for companies that want practical operational leverage.",
    href: "#solutions",
    cta: "See solutions",
  },
  {
    n: "03",
    icon: FlaskConical,
    tag: "Applied AI Lab",
    title: "Research and development for governed AI execution.",
    copy: "We develop the protocols, agent architectures, context systems, evaluation models, and governance layers behind Cyryx products and client solutions.",
    href: "#applied-lab",
    cta: "Inside the Lab",
  },
];

export function CoreCapabilities() {
  return (
    <section id="products" className="relative py-20 lg:py-32 bg-[var(--graphite)]">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)] to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 cx-reveal">
          <div>
            <HudLabel withDot>What we build</HudLabel>
            <h2 className="mt-4 font-display text-[30px] sm:text-4xl lg:text-5xl xl:text-6xl font-semibold uppercase text-silver-gradient">
              What we build.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--silver-dim)]">
            Cyryx Labs operates across three connected pillars: proprietary
            products, custom AI solutions, and applied AI research.
          </p>
        </div>

        <div className="cx-stagger mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-3 cx-hairline-grid border border-[color-mix(in_oklab,var(--silver)_10%,transparent)]">
          {PILLARS.map(({ n, icon: Icon, tag, title, copy, href, cta }) => (
            <article
              key={title}
              data-tilt
              className="cx-stagger-item group relative bg-[var(--graphite)] p-8 lg:p-10 transition-colors hover:bg-[var(--onyx)] hover:shadow-[0_30px_60px_-30px_color-mix(in_oklab,var(--accent-glow)_45%,transparent)]"
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
              <span className="mt-8 block hud-label text-[var(--accent-glow)]">{tag}</span>
              <h3 className="mt-3 font-display text-xl lg:text-2xl font-semibold uppercase tracking-tight text-silver-gradient leading-[1.15]">
                {title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--silver-dim)]">
                {copy}
              </p>
              <a href={href} className="mt-6 inline-flex items-center gap-2 hud-label text-[var(--accent-glow)]">
                {cta} <ArrowRight className="h-3.5 w-3.5" />
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