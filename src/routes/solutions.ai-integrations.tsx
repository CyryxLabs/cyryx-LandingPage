import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/cyryx/seo/SolutionPage";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
  buildServiceJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/solutions/ai-integrations";
const TITLE = "AI integrations — Cyryx Labs";
const DESC = "Production-grade AI integrations into your CRM, billing, support, and data tools — with governance and observability included.";

const FAQ = [
  {
    q: "Which systems have you integrated AI into most often?",
    a: "CRM (Salesforce, HubSpot), support desks (Zendesk, Intercom, Freshdesk), billing (Stripe, Chargebee), data warehouses (Snowflake, BigQuery, Databricks), and internal REST/gRPC APIs. The pattern is the same regardless of vendor: contracts, gates, retries, and observability.",
  },
  {
    q: "What breaks in production that doesn't break in a demo?",
    a: "Concurrency, partial failures, and unbounded input variance. We bake idempotency, retry with backoff, dead-letter queues, and rate-controlled gates into each integration so that AI-driven actions behave like well-behaved microservices — not fire-and-forget prompts.",
  },
  {
    q: "Do you replace our existing iPaaS or workflow tool?",
    a: "Usually no. We integrate alongside them, taking over the AI-touching edges where governance and reliability matter, and leaving stable non-AI plumbing where it already works.",
  },
  {
    q: "How do you keep integrations from drifting after we ship?",
    a: "Every integration ships with a contract test suite and evaluators that run on a schedule. A schema change on the vendor side or a model change on our side fails a test before it can silently corrupt production data.",
  },
  {
    q: "Who owns the code you produce?",
    a: "You do. Cyryx delivers to your repositories under your license. We reuse internal patterns and shared libraries, but the integrations that ship to your production are yours to run and modify.",
  },
];

export const Route = createFileRoute("/solutions/ai-integrations")({
  head: () =>
    buildHead(
      { title: TITLE, description: DESC, path: PATH },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: "AI integrations", path: PATH },
        ]),
        buildServiceJsonLd({
          name: "AI integrations",
          serviceType: "AI integration engineering",
          description: DESC,
          path: PATH,
        }),
        buildFaqJsonLd(FAQ),
      ],
    ),
  component: () => (
    <SolutionPage
      eyebrow="AI Integrations"
      title="AI integrations that hold up under real load."
      directAnswer="Cyryx Labs builds and stabilizes AI integrations across your existing stack — CRM, billing, support, data warehouse, internal APIs. Every integration ships with input validation, command gates, retry semantics, and observability, so the AI layer behaves like infrastructure rather than a science project."
      whatItIs="Targeted integration engagements that connect AI capabilities into the systems your business already runs on, with the same governance discipline as a custom product build."
      whoItIsFor={[
        "Teams whose AI tools work in isolation but break when wired into production systems.",
        "Companies replacing fragile no-code glue with engineered integrations.",
        "Operators standardizing how AI talks to revenue and operations systems.",
      ]}
      whatWeBuild={[
        "Connectors with explicit input/output contracts.",
        "Gates for policy, scope, and rate-control before downstream writes.",
        "Idempotency, retry, and reconciliation strategies for AI-driven actions.",
        "Observability dashboards for cost, latency, and failure modes.",
        "Documentation and runbooks for ongoing operability.",
      ]}
      howWeWork={[
        "Inventory the systems and actions AI needs to touch.",
        "Define contracts, gates, and failure handling per integration.",
        "Implement, instrument, and stage behind feature flags.",
        "Roll out incrementally with rollback paths.",
      ]}
      challenges={[
        "AI tools that succeed in isolation and corrupt records in production.",
        "No-code glue that silently drops rows when a vendor schema changes.",
        "Retries that duplicate side effects because idempotency was never designed in.",
        "Opaque model bills that can't be traced to a specific downstream action.",
        "Runbooks that don't exist, so on-call engineers guess when AI misbehaves.",
      ]}
      architecture={[
        { name: "Contract layer", detail: "Typed request/response schemas per action, versioned and tested against the live vendor surface." },
        { name: "Gate layer", detail: "Policy, scope, and rate-control gates in front of every write, so an unexpected AI output cannot escalate into a production incident." },
        { name: "Reliability layer", detail: "Idempotency keys, retry with jitter, dead-letter queues, and reconciliation jobs for eventual consistency with the source of truth." },
        { name: "Observability layer", detail: "Structured traces per action tying model call, gate verdicts, downstream response, and cost together in one span." },
        { name: "Governance layer", detail: "Explicit ownership per integration, approval workflows for privileged actions, and change management around vendor upgrades." },
      ]}
      deliverables={[
        { phase: "Integration audit", duration: "1–2 weeks", scope: "Inventory current AI touchpoints, classify data flows, and prioritize by risk and business value.", outputs: ["Integration inventory", "Risk + reliability scorecard", "Prioritized roadmap"] },
        { phase: "Reference integration", duration: "3–4 weeks", scope: "Build one end-to-end reference integration that establishes the patterns for contracts, gates, reliability, and observability.", outputs: ["Production-grade reference integration", "Shared connector library", "Runbook + on-call docs"] },
        { phase: "Rollout", duration: "6–12 weeks", scope: "Rebuild or wrap remaining integrations against the reference pattern, staged behind feature flags with parallel-write validation.", outputs: ["Governed integration suite", "Contract test coverage per integration", "Cost + latency dashboards"] },
        { phase: "Ongoing operability (optional)", duration: "Monthly retainer", scope: "Vendor change monitoring, contract-test maintenance, incident postmortems, and roadmap grooming.", outputs: ["Monthly reliability report", "Vendor change log", "Postmortem library"] },
      ]}
      techStack={[
        "TypeScript / Python connector libraries",
        "Zod / Pydantic schemas as contracts",
        "Temporal, Inngest, or SQS/DLQ for durable execution",
        "OpenTelemetry traces + your existing APM",
        "Postgres or your OLTP for ledger + reconciliation",
        "Feature flags via LaunchDarkly, Statsig, or Unleash",
      ]}
      kpis={[
        { metric: "Action success rate", detail: "Percentage of AI-triggered downstream actions that complete cleanly, per integration." },
        { metric: "Reconciliation drift", detail: "Records where the AI-driven system disagrees with the source of truth — target trending to zero." },
        { metric: "Cost per action", detail: "Fully-loaded cost of each AI-triggered action, including model, retries, and human review time." },
        { metric: "Mean time to detect vendor change", detail: "How quickly contract tests catch a breaking change from an upstream vendor before it hits production." },
      ]}
      outcomes={[
        "Stable AI-driven actions across production systems.",
        "Clear cost-per-action visibility instead of opaque model bills.",
        "Fewer late-night incidents traced to AI-side glue.",
        "A pattern your team can replicate for the next integration.",
      ]}
      faq={FAQ}
      engagementNote="Delivered as a fixed-scope audit followed by fixed-price integration builds. A monthly operability retainer is available for teams that want Cyryx to own vendor-change monitoring and contract-test maintenance."
      relatedAnswers={[
        { label: "What are command gates in AI systems?", href: "/answers/what-are-command-gates-in-ai-systems" },
        { label: "AI execution system vs AI automation", href: "/answers/ai-execution-system-vs-ai-automation" },
        { label: "How to measure AI output quality", href: "/answers/how-to-measure-ai-output-quality" },
      ]}
    />
  ),
});