import { createFileRoute } from "@tanstack/react-router";
import { AnswerPage } from "@/components/cyryx/seo/AnswerPage";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildHead } from "@/components/cyryx/seo/seo";

const PATH = "/answers/what-is-governed-ai-execution";
const TITLE = "What is governed AI execution? | Cyryx Labs";
const DESC =
  "Governed AI execution can route AI work through explicit policy gates, evaluators, and human review before consequential actions are committed.";

const faqs = [
  {
    q: "Is governed AI execution the same as AI safety?",
    a: "No. AI safety is a broad research field. Governed AI execution is an engineering practice for routing defined agent actions through the policy checks, evaluation, and human authority appropriate to their risk.",
  },
  {
    q: "Does governance slow AI down?",
    a: "Controls can add latency. The right design applies them according to authority and risk, using deterministic checks, parallel evaluation, or human review where each is justified.",
  },
  {
    q: "Where does Cyryx Labs implement this?",
    a: "Cyryx applies these principles in relevant solution engagements and explores them through MAAX Studio, which remains in active development, and applied research.",
  },
];

export const Route = createFileRoute("/answers/what-is-governed-ai-execution")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH, ogType: "article" }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Answers", path: "/answers" },
        { name: "Governed AI execution", path: PATH },
      ]),
      buildFaqJsonLd(faqs),
    ]),
  component: () => (
    <AnswerPage
      eyebrow="Governed AI execution"
      title="What is governed AI execution?"
      directAnswer="Governed AI execution is the practice of placing explicit authority, policy checks, evaluation, and human review between AI-generated output and consequential downstream action. The controls used depend on what the system can access, decide, spend, and change."
      definition="A governed AI execution system separates three things that ungoverned pipelines collapse: generation (producing candidate output), evaluation (checking it against policy and goal), and action (committing the output to a real system). Each transition is a gate. Failures route to remediation or human review rather than silently shipping."
      whyItMatters={[
        "Operational failures can come from unclear authority, missing acceptance criteria, weak escalation, or acting on output that was never adequately reviewed.",
        "Governance can make AI more appropriate for consequential workflows when it is designed around the actual authority and risk of the system.",
      ]}
      howItWorks={[
        "Define the mission: an explicit goal, acceptance criteria, and policy constraints.",
        "Generate a candidate output grounded in mission context, not just a prompt.",
        "Evaluate against structural, task-level, and policy gates in parallel.",
        "Route on the result: pass → commit, soft fail → remediate, hard fail → human review.",
        "Preserve the execution record needed for review and improvement where the selected infrastructure supports it.",
      ]}
      example="An AI system drafting customer-facing copy generates a candidate. Gates check for forbidden claims, brand voice, factual grounding against an approved source, and reading level. A passing draft is queued for publish; a failing draft is sent for human review with the specific failing check attached. Nothing ships ungoverned."
      cyryxPerspective="Cyryx Labs treats governance as architecture, not a badge. The model is one component among the data, software, evaluation, authority, interfaces, and operating ownership required by the engagement."
      metrics={[
        "Gate pass rate by gate type — surfaces which checks are doing real work.",
        "Time-to-remediate after a gate failure — measures the recovery loop.",
        "Human-review escalation rate — too low signals weak gates; too high signals overfit gates.",
        "Action rollback rate — tracked over time to reveal control and recovery weaknesses.",
      ]}
      mistakes={[
        "Treating governance as a guardrail prompt rather than a separate system.",
        "Running all evaluation inline so latency forces teams to disable checks.",
        "Logging only successes — without failure traces you cannot tune gates.",
        "Letting a single model evaluate its own output without an independent check.",
      ]}
      faqs={faqs}
      related={[
        {
          label: "AI execution system vs AI automation",
          href: "/answers/ai-execution-system-vs-ai-automation",
        },
        {
          label: "What are command gates in AI systems?",
          href: "/answers/what-are-command-gates-in-ai-systems",
        },
        { label: "MAAX Studio (Cyryx Labs)", href: "/products/maax-studio" },
        { label: "Cyryx Solutions", href: "/solutions" },
        { label: "Cyryx Applied Research", href: "/research" },
      ]}
    />
  ),
});
