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

  test("schema rejects wrong hero.meta length (layout-sensitive)", () => {
    const copy = getCopy("v3");
    const broken = { ...copy, hero: { ...copy.hero, meta: ["only", "three", "items"] } };
    const r = CopyDocumentSchema.safeParse(broken);
    expect(r.success).toBe(false);
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