## Goal

Five focused upgrades on top of the v3 copy refresh:

1. Accessibility audit + fixes (aria-labels, contrast on metallic silver).
2. Smooth-scroll header nav to the correct section anchors.
3. Mobile fit verification on the new headlines/bullets (no truncation/CLS).
4. CTA click analytics for "Start an AI Project" and "Request Early Access", scoped by section, written to Lovable Cloud.
5. Hidden dev copy-variant toggle: `?copy=v4` (persisted in `localStorage`), v3 stays the default.

No changes to layout, animation timeline, or business logic beyond what each item requires.

---

## 1) Accessibility audit + contrast

**Targeted fixes (after reading each file):**

- **`src/components/cyryx/Header.tsx`** — current desktop CTA uses an unlabeled `→` glyph next to text; add `aria-label="Start an AI Project"` on the anchor for clarity, and `role="navigation" aria-label="Primary"` on the `<nav>`.
- **`src/components/cyryx/MobileMenu.tsx`** — wrap the link list in `<nav aria-label="Mobile primary">`, add `aria-current="page"` where applicable, and ensure the close button keeps its `aria-label`.
- **`src/components/cyryx/Footer.tsx`** — social icon anchors currently use `href="#"` with `aria-label` — fine for a11y, but mark them `aria-disabled="true"` until real URLs exist (prevents focus traps to dead links). Newsletter input already has `sr-only` label; verify submit button keeps `aria-label="Subscribe"`.
- **`src/components/cyryx/StickyMobileCTA.tsx`** — outer wrapper already has `role="region" aria-label="Quick actions"`; add `aria-label` to the MAAX shortcut link (`aria-label="Jump to MAAX Studio"`).
- **`src/components/cyryx/Hero.tsx`** — the `Scroll` cue is `aria-hidden`, good. No change.
- **`src/components/cyryx/CoreCapabilities.tsx` / `CommandLayerSection.tsx` / `AppliedAILab.tsx` / `WhoWeServe.tsx`** — pillar/solution `<article>` blocks already have semantic headings; no change needed, but add `aria-label` to each card CTA combining the action + card title (e.g. `aria-label="Explore MAAX Studio — Products"`).
- **`src/components/cyryx/ContactSection.tsx`** — verify all form inputs have associated `<label>` (they do). No change.

**Contrast pass (`src/styles.css`):** read the file, then bump `--silver-dim` so body copy on `--onyx` / `--graphite` reaches **≥4.5:1 AA**. Method:
- Compute luminance for current `--silver-dim` vs `--onyx` and `--graphite` using a small `node` script in shell.
- If <4.5:1, raise `--silver-dim` to the smallest value that clears AA on both bg tokens. Same check for `--silver` headlines on tinted glass panels.
- Add a `@media (prefers-contrast: more)` block that snaps `--silver-dim` to a high-contrast variant, leaves `--silver` and `--accent-glow` untouched.
- No changes to gradient text utilities (`text-silver-gradient`, `text-chrome-gradient`) — they are presentational; ensure each one is paired with a solid-color fallback class on the same element via a new `.text-silver-gradient` rule that sets `color: var(--silver)` before `background-clip: text`.

Run a one-off Playwright + `@axe-core/playwright` pass on `/` (desktop + mobile viewport) to catch any remaining flags. Output saved to `/tmp/browser/axe.json`; fix any new criticals before signing off.

---

## 2) Smooth-scroll nav to section anchors

Section IDs that already exist on `/`: `top`, `problem`, `products`, `solutions`, `maax`, `applied-lab`, `process`, `metrics`, `audience`, `ecosystem`, `cta`, `contact`.

**`src/components/cyryx/Header.tsx`** NAV array stays at:
- Products → `#products`
- Solutions → `#solutions`
- Applied AI Lab → `#applied-lab`
- MAAX Studio → `#maax`
- MAAX Runtime → `#ecosystem` (the only place "MAAX Runtime" exists in the page is the Ecosystem grid card)

**Smooth scroll implementation:**
- Add a small `useSmoothScroll()` hook in `src/hooks/useSmoothScroll.ts` that listens for click events on any `a[href^="#"]` inside the document, prevents default, computes `targetTop = element.getBoundingClientRect().top + window.scrollY - headerOffset`, and calls `window.scrollTo({ top: targetTop, behavior: prefersReducedMotion ? "auto" : "smooth" })`. `headerOffset` reads `--header-h` (set in `styles.css`, fallback 96/64 by breakpoint).
- Mount the hook once in `src/routes/__root.tsx` inside an effect (already client-only safe).
- Also keep the hash in sync via `history.replaceState(null, "", "#section")` so deep links keep working, without re-triggering the page's existing scroll-restoration logic.
- Update `MAAX Runtime` link to scroll the user to the Ecosystem section AND highlight the "MAAX Runtime" card briefly: add a `data-flash-target` attribute and a 1s `outline` pulse class in `styles.css`. The pulse is purely CSS (no GSAP), and respects `prefers-reduced-motion`.

---

## 3) Mobile fit verification (no truncation / CLS)

- Drive Playwright headless at 360×800 and 390×844, capture screenshots of every section, and assert:
  - No element has `scrollWidth > clientWidth` inside the main content column (would mean horizontal overflow).
  - Headings don't wrap into more than 4 lines on 360px.
  - Pill bullets in Hero meta rail wrap without overlap.
  - Solutions card deliverables wrap cleanly (chips already use `flex-wrap`).
- If any text overflows: add `[text-wrap:balance]` / `hyphens-auto` / `break-words` on the specific heading without changing font-size tokens.
- Run a `performance.getEntriesByType("layout-shift")` snapshot after the hero animation completes, confirm CLS < 0.05.

No layout refactor — only minor utility tweaks if a failure surfaces.

---

## 4) CTA click analytics (Lovable Cloud)

**Schema (migration):**

```sql
CREATE TABLE public.cta_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cta text NOT NULL,                 -- 'start_project' | 'request_early_access' | 'request_maax_access' | 'explore_maax'
  section text NOT NULL,             -- 'hero' | 'maax_spotlight' | 'final_cta' | 'header' | 'mobile_menu' | 'sticky'
  path text NOT NULL,
  href text,                         -- the target the user was sent to
  variant text,                      -- copy variant, e.g. 'v3'
  user_agent text,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (length(cta) BETWEEN 1 AND 64),
  CHECK (length(section) BETWEEN 1 AND 64),
  CHECK (length(path) BETWEEN 1 AND 2048)
);

GRANT INSERT ON public.cta_events TO anon, authenticated;
GRANT ALL    ON public.cta_events TO service_role;
ALTER TABLE public.cta_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert CTA events"
  ON public.cta_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(cta) BETWEEN 1 AND 64
    AND length(section) BETWEEN 1 AND 64
    AND length(path) BETWEEN 1 AND 2048
    AND (user_agent IS NULL OR length(user_agent) <= 1024)
  );

CREATE POLICY "Admins read CTA events"
  ON public.cta_events FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));
```

No `SELECT TO anon` — admins-only read, matching the existing `web_vitals` pattern.

**Server function:** `src/lib/cta-events.functions.ts`

```ts
export const logCtaEvent = createServerFn({ method: "POST" })
  .inputValidator((d) => CtaEventSchema.parse(d))
  .handler(async ({ data }) => {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false } });
    await supabase.from("cta_events").insert({ ...data, user_agent: getRequestHeader("user-agent") ?? null });
    return { ok: true };
  });
```

**Client tracker:** new component-less helper `src/lib/track-cta.ts` exporting `trackCta({ cta, section, href })`. Uses `navigator.sendBeacon` (POST JSON to a thin `/api/public/cta-events` server route that does the same insert) so the click isn't lost when the browser navigates. The server route validates with the same Zod schema and inserts via the publishable client.

**Wire-up (minimal, no UI changes):** add `onClick={() => trackCta({...})}` to the 4 CTAs that match the request:
- Hero "Start an AI Project" (`section: "hero"`, `cta: "start_project"`)
- Header desktop CTA + MobileMenu CTA + StickyMobileCTA "Start an AI Project" (`section: "header" | "mobile_menu" | "sticky"`)
- MAAXStudioSpotlight "Request Early Access" (`section: "maax_spotlight"`, `cta: "request_early_access"`)
- CTASection "Start an AI Project" + "Request MAAX Studio Access" (`section: "final_cta"`)

Tracker also reads the active copy variant from `window.__cyryxCopyVariant` (item 5) so funnel can be split by variant.

---

## 5) Hidden copy-variant toggle (`?copy=v4`)

- **Storage:** `src/lib/copy-variant.ts` — exports `getActiveVariant()` (returns `"v3"` by default; checks URL `?copy=` then `localStorage.cyryx_copy_variant`; persists URL choice into `localStorage`).
- **Mount:** read once inside a client-only effect in `src/routes/__root.tsx`, set `window.__cyryxCopyVariant` and `document.documentElement.dataset.copy`.
- **Copy registry:** new folder `src/copy/` with one file per variant:
  - `src/copy/v3.ts` — all hero/section/CTA strings used today, extracted from the current components into a single typed object `Copy` (no behavior change for v3 users).
  - `src/copy/index.ts` — `getCopy(variant)` returns the matching object; falls back to v3 if variant is missing.
- **Component refactor:** replace inline literals in the 16 sections updated last turn with `const copy = getCopy(useCopyVariant())` reads, e.g. `copy.hero.headline`. Component JSX stays identical otherwise.
- **Future variants:** dropping `src/copy/v4.ts` and visiting `/?copy=v4` instantly swaps copy without a redeploy of structure. (The variant itself still ships with the build, but adding new wording is a single-file change.)
- **Footnote:** a tiny dev-only badge in the footer ONLY when `import.meta.env.DEV === true && variant !== 'v3'` shows `copy: v4` so the user can confirm. In production builds the badge is tree-shaken out.

Search engines always see v3 (server renders default), so SEO is unaffected.

---

## Verification

- `bun run build` + `tsgo` to catch type errors from the copy registry refactor.
- Playwright pass: axe-core a11y on `/`, smooth-scroll click flow for every nav item, mobile-overflow assertions at 360px & 390px, CTA click that inserts a row and queries it back via `psql`.
- Server-fn logs check after a synthetic CTA click to confirm no insert errors.

## Out of scope

- No new visual sections, no GSAP/ScrollTrigger changes, no Hero parallax tuning.
- No SEO/meta changes.
- No admin dashboard for `cta_events` — viewable in the backend; we can build a UI in a later pass if you want.
