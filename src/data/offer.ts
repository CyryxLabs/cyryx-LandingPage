/**
 * What Cyryx Labs sells, in the words a buyer uses — the single source for the
 * home page, the products page and the FAQ schema.
 *
 * Positioning plan of 2026-10-19. Prices are intentionally not published yet
 * (founder decision, 2026-10-19): every offer starts with a free fit check and
 * ends in a fixed written quote.
 */

export type ServiceStage = {
  readonly id: "advise" | "build" | "control" | "operate";
  readonly name: string;
  readonly outcome: string;
  readonly body: string;
  readonly services: readonly string[];
  readonly href: string;
  readonly cta: string;
};

export const SERVICE_STAGES: readonly ServiceStage[] = [
  {
    id: "advise",
    name: "Advise",
    outcome: "Know what to build before you spend.",
    body: "A straight answer on where AI and software will pay off for you — and where they won't.",
    services: [
      "Free 20-minute fit check",
      "AI opportunity assessment",
      "Hands-on AI workshop for your team",
      "Fractional AI lead, a few days a month",
    ],
    href: "/solutions/ai-strategy-advisory",
    cta: "Explore Advise",
  },
  {
    id: "build",
    name: "Build",
    outcome: "Launch the website, software or AI you need.",
    body: "Designed, built and tested by one accountable team, with a fixed timeline and a written acceptance checklist.",
    services: [
      "Websites and client portals",
      "Workflow automations and AI agents",
      "Internal AI assistants on your own documents",
      "MVPs and custom software",
    ],
    href: "/solutions",
    cta: "Explore Build",
  },
  {
    id: "control",
    name: "Control",
    outcome: "Use AI without risking clients, data or budget.",
    body: "Clear rules for what AI may read, change and spend. Built into every system we deliver.",
    services: [
      "AI use policy and 12-month roadmap",
      "Data access and permission rules",
      "Spending limits and cost alerts",
      "Human approval and an activity log",
    ],
    href: "/solutions/ai-governance-cost-control",
    cta: "Explore Control",
  },
  {
    id: "operate",
    name: "Operate",
    outcome: "Keep it running and improving after launch.",
    body: "Hosting, monitoring, fixes and small improvements, with a short report every month.",
    services: [
      "Website care: hosting, security, updates",
      "Monitoring and fixes for automations and AI",
      "Monthly report and small additions",
      "An ongoing design and development team",
    ],
    href: "/managed-operations",
    cta: "Explore Operate",
  },
];

export type ProductStage = "Available" | "Waitlist" | "In daily use";

export type CyryxProduct = {
  readonly id: "aexos" | "onyx" | "astra";
  readonly name: string;
  readonly category: string;
  readonly stage: ProductStage;
  readonly stageNote: string;
  readonly summary: string;
  readonly points: readonly string[];
  readonly primary: { readonly label: string; readonly href: string; readonly external?: boolean };
  readonly secondary?: {
    readonly label: string;
    readonly href: string;
    readonly external?: boolean;
  };
};

/**
 * Stages are the real ones, checked 2026-10-19: AEXOS Core is published on npm;
 * Onyx (onyx.cyryxlabs.com) is pre-launch with a waitlist; ASTRA runs Cyryx
 * Labs itself and is not sold as a packaged product.
 */
export const CYRYX_PRODUCTS: readonly CyryxProduct[] = [
  {
    id: "aexos",
    name: "AEXOS",
    category: "AI coding framework",
    stage: "Available",
    stageNote: "Core edition free on npm",
    summary:
      "A command-line framework that puts AI coding agents to work inside your project, with the procedures they follow and the quality checks they must pass.",
    points: [
      "One orchestrator routes work to the right specialist agent",
      "Stories carry context from plan to release",
      "Quality gates stop work when a critical check fails",
    ],
    primary: { label: "Explore AEXOS", href: "/products/aexos" },
    secondary: {
      label: "@aexos/core on npm",
      href: "https://www.npmjs.com/package/@aexos/core",
      external: true,
    },
  },
  {
    id: "onyx",
    name: "Onyx",
    category: "A personal AI assistant",
    stage: "Waitlist",
    stageNote: "Pre-launch · join the waitlist",
    summary:
      "An AI assistant that works for one owner. You talk to it; it remembers what matters and helps with your inbox and your work on the computer.",
    points: [
      "Built for one person, not a whole team",
      "Speaks and keeps a memory of your context",
      "Helps manage your inbox and computer work",
    ],
    primary: {
      label: "Join the Onyx waitlist",
      href: "https://onyx.cyryxlabs.com/",
      external: true,
    },
  },
  {
    id: "astra",
    name: "ASTRA",
    category: "CRM with AI agents",
    stage: "In daily use",
    stageNote: "Runs Cyryx Labs every day",
    summary:
      "Our own CRM and company operating system. AI agents keep records current and draft the follow-ups; anything that leaves the company waits for a person to approve it.",
    points: [
      "One customer record from first contact to delivery",
      "AI agents handle the routine updates and drafts",
      "Human approval before any outside message is sent",
    ],
    primary: {
      label: "Ask about a CRM like this",
      href: "/start?source=products&intent=workflow-automation",
    },
  },
];

export type Audience = {
  readonly id: string;
  readonly name: string;
  readonly size: string;
  readonly needs: string;
  readonly start: string;
  readonly timeline: string;
};

export const AUDIENCES: readonly Audience[] = [
  {
    id: "small",
    name: "Small businesses",
    size: "1–50 people",
    needs:
      "A website that brings in calls and bookings, and automations that end the copy-and-paste.",
    start: "Free fit check, then a website or one automation",
    timeline: "2–4 weeks",
  },
  {
    id: "growing",
    name: "Growing companies",
    size: "50–500 people",
    needs:
      "Client portals, CRM integrations and an AI agent on one process your team runs every day.",
    start: "AI opportunity assessment or a 30-day AI agent pilot",
    timeline: "30 days to 3 months",
  },
  {
    id: "enterprise",
    name: "Enterprises",
    size: "500+ people",
    needs:
      "A fixed-scope pilot with limits and records that your IT, security and legal teams can review.",
    start: "Discovery sprint or AI roadmap and governance",
    timeline: "4–12 weeks",
  },
];

export const PLAN_STEPS = [
  {
    n: "01",
    title: "Get a free fit check",
    body: "Tell us the goal in a short form, then a 20-minute call. We say honestly whether — and how — we would build it.",
  },
  {
    n: "02",
    title: "Receive a fixed plan and quote",
    body: "A written scope, timeline, acceptance checklist and price. You know what you get before anything starts.",
  },
  {
    n: "03",
    title: "Launch, and keep improving",
    body: "We launch, train your team and, if you want, keep it running with a short report every month.",
  },
] as const;

export const FAQ_ITEMS = [
  {
    q: "What does Cyryx Labs do?",
    a: "We design, build and run websites, automations, custom software and AI systems, and we advise on where AI is worth it. The same team takes a project from the first conversation to launch and support.",
  },
  {
    q: "Do you work with small businesses?",
    a: "Yes. We work with small businesses, growing companies and enterprises. Small businesses usually start with a website or one automation; larger companies often start with an assessment or a fixed-scope pilot.",
  },
  {
    q: "How much does a project cost?",
    a: "Every project gets a fixed written quote after a free fit check, so you know the price, the timeline and what is included before anything starts. Assessments can be credited toward a build.",
  },
  {
    q: "How long does a project take?",
    a: "A single automation takes about two weeks, a launch website three to four weeks, an AI agent pilot about 30 days, and an MVP eight to twelve weeks after a two-week discovery sprint.",
  },
  {
    q: "Is our data safe when AI is involved?",
    a: "Every AI system we build has written limits on what it can read, change and spend, asks a person before anything that matters, and keeps a log of what it did. You decide what data it may use.",
  },
  {
    q: "Who owns the code, content and data?",
    a: "You do. At final payment you own the code, content and data we create for you.",
  },
  {
    q: "Can you work with our IT team?",
    a: "Yes. We work alongside in-house IT and product teams, document what we build, and hand over access and runbooks at the end.",
  },
  {
    q: "Do you work in Spanish?",
    a: "Yes. We serve companies across the United States and Latin America, in English and Spanish.",
  },
  {
    q: "What if the result doesn't work?",
    a: "Before work starts we agree on a written acceptance checklist. A project is finished when it passes that checklist, not before. We don't guarantee traffic, rankings or revenue — we guarantee what we agreed to build.",
  },
] as const;

/** FAQPage node for the home JSON-LD graph; mirrors the visible FAQ exactly. */
export function buildFaqJsonLd(pageUrl: string) {
  return {
    "@type": "FAQPage",
    "@id": `${pageUrl}#faq`,
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
