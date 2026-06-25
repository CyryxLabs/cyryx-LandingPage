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

// --- Validate input ---------------------------------------------------------
if (!/^\d+$/.test(runId)) {
  console.error(`❌ Invalid run identifier: "${target}"`);
  console.error(`   Expected a numeric run ID or a URL like:`);
  console.error(`   https://github.com/<owner>/<repo>/actions/runs/<run-id>`);
  process.exit(1);
}
if (!repo) {
  console.error(`❌ Missing --repo owner/name (cannot infer from "${target}")`);
  process.exit(1);
}
if (!/^[^/]+\/[^/]+$/.test(repo)) {
  console.error(`❌ Invalid --repo "${repo}". Expected "owner/name".`);
  process.exit(1);
}

const ghCheck = spawnSync("gh", ["--version"], { stdio: "ignore" });
if (ghCheck.status !== 0) {
  console.error("❌ GitHub CLI (`gh`) not found. Install: https://cli.github.com/");
  process.exit(1);
}

const authCheck = spawnSync("gh", ["auth", "status"], { stdio: "pipe", encoding: "utf8" });
if (authCheck.status !== 0) {
  console.error("❌ `gh` is not authenticated. Run: gh auth login");
  console.error("   (need scopes: repo, read:org if private; actions:read to download artifacts)");
  if (authCheck.stderr) console.error(authCheck.stderr.trim());
  process.exit(1);
}

mkdirSync(out, { recursive: true });

const baseArgs = ["run", "download", runId, "--dir", out];
if (repo) baseArgs.push("--repo", repo);

const artifacts = ["a11y-report", "axe-raw-json", "jsonld-snapshot-updated"];
const found = [];
const missing = [];
for (const name of artifacts) {
  console.log(`\n▶ Downloading artifact: ${name}`);
  const r = spawnSync("gh", [...baseArgs, "--name", name], { stdio: "pipe", encoding: "utf8" });
  if (r.status === 0) {
    found.push(name);
    console.log(`  ✓ downloaded`);
  } else {
    missing.push(name);
    const err = (r.stderr || "").trim();
    if (/HTTP 403/i.test(err) || /permission/i.test(err)) {
      console.error(`  ✖ permission denied for "${name}" — token lacks "actions:read" or repo access.`);
    } else if (/HTTP 404/i.test(err) || /not found/i.test(err)) {
      console.warn(`  (not present on run ${runId})`);
    } else {
      console.warn(`  (skipped: ${err.split("\n")[0] || "unknown error"})`);
    }
  }
}

console.log(`\n── Summary ──`);
console.log(`  Found:   ${found.length ? found.join(", ") : "(none)"}`);
console.log(`  Missing: ${missing.length ? missing.join(", ") : "(none)"}`);

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