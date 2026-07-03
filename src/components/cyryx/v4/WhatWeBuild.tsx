import { HudLabel } from "../primitives/HudLabel";

const UNITS = [
  {
    tag: "Products",
    body: "Proprietary AI products, led by MAAX Studio — a local-first agentic execution environment built around human-governed autonomy. The architecture developed here sets the standard for everything we deliver.",
  },
  {
    tag: "Solutions",
    body: "Custom execution systems designed, built, and transferred to client ownership: workflow automation, internal agents, knowledge systems, integrations, governance infrastructure. Fixed scope. Defined acceptance. Documented handover.",
  },
  {
    tag: "Applied AI Lab",
    body: "Applied research in agentic execution, context intelligence, evaluation, and cost architecture. Lab output feeds products and client systems directly. We publish selectively and claim conservatively.",
  },
];

export function WhatWeBuild() {
  return (
    <section id="what-we-build" className="relative py-14 sm:py-20 lg:py-28 bg-[var(--graphite)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal max-w-3xl">
          <HudLabel withDot>What We Build</HudLabel>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-[1.05] tracking-tight text-silver-gradient">
            One discipline. Three units.
          </h2>
        </div>
        <div className="cx-stagger mt-10 grid gap-4 sm:mt-14 lg:grid-cols-3">
          {UNITS.map((u, i) => (
            <article
              key={u.tag}
              className="cx-stagger-item glass-panel rounded-md p-6"
            >
              <span className="hud-label text-[var(--accent-glow)]">{`0${i + 1}`}</span>
              <h3 className="mt-4 font-display text-xl font-semibold uppercase tracking-wider text-[var(--silver)]">
                {u.tag}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                {u.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}