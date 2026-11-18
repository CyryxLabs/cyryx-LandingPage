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

  test("hero renders the approved headline, sub, and CTA labels with correct destinations", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const hero = page.locator("section[data-hero]");
    await expect(hero).toBeVisible();
    await expect(page.locator("#hero-heading")).toHaveText(
      "We build AI systems that do real work.",
    );
    await expect(hero).toContainText(
      "We design, build and operate AI systems, workflow automation and system integration for companies across the United States, with human approval, audit logs and cost limits built in.",
    );
    const primary = hero.getByRole("link", { name: APPROVED.ctaPrimary, exact: true });
    await expect(primary).toHaveAttribute("href", "/start?source=home");
    const secondary = hero.getByRole("link", { name: "See what we build", exact: true });
    await expect(secondary).toHaveAttribute("href", "#services");
    // Products stay out of the hero (founder decision, 2026-11-13).
    await expect(hero).not.toContainText(/Onyx|AEXOS/);
    // The four things we build are named in the hero, each with its own link.
    const forms = hero.getByRole("navigation", { name: "What we build" });
    for (const [name, href] of [
      ["AI systems", "/solutions/custom-ai-product-development"],
      ["Workflow automation", "/solutions/workflow-automation"],
      ["System integration", "/solutions/ai-integrations"],
      ["Governance and control", "/solutions/ai-governance-cost-control"],
    ] as const) {
      await expect(forms.getByRole("link", { name, exact: true })).toHaveAttribute("href", href);
    }
    await expect(hero).not.toContainText(/MAAX/i);
    await expect(hero.locator('a[href*="maax" i], a[href="#maax"]')).toHaveCount(0);
  });

  test("homepage names AI systems, automation, integration, agents and products in visible copy", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const main = page.locator("main");
    for (const term of [/AI systems/i, /automation/i, /integration/i, /AI agents/i, /website/i]) {
      await expect(main).toContainText(term);
    }
  });

  test("homepage presents no discontinued MAAX product section", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#maax")).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(/MAAX/i);
  });

  test("the ten services each link to their own page and state no price", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const services = page.locator("#services");
    await expect(services.getByRole("heading", { level: 2 })).toHaveText(
      "Ten services. One for each thing in the way.",
    );
    await expect(services.locator("a.cy-index__row")).toHaveCount(10);
    for (const href of [
      "/solutions/ai-strategy-advisory",
      "/solutions/workflow-automation",
      "/solutions/internal-ai-assistants",
      "/solutions/ai-integrations",
      "/solutions/custom-ai-product-development",
      "/solutions/data-knowledge-systems",
      "/solutions/ai-governance-cost-control",
      "/solutions/digital-web-systems",
      "/solutions/ai-training-enablement",
      "/managed-operations",
    ]) {
      await expect(services.locator(`a.cy-index__row[href="${href}"]`)).toHaveCount(1);
    }
    // Prices stay off the site until the founder publishes them.
    await expect(page.locator("main")).not.toContainText(/\$\d/);
  });

  test("products show Onyx and AEXOS with their real stages", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const products = page.locator("#products");
    await expect(products).toContainText("AI coworker for Windows · Free beta");
    await expect(products).toContainText("Core free on npm");
    // Each product opens its own page: the Onyx site in a new tab, AEXOS on this site.
    const onyxSite = products.getByRole("link", { name: /Open the Onyx site/ });
    await expect(onyxSite).toHaveAttribute("href", "https://onyx.cyryxlabs.com/");
    await expect(onyxSite).toHaveAttribute("target", "_blank");
    await expect(products.locator('img[src^="/media/onyx/"]').first()).toBeAttached();
    await expect(products.getByRole("link", { name: "Explore Onyx" })).toHaveAttribute(
      "href",
      "/products/onyx",
    );
    await expect(products.getByRole("link", { name: "Explore AEXOS" })).toHaveAttribute(
      "href",
      "/products/aexos",
    );
    await expect(products).not.toContainText(/ASTRA|MAAX/);
  });

  test("every market figure names its publisher", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const stats = page.locator("#market .cy-stat");
    await expect(stats).toHaveCount(3);
    for (const publisher of ["Goldman Sachs", "RSM US", "Deloitte"]) {
      await expect(page.locator("#market")).toContainText(publisher);
    }
  });

  test("homepage chapters render in the approved order", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const ids = await page
      .locator("main section[id]")
      .evaluateAll((sections) => sections.map((section) => section.id));
    const expected = [
      "top",
      "market",
      "demo",
      "who",
      "services",
      "how-it-works",
      "control",
      "products",
      "research",
      "readiness",
      "faq",
      "contact",
    ];
    expect(ids.filter((id) => expected.includes(id))).toEqual(expected);
    // No founder profile is published.
    await expect(page.locator("#team")).toHaveCount(0);
  });

  test("the visible FAQ and the FAQPage schema say the same thing", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const questions = await page.locator("#faq summary").allInnerTexts();
    const graph = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) =>
        nodes.flatMap((n) => JSON.parse(n.textContent || "{}")["@graph"] ?? []),
      );
    const faq = graph.find((node: { "@type"?: string }) => node["@type"] === "FAQPage");
    expect(faq).toBeTruthy();
    expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(
      questions.map((q) => q.trim()),
    );
  });
});
