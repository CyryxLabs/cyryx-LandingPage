import { createFileRoute } from "@tanstack/react-router";
import { AnswerPage } from "@/components/cyryx/seo/AnswerPage";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
} from "@/components/cyryx/seo/seo";

const PATH = "/answers/ai-execution-system-vs-ai-automation";
const TITLE = "AI execution system vs AI automation — Cyryx Labs";
const DESC = "Automation runs predefined scripts. AI execution systems run goals, evaluate outputs against intent, and gate downstream actions.";

const faqs = [
  {
    q: "Isn't AI automation just automation with a model in it?",
    a: "That is how most teams ship it, which is why most teams hit a ceiling. An execution system treats the model as one component inside a goal-driven control loop, not a step in a linear script.",
  },
  {
    q: "When should we use plain automation instead?",
    a: "When the task is deterministic, well-specified, and rarely changes. Reserve execution systems for work where intent matters more than steps and where outcomes need verification.",
  },
  {
    q: "Where does MAAX Studio sit?",
    a: "MAAX Studio is an execution system. It orchestrates agents around missions, gates outputs, and produces an auditable ledger of every decision.",
  },
];

export const Route = createFileRoute("/answers/ai-execution-system-vs-ai-automation")({
  head: () =>
    buildHead(
      { title: TITLE, description: DESC, path: PATH, ogType: "article" },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Answers", path: "/answers" },
          { name: "Execution system vs automation", path: PATH },
        ]),
        buildFaqJsonLd(faqs),
      ],
    ),
  component: () => (
    <AnswerPage
      eyebrow="Execution vs automation"
      title="AI execution system vs AI automation"
      directAnswer="AI automation chains predefined steps and inserts a model call into the chain. An AI execution system takes a stated goal, plans candidate actions, evaluates each one against policy and acceptance criteria, and only then commits. Automation optimizes for throughput on a known script; execution systems optimize for verified outcomes on open-ended work."
      definition="An AI automation is a pipeline: trigger → step → step → step → result. An AI execution system is a control loop: goal → context → candidate action → evaluation → gate → commit or remediate. The execution system holds intent and verifies every transition; automation holds steps and assumes correctness."
      whyItMatters={[
        "Automation breaks the moment the input shape changes. Execution systems absorb variance because they reason from goal and context, not from a fixed script.",
        "Most teams describe an automation goal but ship an automation pipeline. The gap explains why AI projects look great in demo and fail in production.",
      ]}
      howItWorks={[
        "Capture the mission: goal, constraints, acceptance criteria, escalation rules.",
        "Resolve context from a project graph rather than from a single prompt.",
        "Generate one or more candidate actions for the next step.",
        "Run candidates through gates: structural, policy, evaluator, and (where required) human review.",
        "Commit the passing candidate, log the trace, and re-plan from the new state.",
      ]}
      example="An onboarding workflow that automates document collection is automation. An onboarding workflow that owns the mission 'fully onboard this customer to a verified, billable state', plans the missing artifacts, drafts the right communications, gates them, and escalates blockers — that is an execution system."
      cyryxPerspective="Cyryx builds execution systems. We use automation primitives where they fit, but the architectural unit is the mission, not the pipeline. This is why every Cyryx engagement starts by writing the mission and acceptance criteria, not the workflow diagram."
      metrics={[
        "Mission completion rate vs step success rate — execution systems are judged on the former.",
        "Replans per mission — measures how well the system absorbs variance.",
        "Gate-induced rework rate — should fall as gates and prompts co-evolve.",
        "Cost per verified outcome, not cost per token or cost per run.",
      ]}
      mistakes={[
        "Calling a Zapier-style pipeline an 'agentic system' because a model is in it.",
        "Writing prompts without writing acceptance criteria.",
        "Optimizing model spend before fixing weak gates — cheap output that fails review is the most expensive outcome.",
        "Hiding replans and remediations from observability dashboards.",
      ]}
      faqs={faqs}
      related={[
        { label: "What is governed AI execution?", href: "/answers/what-is-governed-ai-execution" },
        { label: "What is goal-grounded generation?", href: "/answers/what-is-goal-grounded-generation" },
        { label: "MAAX Studio (Cyryx Labs)", href: "/products/maax-studio" },
        { label: "Cyryx Solutions", href: "/solutions" },
        { label: "Cyryx Applied AI Lab", href: "/research" },
      ]}
    />
  ),
});