import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/cyryx/seo/SolutionPage";
import {
  buildBreadcrumbJsonLd,
  buildHead,
  buildServiceJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/solutions/workflow-automation";
const TITLE = "AI workflow automation — Cyryx Labs";
const DESC = "Governed AI workflow automation: missions, gates, and human review built into every step instead of bolted on after the fact.";

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
      outcomes={[
        "Fewer manual rework loops on AI-driven workflows.",
        "Predictable cost per verified outcome, not per call.",
        "A complete trace for every action taken on a customer or record.",
        "A safe path to upgrading or swapping models without regressions.",
      ]}
      relatedAnswers={[
        { label: "AI execution system vs AI automation", href: "/answers/ai-execution-system-vs-ai-automation" },
        { label: "What are command gates in AI systems?", href: "/answers/what-are-command-gates-in-ai-systems" },
        { label: "How to measure AI output quality", href: "/answers/how-to-measure-ai-output-quality" },
      ]}
    />
  ),
});