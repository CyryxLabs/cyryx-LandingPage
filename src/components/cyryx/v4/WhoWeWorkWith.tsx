import { HudLabel } from "../primitives/HudLabel";

const AUDIENCES = [
  {
    title: "Founders",
    body: "Build AI products, MVPs, SaaS platforms, internal tools, and agentic workflows with more structure and execution speed.",
  },
  {
    title: "Agencies",
    body: "Deliver client work with reusable AI systems, repeatable workflows, better delivery control, and clearer operational leverage.",
  },
  {
    title: "Businesses",
    body: "Automate manual work, connect internal tools, and turn scattered processes into intelligent workflows.",
  },
  {
    title: "Product Teams",
    body: "Add AI capabilities, agents, copilots, workflow automation, and governance layers to existing products and operations.",
  },
  {
    title: "AI-Native Builders",
    body: "Use MAAX Studio to structure complex software work through missions, operators, memory, gates, and governed delivery.",
  },
];

export function WhoWeWorkWith() {
  return (
    <section id="who" className="relative py-14 sm:py-20 lg:py-28 bg-[var(--graphite)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal">
          <HudLabel withDot>Who We Work With</HudLabel>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-[1.05] tracking-tight text-silver-gradient">
            Built for teams ready to operationalize AI.
          </h2>
        </div>
        <ul className="cx-stagger mt-10 grid gap-4 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {AUDIENCES.map((a) => (
            <li key={a.title} className="cx-stagger-item glass-panel rounded-md p-6">
              <p className="font-display text-base uppercase tracking-[0.06em] text-[var(--silver)]">
                {a.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                {a.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}