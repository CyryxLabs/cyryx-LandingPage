## Objetivo
Melhorar a CapabilityStrip (mobile com itens desalinhados/quebrados) e substituir os ícones lucide genéricos por **glifos exclusivos da Cyryx Labs** com gradiente metálico — incluindo dois novos glifos: MAAX Studio e MAAX Runtime.

## Mudanças

### 1. `src/components/cyryx/primitives/BrandGlyphs.tsx`
Adicionar 2 novos glifos únicos seguindo a mesma linguagem (viewBox 48×48, stroke gradiente prata→teal, fundo `var(--graphite)` em nós):

- **`MaaxStudioGlyph`** — metáfora de "estúdio criativo + agente": um prisma/diamante facetado com 3 raios divergentes saindo do vértice superior (representando geração multi-agente). Pequeno ponto teal no centro.
- **`MaaxRuntimeGlyph`** — metáfora de "runtime governado": um anel hexagonal (governança) com núcleo quadrado rotacionado 45° dentro (execução), e um traço orbital atravessando representando o pipeline em execução.

Atualizar `BrandGlyphs` export com `MaaxStudio` e `MaaxRuntime`.

### 2. `src/components/cyryx/CapabilityStrip.tsx`
Reescrever a estrutura para:

- **Mobile (`< sm`)**: grid `grid-cols-1` com cada item ocupando uma linha completa, ícone à esquerda (48×48), número + título à direita, divisores horizontais entre linhas. Acaba com o problema de "MAAX RUNTIME" sozinho na última linha desbalanceado.
- **Tablet (`sm`)**: `grid-cols-2` com divisores verticais nas colunas pares e horizontais entre linhas.
- **Desktop (`lg`)**: `grid-cols-5` em linha única, divisores verticais entre colunas.
- Cada item:
  - Número `01`–`05` em fonte mono, gradiente metálico (`text-metal` já criado)
  - Glifo exclusivo (48×48 desktop / 40×40 mobile) com gradiente metálico
  - Título em `hud-label` com `text-metal` (silver→teal)
  - Hover: leve translateY + intensificação do gradiente do glifo
- Mapeamento:
  - 01 Products → `ProductsGlyph`
  - 02 Solutions → `SolutionsGlyph`
  - 03 Applied AI Lab → `LabGlyph`
  - 04 MAAX Studio → `MaaxStudioGlyph` (novo)
  - 05 MAAX Runtime → `MaaxRuntimeGlyph` (novo)
- Remover imports de `lucide-react` neste arquivo.

### 3. Sem mudanças em
- Animações GSAP (classes `cx-stagger` / `cx-stagger-item` preservadas)
- Tokens de cor / `text-metal` (já existem do passo anterior)
- Outras telas

## Resultado
- Layout mobile organizado e respirável, sem item órfão desalinhado
- 5 ícones únicos, coesos entre si, exclusivos da identidade Cyryx Labs
- Continuidade visual com o gradiente metálico aplicado na meta rail do Hero
