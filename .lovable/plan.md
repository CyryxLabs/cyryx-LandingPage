## Goal

1. Make every "Start a Project" / "Request Access" / "Request Early Access" CTA route the user to the actual contact form (`#contact`), with `mailto:` as a clearly labeled secondary option where relevant.
2. Do a focused review of the landing page layout and GSAP effects so the page feels coherent — no over-animated sections, consistent reveal cadence, and respects `prefers-reduced-motion` (already wired in `useCyryxScrollAnimations`).

No content rewrites, no new sections. Pure navigation + polish.

---

## 1. CTA navigation fixes

Today several CTAs go nowhere (`href="#"`) or only scroll to a generic CTA band. Target the real contact form section (`<section id="contact">` in `ContactSection.tsx`) so the user lands directly on the form, prefilled-context where useful.

| File | Element | Current | New |
|---|---|---|---|
| `src/components/cyryx/CTASection.tsx` | "Request Access" button | `href="#"` | `href="#contact"` + `aria-label="Request access — open contact form"` |
| `src/components/cyryx/CTASection.tsx` | "Start a Project" button | `href="#"` | `href="#contact"` |
| `src/components/cyryx/CTASection.tsx` | (add) tertiary text link | — | `mailto:hello@cyryxlabs.com` as small "or email us" fallback |
| `src/components/cyryx/Header.tsx` | "Start a Project" header CTA | `href="#cta"` | `href="#contact"` |
| `src/components/cyryx/StickyMobileCTA.tsx` | primary CTA | already `#contact` | keep |
| `src/components/cyryx/MAAXStudioSpotlight.tsx` | "Request Early Access" | `href="#cta"` | `href="#contact"` (form is the actual conversion surface) |
| `src/components/cyryx/Hero.tsx` | primary CTA already `#contact` | keep | — |
| `src/components/cyryx/Footer.tsx` | placeholder `href="#"` links | dead links | wire footer "Contact" → `#contact`; socials → real urls or remove |

All anchor jumps will use smooth in-page scroll (CSS `scroll-behavior: smooth` is already set globally; verify and add if missing in `src/styles.css`).

The email address for `mailto:` will be confirmed with the user before implementation (see clarifying question below) — default suggestion: `hello@cyryxlabs.com`.

## 2. GSAP / layout review pass

Scope is conservative — no rewrite of `useCyryxScrollAnimations.ts`. Targeted adjustments only:

- **Reveal consistency**: audit `.cx-reveal` and `.cx-stagger` usage across `Hero`, `WhyCyryx`, `CoreCapabilities`, `ProcessTimeline`, `MetricsBand`, `MAAXStudioSpotlight`, `WhoWeServe`, `Ecosystem`, `CTASection`, `ContactSection`. Ensure every section root that should fade-in carries `.cx-reveal` and child grids use `.cx-stagger` + `.cx-stagger-item`. Add any missing classes; remove duplicates.
- **Global image 3D tilt**: currently applied to *every* `<img>` (see hook). Add `data-no3d="1"` to images where the effect harms readability (logos in Header/Footer, MacBook figure already handled, MAAX product preview if any). Keeps the cinematic feel on hero/lifestyle imagery only.
- **Hero scrub fade**: keep, but reduce `opacity: 0.65` → `0.8` so the next section transition feels less abrupt.
- **Timeline draw**: verify `[data-timeline-section]`/`[data-timeline-line]` markup still exists in `ProcessTimeline`; if not, no-op (hook already guards).
- **Section vertical rhythm**: standardize section padding to `py-20 sm:py-28 lg:py-36` across `WhyCyryx`, `CoreCapabilities`, `ProcessTimeline`, `WhoWeServe`, `Ecosystem`, `MAAXStudioSpotlight`. Hero and CTASection keep their custom values.
- **Container widths**: confirm each section uses `max-w-7xl px-4 sm:px-6 lg:px-10` to match Header/Hero gutters. Adjust any outliers.
- **Scroll offset for anchor jumps**: fixed header overlaps anchored sections. Add `scroll-margin-top: 6rem` (`lg:scroll-margin-top: 7rem`) to `#contact`, `#cta`, `#maax`, `#products`, `#solutions`, `#applied-lab` via a `.cx-anchor` utility in `src/styles.css`, then apply on those `<section>` elements. Fixes "form is hidden under the header" after clicking a CTA.

## 3. Verification

After implementation:
- `bun run typecheck` (typecheck must pass).
- Manually click each updated CTA in the preview to confirm it lands on the form with the heading visible (not under header).
- Check `prefers-reduced-motion: reduce` path still snaps reveals to final state.

---

## Open question before implementing

Confirm the destination email for the secondary `mailto:` link and footer contact link:
- Default: `hello@cyryxlabs.com`
- Or provide the address you want exposed publicly.

If you prefer **no** `mailto:` (form-only conversion), I'll skip the email fallback and just route every CTA to `#contact`.
