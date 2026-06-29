import { createFileRoute } from "@tanstack/react-router";
import { AnswerPage } from "@/components/cyryx/seo/AnswerPage";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
} from "@/components/cyryx/seo/seo";

const PATH = "/answers/how-to-measure-ai-output-quality";
const TITLE = "How to measure AI output quality — Cyryx Labs";
const DESC = "Measure AI output quality with structural checks, task-level evaluators, regression suites, and targeted human review — combined into one signal.";

const faqs = [
  {
    q: "Is a single score enough?",
    a: "No. A single score hides which axis failed. Track structural, policy, task-level, and human verdicts separately and only collapse them at the routing layer.",
  },
  {
    q: "Can the same model evaluate its own output?",
    a: "It can, but you lose independence. Cyryx Labs recommends a different evaluator model, or a deterministic check, wherever the cost of error is meaningful.",
  },
  {
    q: "What's the role of human review?",
    a: "Human review is reserved for cases gates can't resolve. Used well, it's a signal for improving gates — every escalation should produce either a gate change or a documented exception.",
  },
];

export const Route = createFileRoute("/answers/how-to-measure-ai-output-quality")({
  head: () =>
    buildHead(
      { title: TITLE, description: DESC, path: PATH, ogType: "article" },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Answers", path: "/answers" },
          { name: "Measuring AI output quality", path: PATH },
        ]),
        buildFaqJsonLd(faqs),
      ],
    ),
  component: () => (
    <AnswerPage
      eyebrow="Quality measurement"
      title="How to measure AI output quality"
      directAnswer="Measure AI output quality across four independent axes: structural correctness (does it match schema and contract), policy compliance (does it respect rules and scope), task quality (does it satisfy the acceptance criteria), and human verdicts on a sampled subset. Combine the axes only at the routing layer; keep the signals separate so you can tell which one regressed."
      definition="AI output quality is a multi-axis measurement, not a single number. Each axis is owned by a different mechanism — code, policy engines, evaluator models, and humans — and each produces a verdict for every relevant output."
      whyItMatters={[
        "Without multi-axis measurement, a system can score well on the wrong thing and ship the wrong outcome.",
        "Without a regression suite, every model change is a guess. Quality measurement is what makes model upgrades safe.",
      ]}
      howItWorks={[
        "Build a structural check from the output contract: schema, required fields, references.",
        "Encode policy as deterministic rules, not as prompt instructions.",
        "Define task-level evaluators against acceptance criteria; prefer a different model than the generator.",
        "Sample outputs for human review; record verdicts as a ground-truth set.",
        "Maintain a regression suite that runs on every prompt, model, or gate change.",
      ]}
      example="For an AI assistant that books meetings: structural — the calendar event has all required fields; policy — the assistant never schedules outside business hours; task — the assistant proposed times that match the user's stated constraints; human — a sampled set of bookings is reviewed weekly and any regression appears as a failing test."
      cyryxPerspective="In Cyryx systems, quality measurement is part of the execution loop, not a dashboard. A gate failure is also a metric event, a regression test, and a candidate for a new evaluator."
      metrics={[
        "Per-axis pass rate (structural, policy, task, human) over time.",
        "Disagreement rate between automated evaluator and human reviewer.",
        "Regression-suite pass rate per model or prompt version.",
        "Time from failure detection to corrective change shipped.",
      ]}
      mistakes={[
        "Collapsing all axes into one score and chasing it.",
        "Encoding policy in prompts where it can be silently rewritten.",
        "Running evaluators on the same context the generator used — drift hides.",
        "Skipping human sampling once the automated scores look good.",
      ]}
      faqs={faqs}
      related={[
        { label: "What are command gates in AI systems?", href: "/answers/what-are-command-gates-in-ai-systems" },
        { label: "What is goal-grounded generation?", href: "/answers/what-is-goal-grounded-generation" },
        { label: "MAAX Studio (Cyryx Labs)", href: "/products/maax-studio" },
        { label: "Cyryx Solutions", href: "/solutions" },
        { label: "Cyryx Applied AI Lab", href: "/research" },
      ]}
    />
  ),
});