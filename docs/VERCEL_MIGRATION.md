# Migração para Vercel — Hosting + CI/CD

Este documento descreve a mudança de hospedagem do site (frontend + SSR TanStack Start) para a **Vercel**, mantendo o **GitHub como fonte de verdade** e o **Supabase inalterado no Lovable Cloud**. Domínio `cyryxlabs.com` permanece no Lovable até corte planejado.

## Decisões arquiteturais

- **`vite.config.ts` não é alterado.** O wrapper `@lovable.dev/vite-tanstack-config` só usa `cloudflare-module` como `defaultPreset` (fallback). Nitro faz auto-detect via `VERCEL=1` (a Vercel injeta essa variável) e via `NITRO_PRESET`. Local continua Cloudflare, Vercel emite `.vercel/output/` automaticamente.
- **Nenhum hardcode de preset.** Sem `nitro: { preset: "vercel" }` em código — quem escolhe o alvo é o ambiente de build.
- **Rollback:** enquanto o DNS de `cyryxlabs.com` seguir no Lovable, o deploy Lovable permanece vivo e serve como rollback instantâneo.

## Passos na Vercel (executados pelo founder)

### 1. Conectar GitHub ao Lovable

No editor Lovable → botão **+** (canto inferior esquerdo do chat) → **GitHub** → **Connect project** → **Create Repository**. Após conectado, toda mudança feita no Lovable e todo push direto ao GitHub sincronizam nos dois lados.

### 2. Importar repo na Vercel

1. [vercel.com/new](https://vercel.com/new) → selecionar o repositório.
2. Framework Preset: **Vite** (auto-detect).
3. Build Command: deixar padrão (`vite build`).
4. Output Directory: deixar padrão. Nitro emite `.vercel/output/` (Build Output API v3) e a Vercel detecta sozinha.
5. **Não** anexar Production Domain ainda — deploy inicial roda em `<projeto>.vercel.app`.

### 3. Variáveis de ambiente (Settings → Environment Variables)

Aplicar a **Production + Preview + Development**. Os valores estão no `.env` do projeto Lovable (abra pelo Code Editor):

| Nome | Origem | Escopo |
|---|---|---|
| `VITE_SUPABASE_URL` | `.env` | client + server |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env` | client + server |
| `VITE_SUPABASE_PROJECT_ID` | `.env` | client |
| `SUPABASE_URL` | mesmo valor de `VITE_SUPABASE_URL` | server |
| `SUPABASE_PUBLISHABLE_KEY` | mesmo valor de `VITE_SUPABASE_PUBLISHABLE_KEY` | server |
| `SUPABASE_PROJECT_ID` | mesmo valor | server |

Opcional — necessária apenas se o build for usar Lovable AI Gateway a partir da Vercel:

| Nome | Notas |
|---|---|
| `LOVABLE_API_KEY` | Hoje é auto-injetada pelo Lovable; na Vercel precisa ser provisionada manualmente (rotate via ferramenta `lovable_api_key--rotate_lovable_api_key` e colar o valor). |

### 4. Deploy inicial

Ao terminar o import, a Vercel roda o primeiro build. Se `VERCEL=1` estiver presente (é, sempre), Nitro seleciona o preset `vercel` e o build sai limpo.

### 5. Smoke test em `<projeto>.vercel.app`

- Home `/`
- `/products/lyra`, `/solutions`
- Login Google (ver seção OAuth abaixo)
- Renderização SSR de metadata (View Source deve mostrar `<title>`, `og:*`, JSON-LD)
- Formulário de contato (**ver ⚠️ abaixo**)
- Hero preservado

### 6. OAuth — Redirect URLs

Adicionar as URLs Vercel à allowlist de OAuth no Supabase (via ferramenta `supabase--configure_social_auth` quando as URLs finais estiverem definidas):

- `https://<projeto>.vercel.app`
- `https://<projeto>-*.vercel.app` (previews de branch — pattern)

Manter `cyryxlabs.com`, `www.cyryxlabs.com`, `workspace.cyryxlabs.com` na lista.

## ⚠️ Auditoria realizada — pendência bloqueante identificada

Durante a preparação desta migração, foi feita busca em `src/` por usos de `supabaseAdmin` / `client.server` / `SERVICE_ROLE`. **A premissa inicial ("nenhuma server function ativa usa service role") não corresponde ao código atual.** Módulos que importam `supabaseAdmin`:

| Arquivo | Uso | Impacto na Vercel sem `SUPABASE_SERVICE_ROLE_KEY` |
|---|---|---|
| `src/lib/contact.functions.ts` | insert em `contact_submissions` | **Formulário de contato quebra em runtime** |
| `src/lib/admin-users.functions.ts` | `auth.admin.listUsers`, `inviteUserByEmail`, `generateLink`, grants de role | Área admin de usuários quebra |
| `src/lib/admin-overview.functions.ts` | leituras `cta_events` e agregados | Dashboard admin quebra |
| `src/lib/careers-analytics.functions.ts` | leituras analíticas | Analytics de careers quebra |
| `src/lib/email/send-internal.server.ts` | import top-level (server-only) de `supabaseAdmin` | Fluxos internos de e-mail podem quebrar |

A restrição de plataforma (Lovable Cloud não expõe `SUPABASE_SERVICE_ROLE_KEY` fora do runtime Lovable) impede a portabilidade direta desses módulos. Caminhos possíveis, todos fora do escopo desta migração:

1. **Portar para RLS puro + `requireSupabaseAuth`** — reescrever cada função removendo dependência de service role, usando policies e RPCs `SECURITY DEFINER` para as operações privilegiadas. Preserva a Vercel sem depender de chave adicional.
2. **Escalar ao suporte Lovable** para obter a chave service role do projeto Supabase gerenciado. Uma vez obtida, provisioná-la como env var **server-only** na Vercel (nunca com prefixo `VITE_`).
3. **Aceitar quebra funcional** dessas superfícies enquanto o DNS ainda estiver no Lovable — o deploy Lovable segue servindo essas rotas até o corte de tráfego.

Escolha uma antes de apontar o DNS para a Vercel.

## O que NÃO faz parte desta etapa

- Não move DNS (permanece no Lovable — este é o rollback).
- Não migra Supabase.
- Não altera Hero, copy, layouts, SEO, JSON-LD ou assets.
- Não despublica o Lovable.
- Não altera `vite.config.ts`, `supabase/config.toml`, migrations ou `src/routeTree.gen.ts`.

## Comandos úteis

Verificar localmente que o build ainda funciona no preset Cloudflare (padrão local):

```bash
bun run build
```

Simular preset Vercel localmente (não commitar mudanças de artefato):

```bash
NITRO_PRESET=vercel bun run build
ls -la .vercel/output/
```

## Rollback

1. Manter DNS de `cyryxlabs.com` no Lovable — corte não foi feito.
2. Se o deploy Vercel apresentar regressão em `<projeto>.vercel.app`, desativar a integração GitHub↔Vercel (Vercel → Settings → Git → Disconnect). Lovable segue publicado normalmente.
3. Não há mudança de código de runtime que precise ser revertida.