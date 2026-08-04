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

export const TRANSVERSAL_CAPABILITIES = [
  {
    name: "Products",
    description:
      "Cyryx-owned software, separate from client delivery, with an explicit maturity state. MAAX Studio is in active development.",
    href: "/products",
  },
  {
    name: "Applied Research",
    description:
      "Published records and qualified research directions, separate from client delivery, that inform decisions without implying implementation or certification.",
    href: "/research",
  },
] as const;

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

export const MAAX_STUDIO_PRODUCT = {
  name: "MAAX Studio",
  kind: "Product" as const,
  maturity: "In active development",
  identity: "Agentic software execution environment",
  description:
    "A command environment intended to coordinate software missions, agents, project context, review, and controlled execution.",
} as const;
