import { AEXOS_PRODUCT } from "@/data/site-taxonomy";

/**
 * Cyryx-owned products shown on the public site (founder decision 2026-11-13:
 * Onyx and AEXOS; further products are added when announced).
 *
 * Stages are the real ones. Onyx (onyx.cyryxlabs.com) is a free beta for
 * Windows 10 and 11; AEXOS Core is published on npm. No prices are published.
 */
export type Product = {
  readonly id: "onyx" | "aexos";
  readonly name: string;
  readonly category: string;
  readonly stage: string;
  readonly tagline: string;
  readonly summary: string;
  readonly points: readonly string[];
  readonly path: string;
  readonly site: string;
  readonly primary: { readonly label: string; readonly href: string; readonly external: boolean };
};

export const PRODUCTS: readonly Product[] = [
  {
    id: "onyx",
    name: "Onyx",
    category: "AI coworker for Windows",
    stage: "Free beta · Windows 10 and 11",
    tagline: "The AI coworker that lives on your PC.",
    summary:
      "Onyx talks with you in real time, works your inbox, does the research, operates your apps and remembers everything in a vault you own. Outside your machine, it acts on your word.",
    points: [
      "Live voice in six languages, with eight characters to choose from",
      "A Second Brain in a vault on your own PC",
      "Works your inbox, calendar, research, files and apps",
      "Asks before it acts outside, and logs every action",
    ],
    path: "/products/onyx",
    site: "https://onyx.cyryxlabs.com/",
    primary: {
      label: "Get the free beta",
      href: "https://onyx.cyryxlabs.com/",
      external: true,
    },
  },
  {
    id: "aexos",
    name: AEXOS_PRODUCT.name,
    category: "Agentic orchestration framework",
    stage: "Core edition free on npm",
    tagline: "AI agents that work to a method.",
    summary:
      "AEXOS is a command-line framework that installs specialist AI agents into your software project, together with the procedures they follow and the checks they must pass. You talk to one orchestrator; it routes the work.",
    points: [
      "One orchestrator routes each request to the right specialist",
      "Stories carry context from plan to release",
      "Quality gates stop work when a critical check fails",
      `Runs on ${AEXOS_PRODUCT.runtime}`,
    ],
    path: "/products/aexos",
    site: AEXOS_PRODUCT.productSiteUrl,
    primary: { label: "Explore AEXOS", href: "/products/aexos", external: false },
  },
];

export const ONYX = PRODUCTS[0];
export const AEXOS = PRODUCTS[1];
