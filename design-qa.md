# Design QA — Approved Structural Aperture Internal Heroes

## Visual contract

- Source of truth: `C:\Users\ppetr\.codex\generated_images\019fc93a-d787-7123-bf8f-510c22d52b9f\exec-dc366aef-18b5-4ca4-b14e-926e46f7c86f.png` (approved Option 3, 1487 × 1058).
- The approved composition is the contract: editorial serif headline, visible Structural Aperture, quiet near-black field, narrow vertical lifecycle rail, and outlined primary CTA.
- Brand governance exception: Cormorant Garamond is limited to internal-hero H1s. Space Grotesk, Inter, and IBM Plex Mono remain the product/brand UI stack elsewhere.
- The reference image is implemented as a real responsive WebP, not recreated with CSS.

## Corrected implementation evidence

| Surface           | Result | Evidence                                                                                                                                                                                                              |
| ----------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Composition       | Passed | Desktop content begins at approximately 19vw, the default headline is constrained to 42vw, and the lifecycle rail sits near 75vw.                                                                                     |
| Typography        | Passed | Company H1 renders in Cormorant Garamond at 89.6px / 86.016px in the tested 1280px viewport and preserves the approved four-line rhythm.                                                                              |
| Structural asset  | Passed | Aperture opacity is 0.52 on desktop with a reduced 0.48 black overlay, so the approved material is visible without becoming a game-like neon field.                                                                   |
| Copy hierarchy    | Passed | Company uses the exact approved headline, then a concrete company description, the Advise / Build / Control / Operate sequence, CTA pair, scope boundary, and vertical operating-model rail.                          |
| CTA treatment     | Passed | The hero primary action uses an outlined treatment; the secondary action remains visually subordinate. The final Company CTA reaches the context-aware `/start?source=company&intent=operating-capability` route.     |
| Solutions fit     | Passed | `/solutions` uses the governed `compact` title scale: 64px, 380px maximum width, five lines at 1280 × 720, with no horizontal overflow. Other internal routes retain the default approved scale.                      |
| Responsive layout | Passed | At 390 × 844, the hero remains overflow-free, the aperture is retained at 0.48 opacity, and the mobile navigation opens with the body lock applied.                                                                   |
| Runtime integrity | Passed | The production-style Node build served `/company`, `/solutions`, and `/start` with HTTP 200; all three hydrated (`data-cyryx-hydrated="true"`). The Company CTA navigation and form render were exercised in-browser. |
| Accessibility     | Passed | Semantic headings and landmarks, descriptive links, readable contrast, restrained motion, and touch targets remain intact.                                                                                            |

## Correction history

1. The first implementation over-adapted the reference: it replaced the approved serif with Space Grotesk, reduced the aperture to near invisibility, used a generic wide SaaS headline, and filled the primary CTA.
2. The user correctly rejected that result. The prior visual PASS was superseded by corrective UX and Brand gates.
3. The current implementation treats Option 3 as the source of truth and restores its essential hierarchy while keeping public claims evidence-bounded and mobile behavior intact.
4. `/solutions` received only a compact title-scale variant because its longer sentence exceeded the reference composition at the default scale.

## Measured browser checks

- `/company`, 1280 × 720: H1 x=243.2, y=231, width=537.6, four lines; page width 1265/1265; no horizontal overflow.
- `/solutions`, 1280 × 720: H1 x=243.2, y=167, width=380, height=307.2, five lines; hero height 747.7; no horizontal overflow.
- `/solutions`, 390 × 844 preset: content width 375/375; no horizontal overflow; mobile menu opens and body overflow becomes `hidden`.
- `/start`: one form rendered with the contextual source and intent preserved after CTA navigation.

## Scope boundary

This document passes the corrected Structural Aperture visual/runtime gate only. It does not waive the story's existing release-readiness blockers: repository-wide lint debt and execution of the Supabase migration/persistence boundary against an authorized database.

## Brushed-steel enterprise extension — 2026-08-08

- The approved Structural Aperture remains the source image; no decorative replacement or game-like visual field was introduced.
- New governed material tokens define highlight, midtone, shadow, edge, directional sheen, brush, panel base, and inset shadow. Components consume reusable classes instead of route-specific material values.
- The internal-hero grade is now directional: it protects the central reading field while revealing the brushed-steel architecture at the left and right edges.
- A shared “Next chapter” transition continues the narrative below every primary internal hero. Company, Solutions, Careers, Engagement Model, Managed Operations, Products, Research, and the shared wrapper for eleven solution-detail routes each provide page-specific transition copy.
- Brushed dark-steel panels are limited to buyer-choice, product, research, operating-area, form, architecture, phase, KPI, and FAQ surfaces. Teal remains a signal color rather than an ambient glow.
- Mobile uses narrow generated steel edges plus the responsive source asset, preserving the material language without narrowing the readable content column.

### Current validation evidence

- `bun run typecheck` — PASS.
- `bun run test:unit` — PASS, 37 tests / 120 expectations.
- Focused ESLint over the nine changed TS/TSX implementation files — PASS.
- `bun run build` — PASS; existing plugin-timing and large-chunk warnings remain unchanged.
- Desktop visual review: Company at 1440 × 1000 and Solutions at 1440 × 1000 — PASS for reference fidelity, hierarchy, material restraint, and storytelling transition.
- Mobile visual review: Company at 390 × 844 — PASS after increasing the visibility of the narrow structural steel edges.
- The attempted extended Playwright route matrix was not counted as passing evidence because the local Chromium headless harness timed out during browser launch. This does not supersede the passing screenshots or existing responsive gate; a clean full-browser rerun remains appropriate before publication.

final result: passed
