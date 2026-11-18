/**
 * Home page copy (rebuild v9, 2026-11-17).
 *
 * Source: docs/rebuild/Cyryx_Labs_Website_Blueprint.html, section 6, with the
 * founder decisions of 2026-11-17 (wordmark only, Orbit "In development" with
 * no description, no published prices, no fixed timelines, no blanket
 * ownership or control promises). The only guarantee is the acceptance
 * checklist.
 */
import type { StartContextIntent } from "@/lib/cta";

export const HOME_HERO = {
  eyebrow: "AI products & technology services",
  title: "AI products and automation.",
  titleLine2: "Built for the way you work.",
  body: "We build AI software, connect your existing systems, and automate the work between them. Explore our products or work with us—from strategy and implementation to ongoing support.",
  primary: "Discuss your project",
  secondary: "Explore our products",
  support: ["Clear scope.", "Visible progress.", "Defined controls."],
} as const;

export const HOME_PATHS = {
  title: "Two ways to put AI to work.",
  products: {
    kicker: "Products",
    title: "Explore Cyryx products",
    body: "Meet the software we are building. See what each product does, who it is for, and what is available now.",
    cta: "Explore products",
    href: "/products",
  },
  solutions: {
    kicker: "Solutions",
    title: "Build AI into your business",
    body: "Connect your tools, automate a workflow, or develop a custom AI application around your team’s needs.",
    cta: "Explore solutions",
    href: "/solutions",
  },
} as const;

/** Illustrative workflow. Sample data only: nothing is sent or written. */
export const WORKFLOW_DEMO = {
  title: "One request, from inbox to answer.",
  lead: "See how a customer request can move from your inbox to the right system—with AI handling defined steps and your team approving important actions.",
  label: "Illustrative workflow using sample data.",
  note: "Your implementation depends on your systems, permissions, and agreed scope. No message is sent and no record is written on this page.",
  cta: "Discuss a workflow like this",
  steps: [
    {
      name: "Inquiry received",
      why: "A customer writes in. Nothing has been read or changed yet.",
      text: "Maria Chen of Northline Dental asks to move Thursday’s onboarding call to early next week.",
    },
    {
      name: "Request summarized",
      why: "The AI step reads the message and extracts what matters. It changes nothing.",
      text: "Intent is to reschedule; mornings early next week are preferred.",
    },
    {
      name: "CRM record prepared",
      why: "The change is prepared for the CRM, not saved. Saving waits for approval.",
      text: "An activity and two proposed slots are prepared but not saved.",
    },
    {
      name: "Draft reviewed",
      why: "A person reads the reply before anything leaves the company.",
      text: "A person reads the reply offering Tuesday 10:00 or Wednesday 10:30 and approves it.",
    },
    {
      name: "Approved response sent",
      why: "After approval, the reply goes out and the CRM record is saved—with a trail of who did what.",
      text: "The reply goes out and the CRM record is saved, with a log of each step.",
    },
  ],
} as const;

export const SOLUTION_GROUPS = [
  {
    id: "strategy",
    icon: "compass",
    title: "AI strategy & consulting",
    body: "Decide where AI is useful, what to build first, and what controls are needed.",
    cta: "Explore AI consulting",
    href: "/solutions/ai-strategy-advisory",
  },
  {
    id: "automation",
    icon: "connect",
    title: "Automation & integration",
    body: "Connect business tools and reduce repetitive steps between them.",
    cta: "Explore automation",
    href: "/solutions/workflow-automation",
  },
  {
    id: "custom",
    icon: "build",
    title: "Custom AI software",
    body: "Build an assistant, internal application, or product around a defined use case.",
    cta: "Discuss a custom build",
    href: "/solutions/custom-ai-product-development",
  },
  {
    id: "operations",
    icon: "pulse",
    title: "Managed AI operations",
    body: "Monitor and maintain implemented systems, with support and changes defined in an agreement.",
    cta: "Explore ongoing support",
    href: "/managed-operations",
  },
] as const;

export const EVIDENCE = [
  {
    type: "Internal product",
    title: "Onyx Command Center",
    real: "The product’s own interface, captured from the beta.",
    simulated: "The names, tasks and numbers are example data.",
    cta: "See the product",
    href: "/products/onyx",
  },
  {
    type: "Internal demo",
    title: "Inquiry-to-reply workflow",
    real: "The sequence of steps and where a person approves.",
    simulated: "Everything else: sample data, no live email or CRM.",
    cta: "Open the demo",
    href: "/demos",
  },
  {
    type: "Internal product",
    title: "AEXOS story cycle",
    real: "The published package and its documented commands.",
    simulated: "The terminal on this page is a written summary, not a recording.",
    cta: "Read about AEXOS",
    href: "/products/aexos",
  },
] as const;

export const DELIVERY_STEPS = [
  { title: "Understand", body: "Identify the workflow, tools, constraints, and decision-makers." },
  { title: "Define", body: "Agree scope, responsibilities, controls, and acceptance criteria." },
  { title: "Build and test", body: "Review working increments against realistic cases." },
  {
    title: "Launch and support",
    body: "Complete acceptance, hand over documentation, and define ongoing support where applicable.",
  },
] as const;

/** Things defined with the client in each scope — not universal promises. */
export const SCOPE_CONTROLS = [
  { title: "Access", body: "Which systems and data the AI may read." },
  { title: "Actions", body: "What it may change, and which steps wait for a person." },
  { title: "Records", body: "What is logged, where, and who can see it." },
  { title: "Support", body: "Who responds after launch, and how changes are requested." },
] as const;

export const ACCEPTANCE_GUARANTEE =
  "A project is done when it passes the acceptance checklist we agree on.";

export const HOME_COMPANY = {
  title: "A product company. An implementation partner.",
  body: "Cyryx Labs develops its own software and works with businesses to put AI into practical use. Our focus is the connection between a useful idea, a working system, and the people responsible for it.",
} as const;

export const HOME_CLOSE = {
  title: "What should work better in your business?",
  body: "Tell us about the task, the tools, and what needs to change. We will help define whether a product, an integration, or a custom build is the right next step.",
  legend: "What do you need?",
  after:
    "Next: a short form—your reply address and a few lines about the work. No documents needed.",
} as const;

/** Intent chips on the home close, mapped onto the existing /start contract. */
export const HOME_INTENTS: readonly { label: string; intent: StartContextIntent }[] = [
  { label: "Automate a workflow", intent: "workflow-automation" },
  { label: "Connect systems", intent: "workflow-automation" },
  { label: "Build software", intent: "custom-ai-product" },
  { label: "Need guidance", intent: "strategy-advisory" },
];
