import { expect, test } from "@playwright/test";

/**
 * Footer link contract: every internal href must resolve (200 + <h1>),
 * every mailto must be well-formed, and every external link must open in
 * a new tab with rel="noreferrer noopener". Guards against dead footer
 * links after route renames or product launches.
 */
test.describe("footer links", () => {
  test("all links are well-formed and resolvable", async ({ page, request }) => {
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
        expect(l.href, `bad mailto on "${l.text}"`).toMatch(
          /^mailto:[^@\s]+@[^@\s]+\.[^@\s]+/,
        );
      } else if (l.href.startsWith("http")) {
        expect(l.target, `external "${l.text}" needs target=_blank`).toBe("_blank");
        expect(l.rel).toContain("noreferrer");
        expect(l.rel).toContain("noopener");
      } else if (l.href.startsWith("/")) {
        internal.add(l.href.split("#")[0]);
      }
    }

    for (const path of internal) {
      const res = await request.get(path);
      expect(res.status(), `${path} returned ${res.status()}`).toBeLessThan(400);
      await page.goto(path, { waitUntil: "domcontentloaded" });
      await expect(page.locator("h1").first()).toBeVisible();
    }
  });
});