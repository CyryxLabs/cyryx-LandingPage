## Objetivo

Corrigir o logo do header desktop usando a variante chrome/metálica (`cyryx-wordmark-chrome.png`) já existente, com glifos levemente translúcidos para integrar ao efeito glass.

## Alterações

1. **`src/components/cyryx/primitives/CyryxMark.tsx`**
   - Trocar o import `cyryx-wordmark.png.asset.json` por `cyryx-wordmark-chrome.png.asset.json` no componente `CyryxWordmark`.
   - Atualizar `width`/`height`/`aspectRatio` para as dimensões reais do asset chrome.
   - Adicionar `opacity-90` (≈90%) ao `<img>` para manter o efeito de leve transparência sobre o glass header.

2. **`src/components/cyryx/Header.tsx`**
   - Sem mudanças estruturais. Manter `h-9 lg:h-11 -translate-y-[2px]` já ajustado.

## Fora de escopo

- Não substituir o logo no footer, mobile menu, ou outros pontos da aplicação (a não ser que peça).
- Não criar nova variante de cor por CSS — usar exclusivamente o asset chrome existente.

## Verificação

- Confirmar visualmente via preview que o wordmark aparece em tom prata/chrome alinhado com o menu, sem fundo opaco.
