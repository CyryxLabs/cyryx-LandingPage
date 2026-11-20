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
    expect(labels).toEqual(["Products", "Solutions", "Demos", "Insights", "Company"]);
    // Demos is a direct link, not a menu.
    expect(PRIMARY_NAVIGATION.find((g) => g.id === "demos")?.href).toBe("/demos");
  });

  test("A2. Products group lists every product with its real home", () => {
    const products = PRIMARY_NAVIGATION.find((g) => g.id === "products");
    expect(products?.children).toEqual([
      { label: "All products", href: "/products" },
      { label: "Onyx", href: "/products/onyx" },
      { label: "AEXOS", href: "/products/aexos" },
    ]);
    const allLabels = PRIMARY_NAVIGATION.flatMap((g) => g.children.map((c) => c.label));
    const allHrefs = PRIMARY_NAVIGATION.flatMap((g) => g.children.map((c) => c.href));
    expect(allLabels.join("|")).not.toMatch(/MAAX/i);
    expect(allHrefs.join("|")).not.toMatch(/maax/i);
  });

  test("B. CTA", () => {
    expect(PRIMARY_NAVIGATION_CTA).toEqual({ label: "Discuss your project", href: "/start" });
  });

  test("D. Uniqueness", () => {
    const ids = PRIMARY_NAVIGATION.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);

    const allTargets = PRIMARY_NAVIGATION.flatMap((g) =>
      g.children.map((c) => `${c.href}#${"hash" in c ? (c.hash ?? "") : ""}`),
    );
    expect(new Set(allTargets).size).toBe(allTargets.length);

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
      "/auth",
      "/workspace",
      "/products/maax-studio",
    ];
    const allHrefs = PRIMARY_NAVIGATION.flatMap((g) => g.children.map((c) => c.href));
    forbidden.forEach((route) => {
      expect(allHrefs).not.toContain(route);
    });
  });

  test("F. Group matching", () => {
    // PRODUCTS
    expect(getActiveNavigationGroup("/products")).toBe("products");
    expect(getActiveNavigationGroup("/products/aexos")).toBe("products");

    // SOLUTIONS
    expect(getActiveNavigationGroup("/solutions")).toBe("solutions");
    expect(getActiveNavigationGroup("/managed-operations")).toBe("solutions");
    expect(getActiveNavigationGroup("/engagement-model")).toBe("solutions");

    // DEMOS
    expect(getActiveNavigationGroup("/demos")).toBe("demos");

    // INSIGHTS
    expect(getActiveNavigationGroup("/research")).toBe("insights");
    expect(getActiveNavigationGroup("/answers")).toBe("insights");

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
    expect(isNavigationItemActive("/products", "/products/aexos")).toBe(false);

    // At /products/aexos
    expect(isNavigationItemActive("/products/aexos", "/products/aexos")).toBe(true);
    expect(isNavigationItemActive("/products/aexos", "/products")).toBe(false);

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
    expect(normalizePathname("/products/aexos#details")).toBe("/products/aexos");
    expect(normalizePathname("products/aexos")).toBe("products/aexos");
  });

  test("J. Internal-route isolation", () => {
    expect(getActiveNavigationGroup("/auth")).toBeNull();
    expect(getActiveNavigationGroup("/workspace")).toBeNull();
    expect(getActiveNavigationGroup("/workspace/dev")).toBeNull();
    expect(getActiveNavigationGroup("/_authenticated/workspace")).toBeNull();
  });
});
