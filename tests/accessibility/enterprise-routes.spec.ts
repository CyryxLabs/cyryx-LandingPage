import { expect, test } from "@playwright/test";

const homepageSections = [
  "execution-gap",
  "operating-model",
  "solutions",
  "outcomes",
  "process",
  "governance",
  "products",
  "research",
  "why-cyryx",
  "contact",
];

const publicRoutes = [
  "/",
  "/solutions",
  "/solutions/ai-strategy-advisory",
  "/solutions/digital-web-systems",
  "/solutions/workflow-automation",
  "/solutions/internal-ai-assistants",
  "/solutions/custom-ai-products",
  "/solutions/ai-governance-cost-control",
  "/solutions/managed-operations",
  "/products",
  "/products/maax-studio",
  "/products/lyra",
  "/how-we-work",
  "/research",
  "/company",
  "/careers",
  "/contact",
  "/start",
  "/privacy",
];

const representativeRoutes = [
  "/",
  "/solutions/ai-strategy-advisory",
  "/products/maax-studio",
  "/products/lyra",
  "/start",
  "/privacy",
];

const responsiveWidths = [320, 360, 390, 768, 1024, 1280, 1440, 1920];

test("Homepage follows the enterprise narrative and public product contract", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);

  const audit = await page.evaluate((expected) => {
    const positions = expected.map((id) => {
      const node = document.getElementById(id);
      return node ? { id, top: node.offsetTop } : null;
    });
    const ids = Array.from(document.querySelectorAll("[id]"), (node) => node.id);
    return {
      positions,
      duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
      text: document.body.innerText,
    };
  }, homepageSections);

  expect(audit.positions.every(Boolean)).toBe(true);
  expect(audit.positions.map((entry) => entry?.top)).toEqual(
    [...audit.positions].map((entry) => entry?.top).sort((a, b) => (a ?? 0) - (b ?? 0)),
  );
  expect(audit.duplicateIds).toEqual([]);
  expect(audit.text).toContain("IN ACTIVE DEVELOPMENT");
  expect(audit.text).toContain("PRIVATE DEVELOPMENT");
  expect(audit.text).not.toMatch(/Praxis|MAAX Runtime/i);
});

test("Every enterprise route has a unique H1, canonical URL, and no horizontal overflow", async ({
  page,
}) => {
  for (const pathname of publicRoutes) {
    const response = await page.goto(pathname);
    expect(response?.ok(), `${pathname} should return a successful response`).toBe(true);
    await expect(page.locator("h1"), `${pathname} should expose one H1`).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://cyryxlabs.com${pathname}`,
    );
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, `${pathname} should not overflow horizontally`).toBeLessThanOrEqual(1);
  }
});

test("Official brand-board tokens remain the visual source of truth", async ({ page }) => {
  await page.goto("/solutions");

  const brand = await page.evaluate(() => {
    const root = getComputedStyle(document.querySelector(".cx-interior-main")!);
    const heading = getComputedStyle(document.querySelector(".cx-interior-main h1")!);
    const body = getComputedStyle(document.body);
    return {
      onyx: root.getPropertyValue("--onyx").trim().toLowerCase(),
      obsidian: root.getPropertyValue("--obsidian").trim().toLowerCase(),
      graphite: root.getPropertyValue("--graphite").trim().toLowerCase(),
      gunmetal: root.getPropertyValue("--charcoal").trim().toLowerCase(),
      steel: root.getPropertyValue("--steel").trim().toLowerCase(),
      silver: root.getPropertyValue("--silver").trim().toLowerCase(),
      coreTeal: root.getPropertyValue("--accent-core").trim().toLowerCase(),
      accent: root.getPropertyValue("--accent-glow").trim().toLowerCase(),
      bodyFont: body.fontFamily,
      headingFont: heading.fontFamily,
    };
  });

  expect(brand).toMatchObject({
    onyx: "#050607",
    obsidian: "#0a0d0f",
    graphite: "#11161a",
    gunmetal: "#1b2227",
    steel: "#8c949e",
    silver: "#c7c9cc",
    coreTeal: "#0f6b68",
    accent: "#19c7c0",
  });
  expect(brand.bodyFont).toContain("Inter");
  expect(brand.headingFont).toContain("Space Grotesk");

  const headerMark = page.locator('header a[aria-label="Cyryx Labs — home"] img');
  await expect(headerMark).toHaveAttribute("src", "/favicon.ico");
  expect(
    await headerMark.evaluate((image: HTMLImageElement) => image.naturalWidth),
  ).toBeGreaterThan(0);

  const footerMark = page.locator('footer img[src="/favicon.ico"]');
  await footerMark.scrollIntoViewIfNeeded();
  await expect(footerMark).toHaveJSProperty("complete", true);
  expect(
    await footerMark.evaluate((image: HTMLImageElement) => image.naturalWidth),
  ).toBeGreaterThan(0);
});

test("Representative pages remain intact from 320px through 1920px", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "hero-a11y-chromium", "Responsive matrix runs once");

  for (const width of responsiveWidths) {
    await page.setViewportSize({ width, height: width < 768 ? 800 : 1000 });

    for (const pathname of representativeRoutes) {
      const response = await page.goto(pathname);
      expect(response?.ok(), `${pathname} should load at ${width}px`).toBe(true);
      await expect(page.locator("h1"), `${pathname} should keep one H1 at ${width}px`).toHaveCount(
        1,
      );

      const layout = await page.evaluate(() => {
        const images = Array.from(document.images);
        const visibleControls = Array.from(
          document.querySelectorAll<HTMLElement>("button, a.cx-btn, a.cx-cta"),
        ).filter((node) => {
          const rect = node.getBoundingClientRect();
          const style = getComputedStyle(node);
          return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden";
        });

        return {
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          clippedImages: images
            .filter((image) => image.getBoundingClientRect().right > window.innerWidth + 1)
            .map((image) => image.alt),
          undersizedControls: visibleControls
            .filter((node) => node.getBoundingClientRect().height < 44)
            .map(
              (node) => node.getAttribute("aria-label") || node.textContent?.trim() || node.tagName,
            ),
        };
      });

      expect(layout.overflow, `${pathname} should not overflow at ${width}px`).toBeLessThanOrEqual(
        1,
      );
      expect(layout.clippedImages, `${pathname} images should fit at ${width}px`).toEqual([]);
      expect(
        layout.undersizedControls,
        `${pathname} controls should be at least 44px tall`,
      ).toEqual([]);
    }
  }
});

test("Every internal page link resolves to a declared public route", async ({ page }) => {
  const declared = new Set(publicRoutes);
  const discovered = new Set<string>();

  for (const pathname of publicRoutes) {
    await page.goto(pathname);
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).getAttribute("href") || ""),
      );
    for (const href of hrefs) {
      const url = new URL(href, "https://cyryxlabs.com");
      discovered.add(url.pathname.replace(/\/$/, "") || "/");
    }
  }

  expect([...discovered].filter((pathname) => !declared.has(pathname))).toEqual([]);
});

test("Solutions map closes its final row and MAAX visual evidence is qualified", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "hero-a11y-chromium", "Visual contract runs once");

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/solutions");
  const solutionCards = page.locator(".cx-solution-map article");
  await expect(solutionCards).toHaveCount(7);
  await expect(solutionCards.last()).toHaveCSS("grid-column-start", "1");
  await expect(solutionCards.last()).toHaveCSS("grid-column-end", "-1");

  await page.goto("/products/maax-studio");
  const maaxVisual = page.locator(".cx-product-page-visual img");
  await expect(maaxVisual).toHaveAttribute("src", /cyryx-macbook-ide.*\.webp/);
  await expect(page.locator(".cx-product-page-visual p")).toContainText("Product visualization");
});

test("Mobile navigation moves focus into the dialog and restores it on Escape", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "hero-a11y-mobile-360", "Mobile navigation contract");
  await page.goto("/");
  const opener = page.getByRole("button", { name: /open menu/i });
  await expect(opener).toHaveAttribute("data-hydrated", "true");
  await opener.click();
  const dialog = page.getByRole("dialog", { name: /main navigation/i });
  await expect(dialog).toBeVisible();
  await expect(page.getByRole("button", { name: /close menu/i })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(opener).toBeFocused();
});
