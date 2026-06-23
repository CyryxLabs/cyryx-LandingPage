import { Brain, Cpu, ShieldCheck, Lock, Sparkles } from "lucide-react";

const ITEMS = [
  { n: "01", icon: Brain, title: "Cybernetic Reasoning" },
  { n: "02", icon: Cpu, title: "Autonomous Execution" },
  { n: "03", icon: ShieldCheck, title: "Governed Systems" },
  { n: "04", icon: Lock, title: "Secure Infrastructure" },
  { n: "05", icon: Sparkles, title: "Behind MAAX Studio" },
];

export function CapabilityStrip() {
  return (
    <section
      id="systems"
      className="relative border-y border-[color-mix(in_oklab,var(--silver)_8%,transparent)] bg-[var(--graphite)]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-8 lg:py-10">
        <div className="cx-stagger grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {ITEMS.map(({ n, icon: Icon, title }, i) => (
            <div
              key={title}
              className={`cx-stagger-item group flex items-center gap-4 px-3 sm:px-4 lg:px-6 py-3 ${i > 0 ? "lg:border-l border-[color-mix(in_oklab,var(--silver)_8%,transparent)]" : ""}`}
            >
              <span className="font-display text-xs font-bold tracking-widest text-[var(--accent-glow)]">
                {n}
              </span>
              <Icon className="h-4 w-4 text-[var(--accent-glow)] opacity-80 shrink-0" />
              <span className="hud-label text-[var(--silver)] truncate">{title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}