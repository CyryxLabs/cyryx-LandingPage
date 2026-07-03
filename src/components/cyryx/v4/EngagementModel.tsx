import { HudLabel } from "../primitives/HudLabel";

const STEPS = [
  {
    n: "01",
    title: "Diagnostic",
    body: "Workflow, data topology, risk surface, unit economics — before any proposal. If the system isn't worth building, we say so.",
  },
  {
    n: "02",
    title: "Scope",
    body: "Deliverables, acceptance criteria, timeline, price — fixed in writing.",
  },
  {
    n: "03",
    title: "Build",
    body: "Production discipline from day one: server-side security, audit logging, human approval on consequential actions.",
  },
  {
    n: "04",
    title: "Verification",
    body: "Every system ships with evaluation criteria. Claims are testable by design.",
  },
  {
    n: "05",
    title: "Transfer",
    body: "Documentation, training, ownership. We engineer for your independence.",
  },
];

export function EngagementModel() {
  return (
    <section id="engagement" className="relative py-14 sm:py-20 lg:py-28 bg-[var(--graphite)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal max-w-3xl">
          <HudLabel withDot>Engagement Model</HudLabel>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-[1.05] tracking-tight text-silver-gradient">
            Fixed scope. Verifiable delivery. Full transfer.
          </h2>
        </div>
        <ol className="cx-stagger mt-10 grid gap-4 sm:mt-14 md:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s) => (
            <li key={s.title} className="cx-stagger-item glass-panel rounded-md p-6">
              <span className="hud-label text-[var(--accent-glow)]">{s.n}</span>
              <h3 className="mt-4 font-display text-base font-semibold uppercase tracking-wider text-[var(--silver)]">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}