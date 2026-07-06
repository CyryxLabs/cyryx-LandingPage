import { createFileRoute } from "@tanstack/react-router";
import { SolutionPage } from "@/components/cyryx/seo/SolutionPage";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildHead,
  buildServiceJsonLd,
} from "@/components/cyryx/seo/seo";

const PATH = "/solutions/custom-ai-product-development";
const TITLE = "Custom AI product development — Cyryx Labs";
const DESC = "End-to-end design and engineering of custom AI products built on the same governance primitives as MAAX Studio.";

const FAQ = [
  {
    q: "Are you a build shop or a product partner?",
    a: "A product partner. Every engagement starts with framing the product as missions and outcomes, not features. We take a stake in whether it works commercially, not just whether it compiles — that includes pushing back on scope that dilutes the wedge.",
  },
  {
    q: "What size teams do you plug into?",
    a: "Founding teams (pre-seed to Series A) shipping the first AI-native product, and product units inside larger companies launching new AI products as separate P&Ls. Below that, off-the-shelf tooling is usually the right call; above that, an in-house team is.",
  },
  {
    q: "How do you handle IP and code ownership?",
    a: "You own the product code, the models you fine-tune or license, and the customer data. Cyryx reuses shared internal libraries under permissive licenses. The MSA locks IP ownership per engagement — no boilerplate that leaves it ambiguous.",
  },
  {
    q: "What's your stance on AI model choice?",
    a: "Model-agnostic and route-per-mission. We architect so that a model swap is a routing change, not a rewrite. Evaluators run against the ledger to confirm no regression before promoting a new model into a production mission.",
  },
  {
    q: "How do you know when to hand off?",
    a: "A handoff plan is part of the initial scope. We define the operability bar (runbooks, dashboards, on-call hygiene, evaluator coverage) and hand off when your team can run it without us. Ongoing engagement is opt-in, not baked into the contract.",
  },
];

export const Route = createFileRoute("/solutions/custom-ai-product-development")({
  head: () =>
    buildHead(
      { title: TITLE, description: DESC, path: PATH },
      [
        buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: "Custom AI product development", path: PATH },
        ]),
        buildServiceJsonLd({
          name: "Custom AI product development",
          serviceType: "AI product engineering",
          description: DESC,
          path: PATH,
        }),
        buildFaqJsonLd(FAQ),
      ],
    ),
  component: () => (
    <SolutionPage
      eyebrow="Custom AI Product Development"
      title="Custom AI products engineered to ship."
      directAnswer="Cyryx Labs partners with founders and product teams to design and build custom AI products end to end: positioning, architecture, runtime, gates, evaluators, UI, and deployment. We bring the same execution primitives that power MAAX Studio to each engagement, so the product you ship is governed and operable from day one."
      whatItIs="A senior, opinionated product engineering partnership focused on AI-native software — from problem definition through production. We build, not advise."
      whoItIsFor={[
        "Founders shipping AI-native products who need engineering depth instead of agency throughput.",
        "Product teams inside larger companies launching new AI products as separate units.",
        "Operators with a strong wedge but no AI execution architecture.",
      ]}
      whatWeBuild={[
        "Product architecture grounded in missions, gates, and ledgers.",
        "AI runtime and orchestration tailored to the product domain.",
        "Front-end experiences that surface governance instead of hiding it.",
        "Evaluators and regression suites that scale with the product.",
        "Operability handoff: dashboards, runbooks, on-call hygiene.",
      ]}
      howWeWork={[
        "Frame the product as missions and outcomes, not features.",
        "Architect the execution layer before the UI.",
        "Ship a vertical slice end to end, then iterate against real users.",
        "Transition operability to your team on a defined schedule.",
      ]}
      challenges={[
        "AI features bolted on features instead of shipping as products with a wedge.",
        "Prototypes that impress in demos and collapse under paying-customer load.",
        "Runtime, gates, and evaluators postponed until the first incident forces them.",
        "Teams that scale headcount before they scale architecture — and pay for it later.",
        "Model lock-in that turns a routine vendor swap into a rewrite.",
      ]}
      architecture={[
        { name: "Product spine", detail: "Missions, acceptance criteria, and outcomes framed as the durable product model — everything else composes around it." },
        { name: "Execution runtime", detail: "Domain-specific runtime built on the same primitives as MAAX Studio: routing, context resolution, gates, ledger." },
        { name: "Experience layer", detail: "Front-end that surfaces governance (gate reasons, escalations, provenance) as trust signals instead of hiding them." },
        { name: "Evaluator suite", detail: "Automated and human-in-the-loop evaluators sized to the product's risk profile and scaled with mission volume." },
        { name: "Deployment + operability", detail: "Feature-flagged deploys, staged rollouts, dashboards, runbooks, and on-call hygiene delivered as first-class product assets." },
      ]}
      deliverables={[
        { phase: "Product framing", duration: "2 weeks", scope: "Reframe the product as missions and outcomes, identify the wedge, and define the initial vertical slice.", outputs: ["Mission-based product spec", "Vertical slice scope", "Risk + evaluator plan"] },
        { phase: "Vertical slice", duration: "6–10 weeks", scope: "Ship one end-to-end mission through runtime, gates, ledger, and UI — in front of real users behind a controlled rollout.", outputs: ["Live vertical slice", "Runtime + gate framework", "Evaluator baseline"] },
        { phase: "Scale-out", duration: "3–6 months", scope: "Extend to additional missions and surfaces, harden operability, and prepare for growth in usage and headcount.", outputs: ["Full product runtime", "Operability manual", "On-call + incident playbook"] },
        { phase: "Handover", duration: "4 weeks", scope: "Structured knowledge transfer, staff plan for internalization, and a defined post-handoff cadence (advisory-only or retainer).", outputs: ["Handover plan", "Internalization checklist", "Post-handoff cadence"] },
      ]}
      techStack={[
        "TypeScript / Python across runtime + edge",
        "TanStack Start / Next.js on Vercel or Cloudflare Workers",
        "Postgres + append-only mission ledger",
        "Temporal / Inngest for durable execution",
        "Model routing across OpenAI, Anthropic, Google, open-weight",
        "Auth via WorkOS, Clerk, or your existing IdP",
      ]}
      kpis={[
        { metric: "Time to first governed mission in production", detail: "Weeks from kickoff to a real user completing a governed mission end to end — a proxy for product velocity." },
        { metric: "Mission success rate", detail: "Percentage of missions that meet acceptance criteria without human rework, tracked per product surface." },
        { metric: "Regression coverage", detail: "Percentage of production missions covered by an automated evaluator that would catch a regression before rollout." },
        { metric: "Operability score", detail: "Composite: runbook coverage, on-call response time, dashboard freshness — a leading indicator of team readiness to own the product." },
      ]}
      outcomes={[
        "A product that ships with governance, observability, and evaluation built in.",
        "Architectural clarity that survives model upgrades and team changes.",
        "Less rework when scaling to new use cases.",
        "A team that owns and can evolve the system after the engagement.",
      ]}
      faq={FAQ}
      engagementNote="Structured as a multi-phase partnership: fixed-scope framing, milestone-priced vertical slice, then a scale-out retainer with a defined handover date. IP transfers per engagement; Cyryx reuses only permissively-licensed shared libraries."
      relatedAnswers={[
        { label: "AI execution system vs AI automation", href: "/answers/ai-execution-system-vs-ai-automation" },
        { label: "What is governed AI execution?", href: "/answers/what-is-governed-ai-execution" },
        { label: "What is goal-grounded generation?", href: "/answers/what-is-goal-grounded-generation" },
      ]}
    />
  ),
});