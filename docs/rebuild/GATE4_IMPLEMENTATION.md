# Rebuild do site — Gate 4 (v9 no repositório) — 2026-11-18

**Status:** implementado no branch local `feat/rebuild-v9` (a partir de a816685) e testado. **Não publicado, sem push, sem PR.** Preview na Vercel só com autorização.

## O que mudou no site
- **Home nova (v9 "Precision in Motion")**: `src/routes/index.tsx`, `src/styles/home.css` (escopo `.hm`, tokens do `cy.css`), `src/data/home.ts`, `src/components/home/WorkflowDemo.tsx`.
  - Hero: "AI products and automation. / Built for the way you work.", CTAs "Discuss your project" (/start?source=home) e "Explore our products" (#products), três telas de fluxo com "Sample data" sobre a placa metálica (`public/media/precision/*.webp`, 24–80 KB).
  - Seções: Dois caminhos (#paths) → Workflow interativo (#workflow) → 4 grupos de soluções (#solutions) → Produtos (#products: Onyx, AEXOS Core, Orbit só "In development") → Evidência (#evidence, link para o protocolo CGP) → Entrega + controles definidos no escopo + garantia do checklist (#delivery) → Empresa (#company) → Fechamento com chips de intenção (#contact).
  - Sem estatísticas de mercado, sem FAQ/FAQPage, sem preços, sem prazos.
  - Movimento: só CSS + JS leve; entradas desligadas com movimento reduzido e no modo low-perf (Save-Data); conteúdo visível sem JS.
- **/demos** (nova): workflow interativo + exemplos rotulados (real × simulado). Entrou no sitemap-company.
- **Navegação**: Products · Solutions · Demos (link direto) · Insights · Company; CTA "Discuss your project" no header, menu mobile, rodapé e barra fixa.
- **Varredura de promessas** (site, llms.txt, base do assistente): "fixed quote", "you own the code", "human approval/audit log embutidos", prazos fixos e "assessment credited" trocados por linguagem de processo. AEXOS só Core 5.3.0 (Node 18+). Onyx 1.14.45.
- **Assistente**: links permitidos agora cyryxlabs.com, www, onyx.cyryxlabs.com e www.npmjs.com (aexos.cyryxlabs.com saiu; ele redireciona).
- **Analytics**: novos eventos `intent_selected`, `product_viewed`, `demo_started`, `demo_completed`. **O CRM ainda rejeita esses nomes** até a lista de eventos do CRM ser atualizada (o beacon é fire-and-forget, sem erro para o visitante).

## Testes (máquina do fundador, build de produção, mock do CRM/Gemini)
- PASS: `tsc` 0 erros; unit 54/54; build ok.
- PASS: Playwright Chromium (desktop 1024, mobile 360, alto contraste): **651 passed, 1 flaky, 41 skipped, 0 failed**. O flaky é preexistente (dois testes escrevem no mesmo mock do CRM em paralelo; passa no retry).
- PASS: WebKit/Safari mobile 3/3.
- Testes atualizados para a v9: copy-validation, conversion-overhaul, hero, home-hero (reescrito), navegação (header, mobile, footer, modelo, ordem), scroll-restoration, scrolltrigger, seo-metadata, webkit, snapshot JSON-LD e snapshot visual de /solutions/workflow-automation (página encurtou com a varredura).
- Lint: só 1 erro preexistente (`any` em conversion-overhaul, linha 224) e 1 aviso preexistente.
- NOT RUN: Lighthouse/Core Web Vitals, celulares reais, leitor de tela manual.

## Pendências para o fundador
1. Autorizar preview na Vercel (depois promover).
2. Atualizar a lista de eventos no CRM.
3. Itens ainda abertos: instalador do Onyx não assinado; linhas de América Latina/espanhol e "A person reads every message"; Onyx "tamper-evident"/"24/7"; voltar ou não "assessment credited"; favicon ainda é o brasão; slugs dos grupos de solução; frase do Orbit.
4. Componentes órfãos mantidos (não apagados): HeroFilm, Scorecard (o readiness check saiu da home) e WorkflowConsole. Podem ser removidos num passo separado.
5. Botão flutuante "Ask Cyryx" cobre um canto do demo a 390 px; avaliar depois.

## Commit local
`feat/rebuild-v9` contém código, testes, mídia e os registros do Gate 1 (`docs/rebuild/*.md|csv|json`). Ficaram fora do commit: capturas (`docs/rebuild/gate4-shots/`), alvos visuais, PNGs de design e os zips temporários.
