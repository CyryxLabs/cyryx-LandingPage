# Continuar: reduzir lag e finalizar integração da logo Lyra

Logo oficial já foi enviada ao CDN (`lyra-lockup.png`, `lyra-mark.png`) e integrada no hero de `/products/lyra` com `fetchpriority="high"` + `<link rel="preload">`. Falta fechar os itens de performance e validar.

## Próximos passos

### 1. Verificar `trackCta` não bloqueia navegação
Ler `src/lib/track-cta.ts`. Se ainda for `fetch` síncrono no click de `<a href="mailto:">`, envelopar em `queueMicrotask` + `try/catch` (ou confirmar que já usa `navigator.sendBeacon`). Sem mudança se já estiver não-bloqueante.

### 2. Auditar animações que causam jank em `/products/lyra`
- `useCyryxScrollAnimations` e `useSmoothScroll`: confirmar que respeitam `prefers-reduced-motion` e que não rodam observers pesados nessa rota (a página Lyra é estática, não precisa de scroll animations globais).
- Se `useSmoothScroll` estiver montado no `__root.tsx` ou no `Header`, avaliar isolar para a home.

### 3. Lazy em imagens fora do fold no Header/Footer
Verificar `Header.tsx` e `Footer.tsx`: qualquer `<img>` sem `loading="lazy"` / `decoding="async"` ganha esses atributos. Sem mudanças de layout.

### 4. Font-display
Checar `src/styles.css` e o `<link>` de fontes em `__root.tsx` para garantir `font-display: swap` (elimina FOIT em conexões lentas).

### 5. Validação
- `bun run build` verde.
- Rodar `tests/accessibility/lyra-social-preview.spec.ts` (og:image não mudou, deve passar).
- Playwright em `/products/lyra` desktop + mobile: screenshot do hero com o lockup + coletar `LCP` via `performance.getEntriesByType('largest-contentful-paint')` para confirmar melhora.

## Fora de escopo
- Sem mudanças de copy, paleta, ou seções novas.
- Sem tocar em rotas fora de `/products/lyra` (exceto ajustes pontuais de `loading="lazy"` em Header/Footer, se necessário).
- Sem trocar favicon nem og:image (mantém o card social atual).

## Arquivos que provavelmente mudam
- `src/lib/track-cta.ts` (só se ainda for bloqueante)
- `src/components/cyryx/Header.tsx` / `Footer.tsx` (só onde faltar `loading="lazy"`)
- `src/hooks/useSmoothScroll.ts` ou `useCyryxScrollAnimations.ts` (só se estiverem causando jank global)
- `src/styles.css` (só se faltar `font-display: swap`)
