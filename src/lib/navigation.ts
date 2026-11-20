export type NavigationGroupId = "products" | "solutions" | "demos" | "insights" | "company";

export type NavigationItem = {
  readonly label: string;
  readonly href: string;
  /** Optional in-page anchor on `href` (e.g. a product section on /products). */
  readonly hash?: string;
};

export type NavigationGroup = {
  readonly id: NavigationGroupId;
  readonly label: string;
  /** When set, the group renders as a direct link instead of a menu. */
  readonly href?: string;
  readonly children: readonly NavigationItem[];
};

export type NavigationCTA = {
  readonly label: string;
  readonly href: string;
};

/**
 * Target IA (rebuild v9, 2026-11-17): Products · Solutions · Demos · Insights ·
 * Company, with "Discuss your project" as the persistent action. Specialist
 * service pages stay reachable from Solutions; Orbit has no page yet.
 */
export const PRIMARY_NAVIGATION: readonly NavigationGroup[] = [
  {
    id: "products",
    label: "Products",
    children: [
      { label: "All products", href: "/products" },
      { label: "Onyx", href: "/products/onyx" },
      { label: "AEXOS", href: "/products/aexos" },
    ] as const,
  },
  {
    id: "solutions",
    label: "Solutions",
    children: [
      { label: "All solutions", href: "/solutions" },
      { label: "AI Strategy & Roadmap", href: "/solutions/ai-strategy-advisory" },
      { label: "Workflow Automation", href: "/solutions/workflow-automation" },
      { label: "AI Agents & Assistants", href: "/solutions/internal-ai-assistants" },
      { label: "AI Systems Integration", href: "/solutions/ai-integrations" },
      { label: "AI Products & Custom Software", href: "/solutions/custom-ai-product-development" },
      { label: "Data & Knowledge Systems", href: "/solutions/data-knowledge-systems" },
      { label: "AI Governance & Cost Control", href: "/solutions/ai-governance-cost-control" },
      { label: "Websites & AI Search Visibility", href: "/solutions/digital-web-systems" },
      { label: "AI Training & Enablement", href: "/solutions/ai-training-enablement" },
      { label: "Managed AI Operations", href: "/managed-operations" },
      { label: "How We Work", href: "/engagement-model" },
    ] as const,
  },
  {
    id: "demos",
    label: "Demos",
    href: "/demos",
    children: [{ label: "Workflow demo", href: "/demos" }] as const,
  },
  {
    id: "insights",
    label: "Insights",
    children: [
      { label: "Research", href: "/research" },
      { label: "Answers", href: "/answers" },
    ] as const,
  },
  {
    id: "company",
    label: "Company",
    children: [
      { label: "Company", href: "/company" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Project Brief", href: "/brief" },
    ] as const,
  },
] as const;

export const PRIMARY_NAVIGATION_CTA: NavigationCTA = {
  label: "Discuss your project",
  href: "/start",
} as const;

export function normalizePathname(pathname: string): string {
  let path = pathname.split("?")[0].split("#")[0];
  path = path.replace(/\/+/g, "/");
  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path || "/";
}

export function matchesPathBoundary(pathname: string, basePath: string): boolean {
  const normPath = normalizePathname(pathname);
  const normBase = normalizePathname(basePath);
  if (normPath === normBase) return true;
  return normPath.startsWith(normBase + "/");
}

export function getActiveNavigationGroup(pathname: string): NavigationGroupId | null {
  const path = normalizePathname(pathname);

  if (matchesPathBoundary(path, "/products")) return "products";

  if (
    matchesPathBoundary(path, "/solutions") ||
    matchesPathBoundary(path, "/managed-operations") ||
    matchesPathBoundary(path, "/engagement-model")
  )
    return "solutions";

  if (matchesPathBoundary(path, "/demos")) return "demos";

  if (matchesPathBoundary(path, "/research") || matchesPathBoundary(path, "/answers"))
    return "insights";

  if (
    matchesPathBoundary(path, "/company") ||
    matchesPathBoundary(path, "/careers") ||
    matchesPathBoundary(path, "/contact")
  )
    return "company";

  return null;
}

export function isPrimaryNavigationCTAActive(pathname: string): boolean {
  return matchesPathBoundary(normalizePathname(pathname), "/start");
}

export function isNavigationItemActive(pathname: string, href: string, hash?: string): boolean {
  // Anchors inside a page never mark themselves as the current page.
  if (hash) return false;
  const path = normalizePathname(pathname);
  const itemHref = normalizePathname(href);

  // Overview items only activate on exact match, to avoid sibling overlap.
  const isOverview = ["/products", "/solutions", "/company"].includes(itemHref);

  if (isOverview) {
    return path === itemHref;
  }

  // Regular children and other items use segment-safe boundary matching.
  return matchesPathBoundary(path, itemHref);
}
