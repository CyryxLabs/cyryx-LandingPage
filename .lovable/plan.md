## Direction

Building **v3 — Kinetic Industrial Command**: the monolith logo becomes the recurring scroll anchor, a continuous teal core line draws down the page connecting sections, capabilities and command panels orbit around it. Locked taste preserved: onyx `#0A0A0A` / graphite `#121417` / teal `#00E6D0` / silver `#C7C9CC`, Orbitron display + Inter body, full-width stacked sections.

## What changes vs. current

- **Hero**: oversized centered monolith as the hero anchor (replaces side-by-side dashboard layout); two-line Orbitron headline below; HUD dashboard becomes a wider, lower-mounted "console" panel underneath rather than a sibling card.
- **Capability strip**: from 5 stacked cards to a single instrument-bar with numbered slots `01–05` divided by vertical hairlines.
- **Why Cyryx**: from editorial stack with 4 bullets + 3 stats to a clean 2-col (eyebrow + Orbitron headline left / paragraph + manifesto link right). Stats move to a thin telemetry rail above the section.
- **Core Capabilities**: 6 cards become a flush 3×2 grid with 1px hairline gutters (no rounded panels), bracketed icon wells, hover scanline bar at bottom.
- **Command Layer panels**: keep 3 panels but alternate left/right with phase tags `PHASE_01 / 02 / 03` and a per-panel progress hairline.
- **MAAX Studio**: 2-col with brighter product-UI mock (window chrome + sidebar + canvas + status pill) and primary white CTA + ghost docs CTA.
- **How It Works**: 4-step horizontal with oversized outlined numerals (`-webkit-text-stroke` teal); desktop draws a horizontal line through them on scroll.
- **CTA**: monolith reappears centered above the headline, soft teal wash background, single primary button.
- **Footer**: 4 columns + brand block, fine mono legal row with `SYSTEM_STATUS: OPTIMAL`.
- **Continuous teal core line**: a thin vertical `#00E6D0` line runs behind the central column from hero through CTA, drawing in via GSAP as user scrolls (desktop only).

Content (all section copy, capability names, MAAX bullets, footer links) stays as already implemented — this is composition, hierarchy, density, and emphasis only.

## Technical scope

- **No new deps.** Reuse existing GSAP setup in `src/hooks/useCyryxScrollAnimations.ts`; add one new timeline for the continuous core-line draw (desktop only, respects `prefers-reduced-motion`).
- **Files to edit**:
  - `src/components/cyryx/Hero.tsx` — recompose to monolith-centered, dashboard below.
  - `src/components/cyryx/DashboardPanel.tsx` — restyle as wide console (window chrome + 8/4 split telemetry).
  - `src/components/cyryx/CapabilityStrip.tsx` — instrument-bar layout.
  - `src/components/cyryx/WhyCyryx.tsx` — 2-col rebalance, stats move to thin rail.
  - `src/components/cyryx/CoreCapabilities.tsx` — flush hairline grid, bracket icons, hover scanline.
  - `src/components/cyryx/CommandLayerSection.tsx` — alternating panels + phase tags.
  - `src/components/cyryx/MAAXStudioSpotlight.tsx` — product UI mock refresh.
  - `src/components/cyryx/ProcessTimeline.tsx` — outlined numerals + draw line.
  - `src/components/cyryx/CTASection.tsx` — center monolith above headline.
  - `src/components/cyryx/Footer.tsx` — minor density + status pill.
  - `src/routes/index.tsx` — wrap main in a relative container that hosts the continuous teal core line element.
  - `src/styles.css` — add `.cx-core-line`, `.cx-hairline-grid`, `.cx-bracket-icon`, `.cx-outline-num` utilities.
  - `src/hooks/useCyryxScrollAnimations.ts` — add core-line scroll draw; tighten existing reveals for tighter rhythm.
- **No content changes.** No new images. No backend.

## Verification

Playwright snapshots at 390 / 768 / 1280 / 1440. Confirm: monolith centered hero, dashboard below, vertical teal line visible behind central column at desktop, capability bar single row at lg, 3×2 hairline capabilities grid, alternating command panels, no horizontal overflow on mobile, no console errors.

## Out of scope

- Working email capture, sub-pages, dark/light toggle, copy rewrites, new images, palette/font changes.
