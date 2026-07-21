export type SolutionKey =
  "advisory" | "digital" | "automation" | "assistants" | "products" | "governance" | "operations";

export type SolutionContent = {
  slug: string;
  eyebrow: string;
  title: string;
  promise: string;
  problem: string;
  outcome: string;
  questions: string[];
  approach: { title: string; copy: string }[];
  deliverables: string[];
  dependencies: string[];
  path: string[];
  notFor: string[];
  related: SolutionKey[];
};

export const solutions: Record<SolutionKey, SolutionContent> = {
  advisory: {
    slug: "ai-strategy-advisory",
    eyebrow: "AI Strategy & Advisory",
    title: "Make the consequential decisions before you automate.",
    promise:
      "Cyryx helps leadership teams assess readiness, find valuable opportunities, choose an architecture, and establish a credible implementation roadmap.",
    problem:
      "Organizations often begin with a provider, model, or isolated pilot before agreeing on the workflow, authority boundaries, data requirements, or operating owner.",
    outcome:
      "A decision-ready direction that connects business priorities, technical reality, risk, and an executable next step.",
    questions: [
      "Where can AI or automation create meaningful operating leverage?",
      "Which workflows are ready, and which need redesign first?",
      "What should be built, bought, integrated, or deferred?",
      "What authority, evidence, and evaluation does the system require?",
    ],
    approach: [
      {
        title: "Diagnose",
        copy: "Map the business problem, workflow, stakeholders, data, constraints, and current technology.",
      },
      {
        title: "Evaluate",
        copy: "Compare opportunities by value, feasibility, operating risk, and organizational readiness.",
      },
      {
        title: "Architect",
        copy: "Define a provider-portable system direction, control boundaries, and implementation sequence.",
      },
      {
        title: "Mobilize",
        copy: "Translate the recommendation into a prioritized roadmap, acceptance criteria, and ownership plan.",
      },
    ],
    deliverables: [
      "Opportunity assessment",
      "Workflow discovery",
      "AI readiness review",
      "Architecture recommendation",
      "Prioritized roadmap",
      "Governance requirements",
      "Provider evaluation",
      "Technical decision memo",
    ],
    dependencies: [
      "Access to relevant business and technical stakeholders",
      "Representative workflow and system documentation",
      "Clarity on data, security, and procurement constraints",
      "Leadership participation in decision reviews",
    ],
    path: [
      "Focused working session",
      "Discovery and evidence review",
      "Decision workshops",
      "Recommendation and roadmap",
      "Optional implementation support",
    ],
    notFor: [
      "A request for legal or regulatory certification",
      "A predetermined tool purchase seeking retrospective validation",
      "A strategy exercise without access to operating stakeholders",
    ],
    related: ["automation", "governance", "products"],
  },
  digital: {
    slug: "digital-web-systems",
    eyebrow: "Digital & Web Systems",
    title: "Turn your digital presence into an operating asset.",
    promise:
      "Cyryx designs and engineers premium corporate websites, high-performance landing pages, web applications, and digital lead systems around measurable user and business needs.",
    problem:
      "A website can look polished while remaining slow, inaccessible, hard to maintain, disconnected from commercial workflows, or unclear about what the company actually does.",
    outcome:
      "A distinctive, performant digital system with a clear narrative, intentional conversion paths, maintainable architecture, and a documented ownership model.",
    questions: [
      "What must visitors understand in the first minute?",
      "Which journeys create commercial value?",
      "What evidence can the experience show honestly?",
      "How will content, analytics, and integrations be operated after launch?",
    ],
    approach: [
      {
        title: "Position",
        copy: "Clarify audiences, narrative, proof, information architecture, and conversion priorities.",
      },
      {
        title: "Design",
        copy: "Create a responsive design system, editorial layouts, interaction models, and accessible prototypes.",
      },
      {
        title: "Engineer",
        copy: "Build the frontend, backend functions, integrations, analytics, and content architecture.",
      },
      {
        title: "Validate",
        copy: "Test accessibility, responsive behavior, performance, SEO, forms, links, and operational handover.",
      },
    ],
    deliverables: [
      "Digital strategy",
      "Information architecture",
      "UX/UI system",
      "Responsive implementation",
      "CMS or content model where needed",
      "Lead and analytics integration",
      "Accessibility and performance QA",
      "Launch and handover plan",
    ],
    dependencies: [
      "Approved brand assets and factual company content",
      "Access to domains, analytics, and selected platforms",
      "Timely review from business owners",
      "Integration APIs and credentials where applicable",
    ],
    path: [
      "Narrative and conversion discovery",
      "Experience architecture",
      "Design direction",
      "Incremental build",
      "Quality gate and launch or handover",
    ],
    notFor: [
      "Fabricated social proof or performance claims",
      "A purely cosmetic reskin with unresolved positioning",
      "Guaranteed third-party integration behavior without API access",
    ],
    related: ["advisory", "automation", "operations"],
  },
  automation: {
    slug: "workflow-automation",
    eyebrow: "Workflow Automation",
    title: "Automate the flow of work without losing control of it.",
    promise:
      "Cyryx maps and redesigns operational workflows, then connects the right software, AI, approvals, and exception paths.",
    problem:
      "Manual work often spans inboxes, documents, spreadsheets, business systems, and undocumented decisions. Automating the visible steps without understanding the workflow can accelerate errors.",
    outcome:
      "A clearer operating flow with appropriate automation, explicit human decisions, observable exceptions, and ownership for ongoing maintenance.",
    questions: [
      "Where does work wait or get re-entered?",
      "Which decisions require human authority?",
      "What happens when data is missing or a provider fails?",
      "How will teams monitor and improve the workflow?",
    ],
    approach: [
      {
        title: "Observe",
        copy: "Follow the real workflow across people, systems, data, exceptions, and workarounds.",
      },
      {
        title: "Redesign",
        copy: "Remove unnecessary steps and define the target flow before selecting automation.",
      },
      {
        title: "Integrate",
        copy: "Connect approved systems using APIs, event flows, deterministic logic, and AI where useful.",
      },
      {
        title: "Operationalize",
        copy: "Add logging, alerts, review points, runbooks, and a path for change.",
      },
    ],
    deliverables: [
      "Current-state workflow map",
      "Target-state service blueprint",
      "Automation and integration architecture",
      "Approval and exception model",
      "Implemented workflow",
      "Observability and runbook",
      "Evaluation and acceptance results",
    ],
    dependencies: [
      "Access to workflow participants",
      "Supported APIs and system permissions",
      "Representative data and exception cases",
      "Named owners for business decisions",
    ],
    path: [
      "Workflow observation",
      "Target-state design",
      "Technical spike",
      "Incremental implementation",
      "User validation and operating handover",
    ],
    notFor: [
      "A broken process that leadership will not redesign",
      "High-consequence automation without an authority owner",
      "Integrations whose providers do not offer sufficient access",
    ],
    related: ["advisory", "assistants", "governance"],
  },
  assistants: {
    slug: "internal-ai-assistants",
    eyebrow: "Internal AI Assistants",
    title: "Give teams useful intelligence inside defined boundaries.",
    promise:
      "Cyryx builds internal assistants that can support knowledge access, document work, routing, analysis, and approved tool use according to available data and permissions.",
    problem:
      "Generic chat access rarely understands an organization’s sources, vocabulary, permissions, or operating procedures—and confident answers can obscure weak evidence.",
    outcome:
      "An assistant designed around a specific job, approved knowledge, transparent source use, appropriate authority, and measurable evaluation criteria.",
    questions: [
      "Which user and task is the assistant for?",
      "What sources are authoritative?",
      "What may the assistant read, recommend, or execute?",
      "How will quality, refusal, and cost be evaluated?",
    ],
    approach: [
      {
        title: "Define the job",
        copy: "Choose a bounded user need and translate it into testable tasks and non-goals.",
      },
      {
        title: "Ground the system",
        copy: "Prepare approved knowledge, retrieval, permissions, and source presentation.",
      },
      {
        title: "Control authority",
        copy: "Separate answers, recommendations, drafts, and tool actions according to risk.",
      },
      {
        title: "Evaluate",
        copy: "Test representative tasks, failure cases, source quality, latency, and cost before expansion.",
      },
    ],
    deliverables: [
      "Assistant task definition",
      "Knowledge and retrieval architecture",
      "Permission model",
      "Interface and tool integrations",
      "Evaluation dataset and rubric",
      "Usage and cost instrumentation",
      "Operating guidance",
    ],
    dependencies: [
      "Approved source material",
      "Identity and permission requirements",
      "Supported provider and system access",
      "Representative user tasks and reviewers",
    ],
    path: [
      "Task and source discovery",
      "Grounded prototype",
      "Evaluation and permission design",
      "Production implementation",
      "Measured rollout and iteration",
    ],
    notFor: [
      "An unrestricted assistant expected to know undocumented facts",
      "Autonomous high-consequence decisions",
      "Use cases without source or reviewer access",
    ],
    related: ["automation", "governance", "operations"],
  },
  products: {
    slug: "custom-ai-products",
    eyebrow: "Custom AI Product Development",
    title: "Build an AI product around a user and operating reality.",
    promise:
      "Cyryx combines product strategy, UX, software engineering, model integration, and evaluation to build differentiated AI-enabled products.",
    problem:
      "AI prototypes often prove that a model can respond, but not that a product can solve a repeatable user problem, handle failure, protect data, or sustain acceptable unit economics.",
    outcome:
      "A testable product with a defined user, system architecture, quality model, operational boundaries, and a path from validation to continued development.",
    questions: [
      "What job is the product replacing or improving?",
      "Where does proprietary value live beyond the model?",
      "How will quality and failure be visible?",
      "What cost, latency, and permission envelope is acceptable?",
    ],
    approach: [
      {
        title: "Frame",
        copy: "Define the user, job, product thesis, non-goals, and validation evidence.",
      },
      {
        title: "Prototype",
        copy: "Test the riskiest experience, model, data, and integration assumptions early.",
      },
      {
        title: "Engineer",
        copy: "Build the application, service architecture, provider layer, controls, and observability.",
      },
      {
        title: "Validate",
        copy: "Evaluate product behavior with representative tasks and release criteria.",
      },
    ],
    deliverables: [
      "Product brief and roadmap",
      "UX and interaction system",
      "Application architecture",
      "Model and provider abstraction",
      "Frontend and backend implementation",
      "Evaluation harness",
      "Release and ownership plan",
    ],
    dependencies: [
      "Access to target users or domain reviewers",
      "Representative data and workflows",
      "Provider and integration access",
      "Product owner participation",
    ],
    path: [
      "Product framing",
      "Risk-reduction prototype",
      "Architecture and design",
      "Incremental product build",
      "Evaluation and release decision",
    ],
    notFor: [
      "A thin interface with no differentiated workflow",
      "Claims that depend on unverified model behavior",
      "A fixed launch promise before technical discovery",
    ],
    related: ["advisory", "digital", "governance"],
  },
  governance: {
    slug: "ai-governance-cost-control",
    eyebrow: "AI Governance & Cost Control",
    title: "Design authority, evidence, and cost into the system.",
    promise:
      "Cyryx helps teams translate policy intent into system architecture: who can do what, where review is required, what evidence is retained, and how usage becomes visible.",
    problem:
      "Governance expressed only as policy leaves implementation teams to interpret authority, review, logging, evaluation, and spending boundaries inside each product or workflow.",
    outcome:
      "A practical control architecture aligned to the system’s actual authority, selected infrastructure, available evidence, and operating owner.",
    questions: [
      "Which actions carry meaningful consequence?",
      "Where must a human approve, review, or be informed?",
      "What evidence can the infrastructure retain?",
      "How will quality, usage, and provider cost be monitored?",
    ],
    approach: [
      {
        title: "Classify authority",
        copy: "Map what the system can read, generate, recommend, change, or execute.",
      },
      {
        title: "Define boundaries",
        copy: "Place approvals, permissions, and escalation according to consequence and risk.",
      },
      {
        title: "Instrument evidence",
        copy: "Design trace, evaluation, usage, and cost signals where supported.",
      },
      {
        title: "Assign ownership",
        copy: "Define review cadence, exceptions, change control, and operating responsibilities.",
      },
    ],
    deliverables: [
      "Authority and action map",
      "Approval boundary design",
      "Permission requirements",
      "Trace and evidence model",
      "Evaluation framework",
      "Usage and cost dashboard requirements",
      "Operating and escalation model",
    ],
    dependencies: [
      "Clear system scope and authority",
      "Security and data stakeholder participation",
      "Infrastructure logging and identity capabilities",
      "Named owners for exceptions and review",
    ],
    path: [
      "System and risk discovery",
      "Authority mapping",
      "Control architecture",
      "Instrumentation implementation",
      "Operating review",
    ],
    notFor: [
      "Legal or regulatory certification",
      "A universal control framework detached from a system",
      "Claims of immutable or complete evidence without infrastructure proof",
    ],
    related: ["advisory", "assistants", "operations"],
  },
  operations: {
    slug: "managed-operations",
    eyebrow: "Managed Operations",
    title: "Keep delivered systems owned, observed, and improving.",
    promise:
      "When defined by the engagement, Cyryx can continue to monitor, maintain, optimize, and operate digital and AI systems after delivery.",
    problem:
      "A technically complete system can still decay when provider behavior changes, integrations fail, content ages, costs drift, or no one owns evaluation and maintenance.",
    outcome:
      "A defined operating arrangement covering responsibilities, monitoring, maintenance, reporting, escalation, optimization, and eventual transition.",
    questions: [
      "Which components require continued ownership?",
      "What events should trigger review or escalation?",
      "What maintenance and reporting cadence is appropriate?",
      "How can the system transition to another owner later?",
    ],
    approach: [
      {
        title: "Set boundaries",
        copy: "Define the systems, responsibilities, exclusions, access, and service expectations.",
      },
      {
        title: "Observe",
        copy: "Monitor agreed health, usage, quality, cost, and integration signals.",
      },
      {
        title: "Maintain",
        copy: "Address planned maintenance and approved corrective work within the operating model.",
      },
      {
        title: "Improve or transition",
        copy: "Prioritize optimizations and preserve a documented handover path.",
      },
    ],
    deliverables: [
      "Responsibility matrix",
      "Operating runbook",
      "Monitoring and reporting model",
      "Maintenance plan",
      "Escalation path",
      "Optimization backlog",
      "Transition and handover package",
    ],
    dependencies: [
      "Appropriate system and provider access",
      "Defined client decision owners",
      "Agreed monitoring coverage",
      "Commercial and response terms documented per engagement",
    ],
    path: [
      "Operational assessment",
      "Responsibility design",
      "Transition into service",
      "Recurring review and maintenance",
      "Optimization or handover",
    ],
    notFor: [
      "Universal 24/7 coverage without an explicit agreement",
      "Unbounded support for systems outside scope",
      "Guaranteed provider uptime or response",
    ],
    related: ["digital", "automation", "governance"],
  },
};

export const solutionKeys = Object.keys(solutions) as SolutionKey[];
