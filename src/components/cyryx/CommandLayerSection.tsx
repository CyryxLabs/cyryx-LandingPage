import { Rocket, Workflow, Bot, BookOpen, Plug, ShieldCheck } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";

const SOLUTIONS = [
  {
    icon: Rocket,
    title: "AI Websites & Lead Systems",
    copy: "Websites and landing pages designed around AI-powered intake, lead qualification, CRM routing, and conversion architecture.",
    deliverables: ["Website or landing page", "AI intake", "Lead qualification", "CRM routing", "Conversion analytics", "Deployment"],
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    copy: "Structured automation across the tools your team already uses — designed with human approvals, monitoring, and clear accountability.",
    deliverables: ["Workflow mapping", "Automation design", "Tool integrations", "Approval flows", "Notifications", "Logs", "Dashboards"],
  },
  {
    icon: Bot,
    title: "Internal AI Assistants",
    copy: "AI assistants connected to company knowledge, policies, documents, and tools — with permissions, guardrails, and usage visibility built in.",
    deliverables: ["Knowledge base", "Document ingestion", "Retrieval system", "Permissions", "Guardrails", "Usage logs", "Internal interface"],
  },
  {
    icon: BookOpen,
    title: "Custom AI Product Development",
    copy: "From idea to launch-ready AI product — with product strategy, architecture, design, and engineering built as a system, not assembled as parts.",
    deliverables: ["Strategy", "BRD/PRD", "UX/UI", "Frontend", "Backend", "AI integration", "Auth", "Payments", "Dashboard", "Deployment"],
  },
  {
    icon: Plug,
    title: "AI Integrations",
    copy: "AI connected to the systems where your business runs: databases, CRMs, communication tools, payment systems, and workflow platforms.",
    deliverables: ["API & connector architecture", "Data flows", "Real-time sync", "Access controls", "Monitoring"],
  },
  {
    icon: ShieldCheck,
    title: "AI Governance & Cost Control",
    copy: "Structure for teams that need to measure, review, and control what AI does across the organization.",
    deliverables: ["Usage tracking", "Approval flows", "Audit logs", "Evaluation rubrics", "Human review", "Access controls", "Cost monitoring"],
  },
];

export function CommandLayerSection() {
  return (
    <section id="solutions" className="relative py-14 sm:py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="max-w-3xl cx-reveal">
          <HudLabel withDot>Solutions</HudLabel>
          <h2 className="mt-5 font-display text-[30px] sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-[1.08] text-silver-gradient uppercase">
            AI systems built for companies that need them to work.
          </h2>
          <p className="mt-5 text-[15px] sm:text-base text-[var(--silver-dim)]">
            Cyryx Solutions turns AI opportunities into operational systems.
            Not demos. Not pilots. Working systems connected to real workflows.
          </p>
        </div>

        <div className="cx-stagger mt-14 lg:mt-20 grid gap-3 lg:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map(({ icon: Icon, title, copy, deliverables }) => (
            <article
              key={title}
              data-tilt
              className="cx-stagger-item glass-panel rounded-md p-6 lg:p-7 flex flex-col"
            >
              <span className="grid h-10 w-10 place-items-center rounded-sm border border-[color-mix(in_oklab,var(--accent-glow)_30%,transparent)]">
                <Icon className="h-4 w-4 text-[var(--accent-glow)]" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold uppercase tracking-wider text-[var(--silver)]">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                {copy}
              </p>
              <div className="mt-5 pt-5 border-t border-[color-mix(in_oklab,var(--silver)_10%,transparent)]">
                <span className="hud-label text-[var(--silver-dim)]">Deliverables</span>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {deliverables.map((d) => (
                    <span
                      key={d}
                      className="rounded-sm border border-[color-mix(in_oklab,var(--silver)_12%,transparent)] px-2 py-1 text-[11px] text-[var(--silver-dim)] hover:text-[var(--accent-glow)] hover:border-[color-mix(in_oklab,var(--accent-glow)_35%,transparent)] transition-colors"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}