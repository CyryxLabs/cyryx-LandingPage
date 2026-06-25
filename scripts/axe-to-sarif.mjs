#!/usr/bin/env node
// Convert axe JSON reports (a11y-report/*.json) into a single SARIF v2.1.0 file
// for GitHub Code Scanning.
// Usage: node scripts/axe-to-sarif.mjs <inputDir> <outputFile>
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [, , inputDir = "a11y-report", outputFile = "a11y-report/axe.sarif"] = process.argv;
if (!existsSync(inputDir)) {
  console.error(`Input dir not found: ${inputDir}`);
  process.exit(0);
}

const impactToLevel = { critical: "error", serious: "error", moderate: "warning", minor: "note" };
const rules = new Map();
const results = [];

for (const file of readdirSync(inputDir).filter((f) => f.endsWith(".json"))) {
  const report = JSON.parse(readFileSync(join(inputDir, file), "utf8"));
  for (const v of report.violations ?? []) {
    if (!rules.has(v.id)) {
      rules.set(v.id, {
        id: v.id,
        name: v.id,
        shortDescription: { text: v.help },
        fullDescription: { text: v.description },
        helpUri: v.helpUrl,
        defaultConfiguration: { level: impactToLevel[v.impact ?? "moderate"] ?? "warning" },
      });
    }
    for (const node of v.nodes ?? []) {
      results.push({
        ruleId: v.id,
        level: impactToLevel[v.impact ?? "moderate"] ?? "warning",
        message: { text: node.failureSummary ?? v.help },
        locations: [
          {
            physicalLocation: {
              artifactLocation: { uri: `a11y-report/${file}` },
              region: { startLine: 1 },
            },
            logicalLocations: [{ name: node.target.join(" "), kind: "element" }],
          },
        ],
        properties: { project: file.replace(/\.json$/, ""), impact: v.impact, target: node.target },
      });
    }
  }
}

const sarif = {
  $schema: "https://json.schemastore.org/sarif-2.1.0.json",
  version: "2.1.0",
  runs: [
    {
      tool: {
        driver: {
          name: "axe-core",
          informationUri: "https://github.com/dequelabs/axe-core",
          rules: Array.from(rules.values()),
        },
      },
      results,
    },
  ],
};

writeFileSync(outputFile, JSON.stringify(sarif, null, 2));
console.log(`Wrote ${results.length} axe violations to ${outputFile}`);