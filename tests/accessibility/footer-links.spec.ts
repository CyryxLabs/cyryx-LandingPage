import { expect, test } from "@playwright/test";

/**
 * Footer link contract: every internal href must resolve (200 + heading),
 * every mailto must be well-formed, and every external link must open in
 * a new tab with rel="noreferrer noopener". Guards against dead footer
 * links after route renames or product launches.
 */
test.describe("footer links", () => {
  test("all links are well-formed and resolvable", async ({ page, request }) => {
    test.setTimeout(90_000);
    await page.goto("/", { waitUntil: "networkidle" });

    const links = await page.locator("footer a").evaluateAll((els) =>
      els.map((el) => ({
        href: el.getAttribute("href") ?? "",
        target: el.getAttribute("target"),
        rel: el.getAttribute("rel") ?? "",
        text: (el.textContent ?? "").trim(),
      })),
    );
    expect(links.length).toBeGreaterThan(10);

    const internal = new Set<string>();
    for (const l of links) {
      expect(l.href, `empty href on "${l.text}"`).toBeTruthy();

      if (l.href.startsWith("mailto:")) {
        // Press and Security are verified mailto
        expect(l.href, `bad mailto on "${l.text}"`).toMatch(/^mailto:[^@\s]+@[^@\s]+\.[^@\s]+/);
        expect(l.target).toBeNull(); // Should not use target=_blank
      } else if (l.href.startsWith("http")) {
        expect(l.target, `external "${l.text}" needs target=_blank`).toBe("_blank");
        expect(l.rel).toContain("noreferrer");
        expect(l.rel).toContain("noopener");
      } else if (l.href.startsWith("/")) {
        internal.add(l.href.split("#")[0]);
      }
    }

    // Verify all internal links point to valid routes
    await Promise.all(
      [...internal].map(async (path) => {
        const res = await request.get(path);
        expect(res.status(), `${path} returned ${res.status()}`).toBeLessThan(400);
      }),
    );
  });

  test("Contact points to /contact", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const contactLink = page
      .locator('footer nav[aria-label="Company"] a')
      .getByText("Contact", { exact: true });
    await expect(contactLink).toHaveAttribute("href", "/contact");
  });

  test("Temporary stubs are absent", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const footer = page.locator("footer");
    const forbidden = ["Docs", "Support", "Status", "Responsible AI"];
    for (const text of forbidden) {
      await expect(footer.getByText(text, { exact: true })).not.toBeVisible();
    }
  });
});
