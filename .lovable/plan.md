## Objetivo
1. Aplicar fonte **Orbitron** no título principal do Hero ("The execution layer / for operational AI.").
2. Corrigir o alinhamento desktop da meta rail (linha de pilares + linha de postura) para harmonizar verticalmente.

## Mudanças

### 1. Carregar Orbitron (`src/routes/__root.tsx`)
- Acrescentar `family=Orbitron:wght@500;600;700` no `<link>` do Google Fonts já existente (duas tags `preload` + `stylesheet`). Sem novo `<link>`, só estender a URL atual.

### 2. Registrar token (`src/styles.css`)
- Adicionar dentro do `@theme` existente:
  ```css
  --font-orbitron: "Orbitron", "Inter Tight", system-ui, sans-serif;
  ```
- Isso gera a utility `font-orbitron`.

### 3. Aplicar no título (`src/components/cyryx/Hero.tsx`)
- Trocar `font-display` por `font-orbitron` no `<h1 className="cx-hero-heading …">`.
- Ajustar tracking levemente (`tracking-[-0.01em]` → `tracking-[0.01em]`) já que Orbitron é geométrica/wide, para evitar parecer apertada.

### 4. Alinhar harmonicamente a meta rail desktop (`src/components/cyryx/Hero.tsx`)
Problema atual (visível na imagem): linha 1 tem 4 colunas em grid, linha 2 fica encostada à direita com `md:justify-end` — sem relação visual com a grade acima.

Solução: usar o **mesmo grid 4-col** para as duas linhas e ancorar a linha de postura nas 3 últimas colunas, mantendo simetria com os pilares.

```tsx
<ul className="grid grid-cols-2 md:grid-cols-4 gap-y-4 md:gap-y-0">
  {/* pilares — sem mudança estrutural */}
</ul>
<ul className="grid grid-cols-1 md:grid-cols-4 items-center pt-1">
  {/* célula vazia */}
  <li aria-hidden="true" className="hidden md:block" />
  {/* postura ocupando col-span-3, alinhada com as 3 últimas colunas dos pilares */}
  <li className="md:col-span-3 md:pl-5 flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1 font-mono text-[10.5px] uppercase tracking-[0.3em]">
    <span className="text-metal-dim">Governance-ready architecture</span>
    <span aria-hidden="true" className="text-[var(--accent-glow)]/60">·</span>
    <span className="text-metal-dim">Human-commanded autonomy</span>
    <span aria-hidden="true" className="text-[var(--accent-glow)]/60">·</span>
    <span className="text-metal-dim">Cost-aware execution</span>
  </li>
</ul>
```

- Espaço entre as duas linhas reduzido de `gap-5` para `gap-3` para parecerem um bloco coeso.
- `md:pl-5` na célula da postura alinha exatamente com o padding da segunda coluna dos pilares (que tem `md:pl-5` via `md:border-l md:pl-5`).
- Em mobile a postura continua centralizada em uma linha única.

## Resultado
- Título com presença futurista/tech via Orbitron, mantendo o tratamento metálico/chrome.
- Meta rail desktop forma uma grade harmônica 4 colunas: pilares na linha 1, postura ancorada nas colunas 2–4 da linha 2, criando ritmo visual claro em vez do flutuar à direita atual.
