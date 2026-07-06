import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/cyryx/seo/SolutionPage";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
  buildServiceJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/solutions/internal-ai-assistants";
const TITLE = "Internal AI assistants — Cyryx Labs";
const DESC = "Internal AI assistants grounded in your data, scoped by role, gated for policy, and measured against real task outcomes.";

const FAQ = [
  {
    q: "How is this different from Copilot, Glean, or ChatGPT Enterprise?",
    a: "Those are horizontal surfaces. Cyryx builds vertical assistants tuned to the 5–10 tasks that move real numbers in your team, grounded in your systems of record, with acceptance criteria and gates per task. They complement horizontal tools rather than compete with them.",
  },
  {
    q: "How do you handle permissions and sensitive data?",
    a: "The context graph honors your existing IdP and per-source ACLs. Retrieval is filtered before it reaches the model, and gates enforce data-class policies (e.g. no customer PII in outbound drafts) at generation time.",
  },
  {
    q: "How do you keep the assistant from making things up?",
    a: "Every task template is goal-grounded: the model receives the mission, retrieved context with provenance, and acceptance criteria. Outputs that cannot cite grounded context for load-bearing claims fail a gate and are rewritten or escalated.",
  },
  {
    q: "How is success measured?",
    a: "Per task, not per session. We instrument time-to-completion, rework rate, and human verdicts on a sampled set of outputs. Adoption follows utility — we ship the assistant against the tasks that measurably win first.",
  },
  {
    q: "Can our team edit prompts and gates after handover?",
    a: "Yes. Task templates, prompts, and gate rules live in a versioned config that your team owns. Cyryx provides the editor and the review workflow; you decide what changes and when.",
  },
];

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
        buildFaqJsonLd(FAQ),
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
      challenges={[
        "Generic copilots that peak in week two and never recover adoption.",
        "Assistants that hallucinate confidently on the questions that matter most.",
        "Retrieval that ignores per-user ACLs and quietly leaks documents.",
        "No idea which tasks the assistant actually helps with — and which it hurts.",
        "Prompt changes shipped by whoever had the keyboard, with no versioning.",
      ]}
      architecture={[
        { name: "Context graph", detail: "Structured retrieval across your sources of truth (docs, CRM, tickets, code, runbooks) with provenance and per-source ACLs." },
        { name: "Role scope", detail: "Every request runs through the user's IdP identity — retrieval and gates enforce what that user is allowed to see and do." },
        { name: "Task templates", detail: "Goal-grounded prompts for the specific tasks the team runs, each with acceptance criteria and evaluators." },
        { name: "Policy gates", detail: "Data-class, tone, and scope gates that run on every generated response before it reaches a user or a downstream system." },
        { name: "Task observability", detail: "Per-task metrics on usage, completion, rework, and escalation — leading indicators of trust and utility." },
        { name: "Ownership console", detail: "Versioned editor for templates, prompts, and gates so your team owns changes with a proper review trail after handoff." },
      ]}
      deliverables={[
        { phase: "Task discovery", duration: "1–2 weeks", scope: "Interview teams, review current tooling, and rank the 5–10 tasks with the highest expected impact and the clearest acceptance criteria.", outputs: ["Ranked task inventory", "Acceptance criteria per task", "Adoption target model"] },
        { phase: "Vertical slice", duration: "3–5 weeks", scope: "Ship the context graph and top 2–3 task templates end to end, with gates, evaluators, and a real user cohort.", outputs: ["Live assistant surface", "Context graph over top sources", "Instrumented task metrics"] },
        { phase: "Expansion", duration: "6–10 weeks", scope: "Add remaining task templates, extend the context graph, and tune gates against real usage traces.", outputs: ["Full task coverage", "Gate + evaluator tuning report", "Adoption + impact readout"] },
        { phase: "Handover", duration: "2 weeks", scope: "Hand ownership of templates, gates, and dashboards to your team, with a defined post-handover cadence for advisory support.", outputs: ["Handover manual", "Editor access + review workflow", "Advisory cadence agreement"] },
      ]}
      techStack={[
        "TypeScript / Python retrieval + task runtime",
        "pgvector, Turbopuffer, or your existing vector store",
        "OpenAI, Anthropic, Google, open-weight (per-task routing)",
        "SSO via Okta, Entra ID, WorkOS, or your IdP",
        "OpenTelemetry + your existing APM",
        "In-app surface (React SDK) or Slack / Teams entry points",
      ]}
      kpis={[
        { metric: "Task completion rate", detail: "Percentage of started tasks that meet acceptance criteria without human rework — reported per template." },
        { metric: "Time saved per task", detail: "Median wall-clock savings vs. the pre-assistant workflow, calibrated by periodic sampling." },
        { metric: "Grounded-citation rate", detail: "Percentage of load-bearing claims backed by a retrieved source in the response — leading indicator of factual reliability." },
        { metric: "Weekly active tasks", detail: "Unique users × unique tasks per week — utility signal that outlasts launch curiosity." },
      ]}
      outcomes={[
        "Measurable task-level time savings, not just chat sessions.",
        "Lower hallucination rate via grounded retrieval and evaluator gates.",
        "Clear access controls and audit trail for sensitive work.",
        "An assistant your team trusts enough to make it part of their workflow.",
      ]}
      faq={FAQ}
      engagementNote="Delivered as a fixed-scope task discovery, then a milestone-priced build with a defined handover. Ongoing tuning is offered as a lightweight monthly advisory retainer rather than an open-ended managed service."
      relatedAnswers={[
        { label: "What is goal-grounded generation?", href: "/answers/what-is-goal-grounded-generation" },
        { label: "What is governed AI execution?", href: "/answers/what-is-governed-ai-execution" },
        { label: "How to measure AI output quality", href: "/answers/how-to-measure-ai-output-quality" },
      ]}
    />
  ),
});