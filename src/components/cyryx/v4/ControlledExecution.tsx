import { HudLabel } from "../primitives/HudLabel";

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
      className="relative overflow-hidden py-20 sm:py-24 lg:py-32"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,color-mix(in_oklab,var(--accent-glow)_8%,transparent),transparent_40%)]"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="cx-reveal mx-auto max-w-4xl text-center">
          <HudLabel withDot>Controlled execution</HudLabel>
          <h2
            id="controlled-execution-heading"
            className="mt-7 font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-silver-gradient sm:text-5xl lg:text-7xl"
          >
            Capability becomes value when the enterprise can control the action.
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-[var(--silver-dim)] sm:text-lg">
            Cyryx designs the execution layer between an AI model and the operation it is expected
            to change.
          </p>
        </div>

        <div className="relative mt-14 sm:mt-20">
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

          <ol className="relative grid gap-9 lg:grid-cols-5 lg:gap-5">
            {STAGES.map(([n, title, body]) => (
              <li
                key={title}
                data-execution-node
                className="cx-execution-node grid grid-cols-[2.5rem_1fr] gap-5 lg:block lg:text-center"
              >
                <span className="cx-execution-node-dot relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[var(--onyx)] font-mono text-[9px] text-[var(--steel)] transition-colors">
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

        <p className="cx-reveal mt-14 border-t border-white/10 pt-8 text-center font-display text-2xl tracking-[-0.025em] text-[var(--silver)] sm:mt-20 sm:text-3xl">
          From intent to action. From action to evidence.
        </p>
      </div>
    </section>
  );
}
