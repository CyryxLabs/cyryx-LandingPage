import { useSimulationClock, useTypewriter } from "./useSimulationClock";

const SPECIALISTS = [
  { handle: "@pm", area: "Requirements" },
  { handle: "@architect", area: "Design" },
  { handle: "@dev", area: "Build" },
  { handle: "@qa", area: "Gate" },
  { handle: "@devops", area: "Ship" },
  { handle: "@marketing-chief", area: "Marketing squad" },
  { handle: "@sales-chief", area: "Sales squad" },
  { handle: "@ops-chief", area: "Operations squad" },
] as const;

type Handle = (typeof SPECIALISTS)[number]["handle"];

const REQUESTS: readonly { text: string; route: readonly Handle[] }[] = [
  {
    text: "Add usage-based billing to the dashboard",
    route: ["@pm", "@architect", "@dev", "@qa", "@devops"],
  },
  {
    text: "Plan the launch campaign for the new plan",
    route: ["@marketing-chief", "@sales-chief"],
  },
  {
    text: "Write the onboarding runbook for support",
    route: ["@ops-chief", "@qa"],
  },
];

const TICKS_PER_REQUEST = 7;

/**
 * Simulation of the AEXOS routing layer: one orchestrator reads the request
 * and hands it to the specialists that own the domain. Requests are examples.
 */
export function AexosRoutingSimulation() {
  const { ref, tick, still } = useSimulationClock<HTMLDivElement>(900);
  const requestIndex = still ? 0 : Math.floor(tick / TICKS_PER_REQUEST) % REQUESTS.length;
  const step = still ? TICKS_PER_REQUEST : tick % TICKS_PER_REQUEST;
  const request = REQUESTS[requestIndex];
  const typed = useTypewriter(request.text, !still && step === 0, 700);
  const lit = still ? request.route.length : Math.max(0, step - 1);
  const litHandles = new Set(request.route.slice(0, lit));

  const rows = SPECIALISTS.length;
  const yFor = (index: number) => ((index + 0.5) / rows) * 100;

  return (
    <div
      ref={ref}
      className="cx-sim grid gap-6 rounded-xl border border-white/10 p-5 sm:p-7 lg:grid-cols-[1fr_auto_1.15fr] lg:items-center lg:gap-0"
      role="figure"
      aria-label="Simulation: the orchestrator routes each request to the specialists that own it"
    >
      <div className="lg:pr-6">
        <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--steel)]">
          You ask
        </p>
        <p className="mt-3 min-h-[4.5rem] rounded-lg border border-white/10 bg-[var(--onyx)] px-4 py-3 font-display text-lg leading-snug text-[var(--silver)]">
          “{typed}
          {!still && step === 0 ? <span aria-hidden className="cx-caret" /> : "”"}
        </p>
        <p className="mt-5 font-mono text-[12px] uppercase tracking-[0.16em] text-[var(--steel)]">
          Routed by
        </p>
        <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_oklab,var(--accent-glow)_55%,transparent)] px-3 py-1.5 font-mono text-sm text-[var(--accent-glow)]">
          <span className="h-2 w-2 rounded-full bg-[var(--accent-glow)] shadow-[0_0_10px_var(--accent-glow)]" />
          @aexos-master
        </p>
      </div>

      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="hidden h-[25.5rem] w-24 lg:block"
      >
        {SPECIALISTS.map((specialist, index) => {
          const on = litHandles.has(specialist.handle);
          return (
            <path
              key={specialist.handle}
              d={`M0 50 C 55 50, 45 ${yFor(index)}, 100 ${yFor(index)}`}
              fill="none"
              vectorEffect="non-scaling-stroke"
              className={on ? "cx-route-path cx-route-path--on" : "cx-route-path"}
            />
          );
        })}
      </svg>

      <ul className="grid gap-2 lg:pl-2">
        {SPECIALISTS.map((specialist) => {
          const on = litHandles.has(specialist.handle);
          const order = request.route.indexOf(specialist.handle);
          return (
            <li key={specialist.handle} className="cx-route-node" data-on={on}>
              <span className="font-mono text-[13px]">{specialist.handle}</span>
              <span className="text-[13px] text-[var(--steel)]">{specialist.area}</span>
              <span className="cx-route-order font-mono text-[12px]">
                {on && order >= 0 ? String(order + 1).padStart(2, "0") : ""}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
