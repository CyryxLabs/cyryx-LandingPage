import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/cyryx/seo/SolutionPage";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
  buildServiceJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/solutions/ai-governance-cost-control";
const TITLE = "AI Governance & Cost Control — Cyryx Labs";
const DESC =
  "Practical control design for AI systems: authority, evidence, review, change, provider dependencies, usage, and cost.";

const FAQ = [
  {
    q: "Is this a compliance certification service?",
    a: "No. Cyryx designs and implements technical and operational controls for the systems in scope. Legal interpretation, formal certification, and independent assurance require the appropriate qualified parties.",
  },
  {
    q: "Can governance be added to an existing system?",
    a: "Often, but the path depends on the architecture, available logs, authority model, provider behavior, and access to the system. Discovery determines which controls can be added and where redesign may be required.",
  },
  {
    q: "Does cost control mean choosing the cheapest model?",
    a: "No. Cost is evaluated against task requirements, quality, latency, reliability, privacy, contractual constraints, and operating complexity. Lower unit price does not automatically mean lower total operating cost.",
  },
  {
    q: "Who approves governance changes?",
    a: "The client-side authority model is documented for the engagement. Material changes should have named owners, required evidence, and an approval path appropriate to the system's impact.",
  },
];

export const Route = createFileRoute("/solutions/ai-governance-cost-control")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Solutions", path: "/solutions" },
        { name: "AI Governance & Cost Control", path: PATH },
      ]),
      buildServiceJsonLd({
        name: "AI Governance & Cost Control",
        serviceType: "AI system governance and operating control design",
        description: DESC,
        path: PATH,
      }),
      buildFaqJsonLd(FAQ),
    ]),
  component: () => (
    <SolutionPage
      eyebrow="Governance & Cost Control"
      title="Make authority, evidence, and cost visible before scale."
      directAnswer="Cyryx helps teams define and implement practical controls around AI-enabled systems: what the system may do, what evidence it must produce, where people decide, how changes are approved, and how usage and cost are interpreted."
      whatItIs="A technical and operating-control engagement for selected AI systems. It connects policy intent to system behavior without representing legal advice, certification, or independent assurance."
      whoItIsFor={[
        "Technology leaders who need a clearer inventory and ownership model for AI-enabled systems.",
        "Product and operations teams preparing a prototype for controlled use.",
        "Organizations facing rising provider spend without task-level cost visibility.",
      ]}
      whatWeBuild={[
        "System inventory, authority map, and named ownership for the scope reviewed.",
        "Review, escalation, evidence, change, and release control patterns.",
        "Usage and cost instrumentation aligned to agreed workloads and outcomes.",
        "Provider and model-change evaluation paths appropriate to the architecture.",
        "Operating documentation for decisions, incidents, limitations, and change.",
      ]}
      howWeWork={[
        "Inventory the relevant systems, owners, providers, data, and current controls.",
        "Prioritize material gaps using the business impact and authority of each system.",
        "Design controls that can be implemented and operated by the responsible teams.",
        "Implement the agreed instrumentation, review, and change paths.",
        "Validate behavior and establish ownership for ongoing decisions.",
      ]}
      challenges={[
        "Policy language with no corresponding system or operating control.",
        "No named owner for AI behavior, provider changes, or exceptions.",
        "Logs that record activity but not the context needed for a decision.",
        "Spend measured only by provider invoice rather than workload and value.",
        "Governance applied uniformly without regard to system authority and impact.",
      ]}
      architecture={[
        {
          name: "Inventory",
          detail:
            "Systems, providers, data, owners, users, and dependencies included in the review.",
        },
        {
          name: "Authority",
          detail: "What each system and role may decide, recommend, write, or escalate.",
        },
        {
          name: "Evidence",
          detail: "The records and evaluation required for material behavior and change decisions.",
        },
        {
          name: "Change",
          detail: "Ownership, review, testing, approval, release, and rollback expectations.",
        },
        {
          name: "Economics",
          detail:
            "Usage and cost signals interpreted alongside workload, quality, and operating effort.",
        },
      ]}
      deliverables={[
        {
          phase: "Assess",
          duration: "Engagement-defined",
          scope:
            "Establish the system inventory, authority, current controls, dependencies, and priority gaps.",
          outputs: [
            "System and ownership inventory",
            "Authority and control map",
            "Prioritized recommendations",
          ],
        },
        {
          phase: "Design",
          duration: "Engagement-defined",
          scope:
            "Translate the selected recommendations into implementable technical and operating controls.",
          outputs: [
            "Control design",
            "Evidence and decision requirements",
            "Implementation sequence",
          ],
        },
        {
          phase: "Implement",
          duration: "Engagement-defined",
          scope:
            "Add the agreed instrumentation, review, escalation, and change paths to the systems in scope.",
          outputs: [
            "Implemented control surfaces",
            "Operating documentation",
            "Validation evidence",
          ],
        },
        {
          phase: "Operate or transfer",
          duration: "Engagement-defined",
          scope: "Establish the ongoing ownership, review cadence, and optional managed coverage.",
          outputs: ["Ownership and review model", "Handover", "Optional continuing scope"],
        },
      ]}
      kpis={[
        {
          metric: "Ownership coverage",
          detail: "Whether each material system and decision has a named responsible owner.",
        },
        {
          metric: "Evidence sufficiency",
          detail:
            "Whether agreed decisions and changes are supported by the records required for the use case.",
        },
        {
          metric: "Exception visibility",
          detail:
            "How quickly relevant failures and ambiguous cases reach the correct owner with context.",
        },
        {
          metric: "Cost by workload",
          detail:
            "The selected usage and cost signals interpreted at a level useful for product and operating decisions.",
        },
      ]}
      outcomes={[
        "Clearer authority and ownership across the AI systems in scope.",
        "Controls connected to actual product and workflow behavior.",
        "Better evidence for release, provider, and model-change decisions.",
        "Cost visibility that supports engineering and business tradeoffs.",
      ]}
      faq={FAQ}
      engagementNote="This service does not provide legal advice, certification, or independent assurance. Scope, applicable requirements, responsibilities, evidence, and any continuing review are defined for each engagement."
      relatedAnswers={[
        { label: "What is governed AI execution?", href: "/answers/what-is-governed-ai-execution" },
        {
          label: "What are command gates in AI systems?",
          href: "/answers/what-are-command-gates-in-ai-systems",
        },
        {
          label: "How to measure AI output quality",
          href: "/answers/how-to-measure-ai-output-quality",
        },
      ]}
    />
  ),
});
