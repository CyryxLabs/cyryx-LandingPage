import { AEXOS_CYCLE } from "@/data/aexos";
import { useSimulationClock, useTypewriter } from "./useSimulationClock";

const HOLD_TICKS = 2;
const LOOP = AEXOS_CYCLE.length + HOLD_TICKS;

function TerminalLine({
  agent,
  command,
  output,
  typing,
}: {
  agent: string;
  command: string;
  output: string;
  typing: boolean;
}) {
  const full = `${agent} ${command}`;
  const typed = useTypewriter(full, typing, 650);
  const done = typed.length === full.length;
  return (
    <li className="cx-sim-line">
      <span className="text-[var(--steel)]">›</span>{" "}
      <span className="text-[var(--accent-glow)]">{typed.slice(0, agent.length)}</span>
      <span className="text-[var(--silver)]">{typed.slice(agent.length)}</span>
      {typing && !done ? <span aria-hidden className="cx-caret" /> : null}
      {done ? <span className="cx-sim-output">{output}</span> : null}
    </li>
  );
}

/**
 * Simulation of one story moving through the AEXOS story development cycle.
 * Commands and verdicts follow the documented cycle; the story is an example.
 */
export function AexosCycleSimulation() {
  const { ref, tick, still } = useSimulationClock<HTMLDivElement>(1700);
  const phase = still ? LOOP - 1 : tick % LOOP;
  const active = Math.min(phase, AEXOS_CYCLE.length);
  const finished = phase >= AEXOS_CYCLE.length;

  return (
    <div
      ref={ref}
      className="cx-sim grid overflow-hidden rounded-xl border border-white/10 lg:grid-cols-[0.95fr_1.05fr]"
      role="figure"
      aria-label="Simulation: a story moves from draft to push through five gated steps"
    >
      <ol className="cx-sim-steps border-b border-white/10 p-5 sm:p-7 lg:border-b-0 lg:border-r">
        {AEXOS_CYCLE.map((step, index) => {
          const state = index < active ? "done" : index === active ? "active" : "pending";
          return (
            <li key={step.key} className="cx-sim-step" data-state={state}>
              <span className="cx-sim-step-dot" aria-hidden />
              <span className="min-w-0">
                <span className="block font-display text-lg font-semibold tracking-[-0.02em] text-[var(--silver)]">
                  {step.step}
                </span>
                <span className="block font-mono text-[12px] text-[var(--steel)]">
                  {step.agent} {step.command}
                </span>
              </span>
              <span className="cx-sim-chip">
                {state === "done" ? step.status : state === "active" ? "running" : "queued"}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="cx-sim-terminal flex min-h-[22rem] flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </span>
          <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--steel)]">
            story-4.2 · simulation
          </span>
        </div>
        <ol className="flex-1 space-y-3 p-5 font-mono text-[12.5px] leading-relaxed sm:p-6 sm:text-[13px]">
          {AEXOS_CYCLE.slice(0, finished ? AEXOS_CYCLE.length : active + 1).map((step, index) => (
            <TerminalLine
              key={`${step.key}-${still ? "still" : Math.floor(tick / LOOP)}`}
              agent={step.agent}
              command={step.command}
              output={step.output}
              typing={!still && index === active && !finished}
            />
          ))}
        </ol>
        <div className="border-t border-white/10 px-5 py-3 font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--steel)]">
          {finished ? (
            <span className="text-[var(--accent-glow)]">Story Done · evidence recorded</span>
          ) : (
            <span>Gate required before the next step</span>
          )}
        </div>
      </div>
    </div>
  );
}
