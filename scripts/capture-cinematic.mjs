import { chromium, webkit, firefox } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const output = resolve(process.env.REVIEW_OUTPUT_DIR || "/tmp/cyryx-review-final");
await mkdir(output, { recursive: true });
const base = process.env.REVIEW_BASE_URL || "http://127.0.0.1:4175";
const installedChromium =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ||
  (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);
const requested = (process.env.REVIEW_BROWSERS || "desktop,mobile,safari-mobile").split(",");
const profiles = [
  ["desktop", chromium, { width: 1920, height: 1080 }],
  ["mobile", chromium, { width: 390, height: 844 }],
  ["safari-mobile", webkit, { width: 390, height: 844 }],
  ["firefox-desktop", firefox, { width: 1920, height: 1080 }],
];
const results = [];
const sourceRevision = execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
for (const [name, browserType, viewport] of profiles.filter(([name]) => requested.includes(name))) {
  const browser = await browserType.launch(
    browserType === chromium && installedChromium ? { executablePath: installedChromium } : {},
  );
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const errors = [];
  const consoleErrors = [];
  page.on("pageerror", (err) => errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.documentElement.dataset.cyryxHydrated === "true");
  await page.waitForFunction(() => document.documentElement.dataset.cyryxScrollReady === "true");
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${output}/${name}-hero.png` });
  const heroHeight = await page
    .locator("[data-hero]")
    .evaluate((el) => el.getBoundingClientRect().height);
  const ctaVisible = await page.locator('[data-cta="primary"]').evaluate((el) => {
    const r = el.getBoundingClientRect();
    return r.top > 60 && r.bottom <= innerHeight;
  });
  const capture = async (id, target = `#${id}`) => {
    await page.locator(target).evaluate((el) =>
      window.scrollTo({
        top: el.getBoundingClientRect().top + scrollY - (innerWidth < 768 ? 80 : 110),
        behavior: "instant",
      }),
    );
    await page.waitForTimeout(1400);
    await page.screenshot({ path: `${output}/${name}-${id}.png` });
  };
  for (const id of [
    "operating-model",
    "controlled-execution",
    "security",
    "evidence",
    "our-products",
    "research",
    "team",
    "contact",
  ])
    await capture(id);
  await capture("service-stage", "#service-visual");
  for (const [index, view] of [
    [1, "workflow"],
    [2, "prototype"],
  ]) {
    // The button is deliberately outside the current viewport on phones;
    // programmatic click models selection without an unsolicited scroll.
    await page
      .locator(".cinema-service button")
      .nth(index)
      .evaluate((el) => el.click());
    await page.waitForTimeout(450);
    await page.screenshot({ path: `${output}/${name}-service-${view}.png` });
  }
  await capture("invoice", ".cinema-invoice");
  await capture("draft", ".cinema-draft");
  const dimensions = await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  }));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForFunction(() => document.documentElement.dataset.cyryxScrollReady === "true");
  const refreshedY = await page.evaluate(() => scrollY);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.waitForFunction(() =>
    [...document.images].every((img) => img.complete && img.naturalWidth > 0),
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({ path: `${output}/${name}-reduced-motion.png` });
  await page.screenshot({ path: `${output}/${name}-full.png`, fullPage: true });
  const activeAnimations = await page.evaluate(
    () => document.getAnimations().filter((a) => a.playState === "running").length,
  );
  const imageFailures = await page
    .locator("img")
    .evaluateAll((images) =>
      images.filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src),
    );
  results.push({
    name,
    sourceRevision,
    heroHeight,
    ctaVisible,
    refreshedY,
    dimensions,
    activeAnimations,
    imageFailures,
    errors,
    consoleErrors,
  });
  await browser.close();
}
await writeFile(`${output}/browser-measurements.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
