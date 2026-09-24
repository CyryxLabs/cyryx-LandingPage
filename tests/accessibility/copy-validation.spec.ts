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

  test("registry exposes exactly v4a (default) and v4b", () => {
    expect([...AVAILABLE_COPY_VARIANTS].sort()).toEqual(["v4a", "v4b"]);
    expect(DEFAULT_COPY_VARIANT).toBe("v4a");
  });

  test("getCopy falls back to the default v4a for unknown or retired variants", () => {
    const fallback = getCopy("v4a").hero.headline;
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
      CopyDocumentSchema.safeParse({ ...copy, hero: { ...copy.hero, headline: "x".repeat(91) } })
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
        ["assistantNote", "ctaPrimary", "ctaSecondary", "eyebrow", "headline", "sub"].sort(),
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

test("primary navigation uses the official mark and wordmark lockup", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const home = page.getByRole("link", { name: "Cyryx Labs — home" });
  const lockup = home.locator("[data-cyryx-lockup]");
  await expect(lockup).toBeVisible();
  await expect(lockup.locator("img")).toHaveCount(2);
  await expect(lockup.locator('img[alt="Cyryx Labs"]')).toHaveCount(1);
});

test.describe("Hero — enterprise value proposition", () => {
  const APPROVED = {
    eyebrow: "AI systems · Advise · Build · Control · Operate",
    headline: "The execution layer for enterprise AI.",
    sub: "We design, build and run AI systems that act inside your workflows, with clear permissions, human approval where it matters and a record of every decision.",
    ctaPrimary: "Start a project",
    ctaSecondary: "See how we work",
  } as const;

  test("v4a hero copy matches the approved source of truth exactly", () => {
    const hero = getCopy("v4a").hero;
    expect(hero.eyebrow).toBe(APPROVED.eyebrow);
    expect(hero.headline).toBe(APPROVED.headline);
    expect(hero.sub).toBe(APPROVED.sub);
    expect(hero.ctaPrimary).toBe(APPROVED.ctaPrimary);
    expect(hero.ctaSecondary).toBe(APPROVED.ctaSecondary);
    expect(getCopy("v4a").header.cta).toBe("Start a project");
    expect(getCopy("v4a").finalCta.ctaPrimary).toBe("Start a project");
  });

  test("v4b only changes the hero promise", () => {
    const a = getCopy("v4a");
    const b = getCopy("v4b");
    expect(b.hero.headline).toBe(
      "Put AI to work in your operations, without losing control of it.",
    );
    expect(b.hero.headline).not.toBe(a.hero.headline);
    expect(b.hero.sub).not.toBe(a.hero.sub);
    expect(b.hero.eyebrow).toBe(a.hero.eyebrow);
    expect(b.hero.ctaPrimary).toBe(a.hero.ctaPrimary);
    expect(b.hero.ctaSecondary).toBe(a.hero.ctaSecondary);
    expect(b.header).toEqual(a.header);
    expect(b.finalCta).toEqual(a.finalCta);
  });

  test("hero copy does not contain the forbidden 'business AI' variant", () => {
    for (const variant of AVAILABLE_COPY_VARIANTS) {
      const hero = getCopy(variant).hero;
      const forbidden = "The execution layer for business AI.";
      expect(hero.headline).not.toBe(forbidden);
      expect(hero.sub).not.toContain(forbidden);
    }
  });

  test("hero renders approved headline, sub, and CTA labels with correct destinations", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const hero = page.locator("section[data-hero]");
    await expect(hero).toBeVisible();
    await expect(hero).toContainText(APPROVED.eyebrow);
    await expect(page.locator("#hero-heading")).toHaveText(APPROVED.headline);
    await expect(hero).toContainText(APPROVED.sub);
    const primary = hero.getByRole("link", { name: APPROVED.ctaPrimary, exact: true });
    await expect(primary).toHaveAttribute("href", "/start?source=home");
    const secondary = hero.getByRole("link", { name: APPROVED.ctaSecondary, exact: true });
    await expect(secondary).toHaveAttribute("href", "/engagement-model");
    await expect(hero).not.toContainText("The execution layer for business AI.");
    await expect(hero).not.toContainText(/MAAX/i);
    await expect(hero.locator('a[href*="maax" i], a[href="#maax"]')).toHaveCount(0);
  });

  test("execution-gap evidence preserves Gartner qualifiers and original sources", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const section = page.locator("#execution-gap");
    await expect(section).toBeVisible();
    await expect(section).toContainText("Gartner predicts");
    await expect(section).toContainText("more than 40% of agentic AI projects");
    await expect(section).toContainText("by the end of 2027");
    await expect(section).toContainText(
      "60% of organizations that don't address the cultural challenges of data and analytics governance will fail to govern AI successfully",
    );
    await expect(section).toContainText("Gartner · September 2026");
    await expect(section).toContainText("Gartner · June 2025");

    const sources = section.locator('a[href^="https://www.gartner.com/en/newsroom/"]');
    await expect(sources).toHaveCount(2);
    const sourceAttributes = await sources.evaluateAll((anchors) =>
      anchors.map((anchor) => ({
        href: anchor.getAttribute("href"),
        target: anchor.getAttribute("target"),
        rel: anchor.getAttribute("rel"),
      })),
    );
    expect(sourceAttributes).toEqual([
      {
        href: expect.stringContaining("/press-releases/2026-09-21-gartner-predicts-60-percent"),
        target: "_blank",
        rel: "noopener noreferrer",
      },
      {
        href: expect.stringContaining(
          "/press-releases/2025-06-25-gartner-predicts-over-40-percent-of-agentic-ai-projects",
        ),
        target: "_blank",
        rel: "noopener noreferrer",
      },
    ]);
  });

  test("homepage connects cited execution risk directly to the Cyryx thesis", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const section = page.locator("#execution-gap");

    await expect(section).toContainText("A capable model is not yet a working system.");
    await expect(section).toContainText("The missing layer is controlled execution");
    await expect(section.locator("article")).toHaveCount(2);
  });

  test("homepage presents no discontinued MAAX product section", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#maax")).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(/MAAX/i);
  });

  test("homepage explains the four ways to engage with focused entry points", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const operatingModel = page.locator("#operating-model");

    await expect(operatingModel.getByRole("heading", { level: 2 })).toHaveText(
      "Four ways to start.",
    );
    await expect(operatingModel).toContainText(
      "Start with the stage you need now: Advise, Build, Control or Operate.",
    );
    await expect(
      operatingModel.getByRole("link", { name: /Not sure where to start\? Tell us the problem/ }),
    ).toHaveAttribute("href", "/start?source=home");
    await expect(
      operatingModel.getByRole("link", { name: /See how engagements run/ }),
    ).toHaveAttribute("href", "/engagement-model");
  });

  test("homepage chapters render in the approved order", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const ids = await page
      .locator("main section[id]")
      .evaluateAll((sections) => sections.map((section) => section.id));
    const expected = [
      "top",
      "execution-gap",
      "operating-model",
      "controlled-execution",
      "evidence",
      "security",
      "contact",
    ];
    expect(ids.filter((id) => expected.includes(id))).toEqual(expected);
    // TeamBlock renders nothing while no founder profile is published.
    await expect(page.locator("#team")).toHaveCount(0);
  });

  test("sample deliverables are labelled as illustrative", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const evidence = page.locator("#evidence");
    await expect(evidence.getByRole("tablist")).toBeVisible();
    await expect(evidence.getByRole("tabpanel")).toContainText("Sample · illustrative data");
  });
});
