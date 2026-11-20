/**
 * US market evidence used on service pages (claims check 2026-11-17).
 *
 * Every figure is a third-party survey result, quoted with its publisher and
 * linked to the publisher's own page, and was found on that page on
 * 2026-11-17. Figures that could not be found on the cited page were removed
 * (founder decision 2026-11-17). None of them is a Cyryx Labs result. Update
 * the figure, the source and MARKET_REVIEWED together.
 */
export const MARKET_REVIEWED = "2026-11-17";

export type Source = {
  readonly publisher: string;
  readonly title: string;
  readonly detail: string;
  readonly url: string;
};

export const SOURCES = {
  goldman: {
    publisher: "Goldman Sachs",
    title: "10,000 Small Businesses Voices survey",
    detail: "1,256 US small business owners, Jan 27 – Feb 4, 2026",
    url: "https://www.goldmansachs.com/pressroom/press-releases/2026/small-businesses-embrace-ai-but-need-training-and-support-to-fully-harness-it",
  },
  rsm: {
    publisher: "RSM US",
    title: "Middle Market AI Survey 2026",
    detail: "1,030 middle market executives (827 US), March 2026",
    url: "https://rsmus.com/insights/services/digital-transformation/rsm-middle-market-ai-survey.html",
  },
  deloitte: {
    publisher: "Deloitte",
    title: "State of AI in the Enterprise 2026",
    detail: "3,235 business and IT leaders in 24 countries",
    url: "https://www.deloitte.com/us/en/about/press-room/state-of-ai-report-2026.html",
  },
  blackfog: {
    publisher: "BlackFog",
    title: "Shadow AI research",
    detail: "2,000 employees at US and UK companies with 500+ staff, published Jan 2026",
    url: "https://www.blackfog.com/blackfog-research-shadow-ai-threat-grows/",
  },
} as const satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;

/** Adoption is high; AI built into core work is low. Verified figures only. */
export const ADOPTION_GAP = [
  {
    id: "small",
    segment: "Small business owners",
    uses: 76,
    usesLabel: "use AI",
    works: 14,
    worksLabel: "say it is fully embedded in their core operations",
    source: "goldman" as SourceId,
  },
  {
    id: "mid",
    segment: "Middle market executives surveyed",
    uses: 86,
    usesLabel: "have AI in operations",
    works: 36,
    worksLabel: "have it embedded across core processes",
    source: "rsm" as SourceId,
  },
] as const;

export type Segment = {
  readonly id: "small" | "growing" | "enterprise";
  readonly name: string;
  readonly size: string;
  readonly headline: string;
  readonly pains: readonly {
    readonly value: string;
    readonly text: string;
    readonly source: SourceId;
  }[];
  readonly deliver: readonly string[];
  readonly startsWith: string;
  /** No fixed timelines are published (founder decision 2026-11-17). */
  readonly timeline: string;
  readonly intent: "workflow-automation" | "internal-assistant" | "strategy-advisory";
};

export const PLAN_TIMELINE = "Timeline set in the written plan.";

export const SEGMENTS: readonly Segment[] = [
  {
    id: "small",
    name: "Small business",
    size: "1–50 people",
    headline: "You have the tools. You need them to do the work.",
    pains: [
      {
        value: "73%",
        text: "of small business owners say they would benefit from more access to training and implementation resources.",
        source: "goldman",
      },
    ],
    deliver: [
      "One automation that ends a copy-and-paste job for good",
      "An AI assistant that answers from your own documents",
      "A website that brings in calls and bookings, and shows up in AI search",
      "Hands-on training so your team actually uses it",
    ],
    startsWith: "A free fit check, then one automation or a website",
    timeline: PLAN_TIMELINE,
    intent: "workflow-automation",
  },
  {
    id: "growing",
    name: "Mid-market",
    size: "50–500 people",
    headline: "Your pilots worked. Scaling them is the hard part.",
    pains: [
      {
        value: "34%",
        text: "of middle market executives cite data quality as a top barrier to deploying AI.",
        source: "rsm",
      },
    ],
    deliver: [
      "AI connected to your CRM, ERP and internal tools, not sitting beside them",
      "Clean, searchable company knowledge that AI can use safely",
      "An AI agent on one process your team runs every day",
      "A measured baseline, so the return is visible before you scale",
    ],
    startsWith: "An AI opportunity assessment or an AI agent pilot",
    timeline: PLAN_TIMELINE,
    intent: "internal-assistant",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    size: "500+ people",
    headline: "Agents are coming. Governance has to arrive first.",
    pains: [
      {
        value: "21%",
        text: "of companies planning to deploy AI agents have a mature model for governing them.",
        source: "deloitte",
      },
      {
        value: "49%",
        text: "of employees at US and UK companies with 500+ staff use AI tools their employer has not approved.",
        source: "blackfog",
      },
    ],
    deliver: [
      "A scoped pilot your IT, security and legal teams can review",
      "Access, approvals, logging and spending limits defined in the scope",
      "Cost reporting per team, model and workflow, where the scope includes it",
    ],
    startsWith: "A discovery sprint or an AI roadmap with governance",
    timeline: PLAN_TIMELINE,
    intent: "strategy-advisory",
  },
];
