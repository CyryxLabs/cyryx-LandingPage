import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/cyryx/seo/SolutionPage";
import strategyVisualSmall from "@/assets/solutions/solution-strategy-768.webp";
import strategyVisualLarge from "@/assets/solutions/solution-strategy-1440.webp";
import { buildBreadcrumbJsonLd, buildHead, buildServiceJsonLd } from "@/components/cyryx/seo/seo";

const PATH = "/solutions/ai-strategy-advisory";
const TITLE = "AI Strategy & Advisory — Cyryx Labs";
const DESC =
  "AI strategy, readiness, workflow discovery, architecture, governance requirements, and implementation planning for controlled execution.";

const QUESTIONS = [
  "Which workflows or product opportunities are worth pursuing?",
  "What data, integrations, and operating changes would the system require?",
  "Where should AI be used — and where is deterministic software the better choice?",
  "What authority, approval, evaluation, and cost controls should be defined?",
  "Should the organization build, buy, integrate, or defer?",
] as const;

const CAPABILITIES = [
  {
    name: "Opportunity assessment",
    detail:
      "Frame candidate use cases against value, feasibility, data, ownership, and operating risk.",
  },
  {
    name: "Workflow discovery",
    detail:
      "Map the current work, exceptions, handoffs, decisions, and systems before proposing automation.",
  },
  {
    name: "AI readiness review",
    detail:
      "Assess the organizational, technical, data, security, and governance conditions required to proceed.",
  },
  {
    name: "Solution architecture",
    detail:
      "Define a qualified target architecture, provider options, integration boundaries, and operating model.",
  },
  {
    name: "Governance requirements",
    detail:
      "Specify authority, human approval, evaluation, evidence, and cost controls appropriate to the proposed system.",
  },
  {
    name: "Implementation roadmap",
    detail:
      "Sequence decisions, experiments, build stages, acceptance criteria, and ownership into an executable plan.",
  },
] as const;

export const Route = createFileRoute("/solutions/ai-strategy-advisory")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Solutions", path: "/solutions" },
        { name: "AI Strategy & Advisory", path: PATH },
      ]),
      buildServiceJsonLd({
        name: "AI Strategy & Advisory",
        serviceType: "AI strategy and technical advisory",
        description: DESC,
        path: PATH,
      }),
    ]),
  component: () => (
    <SolutionPage
      startIntent="strategy-advisory"
      eyebrow="AI Strategy & Advisory"
      title="Make the right AI decision before funding the build."
      directAnswer="Cyryx helps leadership teams qualify opportunities, understand operating constraints, define architecture, and establish a path from interest to controlled execution."
      whatItIs="Advisory is appropriate when committing to a vendor, architecture, automation, or AI product would be premature without understanding the work around it."
      whoItIsFor={[
        "Leadership teams qualifying AI opportunities before funding a build.",
        "Organizations with urgency while the system decision remains unclear.",
        "Teams deciding whether to build, buy, integrate, or defer.",
      ]}
      whatWeBuild={CAPABILITIES.map((capability) => `${capability.name}: ${capability.detail}`)}
      howWeWork={[
        "Frame candidate use cases against value, feasibility, data, ownership, and operating risk.",
        "Map the current work, exceptions, handoffs, decisions, and systems before proposing automation.",
        "Assess the organizational, technical, data, security, and governance conditions required to proceed.",
        "Define the target architecture, provider options, integration boundaries, and required controls.",
        "Sequence decisions, experiments, acceptance criteria, and ownership into an executable plan.",
      ]}
      challenges={QUESTIONS}
      architecture={CAPABILITIES}
      deliverables={[
        {
          phase: "Focused decision sprint",
          duration: "Engagement-defined",
          scope: "A bounded question, defined stakeholders, and a written recommendation.",
          outputs: ["Technical decision memo", "Architecture recommendation"],
        },
        {
          phase: "Readiness and roadmap engagement",
          duration: "Engagement-defined",
          scope:
            "A broader assessment leading to prioritized opportunities and an implementation sequence.",
          outputs: [
            "Opportunity and constraint assessment",
            "AI readiness findings",
            "Prioritized implementation roadmap",
          ],
        },
        {
          phase: "Architecture advisory",
          duration: "Engagement-defined",
          scope:
            "Technical decision support for a product, workflow, provider, or system already under consideration.",
          outputs: [
            "Current-state workflow map",
            "Provider or build-versus-buy evaluation",
            "Governance requirements",
          ],
        },
        {
          phase: "Continuing advisory",
          duration: "Engagement-defined",
          scope:
            "Optional support for decisions and reviews under a separately defined cadence and scope.",
          outputs: ["Decision support", "Review cadence"],
        },
      ]}
      kpis={[
        {
          metric: "Opportunity qualification",
          detail:
            "Value, feasibility, data, ownership, and operating risk are considered together.",
        },
        {
          metric: "Architecture decision",
          detail:
            "Provider options, integration boundaries, and the target operating model are documented.",
        },
        {
          metric: "Control definition",
          detail:
            "Authority, approval, evaluation, evidence, and cost requirements are explicit before implementation.",
        },
        {
          metric: "Roadmap usability",
          detail:
            "Decisions, experiments, acceptance criteria, and ownership form an executable sequence.",
        },
      ]}
      outcomes={[
        "A qualified view of which opportunities are worth pursuing.",
        "A documented build, buy, integrate, or defer decision.",
        "Architecture and governance requirements established before implementation.",
        "An executable sequence of experiments, acceptance criteria, and ownership.",
      ]}
      engagementNote="Cyryx does not provide legal, financial, regulatory, or compliance certification. Findings depend on the information and access included in the engagement. If Cyryx proceeds into implementation, scope, ownership, licensing, acceptance, support, and operational responsibilities are defined separately in writing."
      visual={{
        imageSmall: strategyVisualSmall,
        imageLarge: strategyVisualLarge,
        alt: "A dark decision table with modular markers arranged across a transparent planning surface",
        diagramVariant: "matrix",
        diagramLabel: "The advisory decision matrix",
        diagramCaption:
          "Opportunity, workflow, readiness, architecture, governance, and implementation decisions are examined together before capital or operating trust is committed.",
      }}
      relatedAnswers={[
        { label: "See the engagement model", href: "/engagement-model" },
        {
          label: "Explore AI Governance & Cost Control",
          href: "/solutions/ai-governance-cost-control",
        },
        {
          label: "Explore Custom AI Product Development",
          href: "/solutions/custom-ai-product-development",
        },
      ]}
    />
  ),
});
