import { HudLabel } from "../primitives/HudLabel";

const BUYERS = [
  {
    title: "Technology leaders",
    question: "How do we introduce AI without creating another unowned platform?",
    examples: ["Architecture decisions", "Provider integration", "Authority boundaries"],
  },
  {
    title: "Operations leaders",
    question: "Which bottlenecks should be redesigned, automated, or left alone?",
    examples: ["Intake and routing", "System synchronization", "Approval workflows"],
  },
  {
    title: "Product teams",
    question: "How do we move from an AI feature to a dependable product capability?",
    examples: ["Product discovery", "Evaluation workflows", "Human escalation paths"],
  },
  {
    title: "Growth and commercial teams",
    question: "Where can a better digital system improve the path from interest to action?",
    examples: ["Web experiences", "Qualification", "Connected lead operations"],
  },
  {
    title: "Controlled environments",
    question: "How should evidence, approval, and cost visibility shape the system?",
    examples: ["Document-review support", "Internal knowledge access", "Usage monitoring"],
  },
] as const;

export function BusinessOutcomes() {
  return (
    <section id="outcomes" className="relative py-24 sm:py-32 lg:py-44">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24 lg:px-10">
        <div className="cx-reveal lg:sticky lg:top-32 lg:self-start">
          <HudLabel withDot>Organized around the work</HudLabel>
          <h2 className="mt-7 max-w-[11ch] font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-[var(--silver)] sm:text-5xl lg:text-7xl">
            Start with the buyer problem. Then choose the technology.
          </h2>
          <p className="mt-8 max-w-lg text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
            The same model, tool, or workflow is not appropriate everywhere. We frame the decision
            around ownership, operating reality, and the outcome the team must sustain.
          </p>
        </div>

        <div className="cx-stagger border-t border-[color-mix(in_oklab,var(--silver)_16%,transparent)]">
          {BUYERS.map((buyer, index) => (
            <article
              key={buyer.title}
              className="cx-stagger-item grid gap-6 border-b border-[color-mix(in_oklab,var(--silver)_16%,transparent)] py-9 sm:grid-cols-[2.2rem_1fr] sm:py-11"
            >
              <span className="font-mono text-[9px] tracking-[0.22em] text-[var(--accent-glow)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--steel)]">
                  {buyer.title}
                </p>
                <h3 className="mt-4 max-w-[28ch] font-display text-2xl font-medium leading-tight tracking-[-0.025em] text-[var(--silver)] sm:text-3xl">
                  {buyer.question}
                </h3>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${buyer.title} examples`}>
                  {buyer.examples.map((example) => (
                    <li
                      key={example}
                      className="rounded-sm border border-[color-mix(in_oklab,var(--silver)_14%,transparent)] px-3 py-1.5 text-xs text-[var(--silver-dim)]"
                    >
                      {example}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
