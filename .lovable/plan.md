# Corrective Build — Copy v4 Deployment

P0 (trust leaks) já foi executado no turno anterior: strings PT removidas, `SYS_STATUS` deletado, socials vazios/dead links removidos, `/privacy` e `/terms` criados, OG image própria (`cyryxlabs.com/cyryx-og.png`). Este plano cobre P1 → P3.

## What ships

### 1. Hero — reduzir a exatamente 4 elementos
`src/components/cyryx/Hero.tsx` + `src/copy/v3.ts`:
- H1: **"The execution layer for enterprise AI."**
- Subhead: **"Cyryx Labs builds AI products and execution systems — governed agents, automated workflows, and operational infrastructure engineered for accountability, auditability, and cost control."**
- CTA 1: **Start a project** → `#contact`
- CTA 2: **MAAX Studio →** → `#maax`
- Remover: meta rail (`copy.hero.meta`), rail line (`copy.hero.rail`), eyebrow, badges, scroll cue text — hero contém só H1 + sub + 2 CTAs.

### 2. Remoções na home
`src/routes/index.tsx`:
- Já removidos: `Ecosystem`, `MetricsBand`.
- Remover também: `CapabilityStrip` (strip de 5 nós com taxonomia MAAX antiga), `ProductEcosystem` (será substituído por seção nova "What We Build"), `CoreCapabilities`, `WhyCyryx` (versão antiga), `AppliedAILab`, `WhoWeServe`, `ProcessTimeline`, `CommandLayerSection`, `CTASection` (versões antigas serão reescritas ou substituídas por seções v4).

### 3. Novas seções v4 (ordem: Problem → What We Build → Solutions → Engagement Model → Security & Governance → MAAX → Who We Work With → Why Cyryx → Final CTA)
Criar em `src/components/cyryx/v4/`:
- `Problem.tsx` — H2 "AI adoption has outpaced AI control." + 3 bullets (Unowned output / Unmeasured cost / Unmanaged autonomy).
- `WhatWeBuild.tsx` — H2 "One discipline. Three units." + 3 cards (Products, Solutions, Applied AI Lab).
- `Solutions.tsx` — H2 "Systems under contract. Not hours under retainer." + intro MSA + 6 cards no formato v4: título + outcome + single "Delivered with: a · b · c" (sem 3-field layout). Cards: AI Product Sprint, AI Workflow Automation, Internal AI Agents & Copilots, AI Knowledge Systems, AI Integrations & Infrastructure, AI Governance & Cost Control. CTA "Start a project".
- `EngagementModel.tsx` — H2 "Fixed scope. Verifiable delivery. Full transfer." + 5 steps (Diagnostic, Scope, Build, Verification, Transfer).
- `SecurityPosture.tsx` — H2 "Governance is architecture." + 5 items (Server-side boundaries, Least privilege, Human authority, Auditability, Conservative claims).
- `WhoWeWorkWith.tsx` — H2 "Organizations that treat AI as infrastructure." + 4 bullets.
- `WhyCyryx.tsx` (v4) — H2 "A lab, not an agency." + 4 pillars (Product discipline, Governance as baseline, Verifiable claims, Engineered for handover).
- `FinalCTA.tsx` — H2 "From experimentation to governed execution." + descrição + 2 CTAs.

### 4. MAAX Studio — reduzir aos 5 pilares
`src/components/cyryx/MAAXStudioSpotlight.tsx`:
- Eyebrow: `FLAGSHIP · IN DEVELOPMENT`
- H2: "Governed autonomy for AI-native builders."
- Parágrafo v4 exato.
- 5 pilares: Mission-based execution, Project memory, Command Gates, Mission Ledger, Cost visibility.
- Status: "MAAX Studio is in active development. Early access opens to a limited cohort."
- CTA: **Request early access** → `#contact`.
- Remover: Mission Engine, Atlas Engine, Operator System, Margin Governor, Continuity Engine, Delivery Package, Mission Control, MAAX Runtime.

### 5. Footer v4
`src/components/cyryx/Footer.tsx`:
- Linha 1: "Cyryx Labs — AI products and execution systems for the agentic era."
- Nav: About · Solutions · MAAX Studio · Lab · Contact
- Legal: Privacy Policy · Terms of Service
- Linha 2: "© 2026 Cyryx Labs" (sem LLC, sem location, sem social, sem widgets).

### 6. Meta v4
`src/routes/index.tsx`:
- Title: **"Cyryx Labs — The Execution Layer for Enterprise AI"**
- Description (≤160): **"AI products and execution systems — governed agents, automated workflows, and infrastructure engineered for accountability, auditability, and cost control."**
- og:title/twitter:title, og:description/twitter:description atualizados; canonical + og:url mantêm `https://cyryxlabs.com/`.

### 7. Contact form
`src/components/cyryx/ContactSection.tsx`:
- Consent line: link para `/privacy` (Privacy Policy).
- Remover qualquer texto de location (Florida/Port Saint Lucie/USA) do formulário e headings.

### 8. Legal pages
- `src/routes/privacy.tsx`: já existe expandida no turno anterior — manter, garantir menção "Cyryx Labs LLC", "Florida", "St. Lucie County".
- `src/routes/terms.tsx`: já existe com Cyryx Labs LLC / Florida / St. Lucie County.

### 9. Global sweep
- Grep e remover qualquer ocorrência remanescente de: "Florida", "Port Saint Lucie", "USA" fora de `/privacy` e `/terms`.
- Grep e remover: SOC, ISO 27001, HIPAA, "compliant".
- Grep `!` em copy visível — remover exclamações em headings/CTAs.
- Grep `href="#"` — zero permitido.
- Confirmar zero strings PT (`arquivos|latência|qualidade|custo|abas` — sensível a "custo" só em copy PT; "cost" em EN está ok).
- Componentes obsoletos (`Ecosystem.tsx`, `MetricsBand.tsx`, `CapabilityStrip.tsx`, `CoreCapabilities.tsx`, `AppliedAILab.tsx`, `WhoWeServe.tsx`, `ProcessTimeline.tsx`, `CommandLayerSection.tsx`, `CTASection.tsx`, `WhyCyryx.tsx` antigo, `ProductEcosystem.tsx`, `MetricCard.tsx`): **manter os arquivos** (apenas remover dos imports/render em `index.tsx`) para preservar histórico e permitir reuso; posso deletar tudo depois se preferir.

### 10. Validação
- Playwright em 375px + 1280px: hero, Solutions (1-col no mobile), footer — sem horizontal scroll.
- `bun run build` verde.
- Grep automatizado das strings proibidas na saída build.

## Structural details

```
src/components/cyryx/
  v4/
    Problem.tsx           (novo)
    WhatWeBuild.tsx       (novo)
    Solutions.tsx         (novo)
    EngagementModel.tsx   (novo)
    SecurityPosture.tsx   (novo)
    WhoWeWorkWith.tsx     (novo)
    WhyCyryx.tsx          (novo)
    FinalCTA.tsx          (novo)
  Hero.tsx                (reescrito: apenas H1+sub+2 CTAs)
  MAAXStudioSpotlight.tsx (reduzido a 5 pilares)
  Footer.tsx              (v4 layout)
  ContactSection.tsx      (consent link)

src/routes/index.tsx       (nova ordem de seções + meta v4)
src/copy/v3.ts             (renomear internamente para v4 ou substituir strings do hero/maax)
```

## Publicação

Após tudo verde: aguardar seu comando para chamar `publish` — ou incluir publish automático no final.

## Decisões pendentes que quero confirmar antes de executar

1. **Publicação**: publicar automaticamente ao fim, ou parar após build verde e aguardar seu OK?
2. **Componentes obsoletos**: manter arquivos (sem uso) ou deletar de vez? Recomendo deletar após o build verde para não acumular dead code.
3. **Cópia v4 dentro do sistema de "copy variants"**: substituo o conteúdo de `v3.ts` in-place (mais simples, quebra menos código) ou crio `v4.ts` e faço v4 ser o default? Recomendo substituir in-place — o sistema de variants não está sendo usado.
4. **Contact form**: manter integração/envio existente ou você quer que eu revalide o fluxo server-side? (Escopo original diz "confirm server-side receipt"; posso testar mas não vou reescrever o backend.)