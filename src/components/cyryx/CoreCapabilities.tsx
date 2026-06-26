import { ArrowRight } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";
import { ProductsGlyph, SolutionsGlyph, LabGlyph } from "./primitives/BrandGlyphs";

const PILLARS = [
  {
    n: "01",
    icon: ProductsGlyph,
    tag: "MAAX Studio",
    title: "Product platform for AI-native software execution.",
    copy: "MAAX Studio gives builders, founders, and technical teams a structured command surface for AI-assisted software work: missions, project memory, specialized operators, command gates, cost governance, and human review before delivery.",
    href: "#maax",
    cta: "Explore MAAX Studio",
  },
  {
    n: "02",
    icon: SolutionsGlyph,
    tag: "Cyryx Solutions",
    title: "Business systems built for how your company actually works.",
    copy: "We design and build AI websites, workflow automation, internal assistants, knowledge systems, integrations, and custom AI products — with architecture that makes them measurable, governable, and improvable.",
    href: "#solutions",
    cta: "See What We Build",
  },
  {
    n: "03",
    icon: LabGlyph,
    tag: "Cyryx Applied AI Lab",
    title: "Research and architecture that ships.",
    copy: "The Lab develops the evaluation methods, system architectures, and workflow patterns that shape our products and client systems. Research that ships. Architecture that compounds.",
    href: "#applied-lab",
    cta: "Inside the Lab",
  },
];

export function CoreCapabilities() {
  return (
    <section id="products" className="relative py-14 sm:py-20 lg:py-32 bg-[var(--graphite)]">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)] to-transparent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 cx-reveal">
          <div>
            <HudLabel withDot>What we build</HudLabel>
            <h2 className="mt-4 font-display text-[30px] sm:text-4xl lg:text-5xl xl:text-6xl font-semibold uppercase text-silver-gradient">
              Three engines. One thesis.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--silver-dim)]">
            Cyryx Labs operates across three interconnected areas. Each one
            exists to close the gap between AI capability and business outcome.
          </p>
        </div>

        <div className="cx-stagger mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-3 cx-hairline-grid border border-[color-mix(in_oklab,var(--silver)_10%,transparent)]">
          {PILLARS.map(({ n, icon: Icon, tag, title, copy, href, cta }) => (
            <article
              key={title}
              data-tilt
              className="cx-stagger-item group relative bg-[var(--graphite)] p-8 lg:p-10 transition-colors hover:bg-[var(--onyx)] hover:shadow-[0_30px_60px_-30px_color-mix(in_oklab,var(--accent-glow)_45%,transparent)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="cx-bracket-icon shrink-0">
                  <span aria-hidden className="cx-bracket-icon-corners" />
                  <Icon className="h-7 w-7" />
                </div>
                <span className="font-display text-xs font-bold tracking-widest text-[var(--silver-dim)] shrink-0">
                  {n}
                </span>
              </div>
              <span className="mt-8 block hud-label text-[var(--accent-glow)]">{tag}</span>
              <h3 className="mt-3 font-display text-[19px] sm:text-xl lg:text-2xl font-semibold uppercase tracking-tight text-silver-gradient leading-[1.18] [text-wrap:balance] hyphens-auto break-words min-w-0">
                {title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--silver-dim)]">
                {copy}
              </p>
              <a href={href} className="mt-4 inline-flex min-h-11 items-center gap-2 -mx-1 px-1 hud-label text-[var(--accent-glow)]">
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