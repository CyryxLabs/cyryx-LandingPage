## Goal
Substituir (em teste) a imagem de fundo da Hero por um vídeo em loop, mantendo overlays, copy e CTAs intactos. Fácil de reverter.

## Passos

1. **Upload do vídeo para o CDN Lovable Assets**
   - `lovable-assets create --file /mnt/user-uploads/Generated_Video_June_29_2026_-_7_04PM.mp4 --filename cyryx-hero.mp4 > src/assets/cyryx-hero.mp4.asset.json`
   - Sem cópia do binário no repo.

2. **Editar `src/components/cyryx/Hero.tsx`**
   - Trocar o `<img>` (com `srcSet` 640/1280/1920 webp) por um `<video>`:
     - `autoPlay`, `muted`, `loop`, `playsInline`, `preload="metadata"`
     - `poster={hero1920.url}` (fallback enquanto carrega + para usuários com `prefers-reduced-motion`)
     - `className` igual ao atual (`absolute inset-0 h-full w-full object-cover object-center`)
     - `aria-hidden`, sem controles
   - Manter os imports das webps para usar como `poster`.
   - Manter todos os overlays (gradientes, noise, linha teal, aura), o conteúdo (headline, sub, CTAs, meta rail) e o scroll cue — sem mudanças.

3. **Acessibilidade / performance**
   - Render condicional: se `window.matchMedia("(prefers-reduced-motion: reduce)").matches`, renderiza apenas o `<img>` atual (não toca no vídeo).
   - `preload="metadata"` para não estourar LCP/banda em mobile.

4. **Verificação**
   - Build roda automaticamente.
   - Conferir visual no preview (`/`).
   - Reverter é trivial pelo histórico do chat se não ficar bom.

## Fora de escopo
- Não mexer em SEO/OG, testes E2E, ou outras páginas.
- Não trocar a ordem/cópia do Hero.
