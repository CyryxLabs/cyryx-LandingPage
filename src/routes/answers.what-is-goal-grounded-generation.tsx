import { createFileRoute } from "@tanstack/react-router";
import { AnswerPage } from "@/components/cyryx/seo/AnswerPage";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
} from "@/components/cyryx/seo/seo";

const PATH = "/answers/what-is-goal-grounded-generation";
const TITLE = "What is goal-grounded generation? | Cyryx Labs";
const DESC = "Goal-grounded generation conditions a model on an explicit mission, context graph, and acceptance criteria — not just a prompt.";

const faqs = [
  {
    q: "Is this just better prompting?",
    a: "No. Prompting is one input. Goal-grounded generation also supplies the mission state, the relevant slice of a context graph, and the acceptance criteria the output will be evaluated against.",
  },
  {
    q: "Does it replace RAG?",
    a: "It uses retrieval, but retrieval alone is not goal-grounded. RAG fetches relevant text; goal-grounded generation also carries goal, constraints, and acceptance criteria into the call.",
  },
  {
    q: "Why does the acceptance criteria need to be in the prompt?",
    a: "Because the same criteria are used by the evaluator gate. Putting them in the prompt aligns generation and evaluation against one shared definition of done.",
  },
];

export const Route = createFileRoute("/answers/what-is-goal-grounded-generation")({
  head: () =>
    buildHead(
      { title: TITLE, description: DESC, path: PATH, ogType: "article" },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Answers", path: "/answers" },
          { name: "Goal-grounded generation", path: PATH },
        ]),
        buildFaqJsonLd(faqs),
      ],
    ),
  component: () => (
    <AnswerPage
      eyebrow="Goal-grounded generation"
      title="What is goal-grounded generation?"
      directAnswer="Goal-grounded generation is a way of calling a model where the input includes an explicit mission, the relevant slice of a project context graph, and the acceptance criteria the output will be evaluated against. The model is generating against a defined goal and a known evaluator, not just answering a free-text prompt."
      definition="A goal-grounded generation call has four parts: the mission (what we're trying to accomplish), the context (what the system already knows), the constraints (what must be true), and the acceptance criteria (how the result will be judged). The model sees all four and produces a candidate aligned to them."
      whyItMatters={[
        "Most quality failures trace back to context loss: the model didn't know the goal, didn't have the right context, or wasn't told what 'done' looked like.",
        "Goal-grounded generation closes the loop between generation and evaluation — both stages see the same criteria.",
      ]}
      howItWorks={[
        "The orchestrator pulls the mission record for the current step.",
        "A context resolver selects the relevant subgraph from the project's context graph.",
        "Constraints and acceptance criteria are attached to the call.",
        "The model generates a candidate, knowing exactly how it will be judged.",
        "Gates evaluate against the same acceptance criteria the model was given.",
      ]}
      example="Instead of 'write a release note for v2.1', the system passes the v2.1 mission, the shipped PRs, the user-facing changes, the brand voice, the forbidden-claims list, and the acceptance criteria (must mention every user-facing change, must be under 200 words, must link to docs). The model writes against that, and the gate scores against the same criteria."
      cyryxPerspective="In MAAX Studio, every generation call is goal-grounded by default. The mission, context graph, and acceptance criteria are first-class objects in the runtime, not strings someone remembered to paste into a prompt."
      metrics={[
        "Acceptance-criteria coverage — fraction of criteria explicitly addressed in the output.",
        "Context resolution recall — did the resolver include the inputs the model actually needed?",
        "Regeneration rate — falls as grounding improves.",
        "Drift between criteria the generator saw and criteria the evaluator scored — should be zero.",
      ]}
      mistakes={[
        "Letting prompts and acceptance criteria evolve independently.",
        "Stuffing the full project into context instead of resolving the relevant slice.",
        "Treating retrieval as grounding without carrying the goal forward.",
        "Re-prompting on failure without updating the context the model saw.",
      ]}
      faqs={faqs}
      related={[
        { label: "What is governed AI execution?", href: "/answers/what-is-governed-ai-execution" },
        { label: "AI execution system vs AI automation", href: "/answers/ai-execution-system-vs-ai-automation" },
        { label: "MAAX Studio (Cyryx Labs)", href: "/products/maax-studio" },
        { label: "Cyryx Solutions", href: "/solutions" },
        { label: "Cyryx Applied AI Lab", href: "/research" },
      ]}
    />
  ),
});