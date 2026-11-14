import type { StartContextIntent } from "@/lib/cta";
import type { SourceId } from "@/data/market";

/**
 * The service catalogue (2026-11): what US companies are asking for in AI,
 * mapped from the market evidence in data/market.ts to what Cyryx Labs builds.
 *
 * Rules kept from earlier founder decisions: no published prices, no client
 * names or results, timelines only where the founder already stated them, and
 * one guarantee — the acceptance checklist.
 */
export type ServiceStage = "Advise" | "Build" | "Control" | "Operate";

export type Service = {
  readonly slug: string;
  readonly path: string;
  readonly name: string;
  readonly stage: ServiceStage;
  readonly icon:
    | "compass"
    | "workflow"
    | "bot"
    | "plug"
    | "box"
    | "database"
    | "shield"
    | "globe"
    | "users"
    | "activity";
  readonly intent: StartContextIntent;
  readonly metaTitle: string;
  readonly metaDescription: string;
  readonly serviceType: string;
  readonly h1: string;
  /** Answer-first paragraph: what it is, for whom, what you get. */
  readonly answer: string;
  readonly cardPain: string;
  readonly cardLine: string;
  readonly stat?: { readonly value: string; readonly text: string; readonly source: SourceId };
  readonly problems: readonly string[];
  readonly deliver: readonly { readonly title: string; readonly body: string }[];
  readonly steps: readonly { readonly title: string; readonly body: string }[];
  readonly examples: readonly { readonly who: string; readonly text: string }[];
  readonly timeline: string;
  readonly startsWith: string;
  readonly faq: readonly { readonly q: string; readonly a: string }[];
  readonly related: readonly string[];
};

const PLAN_TIMELINE = "Set in your written plan before work starts";

export const SERVICES: readonly Service[] = [
  {
    slug: "ai-strategy-advisory",
    path: "/solutions/ai-strategy-advisory",
    name: "AI Strategy & Roadmap",
    stage: "Advise",
    icon: "compass",
    intent: "strategy-advisory",
    metaTitle: "AI Strategy & Roadmap Consulting | Cyryx Labs",
    metaDescription:
      "Find where AI will pay off in your business and where it won't. An AI opportunity assessment with a ranked roadmap, costs and risks in writing.",
    serviceType: "AI strategy consulting",
    h1: "Know where AI pays off before you spend on it.",
    answer:
      "The AI opportunity assessment is a short, fixed-scope review of how your company works. We map your processes, score each AI opportunity by value, effort and risk, and hand you a ranked roadmap with a plan for the first build. If you build with us, the assessment is credited toward it.",
    cardPain: "Not knowing where to start, or what the return will be",
    cardLine: "A ranked roadmap of what to build first, what to skip and what each step costs.",
    stat: {
      value: "33%",
      text: "of mid-market firms with stalled AI pilots say the return is unclear.",
      source: "rsm",
    },
    problems: [
      "You are paying for AI tools, but nobody can say what they have returned.",
      "Every team has ideas. There is no shared way to rank them.",
      "You suspect some of what you are being sold does not need AI at all.",
    ],
    deliver: [
      {
        title: "Process and opportunity map",
        body: "The work your team repeats every day, where time goes, and which steps AI or plain automation can take over.",
      },
      {
        title: "Ranked roadmap",
        body: "Each opportunity scored by business value, effort, data readiness and risk, in the order we would build them.",
      },
      {
        title: "A plan for the first build",
        body: "Scope, timeline, acceptance checklist and a fixed quote for the first project on the list.",
      },
      {
        title: "A straight answer",
        body: "Where AI is the wrong tool, we say so, and tell you what to do instead.",
      },
    ],
    steps: [
      {
        title: "Free fit check",
        body: "A 20-minute call to confirm the assessment is the right first step.",
      },
      {
        title: "Review your operation",
        body: "Short interviews and a look at the tools and data you already have.",
      },
      {
        title: "Score and rank",
        body: "Every opportunity gets a value, an effort and a risk rating you can challenge.",
      },
      {
        title: "Roadmap and quote",
        body: "You leave with the roadmap and a fixed plan for the first build.",
      },
    ],
    examples: [
      {
        who: "Small business",
        text: "Which two tasks to automate first, and which subscriptions to cancel.",
      },
      { who: "Mid-market", text: "A 12-month AI roadmap the leadership team can fund in stages." },
      {
        who: "Enterprise",
        text: "A reviewed shortlist of agent use cases with risk and governance notes.",
      },
    ],
    timeline: "Credited toward a build",
    startsWith: "A free 20-minute fit check",
    faq: [
      {
        q: "What do we get at the end of an AI assessment?",
        a: "A written process map, a ranked list of AI and automation opportunities with value, effort and risk for each, and a fixed plan and quote for the first build.",
      },
      {
        q: "Will you recommend AI for everything?",
        a: "No. Some problems are better solved with ordinary software or a process change, and sometimes the right answer is not to build. The roadmap says which is which.",
      },
      {
        q: "Does the assessment cost extra if we build with you?",
        a: "The assessment can be credited toward a build, so it becomes the first phase of the project rather than a separate cost.",
      },
    ],
    related: ["ai-training-enablement", "workflow-automation", "ai-governance-cost-control"],
  },
  {
    slug: "workflow-automation",
    path: "/solutions/workflow-automation",
    name: "Workflow Automation",
    stage: "Build",
    icon: "workflow",
    intent: "workflow-automation",
    metaTitle: "AI Workflow Automation Services | Cyryx Labs",
    metaDescription:
      "Automate the repetitive work between your systems: intake, routing, data entry, follow-ups and reports. One automation ships in about two weeks.",
    serviceType: "AI workflow automation",
    h1: "End the copy-and-paste work between your systems.",
    answer:
      "Workflow automation moves repetitive work, such as lead intake, data entry, document handling, follow-ups and reports, from people to software. We connect the systems you already use, add AI where a step needs reading or judgment, and keep a person in control of anything that matters. A single automation takes about two weeks.",
    cardPain: "Staff time lost to repetitive, manual work",
    cardLine:
      "The tasks your team repeats every day, running on their own with a person still in control.",
    stat: {
      value: "84%",
      text: "of small business owners name efficiency and productivity as the main benefit of AI.",
      source: "goldman",
    },
    problems: [
      "The same data is typed into three systems by three people.",
      "Leads and requests wait in an inbox until someone has time.",
      "Reports are assembled by hand every week from exports and spreadsheets.",
    ],
    deliver: [
      {
        title: "A mapped workflow",
        body: "Every step, owner, decision and exception written down before anything is built.",
      },
      {
        title: "Working automation",
        body: "Connected to the tools you already use: CRM, email, spreadsheets, accounting, help desk.",
      },
      {
        title: "AI where it helps",
        body: "Reading documents, classifying requests and drafting replies. Plain rules everywhere else, because rules are cheaper and safer.",
      },
      {
        title: "Approval points",
        body: "Anything that sends money, messages a customer or changes a record can wait for a person.",
      },
      {
        title: "An activity log",
        body: "What ran, what it did and what it cost, so problems are visible the day they start.",
      },
    ],
    steps: [
      {
        title: "Pick one process",
        body: "We choose the one with the most repeated hours and the least risk.",
      },
      {
        title: "Map and agree",
        body: "Scope, acceptance checklist and fixed price in a written plan.",
      },
      { title: "Build and test", body: "Built against real cases, including the awkward ones." },
      {
        title: "Launch and hand over",
        body: "Your team is trained and owns the result. We can keep it running if you want.",
      },
    ],
    examples: [
      {
        who: "Small business",
        text: "New web leads are qualified, added to the CRM and answered within minutes.",
      },
      {
        who: "Mid-market",
        text: "Invoices are read, matched to purchase orders and queued for approval.",
      },
      {
        who: "Enterprise",
        text: "Service requests are classified and routed across teams with a full audit trail.",
      },
    ],
    timeline: "About 2 weeks for one automation",
    startsWith: "One automation on one process",
    faq: [
      {
        q: "Do we have to replace the tools we already use?",
        a: "Usually not. We connect the systems your team already trusts and automate the work between them. Replacement is only suggested when a tool blocks the workflow.",
      },
      {
        q: "How long does one automation take?",
        a: "A single automation takes about two weeks from the written plan to launch. Larger workflows are split into stages that each deliver something usable.",
      },
      {
        q: "What happens when the automation hits a case it does not understand?",
        a: "It stops and hands the case to a person with the context attached. Exceptions are designed up front, not discovered in production.",
      },
      {
        q: "Who owns the automation?",
        a: "You do. At final payment you own the code, content and data we create for you.",
      },
    ],
    related: ["ai-integrations", "internal-ai-assistants", "managed-operations"],
  },
  {
    slug: "internal-ai-assistants",
    path: "/solutions/internal-ai-assistants",
    name: "AI Agents & Assistants",
    stage: "Build",
    icon: "bot",
    intent: "internal-assistant",
    metaTitle: "AI Agents & Internal Assistants | Cyryx Labs",
    metaDescription:
      "AI agents and assistants that work inside your business with clear permissions, human approval and a record of every action. Pilot in 30 days.",
    serviceType: "AI agent development",
    h1: "AI agents that do the work, inside limits you set.",
    answer:
      "An AI agent is software that completes a task from start to finish: it reads the request, finds the information, takes the action and reports back. We build agents and internal assistants on one process at a time, with written permissions, human approval for anything that matters and a log of every action. A pilot runs for 30 days.",
    cardPain: "AI pilots that never reach production",
    cardLine:
      "An agent on one real process in 30 days, with permissions, approvals and a full record.",
    stat: {
      value: "21%",
      text: "of enterprises have a mature model for governing autonomous agents.",
      source: "deloitte",
    },
    problems: [
      "Your team asks the same questions and searches the same documents every day.",
      "A demo impressed everyone, then stalled when it met real data and real permissions.",
      "Nobody can say what an agent would be allowed to do, so nothing ships.",
    ],
    deliver: [
      {
        title: "An agent on one process",
        body: "Support triage, sales follow-up, onboarding, reporting: one job, done end to end.",
      },
      {
        title: "Answers from your own knowledge",
        body: "The agent works from your documents, policies and records, and shows where each answer came from.",
      },
      {
        title: "Written permissions",
        body: "What it may read, what it may change and what it may spend, agreed before it runs.",
      },
      {
        title: "Human approval",
        body: "Consequential actions wait for a named person. The agent prepares; your team decides.",
      },
      {
        title: "Measured results",
        body: "Quality, time saved and cost per task, tracked from the first day of the pilot.",
      },
    ],
    steps: [
      {
        title: "Choose the process",
        body: "One your team runs every day, with a clear definition of done.",
      },
      {
        title: "Set the limits",
        body: "Permissions, approval points and test cases, in the written plan.",
      },
      {
        title: "Pilot for 30 days",
        body: "The agent works on real cases with your team reviewing its output.",
      },
      {
        title: "Decide with evidence",
        body: "Keep, extend or stop, based on what the pilot measured.",
      },
    ],
    examples: [
      {
        who: "Small business",
        text: "An assistant that answers staff questions from the handbook and price list.",
      },
      {
        who: "Mid-market",
        text: "A support agent that drafts replies and resolves routine tickets with approval.",
      },
      {
        who: "Enterprise",
        text: "A reviewed pilot with access controls and logs your security team can audit.",
      },
    ],
    timeline: "30-day pilot",
    startsWith: "A 30-day AI agent pilot on one process",
    faq: [
      {
        q: "What is the difference between an AI assistant and an AI agent?",
        a: "An assistant answers questions and drafts content for a person to use. An agent goes further and completes the task itself, taking actions in your systems inside the permissions you set.",
      },
      {
        q: "Is our data safe?",
        a: "Every agent we build has written limits on what it can read, change and spend, asks a person before anything that matters, and keeps a log of what it did. You decide what data it may use.",
      },
      {
        q: "What if the agent gets something wrong?",
        a: "The pilot is designed to find that out safely. Outputs are reviewed, consequential actions wait for approval, and test cases are agreed in advance so quality is measured rather than assumed.",
      },
    ],
    related: ["data-knowledge-systems", "ai-governance-cost-control", "workflow-automation"],
  },
  {
    slug: "ai-integrations",
    path: "/solutions/ai-integrations",
    name: "AI Systems Integration",
    stage: "Build",
    icon: "plug",
    intent: "workflow-automation",
    metaTitle: "AI Systems Integration Services | Cyryx Labs",
    metaDescription:
      "Connect AI to the CRM, ERP, help desk and internal tools you already run, so it works with real data instead of sitting beside your business.",
    serviceType: "AI systems integration",
    h1: "Connect AI to the systems you already run.",
    answer:
      "AI systems integration connects AI models and agents to the software your business already depends on: CRM, ERP, accounting, help desk, databases and internal tools. We build the connections, the permissions and the monitoring, so AI works with live data and writes results back where your team needs them.",
    cardPain: "AI that sits beside your systems instead of inside them",
    cardLine:
      "AI wired into your CRM, ERP and internal tools, reading live data and writing results back.",
    stat: {
      value: "47%",
      text: "of mid-market firms with stalled AI pilots cite integration as the barrier.",
      source: "rsm",
    },
    problems: [
      "Staff copy information out of one system to paste it into an AI tool.",
      "Older systems have no modern API, so every AI project stops at the same wall.",
      "Each department bought its own AI tool and none of them share data.",
    ],
    deliver: [
      {
        title: "Integration map",
        body: "Which systems hold what, how they connect today and where AI needs access.",
      },
      {
        title: "Working connections",
        body: "APIs, webhooks, database access and, where needed, a safe layer over legacy systems.",
      },
      {
        title: "Scoped access",
        body: "Each connection gets only the data and actions it needs, under its own credentials.",
      },
      {
        title: "Monitoring",
        body: "Failed syncs and unusual usage raise an alert instead of failing quietly.",
      },
      {
        title: "Documentation",
        body: "Runbooks and diagrams your IT team can maintain without us.",
      },
    ],
    steps: [
      { title: "Inventory", body: "The systems, data owners and access rules involved." },
      {
        title: "Design",
        body: "The integration approach, security model and acceptance checklist, in writing.",
      },
      {
        title: "Build one path first",
        body: "A single end-to-end connection proves the approach before the rest.",
      },
      {
        title: "Extend and hand over",
        body: "Remaining connections, monitoring and documentation.",
      },
    ],
    examples: [
      {
        who: "Small business",
        text: "Bookings, payments and email finally share one customer record.",
      },
      {
        who: "Mid-market",
        text: "An AI assistant reads the ERP and CRM through a controlled access layer.",
      },
      {
        who: "Enterprise",
        text: "Agents reach legacy systems through a reviewed gateway with full logging.",
      },
    ],
    timeline: PLAN_TIMELINE,
    startsWith: "One end-to-end connection between two systems",
    faq: [
      {
        q: "Can AI work with our older, legacy systems?",
        a: "In most cases, yes. Where a system has no modern API we build a controlled access layer around it, so AI can read and write through a single reviewed path.",
      },
      {
        q: "Do you work with our IT team?",
        a: "Yes. We work alongside in-house IT and product teams, document what we build, and hand over access and runbooks at the end.",
      },
      {
        q: "Which systems can you integrate?",
        a: "Any system that exposes an API, a database or structured exports. That covers most CRM, ERP, accounting, help desk and e-commerce platforms. We confirm the specifics in the fit check.",
      },
    ],
    related: ["workflow-automation", "data-knowledge-systems", "internal-ai-assistants"],
  },
  {
    slug: "custom-ai-product-development",
    path: "/solutions/custom-ai-product-development",
    name: "AI Products & Custom Software",
    stage: "Build",
    icon: "box",
    intent: "custom-ai-product",
    metaTitle: "Custom AI Product & Software Development | Cyryx Labs",
    metaDescription:
      "From idea to a working AI product or MVP: a two-week discovery sprint, then a build in 8 to 12 weeks. You own the code.",
    serviceType: "Custom AI software development",
    h1: "Turn the idea into a product people can use.",
    answer:
      "We design and build AI-powered products, MVPs and custom software for companies that want to own what they run. A two-week discovery sprint defines the product, the architecture and the acceptance checklist. The build then takes 8 to 12 weeks, and at final payment you own the code, content and data.",
    cardPain: "A product idea with no team to build it",
    cardLine:
      "Your product scoped in two weeks, then built in 8 to 12, with the code in your hands.",
    problems: [
      "You know what the product should do, but hiring a full team to find out is too slow and too costly.",
      "Off-the-shelf tools get you most of the way, then stop short of how your business works.",
      "A prototype exists, but it is not something customers or auditors could rely on.",
    ],
    deliver: [
      {
        title: "Discovery sprint",
        body: "Two weeks to define users, scope, architecture, risks and a fixed quote for the build.",
      },
      {
        title: "A working product",
        body: "Web application, internal tool or customer-facing product, built in tested increments.",
      },
      {
        title: "AI that fits the job",
        body: "Models chosen per task, with evaluation, fallbacks and cost limits built in.",
      },
      {
        title: "Launch-ready quality",
        body: "Authentication, access control, logging, automated tests and deployment.",
      },
      {
        title: "Full handover",
        body: "Source code, infrastructure access and documentation. No lock-in.",
      },
    ],
    steps: [
      {
        title: "Discovery sprint",
        body: "Two weeks. Ends with a scope, a design direction and a fixed quote.",
      },
      {
        title: "Build in increments",
        body: "A working version early, then steady releases you can test.",
      },
      {
        title: "Validate",
        body: "The product is checked against the acceptance checklist, line by line.",
      },
      {
        title: "Launch and support",
        body: "Released, documented and, if you want, maintained by us.",
      },
    ],
    examples: [
      { who: "Founder", text: "An MVP ready for first customers and investor demos." },
      {
        who: "Mid-market",
        text: "A client portal with an AI assistant that works from account data.",
      },
      {
        who: "Enterprise",
        text: "An internal product that replaces a spreadsheet-run process across teams.",
      },
    ],
    timeline: "2-week discovery, then 8–12 weeks",
    startsWith: "A two-week discovery sprint",
    faq: [
      {
        q: "How long does it take to build an MVP?",
        a: "An MVP takes eight to twelve weeks after a two-week discovery sprint. The sprint fixes the scope, so the timeline is known before the build starts.",
      },
      {
        q: "Who owns the code?",
        a: "You do. At final payment you own the code, content and data we create for you.",
      },
      {
        q: "Can you start from a prototype we already have?",
        a: "Yes. The discovery sprint reviews what exists, keeps what is sound and says plainly what has to be rebuilt before customers can rely on it.",
      },
    ],
    related: ["ai-integrations", "internal-ai-assistants", "managed-operations"],
  },
  {
    slug: "data-knowledge-systems",
    path: "/solutions/data-knowledge-systems",
    name: "Data & Knowledge Systems",
    stage: "Build",
    icon: "database",
    intent: "internal-assistant",
    metaTitle: "AI Data Readiness & Knowledge Systems | Cyryx Labs",
    metaDescription:
      "Get your company data ready for AI: clean sources, a searchable knowledge base and access rules, so AI answers from facts instead of guessing.",
    serviceType: "AI data readiness and knowledge systems",
    h1: "Make your company knowledge usable by AI.",
    answer:
      "AI is only as good as the information it can reach. We organize the documents, records and data your company already has into a clean, searchable knowledge system with access rules, so assistants and agents answer from your facts, show their sources and respect who is allowed to see what.",
    cardPain: "Messy, scattered data that makes AI unreliable",
    cardLine: "Your documents and records, cleaned up and searchable, so AI answers from facts.",
    stat: {
      value: "34%",
      text: "of middle market executives name data quality as the top barrier to deploying AI.",
      source: "rsm",
    },
    problems: [
      "The answer exists somewhere in a drive, an inbox or someone's head.",
      "AI tools give confident answers that turn out to be out of date or wrong.",
      "Sensitive files sit next to public ones, so nobody dares connect AI to any of it.",
    ],
    deliver: [
      {
        title: "Source inventory",
        body: "Where knowledge lives, who owns it, what is current and what should be retired.",
      },
      {
        title: "A searchable knowledge base",
        body: "Documents and records prepared so AI can find the right passage and cite it.",
      },
      {
        title: "Access rules",
        body: "AI sees only what the person asking is allowed to see.",
      },
      {
        title: "Quality checks",
        body: "Test questions with known answers, run before launch and after every change.",
      },
      {
        title: "A way to keep it current",
        body: "New and updated documents flow in without a manual rebuild.",
      },
    ],
    steps: [
      {
        title: "Audit the sources",
        body: "What exists, what is trustworthy and what is sensitive.",
      },
      { title: "Design the structure", body: "How content is organized, tagged and permissioned." },
      {
        title: "Build and test",
        body: "The knowledge base is checked against real questions from your team.",
      },
      {
        title: "Connect and maintain",
        body: "Linked to your assistants and agents, with updates automated.",
      },
    ],
    examples: [
      {
        who: "Small business",
        text: "Policies, price lists and procedures in one place staff can ask questions of.",
      },
      {
        who: "Mid-market",
        text: "Sales, support and operations knowledge unified behind role-based access.",
      },
      {
        who: "Enterprise",
        text: "A governed knowledge layer that agents use, with sources and audit logs.",
      },
    ],
    timeline: PLAN_TIMELINE,
    startsWith: "An audit of the sources behind one use case",
    faq: [
      {
        q: "Do we need perfect data before using AI?",
        a: "No. You need the data behind your first use case to be accurate, current and properly permissioned. We start there and extend, rather than cleaning everything first.",
      },
      {
        q: "How do you stop AI from making things up?",
        a: "The assistant answers from your documents and shows the source for each answer. Test questions with known answers are run before launch and after changes, so quality is measured.",
      },
      {
        q: "Can AI respect our access permissions?",
        a: "Yes. Access rules are part of the design, so an assistant only retrieves what the person asking is already allowed to see.",
      },
    ],
    related: ["internal-ai-assistants", "ai-integrations", "ai-governance-cost-control"],
  },
  {
    slug: "ai-governance-cost-control",
    path: "/solutions/ai-governance-cost-control",
    name: "AI Governance & Cost Control",
    stage: "Control",
    icon: "shield",
    intent: "governance-control",
    metaTitle: "AI Governance, Security & Cost Control | Cyryx Labs",
    metaDescription:
      "Clear rules for what AI may read, change and spend in your company: an AI use policy, access controls, approval points, logs and cost limits.",
    serviceType: "AI governance consulting",
    h1: "Use AI without risking clients, data or budget.",
    answer:
      "AI governance is the set of rules and controls that decide what AI may read, change and spend in your company, and who answers for it. We write the policy, put the access controls, approval points and activity logs in place, and add cost limits and reporting, so your teams can use AI with confidence and you can show how it is controlled.",
    cardPain: "Unapproved AI use, data exposure and runaway costs",
    cardLine:
      "Written rules, access controls, approval points and spending limits for every AI system.",
    stat: {
      value: "49%",
      text: "of employees at large companies use AI tools their employer has not approved.",
      source: "blackfog",
    },
    problems: [
      "Staff paste client and company data into public AI tools because nothing better is offered.",
      "AI spending is spread across teams and cards, and nobody sees the total.",
      "A customer, auditor or board member asks how AI is controlled, and there is no written answer.",
    ],
    deliver: [
      {
        title: "AI use policy",
        body: "Plain rules for approved tools, data handling and review that staff can actually follow.",
      },
      {
        title: "Inventory of AI in use",
        body: "What tools and models are running today, approved or not, and what data they touch.",
      },
      {
        title: "Access and approval controls",
        body: "Permissions per system, with human sign-off on actions that carry risk.",
      },
      {
        title: "Activity records",
        body: "A log of what each AI system did, kept in a form you can show an auditor.",
      },
      {
        title: "Cost limits and reporting",
        body: "Budgets and alerts per team, model and workflow, with a monthly summary.",
      },
    ],
    steps: [
      { title: "Find what is running", body: "An inventory of AI tools, data flows and spending." },
      {
        title: "Write the rules",
        body: "Policy, roles and risk levels, agreed with the people who own them.",
      },
      {
        title: "Put controls in place",
        body: "Access, approvals, logging and cost limits on real systems.",
      },
      {
        title: "Review on a schedule",
        body: "A regular check that the rules still match how AI is used.",
      },
    ],
    examples: [
      {
        who: "Small business",
        text: "A one-page AI policy and an approved, private tool for the team.",
      },
      {
        who: "Mid-market",
        text: "A governance baseline that satisfies customer security questionnaires.",
      },
      {
        who: "Enterprise",
        text: "Agent governance with permissions, approvals and audit records per workflow.",
      },
    ],
    timeline: PLAN_TIMELINE,
    startsWith: "An inventory of the AI already in use",
    faq: [
      {
        q: "What is AI governance?",
        a: "AI governance is the set of rules and controls that decide what AI may read, change and spend in a company, who approves its actions and how those actions are recorded.",
      },
      {
        q: "What is shadow AI?",
        a: "Shadow AI is the use of AI tools that the company has not approved. It usually means company or client data is being entered into tools nobody has reviewed.",
      },
      {
        q: "Do you certify compliance?",
        a: "No. We design and implement controls and document them. Certification and legal determinations come from your auditors and counsel.",
      },
    ],
    related: ["ai-strategy-advisory", "internal-ai-assistants", "ai-training-enablement"],
  },
  {
    slug: "digital-web-systems",
    path: "/solutions/digital-web-systems",
    name: "Websites & AI Search Visibility",
    stage: "Build",
    icon: "globe",
    intent: "digital-system",
    metaTitle: "AI-Ready Websites, SEO & GEO Services | Cyryx Labs",
    metaDescription:
      "Websites built to win customers and to be found in Google and AI answers. Technical SEO, structured data and lead capture in 3 to 4 weeks.",
    serviceType: "Website development and generative engine optimization",
    h1: "A website buyers find, in Google and in AI answers.",
    answer:
      "We build websites and web systems that turn visitors into leads and are structured so search engines and AI assistants can read, trust and cite them. That means fast pages, clear answers, structured data, an AI-readable summary of your company and lead capture connected to your CRM. A launch website takes three to four weeks.",
    cardPain: "Being invisible when buyers ask AI for a vendor",
    cardLine: "A fast, clear website that ranks in search, gets cited by AI and captures the lead.",
    stat: {
      value: "51%",
      text: "of software buyers start research in an AI chatbot more often than in Google.",
      source: "g2",
    },
    problems: [
      "Your site looks fine, but it does not bring in calls, bookings or qualified leads.",
      "Buyers ask AI assistants for recommendations, and your company is not in the answer.",
      "Leads arrive by form and wait, because nothing connects the site to your sales process.",
    ],
    deliver: [
      {
        title: "A conversion-focused website",
        body: "Clear offer, clear next step and pages that load fast on a phone.",
      },
      {
        title: "Technical SEO",
        body: "Clean structure, metadata, sitemaps, performance and accessibility done properly.",
      },
      {
        title: "AI search readiness",
        body: "Answer-first content, structured data and an llms.txt file, so AI assistants can read and cite you.",
      },
      {
        title: "Lead capture that connects",
        body: "Forms and an AI assistant that send qualified leads straight to your CRM.",
      },
      {
        title: "Measurement",
        body: "Events for the clicks and forms that matter, so you can see what works.",
      },
    ],
    steps: [
      {
        title: "Position",
        body: "Who you serve, what you offer and the one action you want visitors to take.",
      },
      { title: "Design and write", body: "Structure, copy and design agreed before build." },
      { title: "Build and connect", body: "The site, structured data, forms and CRM connection." },
      {
        title: "Launch and measure",
        body: "Checked against the acceptance checklist, then tracked.",
      },
    ],
    examples: [
      {
        who: "Small business",
        text: "A site that takes bookings and answers common questions at any hour.",
      },
      {
        who: "Mid-market",
        text: "A client portal and a site whose leads arrive already qualified in the CRM.",
      },
      {
        who: "Enterprise",
        text: "A product or division site with structured content for search and AI.",
      },
    ],
    timeline: "3–4 weeks for a launch website",
    startsWith: "A launch website with lead capture",
    faq: [
      {
        q: "What is generative engine optimization (GEO)?",
        a: "Generative engine optimization is the practice of structuring a website so AI assistants such as ChatGPT, Claude, Gemini and Perplexity can read it, trust it and cite it when buyers ask questions.",
      },
      {
        q: "Do you guarantee rankings or traffic?",
        a: "No. We don't guarantee traffic, rankings or revenue. We guarantee what we agreed to build, checked against a written acceptance checklist.",
      },
      {
        q: "How long does a website take?",
        a: "A launch website takes three to four weeks from the written plan. Larger sites and portals are scoped in stages.",
      },
    ],
    related: ["workflow-automation", "internal-ai-assistants", "managed-operations"],
  },
  {
    slug: "ai-training-enablement",
    path: "/solutions/ai-training-enablement",
    name: "AI Training & Enablement",
    stage: "Advise",
    icon: "users",
    intent: "strategy-advisory",
    metaTitle: "AI Training for Teams & Business Owners | Cyryx Labs",
    metaDescription:
      "Hands-on AI training built around your team's real work: practical workshops, safe-use rules and reusable playbooks, in English or Spanish.",
    serviceType: "AI training and enablement",
    h1: "Give your team the skills to use AI well.",
    answer:
      "Most companies have bought AI tools that their people were never shown how to use. Our hands-on workshops are built around your team's real tasks: what to use AI for, how to check its work, what must never be pasted into it, and reusable playbooks for the jobs they do every week.",
    cardPain: "Tools bought, team never trained",
    cardLine:
      "Hands-on workshops on your team's real work, with safe-use rules and playbooks they keep.",
    stat: {
      value: "73%",
      text: "of small business owners say training and implementation support would help them use AI.",
      source: "goldman",
    },
    problems: [
      "A few people use AI every day. Most of the team has barely tried it.",
      "Nobody has told staff what is safe to share with an AI tool.",
      "Generic online courses do not match the work your people actually do.",
    ],
    deliver: [
      {
        title: "Workshops on real work",
        body: "Sessions built from your team's actual tasks, documents and tools.",
      },
      {
        title: "Role playbooks",
        body: "Tested prompts and step-by-step routines for sales, support, operations and management.",
      },
      {
        title: "Safe-use rules",
        body: "What may and may not go into AI tools, in one page everyone can remember.",
      },
      {
        title: "A fractional AI lead",
        body: "A few days a month of ongoing guidance, for companies not ready to hire one.",
      },
    ],
    steps: [
      { title: "Learn how you work", body: "A short review of roles, tools and current AI use." },
      { title: "Prepare the material", body: "Exercises and playbooks made from your own work." },
      { title: "Run the workshop", body: "Hands-on, in person or remote, in English or Spanish." },
      { title: "Follow up", body: "A check-in to answer questions and refine the playbooks." },
    ],
    examples: [
      {
        who: "Small business",
        text: "A half-day workshop that gets the whole team using AI on real tasks.",
      },
      { who: "Mid-market", text: "Role-based training for sales, support and operations leads." },
      {
        who: "Enterprise",
        text: "Enablement that goes out together with a new policy and approved tools.",
      },
    ],
    timeline: PLAN_TIMELINE,
    startsWith: "One hands-on workshop for one team",
    faq: [
      {
        q: "Is the training generic or specific to our company?",
        a: "Specific. Exercises and playbooks are built from your team's real tasks, documents and tools, so people leave able to use AI on the work they do every week.",
      },
      {
        q: "Do you train in Spanish?",
        a: "Yes. We serve companies across the United States and Latin America, in English and Spanish.",
      },
      {
        q: "What is a fractional AI lead?",
        a: "A fractional AI lead is an experienced person who guides your AI decisions for a few days a month, instead of a full-time hire.",
      },
    ],
    related: ["ai-strategy-advisory", "ai-governance-cost-control", "workflow-automation"],
  },
  {
    slug: "managed-operations",
    path: "/managed-operations",
    name: "Managed AI Operations",
    stage: "Operate",
    icon: "activity",
    intent: "managed-operations",
    metaTitle: "Managed AI & Website Operations | Cyryx Labs",
    metaDescription:
      "Keep your website, automations and AI systems running after launch: hosting, monitoring, fixes, small improvements and a short monthly report.",
    serviceType: "Managed AI operations",
    h1: "Keep it running, and improving, after launch.",
    answer:
      "Managed operations is ongoing care for the websites, automations and AI systems you depend on. We host and monitor them, fix what breaks, watch quality and cost, make small improvements and send a short report every month, under a written scope that says exactly what is covered.",
    cardPain: "Systems that quietly degrade after launch",
    cardLine: "Monitoring, fixes, small improvements and a short report every month.",
    problems: [
      "The automation worked at launch. Nobody noticed when it stopped.",
      "AI costs creep up month after month with no one watching.",
      "Your team has no time to maintain what was built, and no one else knows how.",
    ],
    deliver: [
      {
        title: "Hosting and updates",
        body: "Security patches, backups and dependency updates handled for you.",
      },
      {
        title: "Monitoring",
        body: "Uptime, failed runs, answer quality and model costs, with alerts.",
      },
      {
        title: "Fixes",
        body: "Problems inside the agreed scope are diagnosed and corrected.",
      },
      {
        title: "Small improvements",
        body: "A monthly allowance for adjustments and additions.",
      },
      {
        title: "A monthly report",
        body: "What ran, what broke, what it cost and what we recommend next.",
      },
    ],
    steps: [
      {
        title: "Agree the scope",
        body: "Which systems are covered and what is included, in writing.",
      },
      { title: "Take over", body: "Access, documentation and monitoring are set up." },
      {
        title: "Run and report",
        body: "Monitoring, fixes and improvements, with a report every month.",
      },
      { title: "Review", body: "A regular check that the coverage still matches what you need." },
    ],
    examples: [
      { who: "Small business", text: "Website care: hosting, security, updates and small edits." },
      {
        who: "Mid-market",
        text: "Automations and agents monitored for failures, quality and cost.",
      },
      {
        who: "Enterprise",
        text: "An operating agreement with defined responsibilities and review cadence.",
      },
    ],
    timeline: "Monthly",
    startsWith: "Care for one website or one system",
    faq: [
      {
        q: "Can you maintain something another team built?",
        a: "Often, yes. We review the system first and tell you plainly what we can take responsibility for and what would need work before we do.",
      },
      {
        q: "What is included each month?",
        a: "Hosting, monitoring, fixes and small improvements within a written scope, plus a short report. Larger changes are quoted separately.",
      },
      {
        q: "Can we take operations back in-house later?",
        a: "Yes. You own the code, content and data, and we hand over access and runbooks whenever you decide to.",
      },
    ],
    related: ["workflow-automation", "internal-ai-assistants", "digital-web-systems"],
  },
];

export const SERVICE_BY_SLUG: Readonly<Record<string, Service>> = Object.fromEntries(
  SERVICES.map((service) => [service.slug, service]),
);

export function getService(slug: string): Service {
  const service = SERVICE_BY_SLUG[slug];
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service;
}
