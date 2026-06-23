import { Rocket, Workflow, Bot, BookOpen, Plug, ShieldCheck } from "lucide-react";
import { HudLabel } from "./primitives/HudLabel";

const SOLUTIONS = [
  {
    icon: Rocket,
    title: "AI Product Development",
    copy: "From idea to AI product. We help teams design, build, and launch AI-powered products with clear architecture, fast execution, and scalable foundations.",
    deliverables: ["Product strategy", "PRD", "UX/UI", "MVP", "Backend", "AI integration", "Auth", "Payments", "Dashboard", "Deployment"],
  },
  {
    icon: Workflow,
    title: "Agentic Workflow Automation",
    copy: "Turn repetitive work into intelligent workflows. AI-powered automations that connect tools, trigger actions, route decisions, and keep humans in control.",
    deliverables: ["Workflow design", "Agent orchestration", "API integrations", "Human approvals", "Notifications", "Logs", "Dashboards"],
  },
  {
    icon: Bot,
    title: "Internal AI Copilots & Agents",
    copy: "Build agents that understand your business. Internal copilots and agents connected to your data, tools, workflows, and operating rules.",
    deliverables: ["Knowledge base", "RAG", "Tool access", "Permissions", "Guardrails", "Evaluation", "Usage logs"],
  },
  {
    icon: BookOpen,
    title: "AI Knowledge Systems",
    copy: "Turn scattered knowledge into operational intelligence. Retrieve, reason over, and act on the information you already have.",
    deliverables: ["Document ingestion", "Semantic search", "Knowledge graph", "Citations", "Versioning", "Access controls", "Internal chat"],
  },
  {
    icon: Plug,
    title: "AI Integrations & Infrastructure",
    copy: "Connect AI to the systems that run your business. Production-ready integrations across models, APIs, databases, workflows, and dashboards.",
    deliverables: ["OpenAI / Anthropic / Gemini", "Supabase", "Stripe", "Vercel", "GitHub", "Slack", "Notion", "Airtable", "Make / n8n / Zapier", "CRMs"],
  },
  {
    icon: ShieldCheck,
    title: "AI Governance & Cost Control",
    copy: "AI with control, not chaos. Governance layers that make AI measurable, auditable, cost-aware, and safe to operate.",
    deliverables: ["Model routing", "Usage caps", "Cost tracking", "Approval flows", "Audit logs", "Security controls", "Eval rubrics", "Human-in-the-loop"],
  },
];

export function CommandLayerSection() {
  return (
    <section id="solutions" className="relative py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="max-w-3xl cx-reveal">
          <HudLabel withDot>Solutions</HudLabel>
          <h2 className="mt-5 font-display text-[30px] sm:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-[1.08] text-silver-gradient uppercase">
            AI solutions built for execution, not hype.
          </h2>
          <p className="mt-5 text-[15px] sm:text-base text-[var(--silver-dim)]">
            We help businesses design, build, and deploy AI systems that connect
            to real workflows, real data, and real outcomes.
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