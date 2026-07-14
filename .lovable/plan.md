# Lyra social preview: dedicated OG image + validation

## Current state
`/products/lyra` already emits full OG/Twitter meta via `buildHead()`, but `og:image` and `twitter:image` fall back to the shared site default (`social-1782497606213-...webp`). Every route uses the same image, so LinkedIn/X/Slack previews for Lyra are indistinguishable from the homepage.

## Changes

1. **Generate a Lyra-specific social image** (1200×630, JPG) via `imagegen`, saved to `src/assets/lyra-og-1200x630.jpg`, then upload via `lovable-assets create` to get a stable CDN URL.
   - Visual direction: dark onyx background matching site (`--onyx`), teal accent glow (`--accent-glow`), "Lyra" wordmark + tagline "The governed AI model at the core of MAAX Studio", Cyryx Labs mark, HUD/monolith aesthetic consistent with existing hero art.

2. **Wire it into `products.lyra.tsx`** by passing the CDN URL as `image` to `buildHead({ ..., image: LYRA_OG_IMAGE })`. This populates both `og:image` and `twitter:image` (already handled by `pageMeta`).

3. **Tighten the Twitter description** — currently reuses the 160-char `DESC`. Fine to keep, but confirm it's under limit and reads well as a standalone preview subtitle.

4. **Validation**
   - Add a Playwright spec `tests/accessibility/lyra-social-preview.spec.ts` that asserts on `/products/lyra`:
     - `og:image` and `twitter:image` are absolute https URLs, not the default site image
     - `og:image` returns 200 with `image/*` content-type
     - `og:title`, `og:description`, `twitter:card=summary_large_image`, `twitter:title`, `twitter:description` present and non-empty
     - canonical points to `https://cyryxlabs.com/products/lyra`
   - Run the spec locally to confirm green.

5. **Tell the user** that LinkedIn/X/Slack cache previews — the new image won't appear in existing shares until they re-scrape via each platform's debugger (LinkedIn Post Inspector, X Card Validator, Slack unfurl refresh).

## Files touched
- `src/assets/lyra-og-1200x630.jpg` + `.asset.json` (new)
- `src/routes/products.lyra.tsx` (add image constant, pass to `buildHead`)
- `tests/accessibility/lyra-social-preview.spec.ts` (new)

## Out of scope
No changes to `seo.ts`, other routes, or the default site OG image.
