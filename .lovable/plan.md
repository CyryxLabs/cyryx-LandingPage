## Objetivo
Eliminar 6 defeitos de credibilidade e deployar Copy v4 verbatim em cyryxlabs.com, sem redesign visual. Trabalho dividido em 4 fases sequenciais; cada fase é auto-contida e verificável antes da próxima.

## Escopo confirmado
- Editar: Hero, Header/Footer, ContactSection, MAAXStudioSpotlight, ProductEcosystem / CoreCapabilities / WhyCyryx / Ecosystem / MetricsBand / CapabilityStrip (remover ou reescrever), `__root.tsx` meta/OG, `index.tsx`, `contact.tsx`, `privacy.tsx`.
- Criar: `src/routes/terms.tsx`, novo asset `cyryx-og.png` (1200×630, via imagegen premium + lovable-assets).
- **Não** mexer: sistema de cores/tipografia, MonolithScene 3D, rotas `/solutions/*`, `/answers/*`, `/research/*`, `/products/*`, primitives (`BackgroundMonolith`, `HudLabel`, `GlassPanel`, etc.), integrações Supabase, testes existentes (serão atualizados só se quebrarem).

## Fase P0 — Trust leaks (~1 turno)
1. **Português**: grep `arquivos|latência|latencia|qualidade|custo|abas` em `src/**` e substituir por captions inglesas do spec ("Files, agents, and gates" / "Tabs and minimap" / "Quality gates" / "Tokens, latency, and cost").
2. **SYS_STATUS**: remover elemento e estilos terminal do `Footer.tsx`.
3. **Dead links**: no `Footer.tsx` remover Documentation, Brand, Security e todos os ícones sociais vazios; apontar Privacy → `/privacy`, Terms → `/terms`. Varrer `href="#"` no repo → zerar.
4. **OG image própria**: gerar `cyryx-og.png` (Onyx `#0A0A0A` + wordmark Orbitron "CYRYX LABS" + linha Emerald), subir via `lovable-assets`, atualizar `og:image` / `twitter:image` em `index.tsx` e remover a URL do `storage.googleapis.com`.

## Fase P1 — Estrutura (~1 turno)
5. Deletar `<Ecosystem />` do `index.tsx` (fica só "What We Build" via `CoreCapabilities`/`ProductEcosystem` — consolidar em uma única seção "What We Build").
6. `MAAXStudioSpotlight.tsx`: reduzir a exatamente 5 pilares Copy v4 §7 (Mission-based execution, Project memory, Command Gates, Mission Ledger, Cost visibility) + status line "in active development" + CTA "Request early access". Remover Mission Engine, Atlas Engine, Operator System, Margin Governor, Continuity Engine, Delivery Package, Mission Control, MAAX Runtime da homepage.
7. Deletar "Execution Signals" (`MetricsBand` ou equivalente) da homepage.
8. Remover card "AI Websites & Lead Systems" da grid da home (rota `/solutions/ai-websites-lead-systems` permanece viva por ora; só sai da vitrine). Confirmar 6 cards conforme Copy v4 §4.

## Fase P2 — Deploy Copy v4 verbatim (~1–2 turnos)
9. `Hero.tsx`: substituir por exatamente 4 elementos (H1 + subhead + 2 CTAs). Remover eyebrow, badge strip, support line, ano de fundação, localização, `CapabilityStrip` se atuar como badge strip abaixo do hero.
10. Ordem final da home: Problem → What We Build → Solutions → Engagement Model → **Security & Governance Posture (NOVA seção, 5 itens)** → MAAX Studio → Who We Work With → Why Cyryx Labs → Final CTA → Footer. Criar componente `SecurityPosture.tsx` para a nova seção. Reescrever textos das seções existentes verbatim do spec (sem parafrasear).
11. `Footer.tsx`: descriptor line + nav (About/Solutions/MAAX Studio/Lab/Contact) + legal (Privacy/Terms) + "© 2026 Cyryx Labs". Sem LLC, sem localização, sem sociais, sem widgets.
12. Grep e remover `Florida|Port Saint Lucie|USA` da copy renderizada (exceto `/privacy` e `/terms`). Grep `!` na copy da home → zero.
13. Meta: title "Cyryx Labs — The Execution Layer for Enterprise AI", description ≤160 chars conforme spec.
14. CTAs site-wide: apenas "Start a project" e "Request early access".

## Fase P3 — Legal (~1 turno)
15. Reescrever `src/routes/privacy.tsx` com boilerplate SaaS+services adaptado: Cyryx Labs LLC, Florida governing law, St. Lucie County venue, email de contato do site.
16. Criar `src/routes/terms.tsx` idem.
17. Linkar Privacy/Terms do footer e da linha de consentimento do formulário de contato (`ContactSection.tsx`).

## Validação final (antes de publicar)
- `rg -n "arquivos|latência|latencia|qualidade|custo|abas|SYS_STATUS|href=\"#\""` → zero em código renderizado.
- `rg -n "Florida|Port Saint Lucie"` → apenas em `/privacy` e `/terms`.
- `rg -n "SOC|ISO 27001|HIPAA|compliant"` → zero.
- Build (`bun run build`) + testes Playwright existentes; ajustar snapshots quebrados por copy nova (não pela estrutura).
- Screenshot 375px e 1280px da home via Playwright: sem scroll horizontal, hero em 4 elementos, footer novo, sem SYS_STATUS.
- `preview_ui--publish` com `website_info_status=added_or_updated` (title + description novos).

## Detalhes técnicos
- **OG image**: gerada com `imagegen--generate_image` (model `premium`, 1200×630, prompt: dark Onyx background #0A0A0A, Orbitron wordmark "CYRYX LABS" centralizado, Emerald #0E5B57 accent line abaixo). Salva em `/tmp/cyryx-og.png`, uploaded via `lovable-assets create --file /tmp/cyryx-og.png --filename cyryx-og.png > src/assets/cyryx-og.png.asset.json`. Referenciada como `import ogAsset from "@/assets/cyryx-og.png.asset.json"` no `index.tsx` head — resolve na origem do próprio projeto via `/__l5e/assets-v1/…`. Observação: o spec pediu "sem CDN externo"; o CDN da Lovable é infraestrutura do próprio projeto (não third-party como `storage.googleapis.com`). Se o time exigir literalmente `/cyryx-og.png` servido pelo domínio, subimos como `public/cyryx-og.png`. **Confirmar preferência antes de gerar.**
- **Testes**: `tests/accessibility/seo-metadata.spec.ts` e `jsonld-snapshot.spec.ts` provavelmente falharão com a nova copy → atualizo os expects/snapshots verbatim.
- **Ecosystem**: componente `src/components/cyryx/Ecosystem.tsx` fica no repo mas some da home; opcionalmente removo o arquivo depois.
- **Cache do Google**: snippet atualizado só aparece após recrawl (horas/dias); previews sociais precisam de força-refresh no debugger da rede (LinkedIn/Twitter/Facebook).

## Pontos de decisão (respondam antes de iniciar)
1. **Faseamento**: OK executar P0→P1→P2→P3 em turnos separados (com aprovação entre fases) ou rodar tudo direto até P3 e só publicar no fim?
2. **OG image**: (a) Lovable CDN (`/__l5e/assets-v1/…`, escala melhor, é a infra padrão), (b) `public/cyryx-og.png` servido literal do domínio (`https://cyryxlabs.com/cyryx-og.png`), ou (c) ambos.
3. **Componentes obsoletos** (`Ecosystem.tsx`, `MetricsBand.tsx`, `CapabilityStrip.tsx` se removido do hero, cards de MAAX subsystems): deletar arquivos ou só desmontar da home?
4. **Publicar**: publicar automaticamente ao fim do P3, ou aguardar comando explícito?