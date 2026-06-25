# Cyryx Labs landing

TanStack Start app for the Cyryx Labs landing page.

## Quality gates (CI)

The `Quality` GitHub Actions workflow runs on every PR and produces:

- **Accessibility report** (`a11y-report/`) — axe-core JSON + HTML per project, plus a SARIF file uploaded to GitHub code scanning so violations appear inline in the PR diff under the *Security* tab.
- **Lighthouse reports** (`lighthouse-report-mobile/`, `lighthouse-report-desktop/`) — full LHR JSON + HTML.
- **Playwright HTML report** (`playwright-report/`) — traces and per-test results.
- **PR comment** — `scripts/summarize-quality.mjs` posts a sticky comment with LCP / CLS / TBT for both form factors and axe violations grouped by selector.

### Tuning budgets per branch

All thresholds are env-var driven — set them as **repository or branch variables** in GitHub Settings → Variables → Actions. Defaults shown.

| Variable | Default | Applies to |
| --- | --- | --- |
| `LH_PERF_MIN` | `0.85` | Lighthouse Performance category (warn) |
| `LH_A11Y_MIN` | `0.95` | Lighthouse Accessibility category (error) |
| `LH_SEO_MIN` | `0.95` | Lighthouse SEO category (error) |
| `LH_LCP_MAX_MOBILE` | `3500` | Largest Contentful Paint, ms (mobile) |
| `LH_LCP_MAX_DESKTOP` | `2500` | Largest Contentful Paint, ms (desktop) |
| `LH_TBT_MAX_MOBILE` | `300` | Total Blocking Time, ms (mobile) |
| `LH_TBT_MAX_DESKTOP` | `200` | Total Blocking Time, ms (desktop) |
| `LH_CLS_MAX` | `0.1` | Cumulative Layout Shift (both) |
| `AXE_FAIL_ON` | `critical` | axe impact level that fails the build — `minor` \| `moderate` \| `serious` \| `critical` |
| `FORBIDDEN_TERMS_FILE` | `.quality/forbidden-terms.json` | Path to compliance/positioning guardrail rules |

The LHCI configs (`lighthouserc.mobile.json`, `lighthouserc.desktop.json`) ship with `"LH_*"` placeholders; `scripts/render-lhci-config.mjs` substitutes the env values into `lhci.runtime.json` before each run.

### Forbidden terms

Compliance + positioning rules live in `.quality/forbidden-terms.json` — edit that file (or point `FORBIDDEN_TERMS_FILE` at a different one) to update the guardrail set without changing tests. Each entry is `{ label, pattern, flags? }` where `pattern` is a JavaScript regex source. Used by both the source scan and the production-bundle scan.

### Updating the JSON-LD snapshot

`tests/accessibility/jsonld-snapshot.spec.ts` pins stable Organization + SoftwareApplication fields against `tests/accessibility/__snapshots__/jsonld.snapshot.json`. After an intentional change:

```bash
UPDATE_JSONLD_SNAPSHOT=1 bun run test:a11y -- --grep "JSON-LD"
```

Commit the updated snapshot alongside the source change. Subsequent CI runs fail if the rendered JSON-LD drifts from it.

## Local commands

```bash
bun install
bun run dev          # local dev server
bun run build        # production build (runs a11y suite in CI)
bun run test:a11y    # Playwright suite (a11y + content + SEO + JSON-LD + bundle scan)
```