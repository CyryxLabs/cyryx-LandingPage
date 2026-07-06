import { HudLabel } from "../primitives/HudLabel";

const ITEMS = [
  {
    title: "Scattered context.",
    body: "Knowledge, decisions, and execution history spread across chats, documents, tools, and dashboards.",
  },
  {
    title: "Session resets.",
    body: "Each AI interaction starts with too little memory and too much repeated explanation.",
  },
  {
    title: "Inconsistent output.",
    body: "The same task can produce different results without a reliable execution contract.",
  },
  {
    title: "Invisible costs.",
    body: "Model usage, token spend, routing decisions, and margin impact are often hard to see.",
  },
  {
    title: "Manual rework.",
    body: "Humans spend time repairing AI output instead of governing the system that produced it.",
  },
  {
    title: "Weak auditability.",
    body: "Important decisions disappear without a clear record of who decided what, when, and why.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="relative py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal">
          <HudLabel withDot>Company Thesis</HudLabel>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-[1.05] tracking-tight text-silver-gradient">
            The next AI shift is not access. It is execution.
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] sm:text-base leading-relaxed text-[var(--silver-dim)]">
            AI is now easy to access. Execution is still hard. Most teams
            already use models, prompts, automations, and copilots — but the
            work remains scattered across tools, chats, documents, dashboards,
            and disconnected decisions. Cyryx Labs exists to build the systems
            layer that makes AI executable, governable, and useful inside real
            businesses.
          </p>
        </div>
        <ul className="cx-stagger mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>
    </section>
  );
}