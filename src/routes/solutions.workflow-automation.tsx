import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/cyryx/seo/SolutionPage";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
  buildServiceJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/solutions/workflow-automation";
const TITLE = "AI Workflow Automation — Cyryx Labs";
const DESC =
  "Design and engineering of AI-enabled workflows with explicit authority, review, exception handling, and operating ownership.";

const FAQ = [
  {
    q: "Do we have to replace the tools we already use?",
    a: "Usually not. The first design question is how the target workflow should interact with the systems your team already trusts. Integration choices depend on access, data quality, provider constraints, and the authority the workflow is allowed to have.",
  },
  {
    q: "How much autonomy should the workflow receive?",
    a: "Only the authority justified by the business context and the available evidence. High-impact or ambiguous actions can remain review-gated, while lower-risk steps may be automated under written criteria.",
  },
  {
    q: "How is success measured?",
    a: "Measurement is defined with the workflow owner before implementation. Depending on the use case, that can include completion quality, cycle time, exception rate, rework, adoption, cost, and escalation patterns.",
  },
  {
    q: "How are scope and commercial terms set?",
    a: "After discovery. Scope, milestones, acceptance, ownership, third-party costs, support, and any continuing operational responsibility are documented for the specific engagement.",
  },
];

export const Route = createFileRoute("/solutions/workflow-automation")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Solutions", path: "/solutions" },
        { name: "Workflow Automation", path: PATH },
      ]),
      buildServiceJsonLd({
        name: "AI Workflow Automation",
        serviceType: "AI workflow design and engineering",
        description: DESC,
        path: PATH,
      }),
      buildFaqJsonLd(FAQ),
    ]),
  component: () => (
    <SolutionPage
      startIntent="workflow-automation"
      eyebrow="Workflow Automation"
      title="Move work through the business with clearer control."
      directAnswer="Cyryx designs AI-enabled workflows around the real operating path: inputs, decisions, systems, owners, exceptions, and evidence. The goal is not automation for its own sake. It is a workflow the business can understand, supervise, and improve."
      whatItIs="A system-level engagement that combines workflow design, integration engineering, AI where it is useful, deterministic software where it is safer, and explicit human authority where judgment remains essential."
      whoItIsFor={[
        "Operations teams carrying repetitive work across disconnected systems.",
        "Product and technology leaders moving an AI prototype into an owned operating process.",
        "Organizations that need clearer review, escalation, and accountability around AI-enabled work.",
      ]}
      whatWeBuild={[
        "Workflow and decision maps with named owners and exception paths.",
        "Integrations with the systems of record included in scope.",
        "Task-specific AI components with written inputs, outputs, and review criteria.",
        "Human review and escalation surfaces for material decisions.",
        "Instrumentation for agreed quality, usage, cost, and operating signals.",
      ]}
      howWeWork={[
        "Frame the business outcome and map the current operating path.",
        "Define system authority, evidence needs, exceptions, and acceptance criteria.",
        "Build an end-to-end vertical slice before expanding the workflow.",
        "Validate with representative cases and document limitations.",
        "Launch with clear ownership and, when agreed, continuing operating coverage.",
      ]}
      challenges={[
        "Automating a broken process without resolving its ownership gaps.",
        "Allowing probabilistic output to trigger material actions without review.",
        "Hiding failure inside integrations that no one monitors.",
        "Measuring activity instead of business completion quality.",
        "Launching without a named owner for exceptions and change decisions.",
      ]}
      architecture={[
        {
          name: "Workflow contract",
          detail:
            "The target outcome, participating systems, roles, states, and acceptance boundaries.",
        },
        {
          name: "Context layer",
          detail:
            "Approved data and evidence prepared for each task with access boundaries defined by the engagement.",
        },
        {
          name: "Execution layer",
          detail:
            "AI and deterministic components composed according to the risk and repeatability of each step.",
        },
        {
          name: "Control layer",
          detail:
            "Validation, review, escalation, and stop conditions applied before material actions proceed.",
        },
        {
          name: "Operating layer",
          detail:
            "Logs, signals, runbooks, change ownership, and response expectations for the launched workflow.",
        },
      ]}
      deliverables={[
        {
          phase: "Frame",
          duration: "Engagement-defined",
          scope:
            "Establish the business case, current workflow, owners, constraints, and evidence required to make a build decision.",
          outputs: [
            "Problem and workflow definition",
            "Authority and risk map",
            "Recommended implementation sequence",
          ],
        },
        {
          phase: "Design",
          duration: "Engagement-defined",
          scope:
            "Specify the target workflow, integrations, review points, exceptions, and acceptance evidence.",
          outputs: [
            "Target operating flow",
            "Architecture direction",
            "Acceptance and governance criteria",
          ],
        },
        {
          phase: "Build & validate",
          duration: "Engagement-defined",
          scope:
            "Implement controlled increments and test representative paths, failures, and handoffs.",
          outputs: [
            "Working system increments",
            "Validation evidence",
            "Known limitations and launch conditions",
          ],
        },
        {
          phase: "Launch & operate",
          duration: "Engagement-defined",
          scope:
            "Release, transfer ownership, and optionally continue under a separately defined operating scope.",
          outputs: [
            "Launch and handover",
            "Runbook and ownership record",
            "Optional managed-operations agreement",
          ],
        },
      ]}
      kpis={[
        {
          metric: "Completion quality",
          detail:
            "How often the workflow produces an acceptable business result under the agreed criteria.",
        },
        {
          metric: "Cycle time",
          detail: "Elapsed time from qualified input to completed outcome, including human review.",
        },
        {
          metric: "Exception and rework",
          detail: "Where cases leave the expected path and what creates avoidable manual work.",
        },
        {
          metric: "Operating cost",
          detail:
            "The agreed infrastructure, provider, and human effort signals required to understand the workflow.",
        },
      ]}
      outcomes={[
        "A clearer path from request to completed business outcome.",
        "Human authority preserved where judgment or risk requires it.",
        "Exceptions that arrive with context instead of disappearing between systems.",
        "An operating baseline the team can inspect and improve after launch.",
      ]}
      faq={FAQ}
      engagementNote="Scope, timing, commercial terms, ownership, licensing, acceptance, support, and operational coverage are defined in writing for each engagement."
      relatedAnswers={[
        {
          label: "AI execution system vs AI automation",
          href: "/answers/ai-execution-system-vs-ai-automation",
        },
        {
          label: "What are command gates in AI systems?",
          href: "/answers/what-are-command-gates-in-ai-systems",
        },
        {
          label: "How to measure AI output quality",
          href: "/answers/how-to-measure-ai-output-quality",
        },
      ]}
    />
  ),
});
