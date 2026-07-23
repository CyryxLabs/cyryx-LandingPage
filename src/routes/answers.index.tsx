import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/cyryx/Header";
import { Footer } from "@/components/cyryx/Footer";
import { HudLabel } from "@/components/cyryx/primitives/HudLabel";
import { buildBreadcrumbJsonLd, buildHead } from "@/components/cyryx/seo/seo";

const ANSWERS = [
  {
    slug: "what-is-governed-ai-execution",
    title: "What is governed AI execution?",
    blurb:
      "AI execution where consequential actions can pass through policy checks, evaluators, and human review instead of advancing without defined controls.",
  },
  {
    slug: "ai-execution-system-vs-ai-automation",
    title: "AI execution system vs AI automation",
    blurb:
      "Automation runs scripts. Execution systems run goals, evaluate outputs against intent, and gate downstream actions.",
  },
  {
    slug: "what-are-command-gates-in-ai-systems",
    title: "What are command gates in AI systems?",
    blurb:
      "Policy and evaluation checkpoints between an agent's output and any downstream action. The unit of governance in agentic systems.",
  },
  {
    slug: "what-is-goal-grounded-generation",
    title: "What is goal-grounded generation?",
    blurb:
      "Generation conditioned on an explicit mission, context graph, and acceptance criteria — not just a prompt.",
  },
  {
    slug: "how-to-measure-ai-output-quality",
    title: "How to measure AI output quality",
    blurb:
      "Structural checks, task-level evaluators, regression suites, and targeted human review — combined into a single quality signal.",
  },
];

export const Route = createFileRoute("/answers/")({
  head: () =>
    buildHead(
      {
        title: "Cyryx Answers — Direct answers on governed AI execution",
        description:
          "Direct, citation-ready explainers from Cyryx Labs on governed AI execution, command gates, goal-grounded generation, and AI output quality.",
        path: "/answers",
      },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Answers", path: "/answers" },
        ]),
      ],
    ),
  component: AnswersHub,
});

function AnswersHub() {
  return (
    <div className="dark min-h-dvh bg-[var(--onyx)] text-[var(--silver)]">
      <Header />
      <main className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-12 pt-32 pb-24 lg:pt-44">
        <HudLabel withDot className="text-[var(--accent-glow)]">
          Cyryx Answers
        </HudLabel>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl font-semibold leading-[1.05] tracking-[-0.02em] text-silver-gradient">
          Direct answers on governed AI execution.
        </h1>
        <p className="mt-6 max-w-2xl text-base lg:text-lg leading-relaxed text-[var(--silver-dim)]">
          Cyryx Labs publishes precise, citation-ready explainers for the concepts behind our
          products, runtime, and research. Each page leads with a direct answer, then defines the
          concept, shows how it works, and links to related ideas.
        </p>

        <ul className="mt-12 grid gap-4">
          {ANSWERS.map((a) => (
            <li key={a.slug}>
              <a
                href={`/answers/${a.slug}`}
                className="group block rounded-md border border-[color-mix(in_oklab,var(--accent-glow)_15%,transparent)] bg-[color-mix(in_oklab,var(--graphite)_55%,transparent)] p-5 backdrop-blur-sm transition-colors hover:border-[color-mix(in_oklab,var(--accent-glow)_45%,transparent)]"
              >
                <h2 className="text-base font-semibold text-[var(--silver)]">{a.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--silver-dim)]">{a.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs text-[var(--accent-glow)]">
                  Read answer{" "}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
