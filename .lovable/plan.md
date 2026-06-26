## Goal
Make the landing page feel premium and frictionless: consistent CTA states, tighter header↔section rhythm, more polished contact form feedback, verified anchor targets, and a clean GSAP/ScrollTrigger tier strategy (mobile = no pin, tablet = light, desktop = immersive).

No new sections or content rewrites. Polish only.

---

## 1. CTA visual states (hover / active / disabled / focus)

Today CTAs use ad-hoc Tailwind utilities per file (Hero, Header, CTASection, MAAX, Contact submit, StickyMobileCTA). Visual states are inconsistent — some have `hover:brightness-110`, some don't; disabled only on the contact submit; focus rings vary.

Consolidate in `src/styles.css` under the existing `.cx-cta` / `cx-btn` / `cx-liquid-glass` system, then apply consistently.

- **Primary CTA** (`cx-cta cx-cta-primary`): teal background, dark text. States:
  - hover: brightness 1.08, lift `translateY(-1px)`, shadow gains glow
  - active: brightness 0.94, `translateY(1px) scale(0.995)` (already partly there)
  - focus-visible: existing 2px teal outline (keep)
  - disabled: opacity 0.55, cursor not-allowed, no transform, no glow
- **Ghost / glass CTA** (`cx-cta cx-cta-ghost` on `cx-liquid-glass`): silver text, glass surface. States:
  - hover: border → teal, text → silver bright, faint teal inner glow
  - active: subtle teal tint background (already there)
  - disabled: same as primary
- Add a single `:disabled, [aria-disabled="true"], [data-disabled]` rule covering both variants.
- Standardize transition tokens: `transition: transform 180ms ease, filter 180ms ease, background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease;`.

Then apply `cx-cta cx-cta-primary` / `cx-cta cx-cta-ghost` classes on:
- Hero primary + secondary
- Header "Start a Project"
- CTASection "Request Access" (primary) + "Start a Project" (ghost)
- MAAX "Request Early Access" (primary)
- ContactSection submit (primary, keeps Loader2)
- StickyMobileCTA buttons

## 2. Header ↔ section spacing & hierarchy

- **Section vertical rhythm**: unify to `py-20 sm:py-28 lg:py-36` across `WhyCyryx`, `CoreCapabilities`, `ProcessTimeline`, `WhoWeServe`, `Ecosystem`, `MAAXStudioSpotlight`. `Hero`, `CTASection`, `ContactSection` keep their tuned values.
- **Container gutters**: enforce `mx-auto max-w-7xl px-4 sm:px-6 lg:px-10` on every section's inner wrapper to match Header. Currently `ContactSection` uses `max-w-2xl px-4 sm:px-6 lg:px-10` — keep narrow content but align outer wrapper.
- **Anchor offset for fixed header**: existing rule `section[id] { scroll-margin-top: 5rem; @media >=1024 { 7rem } }` covers desktop. Add a tablet step `@media (min-width: 640px) { 6rem }` so md viewports (where header is still 16) aren't over-offset.
- **Section heading scale**: ensure every section h2 uses the same `font-display text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-[1.05] text-silver-gradient` pattern that `ContactSection` and `CTASection` use. Audit `WhyCyryx`, `CoreCapabilities`, `WhoWeServe`, `Ecosystem`, `MAAXStudioSpotlight` h2s and bring outliers in line.
- **HudLabel spacing**: standardize `mb-4` between HudLabel and h2 across sections.

## 3. Contact form polish (`#contact`)

The form already has zod schema, per-field onBlur validation, server submit, and a success view (see `ContactSection.tsx`). Improvements:

- **Toast feedback**: on successful submit, also fire `toast.success("Message sent — we'll reply within 24h")` from `sonner` (Toaster already mounted via root). On server error, `toast.error(...)`. Keeps inline success view but gives global confirmation if user has scrolled.
- **Scroll-into-view on success**: after submit success, smooth-scroll the success card into view so it's visible even if the form was tall.
- **Real-time validation on change** (in addition to blur) for the field currently in error — once a field shows an error, validate on each input so user sees error clear immediately. Other fields stay onBlur to avoid noise.
- **Submit button states**: use the unified `cx-cta cx-cta-primary` from §1, with proper `disabled` styling when loading or when zod has any error.
- **Character counter for message** (subtle, right-aligned under field): `{count}/2000` only when count > 1500. Avoids clutter.
- **Honeypot field** (hidden `aria-hidden` input named `website` rejected server-side if filled) — anti-spam without captcha.
- **aria-live polite region** for the server error so screen readers announce failure (currently `role="alert"` exists — keep, fine).

Server-side (`submitContact`): add honeypot rejection. Re-validate zod schema on server (already does via inputValidator? — verify, and add if missing).

## 4. CTA targets & anchor offset verification

All "Start a Project" / "Request Access" / "Request Early Access" CTAs already point to `#contact` (done last turn). Verify and lock down:

- Hero primary CTA → `#contact` ✓
- Header desktop "Start a Project" → `#contact` ✓
- StickyMobileCTA primary → `#contact` ✓
- CTASection two buttons → `#contact` ✓
- MAAX "Request Early Access" → `#contact` ✓
- MobileMenu: audit — if it contains a "Start a Project" item, route to `#contact` and close the sheet after click.
- Add a tiny smooth-scroll handler on these CTAs that calls `closeMobileMenu()` first when applicable so the menu doesn't cover the form.
- Anchor offset (covered in §2) tested at 375 / 768 / 1024 / 1440 widths.

## 5. GSAP / ScrollTrigger matchMedia review

Current `useCyryxScrollAnimations.ts` already uses `gsap.matchMedia` with mobile / tablet / desktop tiers, reduced-motion early-return, and `cx-low-perf` skip. No `pin: true` is used anywhere — confirmed. Refinements:

- **Tier definitions** — make explicit and reuse one breakpoint object across all `mm.add()` calls:
  ```
  isMobile:  "(max-width: 767px)"
  isTablet:  "(min-width: 768px) and (max-width: 1023px)"
  isDesktop: "(min-width: 1024px)"
  ```
  Today some calls use `(max-width: 1023px)` for "mobile" — collapses tablet into mobile path. Split properly.
- **Mobile tier**: keep reveals + count-ups; remove the global 3D `<img>` tilt entirely on mobile (currently runs at 480–767px) — it costs perf and adds wobble. Hero dashboard stays as a simple fade-in.
- **Tablet tier**: light effects only — reveals, staggers, count-ups, gentle image tilt (rot 3, y 12). No hero scrub-out, no parallax on `[data-parallax]` (currently runs on all widths).
- **Desktop tier**: full set — image tilt (current values), parallax, hero scrub-out (with reduced opacity 0.8 from 0.65), card pointer tilt, core line draw, MacBook reveal.
- **Timeline draw** (ProcessTimeline): horizontal scrub on desktop, vertical on tablet/mobile (already implemented) — leave intact, just verify breakpoint matches new tier object.
- **No pinning** anywhere — keep this rule explicit with a code comment. If `ProcessTimeline` ever wants pinning, gate it behind desktop only.
- **Cleanup** — every `mm.add()` returns automatically via `mm.revert()`; verify the hook's unmount calls it (it does). Add `ScrollTrigger.refresh()` once on `fonts.ready` (already present) and once on window resize debounced (currently only `load` and timeouts — ScrollTrigger auto-handles resize, fine).
- **Reduced motion**: existing early-return snaps reveals to final state and count-ups to target. Keep.
- **Low-perf devices** (`html.cx-low-perf`): currently skips the `<img>` 3D tilt. Extend to also skip desktop hero scrub-out and parallax.

## 6. Verification

- `bun run typecheck` passes.
- Click each CTA on /, confirm URL becomes `/#contact` and the contact heading is fully visible below the header at 375 / 768 / 1024 / 1440px.
- Submit form with empty fields → per-field errors; with valid data → toast + success card scrolled into view.
- DevTools throttling: scroll the page on a slow CPU profile — no jank from image tilt on mobile.
- `prefers-reduced-motion: reduce` → page renders with no animations.

---

## Files touched (estimate)

- `src/styles.css` — CTA state tokens, disabled rule, anchor offset tablet step
- `src/components/cyryx/Hero.tsx`, `Header.tsx`, `CTASection.tsx`, `MAAXStudioSpotlight.tsx`, `StickyMobileCTA.tsx`, `MobileMenu.tsx` — apply unified `cx-cta` classes
- `src/components/cyryx/ContactSection.tsx` — toast, scroll-into-view, honeypot, real-time error revalidation, submit disabled state
- `src/lib/contact.functions.ts` — honeypot server check
- Section files (`WhyCyryx`, `CoreCapabilities`, `ProcessTimeline`, `WhoWeServe`, `Ecosystem`, `MAAXStudioSpotlight`) — normalize padding / container / h2 hierarchy
- `src/hooks/useCyryxScrollAnimations.ts` — clean matchMedia tiers, mobile tilt removal, low-perf extensions
