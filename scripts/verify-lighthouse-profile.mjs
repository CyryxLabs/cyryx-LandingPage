#!/usr/bin/env node
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

// Check measured settings, independently of performance budget assertions.
// LHCI autorun still exports reports after a failed budget assertion.
const [, , expected, directory] = process.argv;
if (!["mobile", "desktop"].includes(expected) || !directory) {
  throw new Error("Usage: verify-lighthouse-profile.mjs <mobile|desktop> <report-directory>");
}
const files = readdirSync(directory).filter((name) => name.endsWith(".report.json"));
if (!files.length) throw new Error("No Lighthouse reports found; profile was not verified.");
for (const file of files) {
  const report = JSON.parse(readFileSync(join(directory, file), "utf8"));
  const settings = report.configSettings;
  const mobile = expected === "mobile";
  if (
    settings?.formFactor !== expected ||
    settings.screenEmulation?.mobile !== mobile ||
    settings.screenEmulation?.disabled !== false ||
    settings.throttlingMethod !== "simulate" ||
    (mobile &&
      (settings.screenEmulation.width !== 412 ||
        settings.screenEmulation.height !== 823 ||
        settings.screenEmulation.deviceScaleFactor !== 1.75 ||
        settings.throttling?.cpuSlowdownMultiplier !== 4 ||
        settings.throttling?.rttMs !== 150 ||
        settings.throttling?.throughputKbps !== 1638.4))
  ) {
    throw new Error(`Unexpected ${expected} profile in ${file}: ${JSON.stringify(settings)}`);
  }
  console.log(
    JSON.stringify({
      file,
      lighthouseVersion: report.lighthouseVersion,
      formFactor: settings.formFactor,
      screenEmulation: settings.screenEmulation,
      throttlingMethod: settings.throttlingMethod,
      throttling: settings.throttling,
    }),
  );
}
console.log(`Verified ${files.length} effective ${expected} Lighthouse profiles.`);
