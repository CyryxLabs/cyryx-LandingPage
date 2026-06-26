## Substituir imagem do MAAX Studio

1. Upload do arquivo correto `user-uploads://MAAX_Studio.png` via `lovable-assets`, sobrescrevendo o pointer `src/assets/cyryx-maax-visual.png.asset.json`.
2. Nenhuma alteração de código necessária — `MAAXStudioSpotlight.tsx` já importa esse pointer e renderiza `maaxLogo.url` no lugar do título.
3. Manter o styling atual (`max-w-[420px] object-contain mix-blend-screen`) já apropriado para a logo em fundo preto.