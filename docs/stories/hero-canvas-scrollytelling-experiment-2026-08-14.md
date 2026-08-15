# Story: Homepage Hero Canvas Scrollytelling Experiment

## Status

Ready for Review

## Context

The owner requested a local hero experiment using the 40-frame Cyryx image sequence from `C:\Users\ppetr\Downloads\ezgif-6c0f1542ccd2a695-jpg`. The reference implementation described a Next.js/Framer Motion watch sequence; this repository uses TanStack Start, React 19, Tailwind CSS, GSAP, and an established Cyryx homepage narrative. The experiment must therefore preserve the approved Cyryx copy, CTA destinations, accessibility contract, and existing stack while reproducing the requested canvas-based scroll mechanic.

## Acceptance Criteria

- [x] AC1 — The homepage hero renders the supplied Cyryx sequence through a responsive HTML canvas.
- [x] AC2 — Scroll progress maps deterministically across all 40 source frames with no autoplay fallback.
- [x] AC3 — The visual sequence is preloaded before scroll-linked playback becomes active and exposes an accessible loading state.
- [x] AC4 — The existing approved headline, supporting copy, CTA labels, CTA destinations, and analytics hooks remain unchanged.
- [x] AC5 — Canvas rendering uses device-pixel-ratio scaling, contain/cover art direction appropriate to the viewport, and animation-frame coalescing.
- [x] AC6 — Reduced-motion and low-performance modes show a stable still frame and do not pin or scrub the sequence.
- [x] AC7 — Mobile layouts remain readable without horizontal overflow, and keyboard/focus behavior remains intact.
- [x] AC8 — Focused lint, typecheck, unit/contract tests, hero accessibility tests, production build, and visual inspection pass for the changed slice.
- [x] AC9 — The experiment remains local/unpublished until the owner explicitly approves publication. Production publication was explicitly authorized on 2026-08-14.

## Tasks

- [x] Confirm the source sequence, frame count, dimensions, and file weight.
- [x] Optimize and copy the sequence into the website asset surface.
- [x] Build the reusable canvas sequence component.
- [x] Integrate sequence progress into the existing GSAP hero timeline.
- [x] Preserve progressive enhancement, loading, reduced-motion, and forced-colors behavior.
- [x] Update focused tests for the new hero media contract.
- [x] Validate desktop and mobile rendering and record results.

## File List

- `bun.lock`
- `.github/workflows/quality.yml`
- `docs/stories/hero-canvas-scrollytelling-experiment-2026-08-14.md`
- `package.json`
- `playwright.config.ts`
- `public/media/hero-sequence/desktop/*.webp` (40 optimized frames)
- `public/media/hero-sequence/mobile/*.webp` (40 optimized frames)
- `src/components/cyryx/CyryxHeroSequence.tsx`
- `src/components/cyryx/Hero.tsx`
- `src/copy/v3.ts`
- `src/hooks/useCyryxScrollAnimations.ts`
- `src/routes/__root.tsx`
- `src/routes/index.tsx`
- `src/styles.css`
- `tests/accessibility/copy-validation.spec.ts`
- `tests/accessibility/hero-video-lazy.spec.ts`
- `tests/accessibility/hero-video.spec.ts`
- `tests/accessibility/header-dropdown.spec.ts`
- `tests/accessibility/maax-waitlist.spec.ts`
- `tests/accessibility/scroll-restoration.spec.ts`
- `tests/accessibility/scrolltrigger-breakpoints.spec.ts`
- `tests/accessibility/seo-metadata.spec.ts`
- `tests/support/vite-client-ready.ts`

## Notes

- Verified input: 40 JPEG frames, each 3840×2160, total 4.78 MB.
- Generated device-specific WebP sequences: 1920×1080 desktop (1.75 MB) and 960×540 mobile (0.64 MB). Each client preloads only its selected variant.
- This is a Cyryx brand experiment. The fictional NOXORA/watch copy is treated as interaction reference only and is not introduced into the public website.
- Focused TypeScript, ESLint, unit, terminology, copy, desktop/mobile Playwright, axe, forced-colors, keyboard, responsive, and production-build checks passed.
- The repository-wide `npm run lint` still reports the known pre-existing baseline of 3,194 findings (3,167 errors and 27 warnings). The package does not define an `npm test` script; its available unit suite is `npm run test:unit`, which passed 37/37.
- Local review URL: `http://127.0.0.1:4184/`. The owner approved production publication after reviewing this runtime; commit, push, deployment, and live smoke-test evidence must be appended before the story can be marked Done.
- The complete local CI matrix initially passed 644 scenarios and reproduced six failures from two shared causes: a decorative CSS percentage collided with the fake-metric guard, and the SEO test still expected retired metadata wording. After correcting both contracts, the release-focused three-project matrix passed 126/126; the remote PR workflow remains the final full-matrix authority.
- A pre-release `bun audit` identified critical advisory `GHSA-mv8w-475r-vwqw` through transitive `seroval@1.5.2`. A root override now pins patched `seroval@1.6.2`; the lockfile resolves one patched version and `bun audit --audit-level=critical` passes.
- The first remote PR run passed Safari mobile, visual regression, and both Lighthouse profiles, while its global Playwright job exposed CI contention plus a deterministic low-performance contract mismatch (630 passed, 40 skipped, 14 failed). The sequence now honors `cx-low-perf`, preloads in four abortable low-priority batches, yields to hydration/GSAP, and the affected three-project rerun passed 131 existing scenarios; the explicit high-performance, low-performance, reduced-motion, and readability contract then passed 15/15.
- The second remote run preserved all non-global gates and reduced the global result to one historical MAAX modal timing failure (649 passed, 40 skipped, 1 failed). The homepage funnel test now scopes the exact MAAX trigger and uses the existing 15-second interaction budget used for loaded CI states.
- The browser matrix now runs against the production Node bundle in CI, eliminating Vite development-server contention while retaining Vite-only readiness handling for development jobs. The final local production matrix passed 653/653 applicable scenarios across Chromium, 360px mobile, and forced-colors profiles; 37 profile-inapplicable scenarios were skipped by design.
- Reload and route-entry scroll restoration now expose a deterministic readiness boundary. After the remote mobile runner exposed a second redundant post-hydration reset, that duplicate was removed; the focused mobile restoration suite then passed 60/60 repeated scenarios. The execution rail passed 9/9 repeated scenarios before the full matrix run.
