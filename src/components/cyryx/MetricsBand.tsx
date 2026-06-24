import { HudLabel } from "./primitives/HudLabel";
import { MetricCard } from "./MetricCard";

export function MetricsBand() {
  return (
    <section id="metrics" className="relative py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal max-w-2xl">
          <HudLabel withDot>Signal</HudLabel>
          <h2 className="mt-4 font-display text-2xl sm:text-3xl lg:text-4xl font-semibold uppercase leading-[1.1] text-silver-gradient">
            Execution, in numbers
          </h2>
        </div>
        <div className="cx-stagger mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className="cx-stagger-item">
            <MetricCard label="Agentic workflows shipped" value={148} suffix="+" status="LIVE" />
          </div>
          <div className="cx-stagger-item">
            <MetricCard label="Avg. cycle-time reduction" value={62} format="{n}%" />
          </div>
          <div className="cx-stagger-item">
            <MetricCard label="Eval pass rate" value={97.4} decimals={1} format="{n}%" status="GOVERNED" />
          </div>
          <div className="cx-stagger-item">
            <MetricCard label="Models orchestrated" value={24} />
          </div>
        </div>
      </div>
    </section>
  );
}