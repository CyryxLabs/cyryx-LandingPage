import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/cyryx/seo/SolutionPage";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
  buildServiceJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/solutions/workflow-automation";
const TITLE = "AI workflow automation — Cyryx Labs";
const DESC = "Governed AI workflow automation: missions, gates, and human review built into every step instead of bolted on after the fact.";

const FAQ = [
  {
    q: "How is this different from Zapier, n8n, or a generic agent framework?",
    a: "Those tools treat automation as pipelines of API calls or free-form agent loops. Cyryx treats every step as a mission with acceptance criteria and forces every model output through independent command gates before any downstream write. When a step fails a gate, the mission ledger records why, the workflow pauses, and the right human is paged — nothing silently proceeds.",
  },
  {
    q: "Do we have to replace the tools we already use?",
    a: "No. Cyryx workflows sit on top of your existing CRM, billing, ticketing, and data warehouse. We wrap each connector with typed input/output contracts and gates so the AI layer becomes a governed caller of the systems you already trust.",
  },
  {
    q: "How do you handle a model change or vendor swap mid-project?",
    a: "Missions, gates, and ledgers are model-agnostic. When you swap a model, we replay historical missions from the ledger against the new model, diff the acceptance-criteria results, and only promote it when regression coverage passes. Vendor lock-in is designed out from day one.",
  },
  {
    q: "What kind of team is required on the client side?",
    a: "A named business owner for each workflow (to define acceptance criteria and escalation rules), plus an engineering or ops counterpart with access to the connected systems. Cyryx handles the runtime engineering; your team owns the missions.",
  },
  {
    q: "How is pricing structured?",
    a: "Fixed-scope discovery, then a fixed-price build per workflow tier, plus an optional retained governance package for ongoing tuning and evaluator maintenance. We price per verified outcome where the data supports it.",
  },
];

export const Route = createFileRoute("/solutions/workflow-automation")({
  head: () =>
    buildHead(
      { title: TITLE, description: DESC, path: PATH },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: "Workflow automation", path: PATH },
        ]),
        buildServiceJsonLd({
          name: "Governed AI workflow automation",
          serviceType: "AI workflow engineering",
          description: DESC,
          path: PATH,
        }),
        buildFaqJsonLd(FAQ),
      ],
    ),
  component: () => (
    <SolutionPage
      eyebrow="Workflow Automation"
      title="Governed AI workflows that survive production."
      directAnswer="Cyryx Labs builds AI workflow systems where every step is a mission with explicit acceptance criteria, every output passes through command gates, and every escalation lands with the right human. We replace brittle pipelines and ungoverned agents with workflows that are observable, auditable, and tunable."
      whatItIs="A workflow engineering practice that treats automation as goal-driven execution: missions, gates, evaluators, and human review composed into reliable end-to-end systems on top of your existing tools."
      whoItIsFor={[
        "Operations and revenue teams hitting the ceiling of Zapier-style pipelines.",
        "Teams whose agentic experiments produce great demos and unreliable production runs.",
        "Organizations that need traceability for compliance, finance, or customer trust.",
      ]}
      whatWeBuild={[
        "Mission catalogs covering each workflow with explicit acceptance criteria.",
        "Goal-grounded generation calls in place of free-form prompts.",
        "Command gates for structure, policy, task quality, and escalation.",
        "Mission ledgers for full audit and regression replay.",
        "Integration with existing CRMs, billing, and ticketing systems.",
      ]}
      howWeWork={[
        "Map the target workflow to missions and acceptance criteria.",
        "Identify the gates each mission needs and who owns them.",
        "Implement, instrument, and stage behind feature flags.",
        "Roll out with humans in the loop, then tighten gates as confidence grows.",
      ]}
      challenges={[
        "Prompt drift silently degrading throughput after a model or vendor change.",
        "Agent loops that succeed in staging and hallucinate in production.",
        "No trace of why a workflow acted the way it did on a specific record.",
        "Cost curves that scale with model calls instead of verified outcomes.",
        "Escalations that quietly disappear into a shared inbox nobody owns.",
      ]}
      architecture={[
        { name: "Mission layer", detail: "Each workflow decomposed into missions with owners, acceptance criteria, and disqualifiers — the durable contract the AI executes against." },
        { name: "Context resolver", detail: "Structured retrieval from your systems (CRM, warehouse, docs) with provenance attached to every field passed into a model call." },
        { name: "Command gates", detail: "Independent policy, structure, task-quality, and safety checks that must pass before any write to a downstream system." },
        { name: "Mission ledger", detail: "Append-only record of every candidate action, gate verdict, escalation, and final outcome — used for audit, replay, and evaluator training." },
        { name: "Escalation router", detail: "Routes failed gates to the correct human or queue with full context, SLA, and reopen semantics." },
        { name: "Evaluator suite", detail: "Automated evaluators (heuristic, model-based, human sample) that run on a schedule and gate model or prompt promotion." },
      ]}
      deliverables={[
        { phase: "Discovery & mission design", duration: "1–2 weeks", scope: "We interview owners, review current pipelines, and translate each workflow into missions with acceptance criteria, disqualifiers, and escalation rules.", outputs: ["Mission catalog document", "Gate + evaluator map per mission", "Prioritized rollout plan tied to business risk"] },
        { phase: "Build & instrument", duration: "3–6 weeks per workflow tier", scope: "Implement the mission runtime, connectors, gates, and ledger. Everything is behind feature flags with dual-write to legacy paths where relevant.", outputs: ["Production-ready workflow runtime", "Connector suite with typed contracts", "Mission ledger with retention policy"] },
        { phase: "Governed rollout", duration: "2–4 weeks", scope: "Progressive rollout starting with human-in-the-loop on every mission, tightening automation thresholds as evaluator coverage confirms quality.", outputs: ["Runbook and on-call playbook", "Governance dashboards", "Post-launch tuning report"] },
        { phase: "Ongoing tuning (optional)", duration: "Monthly retainer", scope: "Continuous evaluator tuning, model regression testing, and quarterly governance reviews owned by Cyryx and your workflow owners.", outputs: ["Monthly regression + drift report", "Prompt/model change log", "Quarterly executive review"] },
      ]}
      techStack={[
        "TypeScript / Python runtimes",
        "OpenAI, Anthropic, Google, open-weight models (routable)",
        "Postgres + append-only ledger tables",
        "Temporal or durable queues for long-running missions",
        "OpenTelemetry + your existing observability stack",
        "Feature-flag platform of your choice (LaunchDarkly, Statsig, Unleash)",
      ]}
      kpis={[
        { metric: "Verified outcome rate", detail: "Percentage of missions that complete acceptance criteria without human rework — tracked per workflow tier." },
        { metric: "Cost per verified outcome", detail: "All-in AI spend divided by successful missions, so unit economics stay legible as volume scales." },
        { metric: "Escalation quality", detail: "Ratio of escalations that a human confirms as correct — a leading indicator of gate calibration." },
        { metric: "Time-to-detect regression", detail: "How quickly the evaluator suite catches a model or prompt-induced quality drop after promotion." },
      ]}
      outcomes={[
        "Fewer manual rework loops on AI-driven workflows.",
        "Predictable cost per verified outcome, not per call.",
        "A complete trace for every action taken on a customer or record.",
        "A safe path to upgrading or swapping models without regressions.",
      ]}
      faq={FAQ}
      engagementNote="Workflow engagements start with a fixed-scope discovery and are delivered as fixed-price builds per workflow tier. Ongoing tuning and evaluator maintenance are available as a monthly retainer. Cyryx does not resell model capacity — your model contracts stay with your chosen vendors."
      relatedAnswers={[
        { label: "AI execution system vs AI automation", href: "/answers/ai-execution-system-vs-ai-automation" },
        { label: "What are command gates in AI systems?", href: "/answers/what-are-command-gates-in-ai-systems" },
        { label: "How to measure AI output quality", href: "/answers/how-to-measure-ai-output-quality" },
      ]}
    />
  ),
});