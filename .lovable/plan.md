## Objetivo
Melhorar a rail inferior do Hero (linha "/ AI PRODUCTS / AGENTIC SYSTEMS …" + "GOVERNANCE-READY ARCHITECTURE · HUMAN-COMMANDED AUTONOMY · COST-AWARE EXECUTION") para ficar mais organizada e com tipografia em gradiente metálico (prata → teal), em vez de cinza opaco.

## Mudanças (somente `src/components/cyryx/Hero.tsx` + `src/styles.css`)

1. **Separar em duas linhas claras** (em vez de wrap caótico em uma só):
   - **Linha 1 — Pilares**: os 4 itens (`AI PRODUCTS`, `AGENTIC SYSTEMS`, `GOVERNED EXECUTION`, `APPLIED AI INFRASTRUCTURE`) distribuídos em grid `grid-cols-2 md:grid-cols-4`, cada um com:
     - barra `/` em accent glow (teal)
     - texto em gradiente metálico
     - divisor vertical sutil entre colunas em `md+`
   - **Linha 2 — Postura operacional**: os 3 valores (`Governance-ready architecture`, `Human-commanded autonomy`, `Cost-aware execution`) separados por `·`, alinhados à direita em desktop / centralizados em mobile, em peso menor e gradiente metálico mais discreto.
   - Borda superior `border-white/10` mantida, espaçamento entre as duas linhas (`gap-3`).

2. **Gradiente metálico** — adicionar uma utility em `src/styles.css`:
   ```css
   @utility text-metal {
     background: linear-gradient(135deg,
       color-mix(in oklab, var(--silver) 95%, white) 0%,
       var(--silver) 35%,
       color-mix(in oklab, var(--silver) 60%, var(--accent-glow)) 70%,
       var(--accent-glow) 100%);
     -webkit-background-clip: text;
     background-clip: text;
     color: transparent;
   }
   @utility text-metal-dim {
     background: linear-gradient(135deg,
       color-mix(in oklab, var(--silver) 70%, transparent) 0%,
       color-mix(in oklab, var(--silver) 45%, var(--accent-glow)) 100%);
     -webkit-background-clip: text;
     background-clip: text;
     color: transparent;
   }
   ```
   - Pilares usam `text-metal` (mais brilhante)
   - Linha de postura usa `text-metal-dim` (mais sutil)
   - `/` continua em `var(--accent-glow)` puro para contraste

3. **Preservar comportamento**:
   - Classe `cx-meta` mantida (animações GSAP existentes continuam funcionando)
   - `aria-label` da `<ul>` preservado
   - Sem mudanças em lógica/JS, só estrutura JSX e classes

## Resultado visual
- Pilares alinhados em colunas regulares, fáceis de escanear
- Linha de postura abaixo como rodapé semântico, hierarquicamente menor
- Tipografia ganha o acabamento metálico cromado/teal do resto da identidade Cyryx, em vez do cinza chapado atual
