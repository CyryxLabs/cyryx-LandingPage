import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/cyryx/seo/SolutionPage";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
  buildServiceJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/solutions/custom-ai-product-development";
const TITLE = "Custom AI Product Development — Cyryx Labs";
const DESC =
  "Product strategy, experience design, engineering, validation, launch, and optional operations for custom AI-enabled products.";

const FAQ = [
  {
    q: "Where does Cyryx enter the product lifecycle?",
    a: "Cyryx can begin with product framing, join after an internal concept exists, or help recover a prototype that lacks an architecture and operating path. The first phase is shaped around the evidence already available.",
  },
  {
    q: "Do you build the full product or augment an internal team?",
    a: "Either model may fit. Team structure, responsibilities, decision authority, and handover are agreed before delivery begins.",
  },
  {
    q: "How are code and intellectual property handled?",
    a: "Ownership, licensing, reusable Cyryx components, third-party services, data, and deliverables are defined in the engagement agreement. No universal transfer model is assumed.",
  },
  {
    q: "What happens after launch?",
    a: "The product can be transferred to the client team or operated with Cyryx under a separately defined scope covering the selected systems, responsibilities, and response expectations.",
  },
];

export const Route = createFileRoute("/solutions/custom-ai-product-development")({
  head: () =>
    buildHead({ title: TITLE, description: DESC, path: PATH }, [
      buildBreadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Solutions", path: "/solutions" },
        { name: "Custom AI Product Development", path: PATH },
      ]),
      buildServiceJsonLd({
        name: "Custom AI Product Development",
        serviceType: "AI product strategy, design, and engineering",
        description: DESC,
        path: PATH,
      }),
      buildFaqJsonLd(FAQ),
    ]),
  component: () => (
    <SolutionPage
      eyebrow="Custom AI Products"
      title="Turn an AI product thesis into an operating product."
      directAnswer="Cyryx helps teams frame, design, build, validate, and launch custom AI-enabled products. We connect the customer promise to the system architecture and operating model so the product can move beyond an impressive demonstration."
      whatItIs="A cross-functional product engagement spanning the commercial problem, user experience, AI and software architecture, quality evidence, launch readiness, and post-launch ownership required by the agreed scope."
      whoItIsFor={[
        "Founders and product leaders shaping a new AI-native product or capability.",
        "Enterprise teams creating an AI product for customers, partners, or an internal market.",
        "Teams with a compelling prototype that needs product, engineering, and operating discipline.",
      ]}
      whatWeBuild={[
        "Product framing, journey, interaction model, and measurable product hypotheses.",
        "AI and deterministic application architecture selected for the use case.",
        "Product interfaces, APIs, data flows, integrations, and administrative controls.",
        "Evaluation, review, observability, and release evidence for material behavior.",
        "Launch, handover, and optional continuing operations for the agreed system.",
      ]}
      howWeWork={[
        "Clarify the customer, problem, commercial thesis, evidence, and constraints.",
        "Design the narrowest product experience that can test the core value proposition.",
        "Build the system in vertical slices that connect interface, intelligence, and operations.",
        "Validate product behavior and limitations against written release criteria.",
        "Launch, transfer, and evolve according to the agreed ownership model.",
      ]}
      challenges={[
        "A broad feature list without a sharp customer or operating thesis.",
        "AI behavior treated as a hidden component instead of a product surface.",
        "Prototype architecture becoming the unexamined production architecture.",
        "No plan for evaluation, cost, exceptions, or model and provider change.",
        "A launch date without an owner for the system after launch.",
      ]}
      architecture={[
        {
          name: "Product experience",
          detail:
            "The user journey, interface, feedback, and recovery behavior that make the intelligence usable.",
        },
        {
          name: "Application system",
          detail:
            "APIs, data, identity, integrations, administration, and deterministic product logic.",
        },
        {
          name: "Intelligence system",
          detail:
            "Models, retrieval, tools, context, evaluation, and task orchestration selected for the product.",
        },
        {
          name: "Control system",
          detail: "Review, policy, observability, cost, failure handling, and release authority.",
        },
        {
          name: "Operating model",
          detail:
            "Ownership, change process, support, provider dependencies, and post-launch responsibility.",
        },
      ]}
      deliverables={[
        {
          phase: "Product framing",
          duration: "Engagement-defined",
          scope:
            "Align the customer problem, product thesis, constraints, evidence, and decision path.",
          outputs: [
            "Product opportunity brief",
            "Experience and system hypotheses",
            "Recommended product sequence",
          ],
        },
        {
          phase: "Product & architecture design",
          duration: "Engagement-defined",
          scope:
            "Define the target experience, system boundaries, AI behavior, controls, and release evidence.",
          outputs: [
            "Experience direction",
            "Architecture direction",
            "Delivery and validation plan",
          ],
        },
        {
          phase: "Build & validate",
          duration: "Engagement-defined",
          scope:
            "Implement vertical slices, test material behavior, and decide what is ready to release.",
          outputs: [
            "Working product increments",
            "Evaluation and acceptance evidence",
            "Known limitations and launch decision",
          ],
        },
        {
          phase: "Launch & evolve",
          duration: "Engagement-defined",
          scope:
            "Release the approved product, establish ownership, and plan the next evidence-driven increment.",
          outputs: [
            "Launch and handover",
            "Operating documentation",
            "Optional evolution or operations scope",
          ],
        },
      ]}
      kpis={[
        {
          metric: "Product value",
          detail:
            "The customer or business behavior that indicates the product is solving the intended problem.",
        },
        {
          metric: "Task quality",
          detail:
            "The agreed measures for whether the product's material AI-enabled behavior is acceptable.",
        },
        {
          metric: "User recovery",
          detail:
            "How clearly the product handles uncertainty, failure, correction, and escalation.",
        },
        {
          metric: "Operating viability",
          detail:
            "The cost, support, provider, and ownership signals needed to sustain the product.",
        },
      ]}
      outcomes={[
        "A product scope tied to a real customer and business decision.",
        "A coherent experience across software, AI behavior, and human control.",
        "Release decisions grounded in documented evidence and limitations.",
        "Clear ownership for the product after the first launch.",
      ]}
      faq={FAQ}
      engagementNote="Team structure, scope, timing, commercial terms, code and intellectual-property treatment, third-party costs, acceptance, support, and post-launch responsibility are defined for each engagement."
      relatedAnswers={[
        { label: "What is governed AI execution?", href: "/answers/what-is-governed-ai-execution" },
        {
          label: "What is goal-grounded generation?",
          href: "/answers/what-is-goal-grounded-generation",
        },
        {
          label: "How to measure AI output quality",
          href: "/answers/how-to-measure-ai-output-quality",
        },
      ]}
    />
  ),
});
