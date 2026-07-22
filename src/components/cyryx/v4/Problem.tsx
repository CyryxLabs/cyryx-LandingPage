import { HudLabel } from "../primitives/HudLabel";

const EXECUTION_FLOW = [
  {
    n: "01",
    label: "Qualify the opportunity",
    title: "From broad ambition to a valuable use case.",
    body: "We identify where AI can create durable operational value — and where a simpler system is the better answer.",
    signal: "A prioritized decision instead of a list of AI ideas.",
  },
  {
    n: "02",
    label: "Engineer the system",
    title: "From isolated prototype to integrated capability.",
    body: "Architecture, product experience, data, integrations, and operating constraints are designed as one system — not assembled after the demo.",
    signal: "A coherent capability instead of a disconnected prototype.",
  },
  {
    n: "03",
    label: "Govern the execution",
    title: "From opaque autonomy to bounded action.",
    body: "Human approvals, quality gates, cost limits, and an operating record keep consequential work visible and revocable.",
    signal: "Bounded authority instead of opaque autonomy.",
  },
  {
    n: "04",
    label: "Transfer ownership",
    title: "From unclear responsibility to an owned operating model.",
    body: "Documentation, access, training, licensing, support, and operational responsibility are defined for the engagement.",
    signal: "A named ownership path instead of a launch-day handoff gap.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="relative overflow-hidden py-24 sm:py-32 lg:py-44">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-[color-mix(in_oklab,var(--silver)_12%,transparent)]"
      />
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-24 lg:px-10">
        <div className="cx-reveal lg:sticky lg:top-32 lg:self-start">
          <HudLabel withDot>Why companies hire Cyryx Labs</HudLabel>
          <h2 className="mt-7 max-w-[12ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-silver-gradient sm:text-5xl lg:text-7xl">
            The value is not the demo. It is the operating capability.
          </h2>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
            The hard part is choosing the right opportunity, connecting real operations, controlling
            authority and cost, and delivering something the business can own. Cyryx closes that gap
            from first decision through handover.
          </p>
          <div className="mt-10 flex items-center gap-3 border-l border-[var(--core-teal,var(--teal))] pl-4 text-sm text-[var(--silver)]">
            <span
              aria-hidden
              className="h-2 w-2 rounded-full bg-[var(--accent-glow)] shadow-[0_0_14px_var(--accent-glow)]"
            />
            One accountable partner from the decision through launch or transition.
          </div>
          <div
            aria-hidden="true"
            className="relative mt-10 hidden min-h-28 border-t border-white/10 pt-6 lg:block"
          >
            {EXECUTION_FLOW.map((step, index) => (
              <div
                key={step.n}
                data-story-caption
                className={`absolute inset-x-0 top-6 ${index === 0 ? "opacity-100" : "opacity-0"}`}
                style={{
                  opacity: index === 0 ? 1 : 0,
                  visibility: index === 0 ? "visible" : "hidden",
                }}
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent-glow)]">
                  Active outcome / {step.n}
                </span>
                <p className="mt-3 max-w-md font-display text-xl leading-snug tracking-[-0.02em] text-[var(--silver)]">
                  {step.signal}
                </p>
              </div>
            ))}
          </div>
        </div>

        <ol className="cx-stagger relative border-l border-[color-mix(in_oklab,var(--steel)_24%,transparent)] pl-7 sm:pl-10">
          {EXECUTION_FLOW.map((step) => (
            <li
              key={step.n}
              data-story-step
              className="cx-stagger-item group relative border-b border-[color-mix(in_oklab,var(--steel)_16%,transparent)] py-9 first:pt-0 last:border-b-0 last:pb-0 sm:py-12 lg:flex lg:min-h-[46vh] lg:flex-col lg:justify-center"
            >
              <span
                aria-hidden
                className="absolute -left-[2.08rem] top-11 h-2.5 w-2.5 rounded-full border border-[var(--accent-glow)] bg-[var(--onyx)] sm:-left-[2.83rem] first:top-2"
              />
              <div className="flex items-center gap-4">
                <span className="font-mono text-[10px] tracking-[0.24em] text-[var(--accent-glow)]">
                  {step.n}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--steel)]">
                  {step.label}
                </span>
              </div>
              <h3 className="mt-5 max-w-[20ch] font-display text-2xl font-medium tracking-[-0.03em] text-[var(--silver)] sm:text-3xl">
                {step.title}
              </h3>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--silver-dim)] sm:text-base">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
