import { expect, test } from "@playwright/test";
import { AVAILABLE_COPY_VARIANTS, DEFAULT_COPY_VARIANT, getCopy } from "../../src/copy";
import { CopyDocumentSchema, validateCopy } from "../../src/copy/schema";

test.describe("Copy variants — shape validation", () => {
  for (const variant of AVAILABLE_COPY_VARIANTS) {
    test(`variant "${variant}" matches CopyDocumentSchema`, () => {
      const result = validateCopy(getCopy(variant));
      if (!result.ok) {
        const summary = result.issues.map((i) => `${i.path}: ${i.message}`).join("\n");
        throw new Error(`copy "${variant}" invalid:\n${summary}`);
      }
      expect(result.ok).toBe(true);
    });
  }

  test("registry exposes v5 (default since the 2026-11-06 redesign), v4a and v4b", () => {
    expect([...AVAILABLE_COPY_VARIANTS].sort()).toEqual(["v4a", "v4b", "v5"]);
    expect(DEFAULT_COPY_VARIANT).toBe("v5");
  });

  test("getCopy falls back to the default v5 for unknown or retired variants", () => {
    const fallback = getCopy("v5").hero.headline;
    expect(getCopy("does-not-exist").hero.headline).toBe(fallback);
    expect(getCopy("v3").hero.headline).toBe(fallback);
    expect(getCopy(null).hero.headline).toBe(fallback);
  });

  test("schema rejects missing required fields", () => {
    const broken = { hero: { headline: "" } };
    expect(CopyDocumentSchema.safeParse(broken).success).toBe(false);
  });

  test("schema enforces length limits on hero fields", () => {
    const copy = getCopy("v4a");
    expect(
      CopyDocumentSchema.safeParse({ ...copy, hero: { ...copy.hero, ctaPrimary: "x".repeat(33) } })
        .success,
    ).toBe(false);
    expect(
      CopyDocumentSchema.safeParse({ ...copy, hero: { ...copy.hero, headline: "x".repeat(101) } })
        .success,
    ).toBe(false);
    expect(
      CopyDocumentSchema.safeParse({ ...copy, hero: { ...copy.hero, assistantNote: "" } }).success,
    ).toBe(false);
  });

  test("copy documents no longer carry retired hero fields", () => {
    for (const variant of AVAILABLE_COPY_VARIANTS) {
      const copy = getCopy(variant) as unknown as Record<string, Record<string, unknown>>;
      expect(Object.keys(copy.hero).sort()).toEqual(
        [
          "assistantNote",
          "ctaPrimary",
          "ctaSecondary",
          "eyebrow",
          "headline",
          "rail",
          "sub",
          "trust",
        ].sort(),
      );
      expect(copy).not.toHaveProperty("maaxSpotlight");
      expect(JSON.stringify(copy)).not.toMatch(/MAAX/i);
    }
  });
});

test.describe("Consent + legal anchors render", () => {
  test("project qualification consent contains the Privacy Policy anchor", async ({ page }) => {
    await page.goto("/start");
    const consent = page.locator('label:has(input[name="consent"])');
    await expect(consent).toContainText(/consent to Cyryx Labs contacting me/i);
    await expect(consent).toContainText(/Privacy Policy/i);
    await expect(consent.locator('a[href="/privacy"]')).toHaveCount(1);
  });
});

test("primary navigation uses the official wordmark alone, with no crest", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const home = page.getByRole("link", { name: "Cyryx Labs — home" });
  const lockup = home.locator("[data-cyryx-lockup]");
  await expect(lockup).toBeVisible();
  // Founder decision 2026-11-13: wordmark only, the crest mark is retired.
  await expect(lockup.locator("img")).toHaveCount(1);
  await expect(page.locator('img[src*="brand-mark"]')).toHaveCount(0);
  await expect(lockup.locator('img[alt="Cyryx Labs"]')).toHaveCount(1);
});

test.describe("Hero — plain-English value proposition", () => {
  // Positioning plan of 2026-10-19: what we do, for whom, and what to click, in five seconds.
  const APPROVED = {
    eyebrow: "Advise · Build · Control · Operate",
    headline:
      "Websites, software and AI that grow your business — built and run by one accountable team.",
    sub: "Cyryx Labs designs and builds websites, automations, custom software and AI for small businesses, growing companies and enterprises across the US and Latin America. Fixed timelines. A human in control of every AI decision.",
    ctaPrimary: "Get a free fit check",
    ctaSecondary: "See what we build",
  } as const;

  test("v4a hero copy matches the approved source of truth exactly", () => {
    const hero = getCopy("v4a").hero;
    expect(hero.eyebrow).toBe(APPROVED.eyebrow);
    expect(hero.headline).toBe(APPROVED.headline);
    expect(hero.sub).toBe(APPROVED.sub);
    expect(hero.ctaPrimary).toBe(APPROVED.ctaPrimary);
    expect(hero.ctaSecondary).toBe(APPROVED.ctaSecondary);
    expect(getCopy("v4a").header.cta).toBe("Get a free fit check");
    expect(getCopy("v4a").finalCta.ctaPrimary).toBe("Get a free fit check");
  });

  test("v4b only changes the hero promise", () => {
    const a = getCopy("v4a");
    const b = getCopy("v4b");
    expect(b.hero.headline).toBe(
      "From idea to running system: websites, MVPs and AI, with you in control.",
    );
    expect(b.hero.headline).not.toBe(a.hero.headline);
    expect({ ...b.hero, headline: "" }).toEqual({ ...a.hero, headline: "" });
    expect(b.header).toEqual(a.header);
    expect(b.finalCta).toEqual(a.finalCta);
  });

  test("hero copy avoids the jargon retired by the positioning plan", () => {
    for (const variant of AVAILABLE_COPY_VARIANTS) {
      const hero = getCopy(variant).hero;
      for (const term of [/execution layer/i, /consequential execution/i, /authority boundar/i]) {
        expect(hero.headline).not.toMatch(term);
        expect(hero.sub).not.toMatch(term);
      }
    }
  });

  // Rebuild v9 (2026-11-17): Products · Solutions, one primary action, no
  // published prices, no fixed timelines, Orbit shown by name and stage only.
  test("hero renders the approved headline, body and actions", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const hero = page.locator("section[data-hero]");
    await expect(hero).toBeVisible();
    await expect(page.locator("#hero-heading")).toHaveText(
      "AI products and automation. Built for the way you work.",
    );
    await expect(hero).toContainText(
      "We build AI software, connect your existing systems, and automate the work between them.",
    );
    await expect(hero.locator('a[data-cta="primary"]')).toHaveText(/Discuss your project/);
    await expect(hero.locator('a[data-cta="primary"]')).toHaveAttribute(
      "href",
      "/start?source=home",
    );
    await expect(hero.locator('a[data-cta="secondary"]')).toHaveText("Explore our products");
    await expect(hero.locator('a[data-cta="secondary"]')).toHaveAttribute("href", "#products");
    // The workflow surfaces are labelled as sample data.
    await expect(hero.getByRole("img", { name: /sample data/i })).toBeVisible();
    await expect(hero).not.toContainText(/MAAX|ASTRA|execution layer/i);
  });

  test("homepage names products, automation, integration and custom software", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const main = page.locator("main");
    for (const term of [/AI products/i, /automat/i, /integration/i, /custom AI software/i]) {
      await expect(main).toContainText(term);
    }
  });

  test("homepage presents no discontinued MAAX product section", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#maax")).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(/MAAX/i);
  });

  test("two starting points: products and solutions", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const paths = page.locator("#paths");
    await expect(paths.getByRole("link", { name: /Explore Cyryx products/ })).toHaveAttribute(
      "href",
      "/products",
    );
    await expect(paths.getByRole("link", { name: /Build AI into your business/ })).toHaveAttribute(
      "href",
      "/solutions",
    );
  });

  test("the four solution groups link to their own pages and state no price", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const solutions = page.locator("#solutions");
    for (const href of [
      "/solutions/ai-strategy-advisory",
      "/solutions/workflow-automation",
      "/solutions/custom-ai-product-development",
      "/managed-operations",
    ]) {
      await expect(solutions.locator(`a[href="${href}"]`)).toHaveCount(1);
    }
    // Prices stay off the site until the founder publishes them.
    await expect(page.locator("main")).not.toContainText(/\$\d/);
  });

  test("products show Onyx and AEXOS with their real stages and Orbit by name only", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const products = page.locator("#products");
    await expect(products.locator("#onyx")).toContainText("Onyx");
    await expect(products.locator("#aexos")).toContainText("AEXOS");
    await expect(products.locator("#aexos")).not.toContainText(/\bPro\b/);
    await expect(products.locator('img[src^="/media/onyx/"]').first()).toBeAttached();
    await expect(products.locator('a[href="/products/onyx"]').first()).toBeAttached();
    await expect(products.locator('a[href="/products/aexos"]').first()).toBeAttached();
    const orbit = products.locator(".hm-prod--orbit");
    await expect(orbit).toContainText("Orbit");
    await expect(orbit).toContainText("In development");
    await expect(orbit.locator("a, button, form")).toHaveCount(0);
    await expect(products).not.toContainText(/ASTRA|MAAX/);
  });

  test("the home publishes no market statistics", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#market")).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(/Goldman Sachs|RSM US|Deloitte/);
  });

  test("homepage chapters render in the approved order", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const ids = await page
      .locator("main section[id]")
      .evaluateAll((sections) => sections.map((section) => section.id));
    expect(ids).toEqual([
      "top",
      "paths",
      "workflow",
      "solutions",
      "products",
      "evidence",
      "delivery",
      "company",
      "contact",
    ]);
    // No founder profile is published.
    await expect(page.locator("#team")).toHaveCount(0);
  });

  test("the home publishes no FAQPage schema without a visible FAQ", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const graph = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) =>
        nodes.flatMap((n) => JSON.parse(n.textContent || "{}")["@graph"] ?? []),
      );
    const faq = graph.find((node: { "@type"?: string }) => node["@type"] === "FAQPage");
    expect(Boolean(faq)).toBe((await page.locator("#faq").count()) > 0);
  });

  test("the only guarantee on the home is the acceptance checklist", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const main = page.locator("main");
    await expect(main).toContainText(
      "A project is done when it passes the acceptance checklist we agree on.",
    );
    await expect(main).not.toContainText(
      /fixed (written )?quote|fixed price|you own the code|money.back|\b\d+ (days|weeks)\b/i,
    );
  });
});
