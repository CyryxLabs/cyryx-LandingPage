import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/cyryx/seo/SolutionPage";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
  buildServiceJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/solutions/ai-governance-cost-control";
const TITLE = "AI governance & cost control — Cyryx Labs";
const DESC = "Govern AI usage and bring spend under control: policy gates, evaluator coverage, mission ledgers, and per-outcome cost tracking.";

const FAQ = [
  {
    q: "Is this a compliance product or an engineering engagement?",
    a: "An engineering engagement. We instrument the systems you already run, implement policy gates and cost-per-outcome tracking, and leave your team with dashboards, runbooks, and a governance operating model. We do not sell a certification or a compliance seal.",
  },
  {
    q: "How do you handle regulated data — PII, PHI, financial records?",
    a: "Data classification is a first-class input to every gate. Policies specify which classes may leave which boundaries, which models can process them, and what redaction runs before a call. Ledgers store hashes and provenance, not raw sensitive payloads, unless your policy explicitly permits otherwise.",
  },
  {
    q: "Can you cover AI that our teams built themselves in Python notebooks or Zapier?",
    a: "Yes. The inventory phase surfaces shadow AI regardless of where it lives. We then decide, per surface, whether to wrap it with gates, migrate it to a governed workflow, or retire it.",
  },
  {
    q: "What does 'cost per outcome' actually mean in practice?",
    a: "For each governed workflow, we tag every model call with a mission ID. The ledger then aggregates cost per mission and joins it to whether the mission met acceptance criteria. You end up with dashboards that read 'this workflow costs X per verified case', not 'we spent Y on tokens last month'.",
  },
  {
    q: "Do you help prepare for security reviews or board reporting?",
    a: "Yes. The governance operating model includes an executive review package — coverage, incidents, cost curves, and evaluator health — sized for board and audit committee cadence.",
  },
];

export const Route = createFileRoute("/solutions/ai-governance-cost-control")({
  head: () =>
    buildHead(
      { title: TITLE, description: DESC, path: PATH },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: "AI governance & cost control", path: PATH },
        ]),
        buildServiceJsonLd({
          name: "AI governance & cost control",
          serviceType: "AI governance engineering",
          description: DESC,
          path: PATH,
        }),
        buildFaqJsonLd(FAQ),
      ],
    ),
  component: () => (
    <SolutionPage
      eyebrow="AI Governance & Cost Control"
      title="AI governance and cost control as one system."
      directAnswer="Cyryx Labs designs governance and cost control as the same layer: policy gates, evaluator coverage, mission ledgers, and per-outcome cost tracking. The result is an AI footprint you can explain to a board, an auditor, and a finance team — and tune deliberately instead of reactively."
      whatItIs="A combined governance and FinOps engagement for AI workloads. We instrument the systems you already run, surface where governance is thin and where spend escapes, and ship the gates, dashboards, and policies to close the gap."
      whoItIsFor={[
        "Leaders whose AI spend is growing faster than their understanding of where it goes.",
        "Teams in regulated industries needing real governance evidence, not screenshots.",
        "Companies preparing for a security review, audit, or board scrutiny of AI usage.",
      ]}
      whatWeBuild={[
        "An AI usage inventory and policy baseline.",
        "Command gates and approval workflows for sensitive actions.",
        "Cost-per-outcome tracking, not just cost-per-call.",
        "Mission ledgers with retention policies for audit.",
        "Quarterly governance and cost review packages owned by your team.",
      ]}
      howWeWork={[
        "Map AI surfaces, owners, models, and current controls.",
        "Identify the highest governance and cost risks.",
        "Implement gates, dashboards, and policies prioritized by risk.",
        "Hand off operating model, alerts, and review cadence.",
      ]}
      challenges={[
        "Shadow AI: notebooks, plugins, and SaaS features nobody has inventoried.",
        "Model bills growing faster than any measurable business outcome.",
        "Policies that exist as PDFs but are not enforced anywhere in the stack.",
        "No answer to 'what did AI touch on this customer, and who approved it?'",
        "Vendor contracts with no exit plan when a model changes or a price shifts.",
      ]}
      architecture={[
        { name: "AI inventory", detail: "A living register of every AI surface — internal, embedded, and third-party — with owner, model, data classes, and current controls." },
        { name: "Policy layer", detail: "Declarative policies (data class, tenant, geography, action type) compiled into runtime gates instead of static documents." },
        { name: "Cost telemetry", detail: "Per-call cost signals joined to mission IDs, workflows, and tenants — so cost aggregates roll up by outcome and by owner." },
        { name: "Approval workflows", detail: "Structured human-in-the-loop for high-risk actions, with SLAs, delegates, and full audit of who approved what and when." },
        { name: "Evaluator coverage", detail: "Automated evaluators wired to critical missions, with alerts when coverage drops or drift is detected." },
        { name: "Executive dashboards", detail: "Board-ready views of coverage, incidents, spend curves, and evaluator health — refreshed continuously from the ledger." },
      ]}
      deliverables={[
        { phase: "Inventory & baseline", duration: "2–3 weeks", scope: "Discover every AI surface, classify data flows, and score current governance and cost posture against a Cyryx baseline.", outputs: ["AI usage inventory", "Governance + cost scorecard", "Prioritized risk register"] },
        { phase: "Gate & policy build", duration: "4–8 weeks", scope: "Implement policy gates, approval workflows, and cost telemetry starting with the highest-risk surfaces.", outputs: ["Runtime policy engine", "Approval workflows in production", "Cost-per-outcome dashboards"] },
        { phase: "Operating model handover", duration: "2 weeks", scope: "Codify roles, review cadence, incident response, and executive reporting. Train your team to own the system.", outputs: ["Governance operating manual", "Executive reporting pack", "On-call playbook"] },
        { phase: "Quarterly review (optional)", duration: "Quarterly", scope: "Cyryx joins your governance forum with a fresh scorecard, incident review, and cost outlook.", outputs: ["Quarterly scorecard", "Regression + drift report", "Roadmap update"] },
      ]}
      techStack={[
        "Policy engines (OPA / Cedar) compiled to runtime gates",
        "OpenTelemetry + your SIEM (Splunk, Datadog, Elastic)",
        "Data warehouse-native cost joins (Snowflake, BigQuery, Databricks)",
        "Secrets and key management on your cloud of record",
        "Ledger tables on Postgres or your existing OLTP",
        "SSO / SCIM through your existing IdP",
      ]}
      kpis={[
        { metric: "Governance coverage", detail: "Percentage of inventoried AI surfaces protected by an active gate and an owned policy." },
        { metric: "Cost per verified outcome", detail: "All-in AI spend attributed to a mission, divided by successful missions — reported by workflow and by owner." },
        { metric: "Policy incident rate", detail: "Count of policy-violating candidate actions blocked at a gate — a leading indicator of exposure trends." },
        { metric: "Evaluator freshness", detail: "How recently each critical mission's evaluator suite ran and passed — surfaces stale coverage before it becomes an incident." },
      ]}
      outcomes={[
        "A defensible answer to 'how is AI governed here?'",
        "Visibility into the unit economics of each AI workflow.",
        "Lower likelihood of an AI-driven incident.",
        "A predictable, reviewable AI cost profile.",
      ]}
      faq={FAQ}
      engagementNote="Delivered as a fixed-scope inventory + baseline, then a phased implementation retainer. Cyryx is model-agnostic and does not resell capacity — reduced spend accrues entirely to your team."
      relatedAnswers={[
        { label: "What is governed AI execution?", href: "/answers/what-is-governed-ai-execution" },
        { label: "What are command gates in AI systems?", href: "/answers/what-are-command-gates-in-ai-systems" },
        { label: "How to measure AI output quality", href: "/answers/how-to-measure-ai-output-quality" },
      ]}
    />
  ),
});