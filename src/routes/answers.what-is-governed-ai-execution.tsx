import { createFileRoute } from "@tanstack/react-router";
import { AnswerPage } from "@/components/cyryx/seo/AnswerPage";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
} from "@/components/cyryx/seo/seo";

const PATH = "/answers/what-is-governed-ai-execution";
const TITLE = "What is governed AI execution? | Cyryx Labs";
const DESC = "Governed AI execution runs AI work through explicit policy gates, evaluators, and human review — instead of free-running output generation.";

const faqs = [
  {
    q: "Is governed AI execution the same as AI safety?",
    a: "No. AI safety is a broad research field. Governed AI execution is a concrete engineering practice: routing every agent action through gates that enforce policy, evaluate quality, and require human review where the cost of a wrong action is high.",
  },
  {
    q: "Does governance slow AI down?",
    a: "Properly designed gates run in parallel with generation and only block when a check fails. The cost paid in latency is recovered in fewer rollbacks, less rework, and lower incident rates.",
  },
  {
    q: "Where does Cyryx Labs implement this?",
    a: "Across MAAX Studio (the product), the MAAX Runtime (the architecture), and Cyryx Solutions engagements (custom systems). The Cyryx Applied AI Lab publishes the underlying frameworks.",
  },
];

export const Route = createFileRoute("/answers/what-is-governed-ai-execution")({
  head: () =>
    buildHead(
      { title: TITLE, description: DESC, path: PATH, ogType: "article" },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Answers", path: "/answers" },
          { name: "Governed AI execution", path: PATH },
        ]),
        buildFaqJsonLd(faqs),
      ],
    ),
  component: () => (
    <AnswerPage
      eyebrow="Governed AI execution"
      title="What is governed AI execution?"
      directAnswer="Governed AI execution is the practice of running AI workloads through explicit policy gates, automated evaluators, and human review checkpoints before any downstream action is taken. Instead of letting a model produce free-running output, every step is treated as a candidate action that must pass governance checks against a stated goal, policy, and quality bar."
      definition="A governed AI execution system separates three things that ungoverned pipelines collapse: generation (producing candidate output), evaluation (checking it against policy and goal), and action (committing the output to a real system). Each transition is a gate. Failures route to remediation or human review rather than silently shipping."
      whyItMatters={[
        "Most production AI failures are not model failures. They are governance failures: the system acted on output that nobody verified, against criteria nobody wrote down.",
        "Governance is what makes AI usable in regulated, customer-facing, and revenue-critical workflows — not a different model.",
      ]}
      howItWorks={[
        "Define the mission: an explicit goal, acceptance criteria, and policy constraints.",
        "Generate a candidate output grounded in mission context, not just a prompt.",
        "Evaluate against structural, task-level, and policy gates in parallel.",
        "Route on the result: pass → commit, soft fail → remediate, hard fail → human review.",
        "Log the full decision trace to a mission ledger for audit and regression.",
      ]}
      example="An AI system drafting customer-facing copy generates a candidate. Gates check for forbidden claims, brand voice, factual grounding against an approved source, and reading level. A passing draft is queued for publish; a failing draft is sent for human review with the specific failing check attached. Nothing ships ungoverned."
      cyryxPerspective="Cyryx Labs treats governance as the system, not a feature. The model is one component among many — gates, evaluators, context graphs, and ledgers carry equal architectural weight. This is why Cyryx ships execution systems, not just prompts."
      metrics={[
        "Gate pass rate by gate type — surfaces which checks are doing real work.",
        "Time-to-remediate after a gate failure — measures the recovery loop.",
        "Human-review escalation rate — too low signals weak gates; too high signals overfit gates.",
        "Action rollback rate — should trend toward zero as gates mature.",
      ]}
      mistakes={[
        "Treating governance as a guardrail prompt rather than a separate system.",
        "Running all evaluation inline so latency forces teams to disable checks.",
        "Logging only successes — without failure traces you cannot tune gates.",
        "Letting a single model evaluate its own output without an independent check.",
      ]}
      faqs={faqs}
      related={[
        { label: "AI execution system vs AI automation", href: "/answers/ai-execution-system-vs-ai-automation" },
        { label: "What are command gates in AI systems?", href: "/answers/what-are-command-gates-in-ai-systems" },
        { label: "MAAX Studio (Cyryx Labs)", href: "/products/maax-studio" },
        { label: "Cyryx Solutions", href: "/solutions" },
        { label: "Cyryx Applied AI Lab", href: "/research" },
      ]}
    />
  ),
});