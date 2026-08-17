import { createFileRoute } from "@tanstack/react-router";
import { AnswerPage } from "@/components/cyryx/seo/AnswerPage";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
  buildTechArticleJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/answers/what-are-command-gates-in-ai-systems";
const TITLE = "What are command gates in AI systems? | Cyryx Labs";
const DESC =
  "Command gates are policy and evaluation checkpoints between an agent's output and any downstream action — the unit of governance in agentic systems.";

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
    buildHead({ title: TITLE, description: DESC, path: PATH, ogType: "article" }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Answers", path: "/answers" },
        { name: "Command gates", path: PATH },
      ]),
      buildFaqJsonLd(faqs),
      buildTechArticleJsonLd({
        headline: "What are command gates in AI systems?",
        description: DESC,
        path: PATH,
        datePublished: "2026-08-17",
        dateModified: "2026-08-17",
        authors: ["Cyryx Labs"],
        authorType: "Organization",
        keywords: ["AI command gates", "AI policy gates", "agentic AI governance"],
      }),
    ]),
  component: () => (
    <AnswerPage
      eyebrow="Command gates"
      title="What are command gates in AI systems?"
      directAnswer="A command gate is a checkpoint between an AI agent's candidate output and a downstream action. It can evaluate policy, structure, task quality, or authority, then route the result to pass, remediation, or escalation according to the system design."
      definition="Command gates are independent stages — typically a mix of deterministic checks and dedicated evaluators — that decide whether a model's output is allowed to act. They are separate from generation, separate from each other, and produce explicit verdicts that the orchestrator routes on."
      whyItMatters={[
        "Gates give teams an explicit place to decide what evidence is required before consequential output advances.",
        "Shared checks can reduce duplicated policy logic when the same authority rules apply across agents or workflows.",
      ]}
      howItWorks={[
        "Generation produces one or more candidate actions for the current mission step.",
        "Structural gates check shape: schema, required fields, length, references resolved.",
        "Policy gates check rules: forbidden content, scope, permissions, jurisdictional constraints.",
        "Evaluator gates check task quality: groundedness, faithfulness, acceptance-criteria match.",
        "The orchestrator routes on the combined verdict: commit, remediate with feedback, or escalate to human review.",
      ]}
      example="An agent drafts an outbound email. A structural gate can confirm required fields, a policy gate can block unapproved claims, and an evaluator can compare the draft with approved source data. If sending authority has been granted, a pass may advance; otherwise the draft remains subject to human approval."
      cyryxPerspective="Where authority and risk justify them, Cyryx designs gates as explicit architecture with defined checks, owners, routing behavior, and review requirements."
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
      publishedAt="2026-08-17"
      reviewedAt="2026-08-17"
      primarySources={[
        {
          title: "Artificial Intelligence Risk Management Framework (AI RMF 1.0)",
          publisher: "U.S. National Institute of Standards and Technology",
          url: "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10",
        },
        {
          title: "Regulation (EU) 2024/1689 (Artificial Intelligence Act)",
          publisher: "Official Journal of the European Union",
          url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
        },
      ]}
      related={[
        { label: "What is governed AI execution?", href: "/answers/what-is-governed-ai-execution" },
        {
          label: "How to measure AI output quality",
          href: "/answers/how-to-measure-ai-output-quality",
        },
        { label: "MAAX Studio (Cyryx Labs)", href: "/products/maax-studio" },
        { label: "Cyryx Solutions", href: "/solutions" },
        { label: "Cyryx Applied Research", href: "/research" },
      ]}
    />
  ),
});
