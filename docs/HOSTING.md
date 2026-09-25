# Hosting

- **Site:** Vercel project `cyryx-landing-page` (www.cyryxlabs.com, cyryxlabs.com, and
  aexos.cyryxlabs.com, which redirects to /products/aexos). Built with `bun run build`;
  nitro emits the Vercel output.
- **System of record:** the Cyryx CRM (ASTRA, crm.cyryxlabs.com and Supabase project
  `btdojjpjnlynsxmcqcge`). The site keeps no database of its own. Server routes sign their
  calls to the CRM `astra-public-intake` Edge Function with `CRM_INTAKE_SECRET`:
  - `/api/public/contact` and `/api/public/brief/*` → leads and requirements (`/init`, `/submit`)
  - `/api/public/cta-events` → funnel events (`/event`)
  - `/api/public/talent` → talent-network introductions (`/talent`)
- **Server env (Vercel):** `CRM_INTAKE_URL`, `CRM_INTAKE_SECRET`, `GEMINI_API_KEY`,
  `VITE_ASSISTANT_ENABLED`. Optional: `GEMINI_MODEL`, `GEMINI_FALLBACK_MODELS`.
- **Retired:** the original Lovable hosting and its Supabase project. The old internal console
  (`/auth`, `/workspace`, `workspace.*`) redirects to the CRM; old newsletter links land on the
  home page; `/lovable/*` answers 410. See `src/lib/legacy-redirect.ts`.
- **Build tooling:** `@lovable.dev/vite-tanstack-config` is still the Vite wrapper (a public npm
  package that bundles TanStack Start, React, Tailwind and nitro); it does not tie the site to
  Lovable hosting.
