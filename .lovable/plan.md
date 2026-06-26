## Mudanças

### 1. Título do Hero — uma única linha
`src/components/cyryx/Hero.tsx` — substituir os dois `<span class="cx-line">` por um único:

```tsx
<span className="cx-line cx-hero-title-line block text-chrome-gradient">
  The Execution Layer for Operational AI
</span>
```

Mantém `font-orbitron` e gradient. Em telas pequenas o navegador quebra naturalmente; remover `sm:whitespace-nowrap` para evitar overflow horizontal com Orbitron (que é mais larga que Inter Tight).

### 2. Meta rail — alinhamento harmônico

Problema atual: grid 4-col com conteúdo `flex items-center` à esquerda de cada célula faz as colunas parecerem desiguais (gaps visuais inconsistentes), e a linha de postura encostada na coluna 2 não cria simetria visível.

Solução: abandonar o grid 4-col e usar **flex `justify-between`** para distribuir os 4 pilares uniformemente de borda a borda, e centralizar a linha de postura abaixo, criando um eixo central simétrico.

```tsx
<div
  aria-label="Cyryx platform pillars and operating posture"
  role="group"
  className="mt-24 flex flex-col gap-4 border-t border-white/10 pt-6"
>
  <ul className="flex list-none flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-8">
    {META.map((m) => (
      <li
        key={m}
        className="cx-meta flex items-center font-mono text-[11px] uppercase tracking-[0.32em]"
      >
        <span aria-hidden="true" className="mr-3 text-[var(--accent-glow)]">/</span>
        <span className="text-metal">{m}</span>
      </li>
    ))}
  </ul>
  <p className="cx-meta flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center font-mono text-[10.5px] uppercase tracking-[0.3em]">
    <span className="text-metal-dim">Governance-ready architecture</span>
    <span aria-hidden="true" className="text-[var(--accent-glow)]/60">·</span>
    <span className="text-metal-dim">Human-commanded autonomy</span>
    <span aria-hidden="true" className="text-[var(--accent-glow)]/60">·</span>
    <span className="text-metal-dim">Cost-aware execution</span>
  </p>
</div>
```

Resultado:
- Linha 1: 4 pilares espalhados igualmente entre as bordas com `justify-between` — espaçamento uniforme visual.
- Linha 2: postura centralizada — eixo central limpo, simétrico em relação ao bloco acima.
- Mobile: pilares empilham em coluna, postura permanece centralizada.

Sem mudanças em CSS, tokens ou animações.
