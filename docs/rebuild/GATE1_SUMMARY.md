# Gate 1: Verdade e escopo (resumo)

Data: 17/11/2026. Fontes: snapshot do repositório `feat/site-2026-11` (a816685 + trabalho local), páginas públicas lidas em 17/11/2026 e o blueprint de 17/11. Nada foi publicado, enviado, instalado ou submetido.
Arquivos produzidos: `CURRENT_SITE_AUDIT.md`, `CONTENT_INVENTORY.csv` (58 linhas), `CLAIMS_REGISTER.csv` (75 afirmações), `PRODUCT_TRUTH_REGISTER.json` (Onyx, AEXOS, Orbit) e `REDIRECT_PLAN.csv` (24 regras).

## 10 principais achados (impacto comercial × risco)

1. **Promessas genéricas não aprovadas em todo o site.** Exemplos: "You own the code and data", "Fixed scope and quote in writing", "Human approval on what matters" e "audit logs and cost limits built in". Aparecem na home (`index.tsx:192-194, 227-229`), nos FAQs e no JSON-LD FAQPage. Também estão no llms.txt e na base de conhecimento do assistente (`knowledge.ts:18-20`). **Crítico.**
2. **Prazos fixos publicados:** ~2 semanas por automação, piloto de 30 dias, 2 + 8–12 semanas para MVP, 3–4 semanas para site, e prazos por porte de empresa. Estão em `services.ts`, `market.ts`, `home.ts:20` e no llms.txt. **Crítico.**
3. **Estatísticas de terceiros sem comprovação:** 8 de 17 números não foram encontrados na fonte citada. O "47% integração" (RSM) diverge dos 28% que aparecem na página da RSM. O dado do G2 não tem URL. **Alto.**
4. **Orbit está ausente.** A home diz "Two AI products you can use today" e "Both are available today", o que esconde que o Onyx está em beta. **Alto.**
5. **AEXOS Pro aparece como licença paga disponível, com CTA.** O próprio código diz que o preço do Pro ainda está em validação (`site-taxonomy.ts:84-85`). **Alto.**
6. **Fatos do Onyx desatualizados.** O site mostra a versão 1.14.25; o site do produto, 1.14.45. O texto "No card, no account" conflita com o modal de download, que pede nome e e-mail. O instalador não é assinado e o site não menciona isso. **Alto.**
7. **Navegação e CTA fora da IA-alvo.** Hoje: Products · Services · Research · Company, com "Get a free fit check". Alvo: Products · Solutions · Demos · Insights · Company, com "Discuss your project". /demos e /insights não existem. **Alto.**
8. **Deploy manual sem rastreabilidade.** O deploy é feito com `vercel deploy --prod` a partir de um commit local não enviado (656c4ce). O PR para main está bloqueado por 116 erros de lint. Os arquivos de CI não estão no snapshot. **Médio/alto (processo).**
9. **Medição mistura intenção e conversão.** O quiz de prontidão dispara `form_start` e `generate_lead`. Não há eventos `intent_selected`, `product_viewed` ou `demo_*`. O endpoint de Web Vitals descarta os dados. **Médio.**
10. **Marca e motion fora das regras.** O favicon ainda é o crest. Instrument Serif é uma 4ª fonte, fora do trio aprovado. Há 2 canvases WebGL, GSAP, motion próprio e vídeo ao mesmo tempo. Sobram 80 frames órfãos (2,9 MB) e o código morto `offer.ts`, que contém o card do ASTRA. **Médio.**

Pontos positivos verificados: o logotipo usa apenas o wordmark. MAAX está retirado (redirect 308 para /products, coberto por testes). ASTRA não é renderizado. O fundador não aparece no site (`FOUNDER = null`). Não há preços publicados. A garantia do checklist de aceite está correta. Os formulários vão para o CRM via servidor, com HMAC e consentimento versionado. Canonical, sitemaps e robots estão consistentes.

## Itens pendentes de aprovação do fundador

1. **Propriedade:** substituir a afirmação genérica por "propriedade e licenças definidas em cada contrato". O texto de `engagement-model.tsx:77` é a referência.
2. **Orçamento:** manter ou não "orçamento fixo por escrito" e "avaliação creditada no projeto".
3. **Prazos:** remover todos os prazos fixos ou aprovar redação alternativa ("prazo definido no plano escrito").
4. **Orbit:** linha de propósito. Até lá, o card mostra só "In development", sem link, CTA ou formulário.
5. **AEXOS Pro:** existe oferta comercial real? Se não, mostrar só o Core e remover "Ask about Pro".
6. **AEXOS, categoria:** escolher uma categoria única em linguagem simples.
7. **Onyx:** o modal de download é obrigatório? Publicar o aviso de instalador não assinado? Manter "never logs off", "24/7" e "tamper-evident"?
8. **Atendimento:** EUA + América Latina e espanhol continuam no escopo, ou só EUA?
9. **Estatísticas:** quais manter (só as verificadas, com a base correta) e se saem da sequência principal da home.
10. **Redirects:** confirmar /products como destino de /products/maax-studio, e /answers → /insights (308) depois que /insights existir.
11. **Grupos de soluções:** aprovar os slugs (`/solutions/strategy-consulting`, `/automation-integration`, `/custom-ai-software`, com `/managed-operations` como página do 4º grupo) e onde fica "Data & Knowledge Systems".
12. **Instrument Serif:** remover ou aprovar explicitamente. Novo favicon sem crest.
13. **Newsletter:** links antigos de newsletter (hoje caem na home) devem ir para uma página de aviso?
14. **Privacidade:** revisar `privacy.tsx:355-356`, que parece descrever o armazenamento anterior ao CRM.

## O que não foi possível verificar

- Conteúdo visual do favicon, da imagem OG e da mídia do hero.
- Envio real de formulários, roteamento no CRM e e-mails do CRM.
- Download e execução do instalador do Onyx, e qualquer capacidade de Onyx ou AEXOS.
- Texto da LICENSE do AEXOS, repositório GitHub (bloqueado por rate limit) e página npmjs.com (falhou). O registry foi usado no lugar: v5.3.0 é a única versão, publicada em 03/08/2026, com 6 downloads na semana de 10 a 16/11.
- Códigos HTTP dos redirects no mesmo host (MAAX, aliases, apex). Exceção: aexos.cyryxlabs.com respondeu 302, mas o código prevê 308.
- Workflow de CI, configs de Playwright e Lighthouse, scripts de qualidade e estado atual de testes e lint (fora do snapshot).
- Relatórios completos das pesquisas citadas, a fonte do G2, o DOI do CGP e o perfil do Instagram.
