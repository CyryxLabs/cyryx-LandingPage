import { HudLabel } from "../primitives/HudLabel";

const UNITS = [
  {
    tag: "Products",
    title: "Proprietary AI products built around execution.",
    body: "AI-native software for builders, founders, agencies, and teams that need more than chat-based assistance. Our product strategy is focused on agentic software execution, persistent project memory, context intelligence, command-based workflows, governed autonomy, and reusable operating systems for AI-powered work.",
  },
  {
    tag: "Solutions",
    title: "Custom AI systems for real business workflows.",
    body: "We design and build AI-powered systems that connect to the way companies actually operate — internal copilots, workflow automation, knowledge systems, AI product development, data-connected agents, dashboards, integrations, and governance layers. We do not start with hype. We start with workflow.",
  },
  {
    tag: "Applied AI Lab",
    title: "Research and architecture for governed AI execution.",
    body: "Cyryx Applied AI Lab develops the patterns, protocols, architectures, and evaluation models behind our products and client systems. Focus areas: agentic execution, project memory, context intelligence, governed workflow architecture, human-commanded autonomy, evaluation gates, model routing, cost control, and AI observability.",
  },
];

export function WhatWeBuild() {
  return (
    <section id="what-we-build" className="relative py-14 sm:py-20 lg:py-28 bg-[var(--graphite)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal max-w-3xl">
          <HudLabel withDot>What We Build</HudLabel>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-[1.05] tracking-tight text-silver-gradient">
            AI systems for the agentic era.
          </h2>
          <p className="mt-6 text-[15px] sm:text-base leading-relaxed text-[var(--silver-dim)]">
            Cyryx Labs operates across three connected pillars: proprietary AI
            products, custom AI systems, and applied AI research. Together they
            form the foundation for execution infrastructure that is
            structured, observable, cost-aware, and human-governed.
          </p>
        </div>
        <div className="cx-stagger mt-10 grid gap-4 sm:mt-14 lg:grid-cols-3">
          {UNITS.map((u, i) => (
            <article
              key={u.tag}
              className="cx-stagger-item glass-panel rounded-md p-6"
            >
              <span className="hud-label text-[var(--accent-glow)]">{`0${i + 1}`}</span>
              <p className="mt-4 hud-label text-[var(--silver-dim)]">{u.tag}</p>
              <h3 className="mt-3 font-display text-xl font-semibold uppercase tracking-tight text-[var(--silver)]">
                {u.title}
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