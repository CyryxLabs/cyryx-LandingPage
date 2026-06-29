import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/cyryx/seo/SolutionPage";
import {
  buildBreadcrumbJsonLd,
  buildHead,
  buildServiceJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/solutions/ai-governance-cost-control";
const TITLE = "AI governance & cost control — Cyryx Labs";
const DESC = "Govern AI usage and bring spend under control: policy gates, evaluator coverage, mission ledgers, and per-outcome cost tracking.";

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
      outcomes={[
        "A defensible answer to 'how is AI governed here?'",
        "Visibility into the unit economics of each AI workflow.",
        "Lower likelihood of an AI-driven incident.",
        "A predictable, reviewable AI cost profile.",
      ]}
      relatedAnswers={[
        { label: "What is governed AI execution?", href: "/answers/what-is-governed-ai-execution" },
        { label: "What are command gates in AI systems?", href: "/answers/what-are-command-gates-in-ai-systems" },
        { label: "How to measure AI output quality", href: "/answers/how-to-measure-ai-output-quality" },
      ]}
    />
  ),
});