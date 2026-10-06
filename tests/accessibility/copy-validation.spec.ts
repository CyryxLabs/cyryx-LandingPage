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
        [
          "assistantNote",
          "ctaPrimary",
          "ctaSecondary",
          "eyebrow",
          "headline",
          "rail",
          "sub",
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

  test("cinematic hero states the business and retains the CTA destinations", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("[data-hero]");
    await expect(hero.locator("h1")).toHaveText("AI products. Software, made real.");
    await expect(hero).toContainText(
      "Our own AI products. Custom software for clients. Practical advice on what to build next.",
    );
    await expect(hero.locator('[data-cta="primary"]')).toHaveAttribute(
      "href",
      "/start?source=home",
    );
    await expect(hero.locator('[data-cta="secondary"]')).toHaveAttribute("href", "#cyryx-offer");
  });
  test("the illustrative workflow connects software to people and systems without client claims", async ({
    page,
  }) => {
    await page.goto("/");
    const section = page.locator("#controlled-execution");
    await expect(section).toContainText("Illustrative workflow");
    await expect(section).toContainText("No payment or approval has taken place.");
    await expect(section.locator(".cinema-draft-status")).toHaveText("Ready for review");
  });

  test("homepage presents no discontinued MAAX product section", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("#maax")).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(/MAAX/i);
  });

  test("custom services and the published product are distinct", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".cinema-service")).toHaveCount(3);
    await expect(page.locator(".cinema-services")).toContainText("Applications & websites");
    await expect(page.locator(".cinema-services")).toContainText("Connected systems & automation");
    await expect(page.locator(".cinema-services")).toContainText("AI agents & applied AI");
    await expect(page.locator("#cyryx-offer")).toContainText("Consulting");
    await expect(page.locator(".cinema-product")).toContainText("Core available on npm");
    await expect(page.locator(".cinema-product a")).toHaveAttribute("href", "/products/aexos");
  });
  test("homepage story leads with the offer and names the founder without team-size claims", async ({
    page,
  }) => {
    await page.goto("/");
    const ids = await page
      .locator("main section[id]")
      .evaluateAll((nodes) => nodes.map((n) => n.id));
    expect(ids).toEqual([
      "top",
      "our-products",
      "operating-model",
      "consulting",
      "controlled-execution",
      "security",
      "evidence",
      "research",
      "team",
      "contact",
    ]);
    await expect(page.locator("#team")).toContainText("Work directly with Paulo.");
  });

  test("sample deliverables are labelled as illustrative", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const evidence = page.locator("#evidence");
    await expect(evidence.getByRole("tablist")).toBeVisible();
    await expect(evidence.getByRole("tabpanel")).toContainText("Sample · illustrative data");
  });
});
