import { HudLabel } from "../primitives/HudLabel";

const ITEMS = [
  {
    title: "Unowned output.",
    body: "Work is created without a reliable record of who approved it, what informed it, or who is responsible when it fails.",
  },
  {
    title: "Unmeasured cost.",
    body: "Usage grows without a clear relationship between spend, workflow, and business value.",
  },
  {
    title: "Unmanaged autonomy.",
    body: "Capability is introduced without permission boundaries, approval gates, fallback, or revocation.",
  },
  {
    title: "Disconnected operations.",
    body: "Websites, forms, inboxes, spreadsheets, CRMs, and AI tools operate without a unified execution model.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="relative py-20 sm:py-28 lg:py-40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal">
          <HudLabel withDot>The Problem</HudLabel>
          <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold uppercase leading-[1.02] tracking-tight text-silver-gradient">
            AI adoption has outpaced AI control.
          </h2>
          <p className="mt-8 max-w-2xl text-base sm:text-lg leading-relaxed text-[var(--silver-dim)]">
            Organizations have deployed AI across every function. Few have deployed systems — with
            ownership, review gates, and measurable cost.
          </p>
        </div>
        <ul className="cx-stagger mt-14 grid gap-5 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((i) => (
            <li key={i.title} className="cx-stagger-item glass-panel rounded-md p-7 lg:p-8">
              <p className="font-display text-xl uppercase tracking-[0.04em] text-[var(--silver)]">
                {i.title}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">{i.body}</p>
            </li>
          ))}
        </ul>
        <p className="cx-reveal mt-14 font-display text-lg sm:text-xl text-[var(--silver)]">
          Cyryx Labs closes this gap.
        </p>
      </div>
    </section>
  );
}
