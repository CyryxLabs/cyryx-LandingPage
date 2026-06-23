import { Brain, Cpu, ShieldCheck, Lock, Sparkles } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";

const ITEMS = [
  {
    icon: Brain,
    title: "Cybernetic Reasoning",
    copy: "Multi-layered reasoning engines that adapt, evolve, and optimize with deterministic accuracy.",
  },
  {
    icon: Cpu,
    title: "Autonomous Execution",
    copy: "Orchestrate and execute complex workflows with precision and speed at scale.",
  },
  {
    icon: ShieldCheck,
    title: "Governed Systems",
    copy: "Policy-driven guardrails and compliance controls across every layer of the stack.",
  },
  {
    icon: Lock,
    title: "Secure Infrastructure",
    copy: "Zero-trust architecture with encryption, isolation, and resilience by default.",
  },
  {
    icon: Sparkles,
    title: "Built Behind MAAX Studio",
    copy: "The creative and operational engine powering the next generation of AI systems.",
  },
];

export function CapabilityStrip() {
  return (
    <section id="systems" className="relative border-y border-[color-mix(in_oklab,var(--silver)_8%,transparent)] bg-[var(--graphite)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-10 lg:py-14">
        <div className="cx-stagger grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-[color-mix(in_oklab,var(--silver)_8%,transparent)] overflow-hidden rounded-lg">
          {ITEMS.map(({ icon: Icon, title, copy }) => (
            <article
              key={title}
              className="cx-stagger-item group relative bg-[var(--graphite)] p-5 sm:p-6 border-l-2 border-l-transparent lg:border-l-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)] hover:bg-[var(--charcoal)] transition-colors"
            >
              <Icon className="h-6 w-6 text-[var(--accent-glow)] drop-shadow-[0_0_8px_color-mix(in_oklab,var(--accent-glow)_50%,transparent)]" />
              <HudLabel className="mt-4 block text-[var(--silver)]">{title}</HudLabel>
              <p className="mt-2 text-sm leading-relaxed text-[var(--silver-dim)]">
                {copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}