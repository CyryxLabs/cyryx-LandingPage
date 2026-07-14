# Lyra — reduzir lag e adicionar a logo oficial

## O que vou fazer

### 1. Adicionar a logo oficial da Lyra
Fazer upload das duas imagens anexadas para o CDN via `lovable-assets` (sem duplicar binários no repo):
- `lyra-mark.png` — só o símbolo da lira (para favicon opcional e uso compacto).
- `lyra-lockup.png` — símbolo + wordmark "LYRA · Native Intelligence Layer" (para o hero).

Depois, no `src/routes/products.lyra.tsx`:
- Colocar o **lockup** como visual principal do hero, acima do H1, com `width`/`height` reais, `fetchpriority="high"`, `decoding="async"` e `loading="eager"` (é o LCP da página).
- Substituir o `og:image` genérico atual pelo lockup em versão social (1200×630) — reaproveitar o pipeline `imagegen` só se precisar reenquadrar; senão usar o lockup diretamente.
- Manter o `HudLabel` "In active development" como acento, não como visual principal.

### 2. Reduzir lag e friction percebidos
Focar em ganhos concretos de rendering na rota `/products/lyra`:

- **LCP**: `<link rel="preload" as="image">` para a logo do hero via `head().links` da rota, para que o navegador comece a baixar antes do JS hidratar.
- **Fontes**: garantir `font-display: swap` (checar `src/styles.css`) para eliminar FOIT em conexões lentas.
- **Animações**: auditar `useCyryxScrollAnimations` e qualquer `framer-motion`/GSAP no Header/Footer que rode nessa rota; respeitar `prefers-reduced-motion` e desativar transições pesadas quando não há interseção com o viewport.
- **Imagens do Header/Footer**: qualquer `<img>` fora do viewport ganha `loading="lazy"` e `decoding="async"` (verificar `Header.tsx` e `Footer.tsx` sem tocar em layout).
- **CTA `mailto:`**: já é instantâneo; garantir que `trackCta` seja `queueMicrotask`/`try‑catch` para nunca bloquear a navegação (checar `src/lib/track-cta.ts`).
- **Scroll suave**: se `useSmoothScroll` estiver ativo globalmente e criar jank em `/products/lyra`, isolar para a home apenas.

Sem mudanças de copy, sem novas seções, sem mexer em business logic.

### 3. Validação
- `bun run build` deve compilar sem erros.
- Rodar `tests/accessibility/lyra-social-preview.spec.ts` (atualizar a regex do nome do arquivo se trocarmos o `og:image`).
- Playwright rápido em `/products/lyra`: capturar Performance timings (`LCP`, `TBT`) antes e depois via `page.evaluate(() => performance.getEntriesByType('largest-contentful-paint'))` e reportar o delta.
- Screenshot desktop + mobile do hero com o novo lockup para confirmar visual.

## Arquivos que devem mudar
- `src/assets/lyra-mark.png.asset.json` (novo)
- `src/assets/lyra-lockup.png.asset.json` (novo)
- `src/routes/products.lyra.tsx` (hero visual + preload)
- Possivelmente `src/lib/track-cta.ts` (envelopar em microtask se ainda for síncrono)
- Possivelmente `src/components/cyryx/Header.tsx` / `Footer.tsx` (lazy em imagens fora do fold — apenas se encontrar `<img>` sem `loading`)
- `tests/accessibility/lyra-social-preview.spec.ts` (ajuste da regex se trocarmos o og:image)

## Fora de escopo
- Não vou refazer o design da página nem trocar a paleta.
- Não vou mexer em rotas fora de `/products/lyra`, exceto ajustes pontuais de `loading="lazy"` em Header/Footer.
- Não vou substituir `three.js`/monolith em outras páginas.

## Perguntas rápidas (posso assumir defaults se não responder)
1. **Favicon**: troco o favicon do site pela marca da Lyra, ou mantenho o Cyryx atual? *Default: manter Cyryx.*
2. **OG image**: substituo o card social atual da Lyra por um novo baseado no lockup oficial, ou mantenho o card cinematográfico atual? *Default: gerar um novo card 1200×630 usando o lockup real.*
