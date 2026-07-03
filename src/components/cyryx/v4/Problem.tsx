import { HudLabel } from "../primitives/HudLabel";

const ITEMS = [
  {
    title: "Unowned output.",
    body: "Work no one can trace, explain, or defend when it fails.",
  },
  {
    title: "Unmeasured cost.",
    body: "Spend that scales with usage, not value — invisible until invoiced, unattributable after.",
  },
  {
    title: "Unmanaged autonomy.",
    body: "Capability introduced without approval structures, permission boundaries, or records.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="relative py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal">
          <HudLabel withDot>The Problem</HudLabel>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-[1.05] tracking-tight text-silver-gradient">
            AI adoption has outpaced AI control.
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] sm:text-base leading-relaxed text-[var(--silver-dim)]">
            Organizations have deployed AI across every function. Few have
            deployed systems — with ownership, review gates, audit trails, and
            measurable cost. The gap between what AI produces and what a
            business can rely on is not a model problem. It is an execution
            problem.
          </p>
        </div>
        <ul className="cx-stagger mt-10 grid gap-6 sm:mt-14 sm:grid-cols-3">
          {ITEMS.map((i) => (
            <li
              key={i.title}
              className="cx-stagger-item glass-panel rounded-md p-6"
            >
              <p className="font-display text-lg uppercase tracking-[0.04em] text-[var(--silver)]">
                {i.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                {i.body}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-2xl text-[15px] sm:text-base text-[var(--silver)]">
          Cyryx Labs closes this gap.
        </p>
      </div>
    </section>
  );
}