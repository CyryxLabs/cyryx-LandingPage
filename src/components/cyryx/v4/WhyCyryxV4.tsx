import { HudLabel } from "../primitives/HudLabel";

const PILLARS = [
  {
    title: "Product-led thinking.",
    body: "Client systems inherit the architecture of our own products — runtime-first, state-machine driven, auditable by design.",
  },
  {
    title: "Execution-first architecture.",
    body: "We do not sell AI hype. We build systems designed to operate inside real workflows.",
  },
  {
    title: "Human-commanded autonomy.",
    body: "Consequential actions require explicit human authority. Autonomy is granted, bounded, and revocable.",
  },
  {
    title: "Context-aware systems.",
    body: "Persistent project memory, structural context, and retrieval built for precision over volume.",
  },
  {
    title: "Cost-conscious implementation.",
    body: "Token, latency, and spend telemetry treated as a control input — not a post-mortem line item.",
  },
  {
    title: "Governance-ready design.",
    body: "Approval structures, audit records, and permission boundaries in every delivery. Not a tier.",
  },
  {
    title: "Runtime-first product philosophy.",
    body: "The core is the runtime. The shell is the surface. Everything else is composed on top.",
  },
  {
    title: "Applied research connected to real systems.",
    body: "Lab output feeds products and client engagements directly. We publish selectively and claim conservatively.",
  },
];

export function WhyCyryxV4() {
  return (
    <section id="why" className="relative py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal max-w-3xl">
          <HudLabel withDot>Why Cyryx Labs</HudLabel>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-[1.05] tracking-tight text-silver-gradient">
            Product-first. Execution-focused. Human-governed.
          </h2>
          <p className="mt-6 text-[15px] sm:text-base leading-relaxed text-[var(--silver-dim)]">
            Cyryx Labs combines product development, applied AI architecture,
            automation engineering, and execution governance.
          </p>
        </div>
        <div className="cx-stagger mt-10 grid gap-4 sm:mt-14 md:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <article key={p.title} className="cx-stagger-item glass-panel rounded-md p-6">
              <h3 className="font-display text-lg font-semibold uppercase tracking-wider text-[var(--silver)]">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}