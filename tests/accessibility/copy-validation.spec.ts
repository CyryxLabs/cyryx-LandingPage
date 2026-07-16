import { expect, test } from "@playwright/test";
import { AVAILABLE_COPY_VARIANTS, getCopy } from "../../src/copy";
import { CopyDocumentSchema, validateCopy } from "../../src/copy/schema";

test.describe("Copy variants — shape validation", () => {
  for (const variant of AVAILABLE_COPY_VARIANTS) {
    test(`variant "${variant}" matches CopyDocumentSchema`, () => {
      const result = validateCopy(getCopy(variant));
      if (!result.ok) {
        const summary = result.issues
          .map((i) => `${i.path}: ${i.message}`)
          .join("\n");
        throw new Error(`copy "${variant}" invalid:\n${summary}`);
      }
      expect(result.ok).toBe(true);
    });
  }

  test("getCopy falls back to v3 for unknown variants", () => {
    const copy = getCopy("does-not-exist");
    expect(copy.hero.headline).toBe(getCopy("v3").hero.headline);
  });

  test("schema rejects missing required fields", () => {
    const broken = { hero: { headline: "" } };
    expect(CopyDocumentSchema.safeParse(broken).success).toBe(false);
  });

  test("schema allows 0 to 4 hero.meta items (contract-driven)", () => {
    const copy = getCopy("v3");
    
    // Test 0 items (current v3 state)
    expect(CopyDocumentSchema.safeParse({ ...copy, hero: { ...copy.hero, meta: [] } }).success).toBe(true);
    
    // Test 3 items (previously rejected)
    expect(CopyDocumentSchema.safeParse({ ...copy, hero: { ...copy.hero, meta: ["one", "two", "three"] } }).success).toBe(true);
    
    // Test 4 items (limit)
    expect(CopyDocumentSchema.safeParse({ ...copy, hero: { ...copy.hero, meta: ["a", "b", "c", "d"] } }).success).toBe(true);
    
    // Test 5 items (should fail)
    expect(CopyDocumentSchema.safeParse({ ...copy, hero: { ...copy.hero, meta: ["a", "b", "c", "d", "e"] } }).success).toBe(false);
  });
});

test.describe("Consent + legal anchors render", () => {
  test("contact consent block contains Privacy Policy + email anchors", async ({ page }) => {
    await page.goto("/");
    const consent = page.locator('label[for="consent"]');
    await expect(consent).toContainText(/agree to be contacted/i);
    await expect(consent).toContainText(/Privacy Policy/i);
    await expect(consent.locator('a[href="/privacy"]')).toHaveCount(1);
    await expect(consent.locator('a[href^="mailto:"]')).toHaveCount(1);
  });
});

test.describe("Hero — approved copy lock", () => {
  const APPROVED = {
    headline: "The execution layer for enterprise AI.",
    sub:
      "Cyryx Labs builds AI products and execution systems — governed agents, automated workflows, and operational infrastructure engineered for accountability, auditability, and cost control.",
    ctaPrimary: "Start a project",
    ctaSecondary: "MAAX Studio →",
  } as const;

  test("v3 hero copy matches the approved source of truth exactly", () => {
    const hero = getCopy("v3").hero;
    expect(hero.headline).toBe(APPROVED.headline);
    expect(hero.sub).toBe(APPROVED.sub);
    expect(hero.ctaPrimary).toBe(APPROVED.ctaPrimary);
    expect(hero.ctaSecondary).toBe(APPROVED.ctaSecondary);
  });

  test("v3 hero does not contain the forbidden 'business AI' variant", () => {
    const hero = getCopy("v3").hero;
    const forbidden = "The execution layer for business AI.";
    expect(hero.headline).not.toBe(forbidden);
    expect(hero.sub).not.toContain(forbidden);
  });

  test("hero renders approved headline, sub, and CTA labels with correct destinations", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const hero = page.locator("section[data-hero]");
    await expect(hero).toBeVisible();
    await expect(page.locator("#hero-heading")).toHaveText(APPROVED.headline);
    await expect(hero).toContainText(APPROVED.sub);
    const primary = hero.getByRole("link", { name: /Start a Project with Cyryx Labs/i });
    await expect(primary).toHaveAttribute("href", "#contact");
    await expect(primary).toContainText(APPROVED.ctaPrimary);
    const secondary = hero.getByRole("link", { name: /Explore MAAX Studio/i });
    await expect(secondary).toHaveAttribute("href", "#maax");
    await expect(secondary).toContainText(APPROVED.ctaSecondary);
    await expect(hero).not.toContainText("The execution layer for business AI.");
  });
});