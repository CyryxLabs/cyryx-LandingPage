## Objetivo
Publicar as correções de SEO já feitas no código, validar sitemap/robots no ar, e solicitar reindexação no Google Search Console (GSC) para que o snippet do Google deixe de mostrar a frase antiga "Exciting technology venture…".

## Estado atual (já no código)
- `src/routes/__root.tsx`: `author=Cyryx Labs`, `og:site_name`, `google-site-verification`, `og:type=website`.
- `src/routes/index.tsx`: `title`, `description`, `og:title/description/url/image`, `twitter:*`, `canonical=https://cyryxlabs.com/` e JSON-LD com `Organization`, `WebSite`, `WebPage`, `SoftwareApplication (MAAX Studio)`.
- `public/robots.txt` e `src/routes/sitemap[.]xml.ts` existem.

Falta apenas publicar e pedir recrawl — o Google ainda serve cache antigo.

## Passos

1. **Preflight de publish**
   - Verificar `security--get_scan_results` (sem críticos pendentes).
   - Confirmar `publish_settings` está `public`.

2. **Publish**
   - `preview_ui--publish` com `website_info_status=added_or_updated` e resumo cobrindo title, description, canonical, OG/Twitter, JSON-LD.
   - Avisar usuário que vai ao ar em ~1 min em `cyryxlabs.com`.

3. **Validar produção** (via `curl`/`fetch_website`)
   - `https://cyryxlabs.com/` → confere `<title>`, `<meta name=description>`, `og:title/description/url/image`, `canonical`, JSON-LD presentes.
   - `https://cyryxlabs.com/robots.txt` → 200, Allow:/, Sitemap: https://cyryxlabs.com/sitemap.xml.
   - `https://cyryxlabs.com/sitemap.xml` → 200, `<urlset>` com `/` e demais rotas públicas.

4. **Google Search Console** (via gateway `google_search_console`)
   - Reenviar sitemap: `PUT /webmasters/v3/sites/https%3A%2F%2Fcyryxlabs.com%2F/sitemaps/https%3A%2F%2Fcyryxlabs.com%2Fsitemap.xml`.
   - URL Inspection (`/v1/urlInspection/index:inspect`) na home para checar status de indexação.
   - Solicitar recrawl da home (Request Indexing): o endpoint público da Indexing API só aceita JobPosting/BroadcastEvent; portanto, instruir o usuário a clicar "Solicitar indexação" no GSC para `https://cyryxlabs.com/` (não há API para isso em sites comuns). Vou abrir o GSC com link direto.
   - Após GSC reindexar (horas/dias), o snippet "Exciting technology venture…" será substituído pelo novo title/description.

5. **SEO sweep**
   - `seo_chat--list_findings` → marcar como `fixed` os findings cobertos (title/description/canonical/OG/JSON-LD/sitemap/robots) com `seo_chat--update_findings`.
   - Opcional: `seo_chat--trigger_scan` (requer aprovação) para revalidar.

## Entrega ao usuário
- Confirmação de publish + link da home.
- Status de sitemap/robots em produção.
- Link direto para "Solicitar indexação" no GSC (única forma manual de acelerar recrawl da home em sites não-JobPosting).
- Aviso de que o cache do Google leva de horas a alguns dias para refletir o novo snippet.
