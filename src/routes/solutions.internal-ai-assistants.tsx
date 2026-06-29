import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/cyryx/seo/SolutionPage";
import {
  buildBreadcrumbJsonLd,
  buildHead,
  buildServiceJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/solutions/internal-ai-assistants";
const TITLE = "Internal AI assistants — Cyryx Labs";
const DESC = "Internal AI assistants grounded in your data, scoped by role, gated for policy, and measured against real task outcomes.";

export const Route = createFileRoute("/solutions/internal-ai-assistants")({
  head: () =>
    buildHead(
      { title: TITLE, description: DESC, path: PATH },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: "Internal AI assistants", path: PATH },
        ]),
        buildServiceJsonLd({
          name: "Internal AI assistants",
          serviceType: "Internal AI assistant engineering",
          description: DESC,
          path: PATH,
        }),
      ],
    ),
  component: () => (
    <SolutionPage
      eyebrow="Internal AI Assistants"
      title="Internal AI assistants your team will actually use."
      directAnswer="Cyryx Labs ships internal AI assistants that are grounded in your real systems, scoped to role and permission, gated for policy, and measured against task outcomes. The result is an assistant that earns trust over time instead of becoming the tab nobody opens."
      whatItIs="A purpose-built internal assistant — chat, embedded panel, or in-app surface — sitting on top of a context graph of your data, with explicit gates and observability. Built once with Cyryx Solutions, owned and operable by your team afterward."
      whoItIsFor={[
        "Teams that tried a generic copilot and saw adoption plateau.",
        "Operations, support, and revenue teams with high-volume knowledge work.",
        "Companies that need permissioned access and audit trails on AI use.",
      ]}
      whatWeBuild={[
        "A context graph over your sources of truth (docs, CRM, tickets, code, runbooks).",
        "Role-scoped retrieval so every user sees only what they should.",
        "Goal-grounded task templates for the work the team actually does.",
        "Command gates for policy, data handling, and safety.",
        "Observability on usage, success, and escalation patterns.",
      ]}
      howWeWork={[
        "Identify the top 5–10 tasks where an assistant moves real numbers.",
        "Design grounded task flows with acceptance criteria for each.",
        "Ship a vertical slice, then expand based on usage data.",
        "Hand off operability: dashboards, prompt edits, gate updates owned by your team.",
      ]}
      outcomes={[
        "Measurable task-level time savings, not just chat sessions.",
        "Lower hallucination rate via grounded retrieval and evaluator gates.",
        "Clear access controls and audit trail for sensitive work.",
        "An assistant your team trusts enough to make it part of their workflow.",
      ]}
      relatedAnswers={[
        { label: "What is goal-grounded generation?", href: "/answers/what-is-goal-grounded-generation" },
        { label: "What is governed AI execution?", href: "/answers/what-is-governed-ai-execution" },
        { label: "How to measure AI output quality", href: "/answers/how-to-measure-ai-output-quality" },
      ]}
    />
  ),
});