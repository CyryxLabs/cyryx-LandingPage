
# Cyryx Labs Landing Page — Build Plan

A single-page, mobile-first marketing site matching the provided layout reference, with the uploaded logo as the brand mark and GSAP-driven scroll storytelling.

## Scope

One route (`/`) composed of 10 sections, all responsive, all built mobile-up. No backend, no auth, no CMS — pure presentation. Email signup is a non-functional UI (visual only) unless you want it wired later.

## Design System (`src/styles.css`)

Semantic tokens in oklch — never hardcoded colors in components.

- `--background` Onyx `#0A0A0A`
- `--surface` Graphite `#121417`
- `--surface-2` Charcoal `#1B1E22`
- `--surface-3` Deep Space `#23272B`
- `--foreground` Silver `#C7C9CC`
- `--muted-foreground` dimmed silver
- `--accent` Teal `#0D3B3B`
- `--accent-2` Emerald `#0E5B57`
- `--accent-glow` `#00E6D0` (used sparingly)
- `--border` low-opacity silver
- Gradients: `--gradient-radial-teal`, `--gradient-panel`
- Shadows: `--shadow-glow-teal`, `--shadow-panel`

Typography (loaded via `<link>` in `__root.tsx` head):
- Display / wordmark: **Orbitron** (wide geometric futuristic — Versa-style stand-in via Google Fonts)
- Body / UI: **Inter**
- Mono labels: **JetBrains Mono** for HUD micro-details

Utility classes for: glass panel, thin teal border, scan-line, grid-floor background, HUD label.

## Assets

Upload the three provided images via `lovable-assets`:
- `LogoCyryx.png` → monolith icon (used in header, hero, footer, CTA)
- `2939515b-...png` → full lockup (used in mobile menu / brand moments)
- The wide hero render → optional hero background accent

No other stock images — all section visuals (server racks, command room, neural mesh, lobby) generated with `imagegen` in matching dark-teal-graphite palette to avoid the "image collage" feel. Each generated image is purposeful (one per section panel that needs it).

## Component Architecture

```
src/components/cyryx/
  Header.tsx
  MobileMenu.tsx
  Hero.tsx
  DashboardPanel.tsx          // responsive: compact mobile / full desktop
  MetricCard.tsx              // count-up animated
  CapabilityStrip.tsx
  WhyCyryx.tsx
  CoreCapabilities.tsx
  CapabilityCard.tsx
  CommandLayerSection.tsx
  CommandLayerPanel.tsx
  MAAXStudioSpotlight.tsx
  ProcessTimeline.tsx
  CTASection.tsx
  Footer.tsx
  ScrollIndicator.tsx
  primitives/
    GlassPanel.tsx
    HudLabel.tsx
    SectionEyebrow.tsx
    GridFloor.tsx             // pure CSS bg
```

`src/routes/index.tsx` composes them in order. SEO metadata updated in route `head()`.

## GSAP Scroll Storytelling

Install: `gsap` (free ScrollTrigger included).

Single hook `useCyryxScrollAnimations()` mounted in the page that registers `gsap.matchMedia()` with three breakpoints:

- `(max-width: 767px)` — reveals only: fade+y, stagger, count-up; vertical timeline draw; no pinning; no parallax beyond 10px.
- `(min-width: 768px) and (max-width: 1023px)` — light sticky, mild parallax.
- `(min-width: 1024px)` — pinned dashboard moment, parallax visuals, horizontal timeline draw, richer staggers.

Respects `prefers-reduced-motion` (skip all timelines, set final states).

Per-section animations exactly as specified in the brief (header blur on scroll, hero line-by-line reveal, metric count-up, capability card staggers, command panels sequential reveal, MAAX inner cards stagger, timeline draw, CTA fade, footer column stagger).

Mobile menu open/close uses its own GSAP timeline (panel slide+fade, link stagger, CTA last, close-icon rotate).

## Sections (content matches brief verbatim)

1. **Header** — sticky, dark glass, scroll-triggered blur intensify; mobile hamburger + slide-down menu with 6 links + CTA.
2. **Hero** — eyebrow / H1 / sub / 2 CTAs / monolith logo / responsive dashboard / scroll indicator on grid-floor background.
3. **Capability Strip** — 5 stacked cards on mobile, horizontal row on desktop.
4. **Why Cyryx** — editorial stack with 4 bullets + 3 count-up stats + one infrastructure visual.
5. **Core Capabilities** — 6 glass cards (1col → 2col → 3col grid).
6. **Inside the Command Layer** — 3 editorial panels (image top / text below on mobile, asymmetric grid on desktop).
7. **MAAX Studio Spotlight** — eyebrow, headline, body, 4 bullets, CTA + simplified product UI preview (responsive complexity).
8. **How It Works** — 4-step timeline, vertical mobile (line draws down) / horizontal desktop (line draws across).
9. **Final CTA** — single cinematic background (generated dark lobby), headline, copy, 2 stacked buttons.
10. **Footer** — logo+tagline, 4 link columns (accordions on mobile), email signup, social icons, legal row.

## Accessibility

Semantic landmarks, single H1, focus-visible rings in teal, ARIA on hamburger/menu, 44px+ tap targets, contrast verified for silver-on-onyx, `prefers-reduced-motion` respected, no horizontal overflow.

## Performance

- Lazy-load below-the-fold generated images
- Responsive `<img>` with width/height to prevent CLS
- `will-change` only on actively-animating elements; cleared after
- ScrollTriggers killed on unmount
- No video backgrounds
- Lenis NOT included (mobile risk; native scroll is fine here)

## Out of scope (ask if you want them)

- Working email capture (would need Lovable Cloud)
- Actual sub-pages behind nav links (this is one-page; links scroll to anchors)
- i18n
- Dark/light toggle (dark only by design)

## Build order

1. Tokens + fonts + global CSS utilities
2. Upload logo assets, generate 5–7 supporting visuals
3. Primitives (GlassPanel, HudLabel, GridFloor)
4. Header + MobileMenu
5. Hero + DashboardPanel + MetricCard + ScrollIndicator
6. Sections 3–9 top to bottom
7. Footer
8. `useCyryxScrollAnimations` hook with matchMedia
9. Mobile QA pass at 360 / 390 / 430, then 768, then 1280+
