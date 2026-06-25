# Cyryx Labs landing

TanStack Start app for the Cyryx Labs landing page.

## Quality gates (CI)

The `Quality` GitHub Actions workflow runs on every PR and produces:

- **Accessibility report** (`a11y-report/`) — axe-core JSON + HTML per project, plus a SARIF file uploaded to GitHub code scanning so violations appear inline in the PR diff under the *Security* tab.
- **Raw axe-core JSON** (`axe-raw-json/`) — uploaded as a separate artifact so you can inspect full violation payloads (every node, every failure summary) without unpacking the combined a11y report.
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
| `UPDATE_JSONLD_SNAPSHOT` | _(unset)_ | Set to `1` to regenerate the JSON-LD snapshot during the run instead of asserting against it |

The LHCI configs (`lighthouserc.mobile.json`, `lighthouserc.desktop.json`) ship with `"LH_*"` placeholders; `scripts/render-lhci-config.mjs` substitutes the env values into `lhci.runtime.json` before each run.

### Forbidden terms

Compliance + positioning rules live in `.quality/forbidden-terms.json` — edit that file (or point `FORBIDDEN_TERMS_FILE` at a different one) to update the guardrail set without changing tests. Each entry is `{ label, pattern, flags? }` where `pattern` is a JavaScript regex source. Used by both the source scan and the production-bundle scan.

The first step of the `a11y-content-seo` job runs `scripts/validate-forbidden-terms.mjs`, which schema-validates the file (root shape, required `label`/`pattern`, compilable regex, unique labels) and prints the **active rule set** to the build log before any scan runs, so you can see exactly which patterns are enforced.

### Updating the JSON-LD snapshot

`tests/accessibility/jsonld-snapshot.spec.ts` pins stable Organization + SoftwareApplication fields against `tests/accessibility/__snapshots__/jsonld.snapshot.json`. Two ways to refresh it after an intentional change:

- **Locally**: `UPDATE_JSONLD_SNAPSHOT=1 bun run test:a11y -- --grep "JSON-LD"`, then commit the updated snapshot.
- **From GitHub**: open the **Quality** workflow → **Run workflow** → check **Regenerate the schema.org JSON-LD snapshot**. The run uploads `jsonld-snapshot-updated` as an artifact; download it, drop it into `tests/accessibility/__snapshots__/jsonld.snapshot.json`, and commit. (You can also set repo variable `UPDATE_JSONLD_SNAPSHOT=1` to make every run regenerate, but that disables the drift check — use only briefly during a copy refactor.)

Commit the updated snapshot alongside the source change. Subsequent CI runs fail if the rendered JSON-LD drifts from it.

## Enabling GitHub Code scanning (for axe SARIF)

The workflow uploads axe-core violations as SARIF via `github/codeql-action/upload-sarif`. To make them appear under **Security → Code scanning alerts**:

1. **Enable Code scanning on the repo**
   - Public repos: free. Settings → *Code security and analysis* → **Code scanning** → Set up.
   - Private repos: requires **GitHub Advanced Security**. Same path; enable GHAS first if your org plan supports it. Without GHAS the upload step will fail with `403 Advanced Security must be enabled for this repository to use code scanning`.

2. **Grant the workflow `security-events: write`**
   - The `a11y-content-seo` job already declares this permission inline (see `permissions:` block), which is enough when the repo default is read-only.
   - If you set permissions at the org/repo level (Settings → *Actions* → *General* → *Workflow permissions*), make sure **Read and write permissions** is selected, OR keep "Read repository contents and packages permissions" and rely on the job-level override that ships here.

3. **Fork PR limitation**: SARIF uploads from PRs opened by forks are skipped by GitHub for security reasons. Internal branch PRs get inline annotations; fork PRs still get the SARIF in the `a11y-report` artifact.

4. **First run**: the SARIF tab populates after one successful upload on the default branch. Re-run the workflow on `main` once after enabling code scanning if PRs aren't showing alerts yet.

## Local commands

```bash
bun install
bun run dev          # local dev server
bun run build        # production build (runs a11y suite in CI)
bun run test:a11y    # Playwright suite (a11y + content + SEO + JSON-LD + bundle scan)
```