## Objetivo

Trocar a imagem de fundo do Hero pela nova arte enviada (monolith simétrico com core line teal) mantendo todo o layout, copy e animações GSAP existentes. Se o resultado não convencer visualmente, revertemos para a versão atual em 1 commit.

GSAP **já está implementado** no Hero (`src/components/cyryx/Hero.tsx`): timeline de entrada via `useGSAP` + `gsap.matchMedia` (mobile/tablet/desktop + `prefers-reduced-motion`), parallax com `ScrollTrigger` na imagem e na aura, loop do scroll cue. Vou preservar essa estrutura e apenas refiná-la para a nova composição (imagem centralizada e simétrica, não mais alinhada à direita).

## O que muda

1. **Nova imagem de hero como asset CDN**
   - Subir `user-uploads://ChatGPT_Image_Jun_25_2026_10_21_37_AM_1.png` via `lovable-assets` a partir de `/mnt/user-uploads/` (sem copiar binário pro repo).
   - Gerar 3 variantes WebP (`640w`, `1280w`, `1920w`, quality 78, LANCZOS) — mesmo pipeline já usado para `cyryx-hero-serene-*.webp`, mantendo LCP rápido (3–25 KB).
   - Salvar como `src/assets/cyryx-hero-monolith-v2-{640,1280,1920}.webp.asset.json`.

2. **Hero.tsx — swap de imagem, layout intacto**
   - Trocar os 3 imports `hero640/1280/1920` para as novas variantes.
   - Ajustar `object-position` da `<img class="cx-bg-img">`: a arte nova é simétrica/centrada, então passa a `object-center` em todos os breakpoints (remover os `object-[72%_center] sm:object-[75%_center] lg:object-right`).
   - Reposicionar a aura teal `.cx-stage` para o centro também em desktop (remover `lg:right-[8%]`), acompanhando o core line vertical da imagem.
   - Suavizar levemente os overlays de desktop para não esconder o monolith central (gradient de 90deg passa a vertical em todos os breakpoints, mantendo legibilidade da copy à esquerda com vinheta inferior reforçada).

3. **`src/routes/index.tsx` — preload coerente**
   - Atualizar `<link rel="preload" as="image">` e o `imageSrcSet`/`imageSizes` para apontar para as novas 3 variantes (mantém `fetchPriority: high` e o mesmo `sizes`).

4. **GSAP — reforço pontual (sem remover nada)**
   - Adicionar um sutil "core line glow" animado: usar o `.cx-hero-line-glow` existente e dar um `gsap.to` com `opacity` 0.25↔0.55 em loop `yoyo` (respeitando `reduceMotion`), reforçando o eixo central do monolith.
   - Mantém timeline de entrada, parallax (`yPercent`/`scale` com `ScrollTrigger`), e o loop do `.cx-scroll-dot` exatamente como estão.

5. **Fallback rápido**
   - Os assets antigos (`cyryx-hero-serene-*`) ficam no repo. Se a nova arte não funcionar, basta reverter os imports de `Hero.tsx` + `routes/index.tsx` para os arquivos `cyryx-hero-serene-*` — sem outras mudanças.

## Não muda

- Copy, CTAs, meta rail, scroll cue, debug HUD (Alt/⌘+D).
- Estrutura de animações GSAP (timeline, matchMedia, ScrollTrigger, prefers-reduced-motion).
- Layout, espaçamentos, fontes, tokens de cor.
- Nenhum teste, schema de copy ou rota é tocado.

## Detalhes técnicos

- Assets: `lovable-assets create --file /mnt/user-uploads/ChatGPT_Image_Jun_25_2026_10_21_37_AM_1.png` para a PNG original, e mesmo CLI para cada WebP gerado em `/tmp` via Python/PIL.
- WebP: `Image.open(...).convert("RGB").resize((w, h), Image.LANCZOS).save(..., "WEBP", quality=78, method=6)`.
- Hero animação adicional fica dentro do mesmo `mm.add(...)` para herdar o gate `reduceMotion` já existente.

## Critério de aceite

- LCP da home continua ≤ ~25 KB (WebP servido conforme viewport).
- Hero renderiza com o monolith centralizado, core line teal alinhado ao eixo da copy, sem corte do topo do monolith em mobile.
- Todas as animações de entrada e parallax continuam funcionando; `prefers-reduced-motion` continua desativando tudo.
- Se o visual não agradar: 1 reversão pontual nos imports volta ao estado atual.
