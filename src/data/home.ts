/**
 * Home page copy that is not service or market data. FAQ answers reuse the
 * founder-approved facts in data/offer.ts (timelines, ownership, guarantee).
 */
export const HOME_FAQ = [
  {
    q: "What does Cyryx Labs do?",
    a: "Cyryx Labs builds AI systems, workflow automations and integrations for US companies, and advises on where AI is worth it. We also build our own AI products, Onyx and AEXOS, and publish applied research.",
  },
  {
    q: "Do you work with small businesses, or only large companies?",
    a: "Both. Small businesses usually start with one automation or a website. Mid-market companies often start with an assessment or a 30-day AI agent pilot. Enterprises start with a fixed-scope pilot their IT, security and legal teams can review.",
  },
  {
    q: "How much does a project cost?",
    a: "Every project gets a fixed written quote after a free fit check, so you know the price, the timeline and what is included before anything starts. An assessment can be credited toward a build.",
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
    q: "Will AI replace our team?",
    a: "That is not what we build. We automate repetitive steps so people spend their time on work that needs judgment, and a person stays in control of every decision that matters.",
  },
  {
    q: "Who owns the code, content and data?",
    a: "You do. At final payment you own the code, content and data we create for you.",
  },
  {
    q: "What if the result doesn't work?",
    a: "Before work starts we agree on a written acceptance checklist. A project is finished when it passes that checklist, not before. We don't guarantee traffic, rankings or revenue. We guarantee what we agreed to build.",
  },
  {
    q: "Do you work in Spanish?",
    a: "Yes. We serve companies across the United States and Latin America, in English and Spanish.",
  },
] as const;

export const PROCESS_STEPS = [
  {
    n: "01",
    title: "Free 20-minute fit check",
    time: "Day 1",
    body: "Tell us the goal in a short form, then a 20-minute call. We say honestly whether, and how, we would build it. Sometimes the answer is: don't.",
  },
  {
    n: "02",
    title: "A written plan and a fixed quote",
    time: "Before any work",
    body: "Scope, timeline, acceptance checklist and price on one sheet. You know exactly what you get before you commit to anything.",
  },
  {
    n: "03",
    title: "We build, you see it working",
    time: "In weeks",
    body: "Working increments on real cases, not slide decks. Your team reviews as we go, so there are no surprises at the end.",
  },
  {
    n: "04",
    title: "Launch, handover and care",
    time: "Ongoing, if you want",
    body: "It is finished when it passes the checklist. You own the code and data. We train your team and can keep it running with a short report every month.",
  },
] as const;

export const GUARDRAILS = [
  {
    title: "Written limits",
    body: "Each system has a short list of what it may read, what it may change and what it may spend. Nothing outside the list.",
  },
  {
    title: "A person decides",
    body: "Sending a message, moving money, changing a record: anything that matters waits for someone on your team to approve it.",
  },
  {
    title: "Everything on record",
    body: "Every action is logged with what was asked, what was done and what it cost, so you can check the work any day.",
  },
] as const;

export const MARQUEE = [
  "AI agents",
  "Workflow automation",
  "CRM and ERP integration",
  "Internal assistants",
  "Knowledge systems",
  "AI governance",
  "Custom AI products",
  "AI search visibility",
  "Team training",
  "Managed operations",
] as const;
