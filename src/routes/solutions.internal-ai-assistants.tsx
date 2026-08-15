import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/cyryx/seo/SolutionPage";
import assistantVisualSmall from "@/assets/solutions/solution-assistants-768.webp";
import assistantVisualLarge from "@/assets/solutions/solution-assistants-1440.webp";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
  buildServiceJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/solutions/internal-ai-assistants";
const TITLE = "Internal AI Assistants — Cyryx Labs";
const DESC =
  "Task-specific internal AI assistants designed around approved data, role boundaries, review, and measurable team workflows.";

const FAQ = [
  {
    q: "Is this a replacement for a general enterprise assistant?",
    a: "Not necessarily. Cyryx focuses on the specific internal tasks, systems, and controls that a horizontal assistant may not cover. The result can complement an existing enterprise tool or become a dedicated interface for a defined workflow.",
  },
  {
    q: "How are permissions handled?",
    a: "Permission behavior is designed from the identity, source-system, and data-class constraints in scope. The implementation must be validated against those boundaries before release; no universal security posture is assumed.",
  },
  {
    q: "How do you reduce unsupported answers?",
    a: "We narrow each assistant to defined tasks, provide approved context, require evidence where appropriate, and introduce review or refusal behavior when the available information is insufficient.",
  },
  {
    q: "Who owns the assistant after launch?",
    a: "Ownership, access, configuration authority, support, and change responsibility are documented for the engagement. Cyryx can hand over the system or continue under a defined managed-operations scope.",
  },
];

export const Route = createFileRoute("/solutions/internal-ai-assistants")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Solutions", path: "/solutions" },
        { name: "Internal AI Assistants", path: PATH },
      ]),
      buildServiceJsonLd({
        name: "Internal AI Assistants",
        serviceType: "Internal AI assistant design and engineering",
        description: DESC,
        path: PATH,
      }),
      buildFaqJsonLd(FAQ),
    ]),
  component: () => (
    <SolutionPage
      startIntent="internal-assistant"
      eyebrow="Internal AI Assistants"
      title="Give teams intelligence inside the work they already own."
      directAnswer="Cyryx designs internal assistants around defined jobs, approved context, role boundaries, and review. Instead of launching a generic chat surface, we start with the decisions and tasks where better access to intelligence can materially improve the operating day."
      whatItIs="A purpose-built internal interface—conversational, embedded, or workflow-native—that helps a defined group perform selected tasks using the data and systems approved for that use."
      whoItIsFor={[
        "Teams spending significant time finding, reconciling, and applying internal knowledge.",
        "Operations, support, product, and revenue functions with repeatable decision-support tasks.",
        "Organizations that need an assistant to respect role, source, and approval boundaries.",
      ]}
      whatWeBuild={[
        "Task inventory and assistant experience for the highest-value internal jobs.",
        "Context retrieval from the sources included in scope.",
        "Role-aware behavior integrated with the selected identity and access model.",
        "Evidence, review, refusal, and escalation behavior for material outputs.",
        "Usage and quality signals tied to the agreed tasks.",
      ]}
      howWeWork={[
        "Identify the tasks, users, information, and decisions that justify an assistant.",
        "Define source authority, role boundaries, review, and success criteria.",
        "Build a narrow vertical slice with a representative user cohort.",
        "Evaluate usefulness, unsupported behavior, and workflow fit before expanding.",
        "Transfer or operate the assistant under written ownership and change controls.",
      ]}
      challenges={[
        "A generic chat surface with no defined job to be done.",
        "Retrieval that ignores the authority and freshness of a source.",
        "Access assumptions that do not match the underlying systems.",
        "Confident output when the available evidence is incomplete.",
        "Adoption measured by logins rather than completed work.",
      ]}
      architecture={[
        {
          name: "Experience",
          detail:
            "The interface and task flows designed for the users and operating context in scope.",
        },
        {
          name: "Context",
          detail:
            "Approved sources prepared for retrieval with provenance and freshness behavior defined where required.",
        },
        {
          name: "Identity",
          detail: "Role and access signals from the selected identity and source systems.",
        },
        {
          name: "Task runtime",
          detail: "Task-specific instructions, tools, structured outputs, and application logic.",
        },
        {
          name: "Controls",
          detail:
            "Evidence requirements, refusals, human review, escalation, and change authority.",
        },
      ]}
      deliverables={[
        {
          phase: "Task discovery",
          duration: "Engagement-defined",
          scope:
            "Prioritize the internal jobs, users, systems, and constraints that can support a useful assistant.",
          outputs: [
            "Task and user map",
            "Source and access inventory",
            "Opportunity and risk assessment",
          ],
        },
        {
          phase: "Experience & system design",
          duration: "Engagement-defined",
          scope: "Define the interaction model, context behavior, controls, and validation plan.",
          outputs: [
            "Assistant experience flow",
            "Architecture direction",
            "Evaluation and release criteria",
          ],
        },
        {
          phase: "Build & evaluate",
          duration: "Engagement-defined",
          scope: "Implement a representative slice and evaluate it with approved cases and users.",
          outputs: [
            "Working assistant slice",
            "Evaluation findings",
            "Expansion or launch recommendation",
          ],
        },
        {
          phase: "Launch & ownership",
          duration: "Engagement-defined",
          scope:
            "Release the approved scope, document authority, and establish the change and support model.",
          outputs: [
            "Launch and handover",
            "Operating documentation",
            "Optional continuing coverage",
          ],
        },
      ]}
      kpis={[
        {
          metric: "Task completion",
          detail:
            "Whether the assistant helps users complete the selected job under the agreed criteria.",
        },
        {
          metric: "Rework and correction",
          detail: "How often users must materially revise, reject, or recover an output.",
        },
        {
          metric: "Evidence coverage",
          detail:
            "Whether material claims or actions are supported by the sources required for the task.",
        },
        {
          metric: "Adoption by task",
          detail:
            "Repeated use of the assistant for the defined work, interpreted alongside quality and user feedback.",
        },
      ]}
      outcomes={[
        "Faster access to the information required for selected internal tasks.",
        "Clearer boundaries around what the assistant may see, say, and do.",
        "A measurable path from useful prototype to owned internal capability.",
        "An operating model for review, change, and support after launch.",
      ]}
      faq={FAQ}
      engagementNote="Data access, identity integration, scope, ownership, licensing, support, acceptance, and operational coverage are defined for the specific engagement."
      visual={{
        imageSmall: assistantVisualSmall,
        imageLarge: assistantVisualLarge,
        alt: "A central brushed-metal module connected to bounded context, task, and control structures",
        diagramVariant: "radial",
        diagramLabel: "The bounded assistant system",
        diagramCaption:
          "Experience, context, identity, task runtime, and controls surround one defined job rather than an unrestricted general-purpose chat surface.",
      }}
      relatedAnswers={[
        {
          label: "What is goal-grounded generation?",
          href: "/answers/what-is-goal-grounded-generation",
        },
        { label: "What is governed AI execution?", href: "/answers/what-is-governed-ai-execution" },
        {
          label: "How to measure AI output quality",
          href: "/answers/how-to-measure-ai-output-quality",
        },
      ]}
    />
  ),
});
