import { HudLabel } from "./primitives/HudLabel";

const SIGNALS = [
  "Cycle-time reduction",
  "Workflow completion rate",
  "Human review load",
  "Model cost per task",
  "Error and retry rate",
  "Context retrieval precision",
  "Lead conversion quality",
  "Automation coverage",
  "Delivery acceptance rate",
  "Goal-achievement rate",
];

export function MetricsBand() {
  return (
    <section id="metrics" className="relative py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal max-w-3xl">
          <HudLabel withDot>Execution Signals</HudLabel>
          <h2 className="mt-4 font-display text-2xl sm:text-3xl lg:text-4xl font-semibold uppercase leading-[1.1] text-silver-gradient">
            We measure AI by whether it changes how work gets done.
          </h2>
          <p className="mt-5 text-[15px] sm:text-base text-[var(--silver-dim)]">
            Not novelty. Not output volume. These are the operating signals
            Cyryx Labs designs around.
          </p>
        </div>
        <ul className="cx-stagger mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-[color-mix(in_oklab,var(--silver)_10%,transparent)] bg-[color-mix(in_oklab,var(--silver)_10%,transparent)] sm:grid-cols-3 lg:grid-cols-5">
          {SIGNALS.map((s) => (
            <li
              key={s}
              className="cx-stagger-item bg-[var(--graphite)] px-4 py-5 hud-label text-[var(--silver)]"
            >
              <span className="mr-2 text-[var(--accent-glow)]">/</span>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}