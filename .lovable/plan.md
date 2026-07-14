All four items in this request are already satisfied by prior work. No file changes needed.

## Verification

- **CTA types compile** — `src/lib/track-cta.ts` already includes `"lyra_early_access"` in `CtaName` and `"lyra_hero" | "lyra_faq" | "lyra_access"` in `CtaSection`. A `tsgo --noEmit` run surfaces zero errors in `src/routes/products.lyra.tsx` or `src/lib/track-cta.ts` (remaining errors are unrelated workspace/* routes).
- **/products/lyra route** — `src/routes/products.lyra.tsx` exists with `createFileRoute("/products/lyra")`, registered in `src/routeTree.gen.ts`.
- **Start CTA linkage** — `/start` qualification form lists "Lyra Briefing" as a service option. Header (`Header.tsx` line 81) and MobileMenu link to `/start` on desktop and mobile.
- **Sitemap** — `src/routes/sitemap-products[.]xml.ts` line 9 includes `{ path: "/products/lyra", priority: "0.7" }`.
- **SEO metadata** — `products.lyra.tsx` uses `buildHead({ title: TITLE, description: DESC, path: PATH, ogType: "product" }, [...])`, which via `pageMeta` emits title, description, og:title/description/url/type/image, twitter card, and canonical (self-referencing `https://cyryxlabs.com/products/lyra`). JSON-LD includes Breadcrumb, SoftwareApplication, and FAQPage nodes.

## Recommendation

Close the request as already-done. If you want, I can additionally:
1. Add a Lyra card to the `/products` hub page (currently only lists MAAX Studio and Applied AI Lab — the previously-flagged gap), or
2. Run a Playwright smoke test to visually confirm `/products/lyra` renders and CTAs navigate correctly.

Reply with 1, 2, both, or "close" to proceed.