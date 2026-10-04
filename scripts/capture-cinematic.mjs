import { chromium, webkit } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const output = new URL("../../review-artifacts/", import.meta.url).pathname.replace(
  /^\/(\w:)/,
  "$1",
);
await mkdir(output, { recursive: true });
const base = process.env.REVIEW_BASE_URL || "http://127.0.0.1:4175";
const results = [];
for (const [name, browserType, viewport] of [
  ["desktop", chromium, { width: 1920, height: 1080 }],
  ["mobile", chromium, { width: 390, height: 844 }],
  ["safari-mobile", webkit, { width: 390, height: 844 }],
]) {
  const browser = await browserType.launch();
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
  await page.screenshot({ path: `${output}/${name}-hero.png` });
  const heroHeight = await page
    .locator("[data-hero]")
    .evaluate((el) => el.getBoundingClientRect().height);
  const ctaVisible = await page.locator('[data-cta="primary"]').evaluate((el) => {
    const r = el.getBoundingClientRect();
    return r.top > 60 && r.bottom <= innerHeight;
  });
  for (const id of [
    "controlled-execution",
    "operating-model",
    "security",
    "evidence",
    "research",
    "contact",
  ]) {
    await page.locator(`#${id}`).evaluate((el) =>
      window.scrollTo({
        top: el.getBoundingClientRect().top + scrollY - 110,
        behavior: "instant",
      }),
    );
    await page.waitForTimeout(id === "controlled-execution" ? 8000 : 400);
    await page.screenshot({ path: `${output}/${name}-${id}.png` });
    if (id === "controlled-execution" && viewport.width < 768) {
      await page.locator(".cinema-invoice").evaluate((el) =>
        window.scrollTo({
          top: el.getBoundingClientRect().top + scrollY - 120,
          behavior: "instant",
        }),
      );
      await page.screenshot({ path: `${output}/${name}-invoice.png` });
    }
  }
  const dimensions = await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  }));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.reload({ waitUntil: "networkidle" });
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
