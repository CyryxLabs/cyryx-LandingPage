import { createFileRoute } from "@tanstack/react-router";
import { AnswerPage } from "@/components/cyryx/seo/AnswerPage";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
} from "@/components/cyryx/seo/seo";

const PATH = "/answers/what-are-command-gates-in-ai-systems";
const TITLE = "What are command gates in AI systems? | Cyryx Labs";
const DESC = "Command gates are policy and evaluation checkpoints between an agent's output and any downstream action — the unit of governance in agentic systems.";

const faqs = [
  {
    q: "Is a command gate the same as a guardrail prompt?",
    a: "No. A guardrail prompt is part of generation. A command gate is a separate stage that runs after generation and can block, remediate, or route output independently of the model.",
  },
  {
    q: "Do gates need their own model?",
    a: "Some do, some don't. Structural and policy gates are usually deterministic code. Task-level evaluators may use a different model than the generator, which is preferable for independence.",
  },
  {
    q: "How many gates should a system have?",
    a: "Enough to cover policy, structure, task quality, and safety — and few enough that each one earns its place by catching failures the others miss.",
  },
];

export const Route = createFileRoute("/answers/what-are-command-gates-in-ai-systems")({
  head: () =>
    buildHead(
      { title: TITLE, description: DESC, path: PATH, ogType: "article" },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Answers", path: "/answers" },
          { name: "Command gates", path: PATH },
        ]),
        buildFaqJsonLd(faqs),
      ],
    ),
  component: () => (
    <AnswerPage
      eyebrow="Command gates"
      title="What are command gates in AI systems?"
      directAnswer="A command gate is a checkpoint that sits between an AI agent's candidate output and any downstream action. It evaluates the candidate against policy, structure, task quality, and safety, then routes the result — pass, remediate, or escalate. Command gates are the unit of governance in an agentic system: they convert generation into auditable, controllable execution."
      definition="Command gates are independent stages — typically a mix of deterministic checks and dedicated evaluators — that decide whether a model's output is allowed to act. They are separate from generation, separate from each other, and produce explicit verdicts that the orchestrator routes on."
      whyItMatters={[
        "Gates are how you turn 'the model usually does the right thing' into 'the system only does the right thing'.",
        "They give teams a place to encode policy once and enforce it across every agent and every workflow.",
      ]}
      howItWorks={[
        "Generation produces one or more candidate actions for the current mission step.",
        "Structural gates check shape: schema, required fields, length, references resolved.",
        "Policy gates check rules: forbidden content, scope, permissions, jurisdictional constraints.",
        "Evaluator gates check task quality: groundedness, faithfulness, acceptance-criteria match.",
        "The orchestrator routes on the combined verdict: commit, remediate with feedback, or escalate to human review.",
      ]}
      example="An agent drafts an outbound email. The structural gate confirms required fields. The policy gate blocks any unapproved pricing claim. The evaluator gate scores grounding against the CRM record. A pass commits the send; a soft fail returns the draft with the failing checks attached so the agent can try again; a hard fail escalates to a human."
      cyryxPerspective="Cyryx Labs designs gates as first-class architecture. Every Cyryx system has an explicit gate catalog with owners, change history, and failure dashboards — gates are code, not vibes."
      metrics={[
        "Gate firing rate — how often each gate runs.",
        "Gate failure rate by type — surfaces which gates are catching real issues.",
        "Remediation success rate — does a soft fail recover, or does it loop?",
        "Time spent in gates vs generation — keeps governance overhead honest.",
      ]}
      mistakes={[
        "Implementing gates as one large prompt; you lose independence and audit clarity.",
        "Letting the generator and the evaluator share the same model and context without isolation.",
        "Treating a gate failure as a system error instead of a routine routing decision.",
        "Adding gates without owners — unowned gates rot and silently weaken.",
      ]}
      faqs={faqs}
      related={[
        { label: "What is governed AI execution?", href: "/answers/what-is-governed-ai-execution" },
        { label: "How to measure AI output quality", href: "/answers/how-to-measure-ai-output-quality" },
        { label: "MAAX Studio (Cyryx Labs)", href: "/products/maax-studio" },
        { label: "Cyryx Solutions", href: "/solutions" },
        { label: "Cyryx Applied AI Lab", href: "/research" },
      ]}
    />
  ),
});