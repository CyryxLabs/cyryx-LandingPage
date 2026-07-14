# Phase 3B — JSON-LD Terminology Alignment

## Objective
Replace the outdated slogan `The execution layer for operational AI.` with the approved `The execution layer for enterprise AI.` in exactly two files. Structured-data only; no visible copy, hero, routes, nav, sitemap, or metadata changes.

## Pre-change verification (already confirmed via file context)
- `src/routes/index.tsx` — Organization JSON-LD node contains `slogan: "The execution layer for operational AI.",`
- `tests/accessibility/__snapshots__/jsonld.snapshot.json` — Organization block contains `"slogan": "The execution layer for operational AI.",`
- Hero copy in `src/components/cyryx/Hero.tsx` / `src/copy/v3.ts` already uses "enterprise AI" (per Phase 1/3A lock) — will not be touched.

## Authorized edits (exactly two, minimal textual)

### Edit 1 — `src/routes/index.tsx`
Inside the Organization node of the `@graph` JSON-LD:
- Before: `slogan: "The execution layer for operational AI.",`
- After:  `slogan: "The execution layer for enterprise AI.",`

No other property, ordering, formatting, or node changes.

### Edit 2 — `tests/accessibility/__snapshots__/jsonld.snapshot.json`
In the `Organization` object:
- Before: `"slogan": "The execution layer for operational AI.",`
- After:  `"slogan": "The execution layer for enterprise AI.",`

No other snapshot keys or values change. No snapshot regeneration.

## Explicit non-changes
No modification to: JSON-LD @type / @id / name / description / url / sameAs / knowsAbout / makesOffer / SoftwareApplication / WebSite / WebPage nodes; meta/OG/Twitter/canonical; hero component, copy, tests; routes, redirects, navigation, sitemap, robots; styles, assets, deps, lockfiles, generated route files; `.lovable/plan.md`. No global replace of "operational AI".

## Validation

### Textual assertions
- `rg -n "enterprise AI" src/routes/index.tsx` → matches slogan line.
- `rg -n "operational AI" src/routes/index.tsx` → zero matches within the Organization JSON-LD block (and file overall).
- `rg -n "enterprise AI" tests/accessibility/__snapshots__/jsonld.snapshot.json` → matches slogan.
- `rg -n "operational AI" tests/accessibility/__snapshots__/jsonld.snapshot.json` → zero matches.

### Untouched-file assertions
Confirm no diff in:
- `src/components/cyryx/Hero.tsx`
- `src/copy/v3.ts`
- `tests/accessibility/copy-validation.spec.ts`
- `tests/accessibility/hero.spec.ts`
- `tests/accessibility/hero-video.spec.ts`
- `tests/accessibility/hero-video-lazy.spec.ts`

### Changed-file set assertion
Only `src/routes/index.tsx` and `tests/accessibility/__snapshots__/jsonld.snapshot.json` appear as modified. If any generated file (e.g. `src/routeTree.gen.ts`) is auto-touched by tooling, halt and report before proceeding.

## Tests

1. `bun run tsgo` — typecheck.
2. `bunx playwright test tests/accessibility/jsonld-snapshot.spec.ts` — targeted snapshot suite (validates Organization slogan snapshot equality).

`tests/accessibility/jsonld-pages.spec.ts` will be run only if the snapshot suite indicates a shared dependency. Playwright browsers will not be installed; if unavailable, report `NOT EXECUTED — ENVIRONMENT LIMITATION` without further changes.

No snapshot regeneration commands. No `UPDATE_JSONLD_SNAPSHOT=1`. No test edits to force pass.

## Change control
No commit, push, publish, deploy, branch, or PR. Phase 4 not started.

## Evidence report (delivered after execution)
19-item Phase 3B Evidence Report per spec, ending exactly with:

`PHASE 3B COMPLETE — JSON-LD TERMINOLOGY ALIGNED — AWAITING FOUNDER APPROVAL FOR PHASE 4.`

## Risks
- Playwright browser binary may be unavailable in sandbox → test reported as `NOT EXECUTED — ENVIRONMENT LIMITATION`; source correctness still verified via `rg` textual checks.
- Route-tree code-splitter may re-touch `src/routeTree.gen.ts` on typecheck; if so, disclosed in evidence report as an unexpected generated-file touch (no manual edit performed).
