import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

/**
 * Source-level guardrail: workspace.<domain>/ must redirect to /workspace
 * before React hydrates. The redirect is implemented as an inline script
 * in src/routes/__root.tsx so the landing page never flashes on the
 * workspace subdomain. These tests assert the script contract and
 * simulate its behaviour in a jsdom-like sandbox via Playwright's
 * page.evaluate against a data: URL.
 */

const ROOT = "src/routes/__root.tsx";

function extractRedirectScript(): string {
  const src = readFileSync(ROOT, "utf8");
  const match = src.match(
    /__html:\s*"((?:[^"\\]|\\.)*workspace\\\\\.(?:[^"\\]|\\.)*)"/,
  );
  if (!match) throw new Error("workspace subdomain redirect script not found");
  // Unescape the JS string literal so it can be executed in the browser.
  // eslint-disable-next-line no-eval
  return eval(`"${match[1]}"`) as string;
}

test("root shell embeds the workspace subdomain redirect script", () => {
  const src = readFileSync(ROOT, "utf8");
  expect(src, "must detect workspace. subdomain").toMatch(/workspace\\\\\./);
  expect(src, "must redirect using location.replace to /workspace").toMatch(
    /location\.replace\(\s*['"]\/workspace/,
  );
});

test("script redirects workspace.<domain>/ to /workspace", async ({ page }) => {
  const script = extractRedirectScript();
  await page.goto("data:text/html,<html><body>x</body></html>");
  const result = await page.evaluate((snippet) => {
    const calls: string[] = [];
    const fakeLocation = {
      hostname: "workspace.cyryxlabs.com",
      pathname: "/",
      search: "",
      hash: "",
      replace: (url: string) => calls.push(url),
    };
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    new Function("window", `with(window){${snippet}}`)({ location: fakeLocation });
    return calls;
  }, script);
  expect(result).toEqual(["/workspace"]);
});

test("script preserves query and hash on the workspace subdomain", async ({ page }) => {
  const script = extractRedirectScript();
  await page.goto("data:text/html,<html><body>x</body></html>");
  const result = await page.evaluate((snippet) => {
    const calls: string[] = [];
    const fakeLocation = {
      hostname: "workspace.cyryxlabs.com",
      pathname: "/",
      search: "?utm=abc",
      hash: "#top",
      replace: (url: string) => calls.push(url),
    };
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    new Function("window", `with(window){${snippet}}`)({ location: fakeLocation });
    return calls;
  }, script);
  expect(result).toEqual(["/workspace?utm=abc#top"]);
});

test("script does NOT redirect on the apex or www domain", async ({ page }) => {
  const script = extractRedirectScript();
  await page.goto("data:text/html,<html><body>x</body></html>");
  const result = await page.evaluate((snippet) => {
    const calls: string[] = [];
    for (const hostname of ["cyryxlabs.com", "www.cyryxlabs.com"]) {
      const fakeLocation = {
        hostname,
        pathname: "/",
        search: "",
        hash: "",
        replace: (url: string) => calls.push(`${hostname}->${url}`),
      };
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      new Function("window", `with(window){${snippet}}`)({ location: fakeLocation });
    }
    return calls;
  }, script);
  expect(result).toEqual([]);
});

test("script does NOT redirect when already on a /workspace path", async ({ page }) => {
  const script = extractRedirectScript();
  await page.goto("data:text/html,<html><body>x</body></html>");
  const result = await page.evaluate((snippet) => {
    const calls: string[] = [];
    const fakeLocation = {
      hostname: "workspace.cyryxlabs.com",
      pathname: "/workspace/pipeline",
      search: "",
      hash: "",
      replace: (url: string) => calls.push(url),
    };
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    new Function("window", `with(window){${snippet}}`)({ location: fakeLocation });
    return calls;
  }, script);
  expect(result).toEqual([]);
});