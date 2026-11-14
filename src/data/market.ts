/**
 * US market evidence used across the site (reviewed 2026-11-13).
 *
 * Every figure is a third-party survey result, quoted with its publisher and
 * linked to the publisher's own page. None of them is a Cyryx Labs result.
 * Update the figure, the source and REVIEWED together.
 */
export const MARKET_REVIEWED = "2026-11-13";

export type Source = {
  readonly publisher: string;
  readonly title: string;
  readonly detail: string;
  readonly url?: string;
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
  g2: {
    publisher: "G2",
    title: "2026 AI Search Insight Report",
    detail: "survey of B2B software buyers",
  },
  thryv: {
    publisher: "Thryv",
    title: "2026 AI and Small Business Adoption Survey",
    detail: "561 US small and medium business decision-makers, April 2026",
  },
} as const satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;

/** The gap the whole site answers: adoption is high, working integration is low. */
export const ADOPTION_GAP = [
  {
    id: "small",
    segment: "Small businesses",
    uses: 76,
    usesLabel: "use AI",
    works: 14,
    worksLabel: "have it fully built into core operations",
    source: "goldman" as SourceId,
  },
  {
    id: "mid",
    segment: "Mid-market companies",
    uses: 86,
    usesLabel: "have AI in operations",
    works: 36,
    worksLabel: "have it embedded across core processes",
    source: "rsm" as SourceId,
  },
  {
    id: "enterprise",
    segment: "Enterprises",
    uses: 74,
    usesLabel: "plan to deploy AI agents within two years",
    works: 21,
    worksLabel: "have a mature way to govern those agents",
    source: "deloitte" as SourceId,
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
  readonly timeline: string;
  readonly intent: "workflow-automation" | "internal-assistant" | "strategy-advisory";
};

export const SEGMENTS: readonly Segment[] = [
  {
    id: "small",
    name: "Small business",
    size: "1–50 people",
    headline: "You have the tools. You need them to do the work.",
    pains: [
      {
        value: "49%",
        text: "of small businesses using AI say they lack the technical expertise to go further.",
        source: "goldman",
      },
      {
        value: "50%",
        text: "worry about data privacy and security when they use it.",
        source: "goldman",
      },
      {
        value: "73%",
        text: "say training and implementation help would make AI pay off.",
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
    timeline: "2–4 weeks",
    intent: "workflow-automation",
  },
  {
    id: "growing",
    name: "Mid-market",
    size: "50–500 people",
    headline: "Your pilots worked. Scaling them is the hard part.",
    pains: [
      {
        value: "53%",
        text: "of mid-market firms with stalled pilots blame data quality.",
        source: "rsm",
      },
      {
        value: "47%",
        text: "blame integration with the systems they already run.",
        source: "rsm",
      },
      {
        value: "33%",
        text: "cannot show a clear return on what they have spent.",
        source: "rsm",
      },
    ],
    deliver: [
      "AI connected to your CRM, ERP and internal tools, not sitting beside them",
      "Clean, searchable company knowledge that AI can use safely",
      "An AI agent on one process your team runs every day",
      "A measured baseline, so the return is visible before you scale",
    ],
    startsWith: "An AI opportunity assessment or a 30-day AI agent pilot",
    timeline: "30 days to 3 months",
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
        text: "of enterprises have a mature model for governing AI agents.",
        source: "deloitte",
      },
      {
        value: "73%",
        text: "name data privacy and security as their top AI risk.",
        source: "deloitte",
      },
      {
        value: "49%",
        text: "of employees at large companies use AI tools their employer never approved.",
        source: "blackfog",
      },
    ],
    deliver: [
      "A fixed-scope pilot your IT, security and legal teams can review",
      "Written limits on what each agent may read, change and spend",
      "Human approval points and a full activity record",
      "Cost controls and reporting per team, model and workflow",
    ],
    startsWith: "A discovery sprint or an AI roadmap with governance",
    timeline: "4–12 weeks",
    intent: "strategy-advisory",
  },
];

/** How buyers now find vendors. Used on the web and AI search service page. */
export const AI_SEARCH_SHIFT = {
  value: "51%",
  text: "of software buyers now start their research in an AI chatbot more often than in Google.",
  source: "g2" as SourceId,
};
