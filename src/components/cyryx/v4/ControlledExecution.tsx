import { ExecutionTrace } from "../ExecutionTrace";

const STAGES = [
  ["01", "Intent", "Define the business outcome."],
  ["02", "Authority", "Set who and what may act."],
  ["03", "Execution", "Connect models, software, data, and tools."],
  ["04", "Evidence", "Record consequential decisions and actions."],
  ["05", "Improvement", "Measure quality, cost, and exceptions."],
] as const;

export function ControlledExecution() {
  return (
    <section
      id="controlled-execution"
      aria-labelledby="controlled-execution-heading"
      data-story-section
      data-execution-system
      className="relative overflow-hidden py-12 sm:py-20 lg:py-24"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,color-mix(in_oklab,var(--accent-glow)_8%,transparent),transparent_40%)]"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="cx-reveal mx-auto max-w-4xl text-center">
          <h2
            id="controlled-execution-heading"
            className="font-display text-[1.75rem] sm:text-[2.125rem] lg:text-[2.75rem] xl:text-[3.5rem] font-semibold leading-[0.98] tracking-[-0.045em] text-silver-gradient"
          >
            Value begins when intent becomes controlled action.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
            Cyryx designs the execution layer between AI models and the workflows, systems, data,
            and people they are expected to affect.
          </p>
        </div>

        <div className="relative mt-10 sm:mt-20">
          <div
            aria-hidden
            className="absolute bottom-5 left-[1.15rem] top-5 w-px bg-white/10 lg:bottom-auto lg:left-[10%] lg:right-[10%] lg:top-[1.15rem] lg:h-px lg:w-auto"
          >
            <span
              data-execution-rail
              className="absolute inset-0 origin-top scale-y-0 bg-[var(--accent-glow)] shadow-[0_0_18px_color-mix(in_oklab,var(--accent-glow)_58%,transparent)] lg:origin-left lg:scale-x-0 lg:scale-y-100"
            />
            <span
              data-execution-pulse
              className="absolute left-1/2 top-0 h-20 w-[3px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,transparent,var(--accent-glow),white,var(--accent-glow),transparent)] opacity-0 shadow-[0_0_24px_color-mix(in_oklab,var(--accent-glow)_65%,transparent)] lg:left-0 lg:top-1/2 lg:h-[3px] lg:w-20 lg:-translate-x-0 lg:-translate-y-1/2 lg:bg-[linear-gradient(90deg,transparent,var(--accent-glow),white,var(--accent-glow),transparent)]"
            />
          </div>

          <ol className="relative grid gap-7 sm:gap-9 lg:grid-cols-5 lg:gap-5">
            {STAGES.map(([n, title, body]) => (
              <li
                key={title}
                data-execution-node
                className="cx-execution-node grid grid-cols-[2.5rem_1fr] gap-5 lg:block lg:text-center"
              >
                <span className="cx-execution-node-dot relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[var(--onyx)] font-mono text-[12px] text-[var(--steel)] transition-colors">
                  {n}
                </span>
                <div className="lg:mt-7">
                  <h3 className="font-display text-xl font-medium tracking-[-0.025em] text-[var(--silver)]">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--silver-dim)]">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="cx-reveal mt-14 grid gap-8 sm:mt-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <div>
            <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--accent-glow)]">
              One run, end to end
            </p>
            <h3 className="mt-4 font-display text-3xl font-semibold leading-[1.05] tracking-[-0.035em] text-[var(--silver)] sm:text-4xl">
              Every step is scoped, reviewed where it matters, and recorded.
            </h3>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--silver-dim)]">
              The system works inside the limits it was given. Exceptions stop for a person. What
              happened, who approved it and what it cost stays on the record.
            </p>
          </div>
          <ExecutionTrace />
        </div>
      </div>
    </section>
  );
}
