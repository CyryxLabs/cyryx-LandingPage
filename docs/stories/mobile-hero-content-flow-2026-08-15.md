# Mobile Hero Content Flow

**Status:** Ready for Review
**Date:** 2026-08-15
**Owner:** UX/UI + Frontend
**Source:** User-provided mobile production screenshot

## User need

On mobile, the primary hero copy panel currently covers the animated hero media. The media should
lead the experience and the content panel should follow below it in normal document flow.

At the end of the scrollytelling introduction, the final narrative overlay must clear before the
Cyryx brand mark resolves. The logo reveal is a visual signature and cannot compete with body copy.

## Acceptance criteria

- [x] At viewport widths below 768px, the hero media/scrollytelling scene appears before the primary
      copy panel; their rendered rectangles do not overlap.
- [x] The mobile copy panel remains readable, full-width within the existing page gutter, and keeps
      both existing calls to action keyboard- and touch-accessible.
- [x] The mobile image sequence, scroll progress, story overlays, loading state, reduced-motion mode,
      and low-performance fallback continue to work.
- [x] At 768px and above, the existing sticky overlay composition and scroll-linked hero behavior are
      visually and functionally unchanged.
- [x] The hero uses one semantic heading and one set of calls to action at every breakpoint.
- [x] The final narrative overlay finishes fading out before the resolved Cyryx logo frames on both
      mobile and desktop, leaving the brand signature unobstructed.
- [x] Earlier narrative beats remain present and readable; no approved copy or sequence frames are
      removed to solve the collision.
- [ ] Focused responsive, accessibility, typecheck, lint, test, and production-build gates pass.

## Implementation notes

- Keep the animated media inside a dedicated scroll scene.
- Keep one content DOM tree. Use a responsive content layer that is in normal flow on mobile and an
  absolute/sticky overlay on tablet and desktop.
- Bind canvas progress to the scroll scene rather than the outer section so the below-media content
  does not change frame interpolation.
- Reserve the final quarter of the sequence for the Cyryx logo reveal by giving every narrative
  panel an explicit exit window.

## File list

- [x] `src/components/cyryx/Hero.tsx`
- [x] `src/hooks/useCyryxScrollAnimations.ts`
- [x] `src/styles.css`
- [x] `tests/accessibility/hero.spec.ts`
- [x] `tests/accessibility/scrolltrigger-breakpoints.spec.ts`
- [x] `docs/stories/mobile-hero-content-flow-2026-08-15.md`

## Validation evidence

- TypeScript: passed with the production dependency set (`tsc --noEmit`).
- ESLint: changed TypeScript and TSX files passed the production ESLint configuration.
- Prettier and `git diff --check`: passed for all changed files.
- Production build: passed for client and SSR output with `NODE_ENV=production` and the production
  dependency set.
- Unit tests: 32 assertions passed. One unrelated migration contract could not resolve its
  repository-relative fixture from the isolated validation clone.
- Browser verification at 390 x 844: the scroll scene ended at document Y=3376 and the content layer
  began at document Y=3376; at page load the panel was outside the viewport. After scrolling to the
  transition, the scene ended at viewport Y=176 and the panel began at Y=217.
- Browser verification at 1024 x 900: the content layer remained absolute across the 400svh scene,
  the content container remained sticky, and exactly one heading and one primary CTA were rendered.
- Focused Playwright cases were added for the responsive geometry. Their local execution is still
  open because the managed environment denied launching the headless Chromium binary (`EPERM`).
- Brand-reveal browser verification at 390 x 844 and 1280 x 900: at 67% progress the third narrative
  remained fully visible (`opacity: 1`, frame 27); at 90% it was hidden (`opacity: 0`, frame 36); at
  frame 40 all narrative panels remained hidden and the complete Cyryx signature was unobstructed.
- Brand-reveal regression coverage now verifies the narrative and final-logo states in both mobile
  and desktop viewports. The Playwright runner could not execute the assertion because its headless
  Chromium process timed out during launch after 180 seconds, before page navigation.
- Current focused gates: TypeScript passed, changed-file ESLint passed, Prettier and
  `git diff --check` passed, 37 unit tests passed, and the production client/SSR build passed.
