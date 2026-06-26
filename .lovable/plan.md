## Diagnóstico
- `.cx-hero-title-line` foi calibrada para Inter Tight (`clamp(2.25rem, 6.4vw, 5.25rem)`, letter-spacing `-0.028em`). Com Orbitron — fonte geométrica muito mais larga — o tamanho explode no desktop e o tracking negativo aperta as letras de forma desconfortável; em tablet a frase única quebra mal.
- Título mora em `<div class="cx-hero-panel mx-auto max-w-[64rem] sm:mx-0">` (coluna esquerda de 64rem) enquanto a meta rail abaixo usa o container externo `max-w-7xl` cheio. Larguras diferentes = sensação de "tudo desalinhado".

## Mudanças

### 1. `src/styles.css` — re-tunar tipografia para Orbitron

Substituir o bloco `.cx-hero-heading` + `.cx-hero-title-line` (linhas ~274–290), o bloco mobile (~292–305), o crítico 320–360px (~340–344) e o tablet 768–1024 (~503–513) por valores adequados a Orbitron:

```css
.cx-hero-heading {
  line-height: 1.08;
  letter-spacing: 0.02em;
  font-feature-settings: "ss01", "cv11";
  overflow: visible;
  padding-bottom: 0.12em;
  text-wrap: balance;
}

.cx-hero-title-line {
  font-size: clamp(1.9rem, 4.6vw, 3.75rem);
  line-height: 1.1;
  letter-spacing: 0.02em;
  font-weight: 700;
  overflow: visible;
  padding-bottom: 0.08em;
}

@media (min-width: 360px) and (max-width: 767px) {
  .cx-hero-heading { line-height: 1.12; letter-spacing: 0.015em; padding-bottom: 0.1em; }
  .cx-hero-title-line {
    font-size: clamp(1.65rem, 7vw, 2.4rem);
    line-height: 1.14;
    letter-spacing: 0.012em;
    padding-bottom: 0.08em;
  }
}

@media (max-width: 359px) {
  .cx-hero-title-line {
    font-size: clamp(1.35rem, 6.6vw, 1.7rem);
    letter-spacing: 0.01em;
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .cx-hero-heading { line-height: 1.08; padding-bottom: 0.1em; }
  .cx-hero-title-line {
    font-size: clamp(2.25rem, 4.8vw, 3rem);
    line-height: 1.08;
    letter-spacing: 0.018em;
    padding-bottom: 0.08em;
  }
}
```

Resultado: Orbitron respira (`+0.02em` espaçamento), tamanhos cabem em uma linha em telas ≥ ~900px e quebram com elegância (`text-wrap: balance`) abaixo disso.

### 2. `src/components/cyryx/Hero.tsx` — container e grade consistentes

Hoje o painel do título usa `max-w-[64rem]` e a meta rail herda o container externo `max-w-7xl`. Alinhar tudo na mesma coluna de conteúdo:

- Manter o container externo `max-w-7xl px-5 sm:px-10 lg:px-14` (gutters responsivos já corretos).
- Mover a meta rail para **dentro** de um wrapper com a mesma largura/alinhamento do `cx-hero-panel`, para criar um eixo vertical único:

```tsx
<div className="relative mx-auto w-full max-w-7xl px-5 pb-24 pt-28 sm:px-10 sm:pt-40 sm:pb-28 lg:px-14">
  <div className="mx-auto w-full max-w-[68rem] sm:mx-0">
    <div className="cx-hero-panel">
      {/* h1 + sub + ctas — sem mudança */}
    </div>

    {/* meta rail agora compartilha a mesma coluna */}
    <div
      aria-label="Cyryx platform pillars and operating posture"
      role="group"
      className="mt-20 flex flex-col gap-4 border-t border-white/10 pt-6 sm:mt-24"
    >
      <ul className="flex list-none flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-6 md:gap-y-3">
        {/* pilares — sem mudança estrutural */}
      </ul>
      <p className="cx-meta flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center font-mono text-[10.5px] uppercase tracking-[0.3em]">
        {/* postura — sem mudança */}
      </p>
    </div>
  </div>
</div>
```

- Container interno único `max-w-[68rem]` (ligeiramente mais largo que os 64rem antigos para abrigar a frase em uma linha em desktops médios sem quebrar).
- `cx-hero-panel` perde o `mx-auto max-w-[64rem] sm:mx-0` próprio (o wrapper pai já garante isso).
- Gutters vêm SEMPRE do container `max-w-7xl px-5 sm:px-10 lg:px-14` — uma única fonte de verdade para padding horizontal.

### 3. Resultado
- "The Execution Layer for Operational AI" cabe em uma linha em desktop e tablet, com espaçamento Orbitron harmônico (positivo, não negativo).
- Título, sub, CTAs e meta rail compartilham o mesmo eixo esquerdo e a mesma largura máxima — nada flutua "para fora" da grade.
- Mobile mantém quebras naturais via `text-wrap: balance` e o painel translúcido.

Sem mudanças em animações GSAP, glifos, ou outros componentes.
