import { AlertCircle, GitBranch, EyeOff, Repeat, ScrollText, ShieldAlert } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";

const PAINS = [
  { icon: AlertCircle, title: "Scattered context", copy: "Knowledge, decisions, and execution history spread across chats, documents, tools, and dashboards." },
  { icon: GitBranch, title: "Session resets", copy: "Each AI interaction starts with too little memory and too much repeated explanation." },
  { icon: Repeat, title: "Inconsistent output", copy: "The same task can produce different results without a reliable execution contract." },
  { icon: EyeOff, title: "Invisible costs", copy: "Model usage, token spend, routing decisions, and margin impact are often hard to see." },
  { icon: ShieldAlert, title: "Manual rework", copy: "Humans spend time repairing AI output instead of governing the system that produced it." },
  { icon: ScrollText, title: "Weak auditability", copy: "Important decisions disappear without a clear record of who decided what, when, and why." },
];

export function WhyCyryx() {
  return (
    <section id="problem" className="relative py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-end cx-reveal">
          <div>
            <HudLabel withDot>Company Thesis</HudLabel>
            <h2 className="mt-5 font-display text-[32px] sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-[1.05] tracking-[-0.02em] text-silver-gradient">
              The next AI shift is not access.<br />
              <span style={{ color: "var(--accent-glow)" }}>It is execution.</span>
            </h2>
          </div>
          <p className="text-[15px] sm:text-base lg:text-lg leading-relaxed text-[var(--silver-dim)] max-w-xl">
            AI tools are easy to access. Operational AI systems are harder to build.
            Most teams already use models, prompts, automations, and agents — but the
            work remains scattered across disconnected tools, manual decisions, invisible
            costs, and fragile workflows. Cyryx Labs exists to build the systems that
            make AI executable, governable, and useful inside real businesses.
          </p>
        </div>

        <div className="cx-stagger mt-14 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {PAINS.map(({ icon: Icon, title, copy }) => (
            <article
              key={title}
              className="cx-stagger-item glass-panel rounded-md p-6 lg:p-7"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-sm border border-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)]">
                  <Icon className="h-4 w-4 text-[var(--accent-glow)]" />
                </span>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[var(--silver)]">
                  {title}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--silver-dim)]">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}