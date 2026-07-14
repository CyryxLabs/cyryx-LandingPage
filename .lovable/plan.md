## Scope

Enhance `src/routes/products.lyra.tsx`:

1. **SEO metadata** — the page already calls `buildHead(...)` (title, description, og:*, twitter:*, canonical, breadcrumb JSON-LD via `src/components/cyryx/seo/seo.ts`). Extend the JSON-LD graph with:
   - `SoftwareApplication` node (name "Lyra", applicationCategory "DeveloperApplication", operatingSystem "Cross-platform", provider Cyryx Labs, url `https://cyryxlabs.com/products/lyra`, softwareVersion "early-access", offers `PriceSpecification` marked "early access").
   - `FAQPage` node built from the new FAQ Q&As via existing `buildFaqJsonLd`.
   - Keep existing `BreadcrumbJsonLd`.
   - Confirm canonical + og:url self-reference `/products/lyra` (already true).

2. **FAQ section** — new section between the "Lyra × MAAX Studio" block and the "Access" block, styled like other Lyra sections (`glass-panel`, `HudLabel`, `font-display`). Six enterprise-oriented Q&As:
   - What is Lyra?
   - How is Lyra different from a frontier chat model?
   - Where does Lyra run — cloud, on-prem, or local?
   - How does Lyra handle sensitive data and IP?
   - How is Lyra evaluated and versioned?
   - How can my organization get access today?

   Rendered with a semantic `<dl>` (`<dt>` question, `<dd>` answer) so the DOM mirrors the FAQ JSON-LD. No `<details>` toggle (keeps content crawlable and matches the static, glass-panel style of the rest of the page).

3. **Enterprise CTAs** — replace the existing single "Request early access" button in the Access section with a two-CTA block, and repeat the block at the end of the new FAQ section:
   - Primary: `Request enterprise early access` → `mailto:contact@cyryxlabs.com?subject=Lyra enterprise early access` (accent-glow filled button, `trackCta` with `section: "lyra_faq"` / `"lyra_access"`).
   - Secondary: `Start a project` → `/start` (glass button), routes to the qualification form so enterprise leads land in the governed intake flow.
   - Tertiary text link on Access only: `See MAAX Studio` (kept).

## Files touched

- `src/routes/products.lyra.tsx` — only file changed. Adds `FAQS` array, `buildFaqJsonLd` + `SoftwareApplication` nodes in `head()`, new FAQ section, updated CTA blocks. Imports `START_PROJECT_HREF`, `buildFaqJsonLd`, `trackCta`.

No changes to hero, imagery, other pages, sitemap (already lists `/products/lyra`), or shared SEO helpers.

## Verification

- `bun run build` — typecheck + route tree.
- Playwright smoke: visit `/products/lyra`, assert `<title>` matches, `link[rel=canonical]` = `https://cyryxlabs.com/products/lyra`, `script[type="application/ld+json"]` count ≥ 3 (Breadcrumb, SoftwareApplication, FAQPage), FAQ `<dt>` count = 6, both CTA buttons present.
- Manual visual check at desktop + 375 px viewport.
