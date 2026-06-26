import { Boxes, Workflow, FlaskConical, Sparkles, Shield } from "lucide-react";

const ITEMS = [
  { n: "01", icon: Boxes, title: "Products" },
  { n: "02", icon: Workflow, title: "Solutions" },
  { n: "03", icon: FlaskConical, title: "Applied AI Lab" },
  { n: "04", icon: Sparkles, title: "MAAX Studio" },
  { n: "05", icon: Shield, title: "MAAX Runtime" },
];

export function CapabilityStrip() {
  return (
    <section
      id="overview"
      className="relative border-y border-[color-mix(in_oklab,var(--silver)_8%,transparent)] bg-[var(--graphite)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-7 lg:py-9">
        <div className="cx-stagger grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-5 sm:gap-y-0">
          {ITEMS.map(({ n, icon: Icon, title }, i) => (
            <div
              key={title}
              className={`cx-stagger-item group relative flex min-w-0 flex-col gap-2 px-4 lg:px-6 ${
                i > 0
                  ? "sm:[&:not(:nth-child(3n+1))]:border-l lg:border-l lg:[&:not(:nth-child(3n+1))]:border-l border-[color-mix(in_oklab,var(--silver)_8%,transparent)]"
                  : ""
              }`}
            >
              <span className="font-display text-[10px] font-bold tracking-[0.2em] text-[var(--accent-glow)]">
                {n}
              </span>
              <div className="flex min-w-0 items-center gap-2.5">
                <Icon className="h-4 w-4 shrink-0 text-[var(--accent-glow)] opacity-80" />
                <span className="hud-label text-[13px] text-[var(--silver)] leading-tight break-words min-w-0">
                  {title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}