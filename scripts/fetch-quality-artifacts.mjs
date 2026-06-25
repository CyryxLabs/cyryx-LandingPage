#!/usr/bin/env node
// Downloads the SARIF + raw axe JSON artifacts for a given GitHub Actions run
// and prints suggested local viewer commands.
//
// Usage:
//   node scripts/fetch-quality-artifacts.mjs <run-url-or-id> [--repo owner/name] [--out ./ci-artifacts]
//
// Requires the GitHub CLI (`gh`) to be installed and authenticated.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: fetch-quality-artifacts.mjs <run-url-or-id> [--repo owner/name] [--out dir]");
  process.exit(1);
}

const target = args[0];
const repoFlag = args.indexOf("--repo");
const outFlag = args.indexOf("--out");
const out = resolve(outFlag >= 0 ? args[outFlag + 1] : "./ci-artifacts");

let runId = target;
let repo = repoFlag >= 0 ? args[repoFlag + 1] : null;
const urlMatch = target.match(/github\.com\/([^/]+\/[^/]+)\/actions\/runs\/(\d+)/);
if (urlMatch) {
  repo = repo ?? urlMatch[1];
  runId = urlMatch[2];
}

const ghCheck = spawnSync("gh", ["--version"], { stdio: "ignore" });
if (ghCheck.status !== 0) {
  console.error("❌ GitHub CLI (`gh`) not found. Install: https://cli.github.com/");
  process.exit(1);
}

mkdirSync(out, { recursive: true });

const baseArgs = ["run", "download", runId, "--dir", out];
if (repo) baseArgs.push("--repo", repo);

const artifacts = ["a11y-report", "axe-raw-json", "jsonld-snapshot-updated"];
for (const name of artifacts) {
  console.log(`\n▶ Downloading artifact: ${name}`);
  const r = spawnSync("gh", [...baseArgs, "--name", name], { stdio: "inherit" });
  if (r.status !== 0) console.warn(`  (skipped: ${name} not present on run ${runId})`);
}

const sarif = resolve(out, "a11y-report/axe.sarif");
const rawJsonDir = resolve(out, "axe-raw-json");

console.log(`\n✅ Downloaded to: ${out}`);
console.log(`\nOpen with:`);
if (existsSync(sarif)) {
  console.log(`  • VS Code (SARIF Viewer ext): code --goto "${sarif}"`);
  console.log(`  • Pretty-print:               jq . "${sarif}" | less`);
}
if (existsSync(rawJsonDir)) {
  console.log(`  • Raw axe JSON:               ls "${rawJsonDir}" && jq . "${rawJsonDir}"/*.json | less`);
}
const snap = resolve(out, "jsonld-snapshot-updated/jsonld.snapshot.json");
if (existsSync(snap)) {
  console.log(`  • JSON-LD snapshot diff:      diff tests/accessibility/__snapshots__/jsonld.snapshot.json "${snap}"`);
}