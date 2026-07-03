import { HudLabel } from "../primitives/HudLabel";

const PILLARS = [
  {
    title: "Product discipline.",
    body: "Client systems inherit the architecture of our own products — state machines, audit trails, evaluation harnesses.",
  },
  {
    title: "Governance as baseline.",
    body: "Approval structures, audit records, and cost control in every delivery. Not a tier.",
  },
  {
    title: "Verifiable claims.",
    body: "Everything we state about a delivered system is testable against its acceptance criteria.",
  },
  {
    title: "Engineered for handover.",
    body: "Dependency is not our business model.",
  },
];

export function WhyCyryxV4() {
  return (
    <section id="why" className="relative py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal max-w-3xl">
          <HudLabel withDot>Why Cyryx Labs</HudLabel>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-[1.05] tracking-tight text-silver-gradient">
            A lab, not an agency.
          </h2>
        </div>
        <div className="cx-stagger mt-10 grid gap-4 sm:mt-14 md:grid-cols-2">
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