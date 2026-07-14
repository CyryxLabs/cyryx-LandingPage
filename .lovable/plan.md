# Phase 1 — Hero Copy Reconciliation

## Verification (Step 1)

- Hero component: `src/components/cyryx/Hero.tsx` (renders `copy.hero.headline`, `copy.hero.sub`, `copy.hero.ctaPrimary` → `#contact`, `copy.hero.ctaSecondary` → `#maax`).
- Hero copy source: `src/copy/v3.ts`.
- Hero media: `src/assets/cyryx-hero-monolith-v2-{640,1280,1920}.{webp,avif}` + `cyryx-hero.mp4` (poster + video). Unchanged.

Current vs approved:

| Field | Current | Approved |
|---|---|---|
| headline | "The execution layer for operational AI." | "The execution layer for enterprise AI." |
| sub | "AI products and execution systems — governed agents, automated workflows, and operational infrastructure engineered for accountability and cost control." | "Cyryx Labs builds AI products and execution systems — governed agents, automated workflows, and operational infrastructure engineered for accountability, auditability, and cost control." |
| ctaPrimary (→ `#contact`) | "Explore MAAX Studio" | "Start a project" |
| ctaSecondary (→ `#maax`) | "Start a project" | "MAAX Studio →" |

**Status: COPY MISMATCH.** Assets, layout, animation, composition, links, and visual implementation match approved and stay untouched. CTA link targets already align with approved intent once labels are swapped (primary `#contact` = Start a project; secondary `#maax` = MAAX Studio).

## Files to Modify (max 2)

1. `src/copy/v3.ts` — edit only the 4 `hero` string fields listed above. No structural, schema, markup, style, or unrelated copy changes.
2. `tests/accessibility/copy-validation.spec.ts` — extend with a small `test.describe("Hero — approved copy lock")` block asserting the 4 exact strings on `getCopy("v3").hero` and forbidding the literal `"The execution layer for business AI."`. Extending an existing spec (not adding a new file) keeps the regression protection minimal and colocated with existing copy validation.

No other files will be touched. `Hero.tsx` markup already renders these fields; the secondary CTA `aria-label="Explore MAAX Studio — flagship product"` is descriptive-only and stays (not user-visible copy).

## Out of Scope (explicitly not changed)

- `Hero.tsx` markup, styles, animation, ARIA structure, CTA `href`s.
- Any hero image, video, poster, font, or 3D asset.
- Other homepage sections, routes, SEO metadata, JSON-LD (the JSON-LD `slogan` in `src/routes/index.tsx` and its snapshot use organization slogan text — outside Phase 1 hero-copy scope; will flag as Remaining Risk).
- Playwright config, visual-regression baselines, thresholds.
- Dependencies, build config, formatting of unrelated code.

## Validation

- `bun run tsgo` (or project typecheck) on the two edited files' impact.
- `bunx playwright test tests/accessibility/copy-validation.spec.ts tests/accessibility/hero.spec.ts` (existing hero + extended copy-lock spec).

No auto-fix. No install. No deploy.

## Remaining Risks (to report, not fix in Phase 1)

- `src/routes/index.tsx` JSON-LD `slogan` and `tests/accessibility/__snapshots__/jsonld.snapshot.json` still contain "operational AI" — out of Phase 1 scope; flag for founder decision in a later phase.
- No dedicated visual-regression baseline exists for the hero; `tests/accessibility/visual-regression.spec.ts` covers solution/privacy/terms only. Per instructions, no new VR framework will be introduced; hero visual verification remains manual.
