import { ArrowRight } from "lucide-react";
import { HudLabel } from "../primitives/HudLabel";
import { trackCta } from "@/lib/track-cta";
import { START_PROJECT_HREF } from "@/lib/cta";

const CARDS = [
  {
    n: "01",
    title: "AI Product Development",
    outcome:
      "From idea to AI product. Design, build, and launch AI-powered products with clear architecture, focused scope, and scalable foundations.",
    delivered: [
      "product strategy",
      "PRD & UX/UI architecture",
      "MVP build & backend",
      "AI integration, auth, payments, dashboards",
      "deployment & launch readiness",
    ],
  },
  {
    n: "02",
    title: "Agentic Workflow Automation",
    outcome:
      "Turn repetitive work into governed workflows. AI-powered workflows that route decisions, trigger actions, generate outputs, and keep humans in control where judgment matters.",
    delivered: [
      "workflow discovery & process mapping",
      "agentic workflow architecture",
      "API integrations",
      "human approval points",
      "logs, dashboards, governance controls",
    ],
  },
  {
    n: "03",
    title: "Internal AI Copilots & Agents",
    outcome:
      "Agents that understand the business — connected to internal knowledge, tools, permissions, workflows, and operating rules.",
    delivered: [
      "knowledge base architecture",
      "retrieval systems & tool access",
      "permissions & guardrails",
      "evaluation rubrics & usage logs",
      "deployment and iteration plan",
    ],
  },
  {
    n: "04",
    title: "AI Knowledge Systems",
    outcome:
      "Turn scattered information into operational intelligence — searchable, usable AI systems built from documents, processes, policies, and internal knowledge.",
    delivered: [
      "document ingestion",
      "semantic search & knowledge graph",
      "citations & versioning",
      "access controls",
      "knowledge workflow automation",
    ],
  },
  {
    n: "05",
    title: "AI Integrations & Infrastructure",
    outcome:
      "Connect AI to the systems that run the business — existing products, databases, dashboards, workflows, and internal operations.",
    delivered: [
      "model providers",
      "databases, auth, payments",
      "CRM & internal tools",
      "workflow & communication platforms",
      "repository & deployment systems",
    ],
  },
  {
    n: "06",
    title: "AI Governance & Cost Control",
    outcome:
      "AI with control, not chaos. Governance layers that make AI systems measurable, auditable, cost-aware, and safer to operate.",
    delivered: [
      "model routing & usage caps",
      "cost tracking",
      "approval flows & audit logs",
      "evaluation rubrics",
      "human-in-the-loop controls",
      "security & permission boundaries",
    ],
  },
];

export function Solutions() {
  return (
    <section id="solutions" className="relative py-14 sm:py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="cx-reveal max-w-3xl">
          <HudLabel withDot>Solutions</HudLabel>
          <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-[1.05] tracking-tight text-silver-gradient">
            AI solutions built for execution, not theater.
          </h2>
          <p className="mt-6 text-[15px] sm:text-base leading-relaxed text-[var(--silver-dim)]">
            Cyryx Solutions helps teams design, build, and deploy practical AI
            systems that connect to real workflows, real data, and real
            outcomes. We help companies move from scattered experimentation to
            structured execution.
          </p>
        </div>
        <div className="cx-stagger mt-10 grid gap-4 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c) => (
            <article
              key={c.title}
              className="cx-stagger-item glass-panel flex flex-col rounded-md p-6"
            >
              <span className="hud-label text-[var(--accent-glow)]">{c.n}</span>
              <h3 className="mt-4 font-display text-lg font-semibold uppercase tracking-wider text-[var(--silver)]">
                {c.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--silver-dim)]">
                {c.outcome}
              </p>
              <p className="mt-4 text-[13px] leading-relaxed text-[var(--silver-dim)]">
                <span className="hud-label text-[var(--silver)]">Delivered with:</span>{" "}
                {c.delivered.join(" · ")}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <a
            href={START_PROJECT_HREF}
            onClick={() =>
              trackCta({ cta: "start_project", section: "solutions", href: START_PROJECT_HREF })
            }
            className="inline-flex h-12 items-center gap-2 rounded-md bg-[var(--accent-glow)] px-6 hud-label text-[var(--onyx)] font-semibold shadow-[var(--shadow-glow-teal)] hover:brightness-110 transition"
          >
            Start a project
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}