import { test, expect } from "@playwright/test";
import {
  PRIMARY_NAVIGATION,
  PRIMARY_NAVIGATION_CTA,
  normalizePathname,
  matchesPathBoundary,
  getActiveNavigationGroup,
  isPrimaryNavigationCTAActive,
  isNavigationItemActive,
} from "../../src/lib/navigation";

test.describe("Navigation Model", () => {
  test("A. Top-level order", () => {
    const labels = PRIMARY_NAVIGATION.map((g) => g.label);
    expect(labels).toEqual(["Products", "Solutions", "Research", "Company"]);
  });

  test("B. CTA", () => {
    expect(PRIMARY_NAVIGATION_CTA).toEqual({ label: "Start a fit review", href: "/start" });
  });

  test("D. Uniqueness", () => {
    const ids = PRIMARY_NAVIGATION.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);

    const allHrefs = PRIMARY_NAVIGATION.flatMap((g) => g.children.map((c) => c.href));
    expect(new Set(allHrefs).size).toBe(allHrefs.length);

    PRIMARY_NAVIGATION.forEach((group) => {
      const labels = group.children.map((c) => c.label);
      expect(new Set(labels).size).toBe(labels.length);
    });
  });

  test("E. Forbidden route exclusion", () => {
    const forbidden = [
      "/solutions/ai-product-engineering",
      "/solutions/applied-ai-systems",
      "/solutions/governance-optimization",
      "/solutions/ai-websites-lead-systems",
      "/solutions/ai-integrations",
      "/auth",
      "/workspace",
    ];
    const allHrefs = PRIMARY_NAVIGATION.flatMap((g) => g.children.map((c) => c.href));
    forbidden.forEach((route) => {
      expect(allHrefs).not.toContain(route);
    });
  });

  test("F. Group matching", () => {
    // PRODUCTS
    expect(getActiveNavigationGroup("/products")).toBe("products");
    expect(getActiveNavigationGroup("/products/maax-studio")).toBe("products");

    // SOLUTIONS
    expect(getActiveNavigationGroup("/solutions")).toBe("solutions");
    expect(getActiveNavigationGroup("/managed-operations")).toBe("solutions");
    expect(getActiveNavigationGroup("/engagement-model")).toBe("solutions");

    // RESEARCH
    expect(getActiveNavigationGroup("/research")).toBe("research");
    expect(getActiveNavigationGroup("/answers")).toBe("research");

    // COMPANY
    expect(getActiveNavigationGroup("/company")).toBe("company");
    expect(getActiveNavigationGroup("/careers")).toBe("company");
    expect(getActiveNavigationGroup("/contact")).toBe("company");

    // NULL
    expect(getActiveNavigationGroup("/")).toBeNull();
    expect(getActiveNavigationGroup("/start")).toBeNull();
    expect(getActiveNavigationGroup("/privacy")).toBeNull();
  });

  test("G. Segment safety", () => {
    expect(matchesPathBoundary("/productivity", "/products")).toBe(false);
    expect(matchesPathBoundary("/researcher", "/research")).toBe(false);
    expect(matchesPathBoundary("/company-news", "/company")).toBe(false);
    expect(matchesPathBoundary("/career-builder", "/careers")).toBe(false);
    expect(matchesPathBoundary("/contactless", "/contact")).toBe(false);
    expect(matchesPathBoundary("/starting", "/start")).toBe(false);
    expect(matchesPathBoundary("/workspace/products", "/products")).toBe(false);
  });

  test("H. Child specificity", () => {
    // At /products
    expect(isNavigationItemActive("/products", "/products")).toBe(true);
    expect(isNavigationItemActive("/products", "/products/maax-studio")).toBe(false);

    // At /products/maax-studio
    expect(isNavigationItemActive("/products/maax-studio", "/products/maax-studio")).toBe(true);
    expect(isNavigationItemActive("/products/maax-studio", "/products")).toBe(false);

    // At /research/article
    // Section 11 implies "Research" child is active on descendants,
    // UNLESS it overlaps with another child like "Answers".
    expect(isNavigationItemActive("/research/article", "/research")).toBe(true);
    expect(isNavigationItemActive("/research/article", "/answers")).toBe(false);

    // At /careers
    expect(isNavigationItemActive("/careers", "/careers")).toBe(true);
    expect(isNavigationItemActive("/careers", "/company")).toBe(false);
  });

  test("I. Query/hash normalization", () => {
    expect(normalizePathname("/products/?ref=test")).toBe("/products");
    expect(normalizePathname("/products/maax-studio#details")).toBe("/products/maax-studio");
    expect(normalizePathname("products/maax-studio")).toBe("products/maax-studio");
  });

  test("J. Internal-route isolation", () => {
    expect(getActiveNavigationGroup("/auth")).toBeNull();
    expect(getActiveNavigationGroup("/workspace")).toBeNull();
    expect(getActiveNavigationGroup("/workspace/dev")).toBeNull();
    expect(getActiveNavigationGroup("/_authenticated/workspace")).toBeNull();
  });
});
