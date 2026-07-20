# Migração para Vercel — Hosting + CI/CD

Objetivo: mover a hospedagem do site (TanStack Start SSR) e o pipeline de deploy para a **Vercel**, usando o **GitHub como fonte de verdade**. Backend Supabase permanece **inalterado** (banco, auth, RLS, storage, edge functions, cron, pgmq, e-mail). Domínio `cyryxlabs.com` permanece no Lovable **por enquanto** — a Vercel será exercitada primeiro sob um preview URL da própria Vercel.

## Contradição a resolver antes de executar

Sua resposta de escopo marcou "Tudo, incluindo Supabase próprio", mas o texto do motivo diz "O projeto Supabase existente deve permanecer inalterado". Este plano assume **Supabase inalterado** (a leitura mais segura e alinhada com "baixo downtime + rollback"). Se realmente quiser um Supabase próprio, é outro projeto (export schema + dados + RLS + pgmq + vault + rewiring do `functions.email_queue_dispatch` cron) e eu revisito o plano.

## Restrições reais desta stack

1. `SUPABASE_SERVICE_ROLE_KEY` e `SUPABASE_DB_URL` **não são acessíveis** enquanto o Supabase estiver sob Lovable Cloud. Nenhum server function que hoje usa `supabaseAdmin` conseguirá rodar na Vercel sem essa chave. Ou você extrai a chave (fora da minha capacidade — precisa suporte Lovable), ou aceita que essas rotas continuem sendo servidas pelo deploy Lovable, ou migra Supabase para conta própria.
2. O cron `email_queue_dispatch` chama `https://project--e1cd0bf6-…lovable.app/lovable/email/queue/process`. Enquanto o app Lovable continuar publicado, isso segue funcionando. Se um dia despublicar o Lovable, tem que reapontar esse `net.http_post` para o domínio Vercel — via `supabase--migration`.
3. Auth callbacks (`redirect_uri`) precisam incluir os novos domínios Vercel de preview/prod, senão o OAuth do Google quebra nos previews.
4. TanStack Start roda na Vercel via preset Nitro (`vercel`) — a config atual (Cloudflare Workers) precisa ser trocada.

## Etapas

### 1. GitHub como fonte de verdade
- Conectar o projeto Lovable ao GitHub (Plus (+) → GitHub → Create repository), se ainda não estiver.
- Confirmar que o branch `main` reflete o baseline atual (`ff9021b`-alinhado em `src/routes/index.tsx`).

### 2. Ajustes de código para rodar na Vercel
- `vite.config.ts`: trocar o preset do TanStack Start de Cloudflare para `vercel` (Nitro deploy target).
- Revisar servidor: `createServerFn` handlers que hoje dependem de `SUPABASE_SERVICE_ROLE_KEY` — marcar cada um e decidir (permanecer no Lovable, ou aguardar chave).
- `src/routes/api/public/*`: confirmar que webhooks/cron que ficarão na Vercel expõem URL estável (Vercel dá `*.vercel.app` + custom depois).
- Adicionar `vercel.json` mínimo se necessário (SSR já é auto-detectado pelo preset).

### 3. Variáveis de ambiente na Vercel
Provisionar nos três escopos (Production / Preview / Development):
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` — copiadas do `.env` do projeto.
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_PROJECT_ID` — idem (server-side).
- `LOVABLE_API_KEY` — se o Lovable AI Gateway continuar em uso a partir da Vercel, precisa provisionar manualmente (hoje é injetada pelo Lovable).
- `GOOGLE_SEARCH_CONSOLE_API_KEY` — copiar se rotas server-side dependem dela.
- `SUPABASE_SERVICE_ROLE_KEY` — **pendência bloqueante** para rotas admin (ver Restrição 1).

### 4. Deploy inicial na Vercel (sem tocar em DNS)
- Import do repo GitHub na Vercel; framework auto-detect (Vite / TanStack Start).
- Primeiro deploy roda em `<project>.vercel.app`.
- Smoke test: home, `/products/lyra`, `/solutions`, auth flow, formulários, JSON-LD, Hero.

### 5. Auth & OAuth
- Adicionar as URLs Vercel (`*.vercel.app` de production + branch) à lista de Redirect URLs do Supabase Auth (via `supabase--configure_social_auth`, no momento certo).
- Manter `cyryxlabs.com` na lista.

### 6. Corte de tráfego (fase posterior — não neste plano)
- Enquanto DNS permanece no Lovable, os dois deploys coexistem. Isso **é** o rollback: se a Vercel falhar, o tráfego continua no Lovable sem mudança.
- Corte real de DNS entra em plano separado quando você aprovar.

## Detalhes técnicos

- Preset Nitro: `tanstackStart({ target: 'vercel' })` em `vite.config.ts`.
- Server functions com `requireSupabaseAuth` continuam funcionando com chave publishable — sem bloqueio.
- Server functions com `supabaseAdmin` (ex.: qualquer coisa que use `client.server.ts`) — bloqueadas até resolver Restrição 1.
- `src/routeTree.gen.ts` é regenerado pelo plugin no build da Vercel; nada a fazer.
- O `.env` do projeto Lovable tem apenas as chaves publicáveis; não expõe service role. Correto para o cliente, insuficiente para portar rotas admin.

## O que NÃO faz parte deste plano
- Não move DNS.
- Não migra dados do Supabase.
- Não altera Hero, copy, layouts, SEO, JSON-LD, formulários ou assets.
- Não despublica o Lovable.
- Não altera `supabase/config.toml` nem migrations.

## Decisões que preciso de você antes de sair do Plan Mode
1. Confirma que Supabase fica **inalterado no Lovable Cloud** (respondendo à contradição acima).
2. Como quer tratar as rotas que dependem de `SUPABASE_SERVICE_ROLE_KEY`? (a) mantê-las servidas pelo Lovable em paralelo; (b) parar de usá-las temporariamente; (c) escalar com suporte Lovable para obter a chave.
3. Autoriza eu conectar o GitHub agora (se ainda não conectado) e trocar o preset de deploy no `vite.config.ts` como primeiro passo em Build Mode?
