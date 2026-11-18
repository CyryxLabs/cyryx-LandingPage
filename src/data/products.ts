import { AEXOS_PRODUCT } from "@/data/site-taxonomy";

/**
 * Cyryx-owned products shown on the public site (founder decision 2026-11-17:
 * Onyx, AEXOS and Orbit).
 *
 * Stages are the real ones. Onyx (onyx.cyryxlabs.com) is a free beta for
 * Windows 10 and 11; AEXOS Core is free on npm; Orbit is in development and is
 * shown by name and status only: no description, features, link, CTA or form
 * until the founder approves one. No prices are published.
 */
export type PublishedProduct = {
  readonly id: "onyx" | "aexos";
  readonly published: true;
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

/** A product listed by name and status only. Renderers must not add a link or copy. */
export type InDevelopmentProduct = {
  readonly id: "orbit";
  readonly published: false;
  readonly name: string;
  readonly stage: "In development";
};

export type Product = PublishedProduct | InDevelopmentProduct;

export const ONYX: PublishedProduct = {
  id: "onyx",
  published: true,
  name: "Onyx",
  category: "AI coworker for Windows",
  stage: "Free beta · Windows 10 and 11",
  tagline: "The AI coworker that lives on your PC.",
  summary:
    "Onyx talks with you in real time, works your inbox, does the research, operates your apps and remembers everything in a vault on your own PC. Outside your machine, it acts on your word. It runs on AI provider keys you supply.",
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
};

export const AEXOS: PublishedProduct = {
  id: "aexos",
  published: true,
  name: AEXOS_PRODUCT.name,
  category: AEXOS_PRODUCT.category,
  stage: AEXOS_PRODUCT.maturity,
  tagline: "AI agents that work to a method.",
  summary:
    "AEXOS is an agent framework for software projects, for developers who use AI coding tools. It installs specialist AI agents into your project, together with the procedures they follow and the checks they must pass. You talk to one orchestrator; it routes the work.",
  points: [
    "One orchestrator routes each request to the right specialist",
    "Stories carry context from plan to release",
    "Quality gates stop work when a critical check fails",
    `Runs on ${AEXOS_PRODUCT.runtime}`,
  ],
  path: "/products/aexos",
  site: AEXOS_PRODUCT.npmUrl,
  primary: { label: "Explore AEXOS", href: "/products/aexos", external: false },
};

export const ORBIT: InDevelopmentProduct = {
  id: "orbit",
  published: false,
  name: "Orbit",
  stage: "In development",
};

export const PRODUCTS: readonly Product[] = [ONYX, AEXOS, ORBIT];
