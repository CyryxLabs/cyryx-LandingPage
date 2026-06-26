## Diagnóstico

O servidor está saudável:
- `GET https://cyryxlabs.com/` → 200, `cache-control: no-cache, must-revalidate, max-age=0`, `x-cyryx-build: 2026-06-26T22:35:36Z`
- `GET /assets/styles-CtVwFtW-.css` → 200, `content-type: text/css`, 138 KB de Tailwind v4 + tokens
- SSR HTML contém todas as classes Tailwind e o `<link rel="stylesheet">` correto
- No replay da preview, o DOM anima normalmente (transforms/opacity oscilando) — a página está estilizada

A tela "horrível" que você vê é HTML antigo cacheado no seu navegador desktop, anterior ao fix `no-store`. Esse HTML aponta para um bundle CSS que foi substituído por hash novo no último deploy → o `<link>` 404 silenciosamente → fallback para markup cru.

## Solução em 3 passos

### 1. Ação imediata (sem código)
- Hard refresh no desktop: **Ctrl+Shift+R** (Win/Linux) ou **Cmd+Shift+R** (Mac)
- Se persistir: DevTools → Application → Clear storage → Clear site data → reload
- Validação esperada: `view-source:` mostra `<meta name="x-cyryx-build" ...>` recente e o CSS link carrega 200

### 2. Garantir que nunca mais aconteça (mudança de código)
- Em `src/routes/__root.tsx` adicionar no `<head>` (via `head().meta`):
  - `<meta http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate">`
  - `<meta http-equiv="Pragma" content="no-cache">`
  - Reforça `no-store` mesmo em proxies intermediários que ignorem header HTTP
- Inserir, antes da hidratação no `RootShell`, script defensivo que desregistra qualquer Service Worker legado:
  ```js
  if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistrations().then(rs => rs.forEach(r => r.unregister()));
  ```
  Garante que clientes com SW antigo não fiquem presos em HTML obsoleto.

### 3. Sanity check do `vite.config.ts`
- O override de `rollupOptions.output.entryFileNames/chunkFileNames/assetFileNames` é redundante (o preset `@lovable.dev/vite-tanstack-config` já aplica hashing) e adiciona risco de divergência com o manifest do nitro
- Remover o bloco `build.rollupOptions` mantendo apenas o `define` de `__CYRYX_BUILD_VERSION__`
- Reduz superfície para regressões futuras de bundle/manifest

## Após implementar

- Publicar para `https://cyryxlabs.com`
- Validar via `curl -sI` que HTML continua `no-store` e CSS continua hashed
- Confirmar no desktop (após hard refresh único) que o layout volta normal e `?cyryxDiag=1` mostra o build novo

## Detalhes técnicos

- `_headers` em `public/_headers` é sintaxe de Cloudflare Pages — neste projeto (Worker) é inerte; quem manda nos headers é `src/server.ts`. Não precisa remover, mas também não está protegendo nada hoje.
- O `x-cyryx-build` já está no response e visível no overlay de diagnóstico — útil pra confirmar versão sem precisar abrir o bundle.
