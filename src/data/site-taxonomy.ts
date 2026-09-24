export type OperatingLifecycleStage = "Advise" | "Build" | "Control" | "Operate";

export type PublicContentKind = "Product" | "Solution" | "Client work" | "Applied Research";

export type EvidenceState = "verified" | "qualified" | "withheld";

export type PublicContentDefinition = {
  readonly kind: PublicContentKind;
  readonly definition: string;
  readonly publicationRule: string;
};

export const OPERATING_LIFECYCLE = [
  {
    n: "01",
    name: "Advise",
    promise: "Qualify the opportunity before committing capital or operational trust.",
    receives: ["Opportunity assessment", "Architecture direction", "Prioritized roadmap"],
    href: "/solutions/ai-strategy-advisory",
    cta: "Explore advisory",
  },
  {
    n: "02",
    name: "Build",
    promise: "Engineer the capability around real workflows, systems, and acceptance criteria.",
    receives: ["Working system", "Acceptance evidence", "Operational documentation"],
    href: "/solutions",
    cta: "Explore build capabilities",
  },
  {
    n: "03",
    name: "Control",
    promise: "Define authority, evaluation, evidence, and cost boundaries before scale.",
    receives: ["Control requirements", "Review boundaries", "Change and escalation path"],
    href: "/solutions/ai-governance-cost-control",
    cta: "Explore control",
  },
  {
    n: "04",
    name: "Operate",
    promise: "Maintain selected systems under explicit responsibilities and review cadence.",
    receives: ["Defined coverage", "Operating cadence", "Transition path"],
    href: "/managed-operations",
    cta: "Explore operations",
  },
] as const satisfies readonly {
  n: string;
  name: OperatingLifecycleStage;
  promise: string;
  receives: readonly string[];
  href: string;
  cta: string;
}[];


export const PUBLIC_CONTENT_DEFINITIONS: readonly PublicContentDefinition[] = [
  {
    kind: "Product",
    definition: "Cyryx-owned software with an explicit maturity state.",
    publicationRule: "Describe only behavior and maturity supported by current product evidence.",
  },
  {
    kind: "Solution",
    definition: "A repeatable engagement or operating capability shaped to a written scope.",
    publicationRule: "Do not present a solution as a client-owned product or operating system.",
  },
  {
    kind: "Client work",
    definition: "Work performed for a named client under a specific engagement.",
    publicationRule: "Withhold unless evidence and disclosure permission are approved.",
  },
  {
    kind: "Applied Research",
    definition: "A publication, protocol, evaluation, or research direction with a stated record.",
    publicationRule:
      "Keep publication, implementation, conformance, certification, and client outcomes separate.",
  },
];


/**
 * AEXOS — the Cyryx product shown on the public site.
 * Every fact below was verified on 2026-09-24 against the published npm
 * package (@aexos/core) and the AEXOS product brief. Pro/Team pricing is not
 * published: it is still a recommendation being validated with launch partners.
 */
export const AEXOS_PRODUCT = {
  name: "AEXOS",
  fullName: "Agentic eXecution & Orchestration System",
  kind: "Product" as const,
  identity: "Governed execution for AI-assisted software delivery",
  maturity: "Core available · Pro in beta",
  description:
    "A CLI-first system that installs roles, procedures, quality gates and an audit trail into a software project, so AI coding agents work from task contracts instead of loose prompts.",
  focus: [
    "Task contracts with inputs, outputs and completion checklists",
    "Quality gates that stop work when critical checks fail",
    "Story files and QA verdicts as the record of what shipped",
  ],
  npmPackage: "@aexos/core",
  npmUrl: "https://www.npmjs.com/package/@aexos/core",
  productSiteUrl: "https://aexos.cyryxlabs.com/",
  installCommand: "npx @aexos/core init my-project",
  existingProjectCommand: "npx @aexos/core install",
  runtime: "Node.js 18+",
  // Named hosts are limited to non-competitor environments (see .quality/forbidden-terms.json).
  hosts: ["Claude", "Codex", "Gemini"],
} as const;
