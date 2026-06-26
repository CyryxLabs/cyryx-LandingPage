## Diagnóstico

Testei https://cyryxlabs.com agora com um navegador headless real (Playwright):

- **Renderiza perfeitamente.** Logo 56px, fundo escuro `oklch(0.07 0 0)`, hero monolith e headline "Built to achieve. Not just to generate." aparecem com o design correto.
- O CSS `/assets/styles-2-0CpefQ.css` carrega (161 regras), JS carrega 200, nenhuma requisição falhou, nenhum erro no console.
- Screenshot do teste em `/tmp/browser/cyryx/live.png` confirma layout idêntico ao preview.

Conclusão: **o código e o deploy estão corretos**. O screenshot "unstyled" que você mandou é o que o seu navegador específico está exibindo — não o que o site está realmente servindo. As causas prováveis são:

1. **Cache antigo do navegador** servindo o HTML quebrado de quando o SSR ainda estava crashando (antes do fix do `gsap.registerPlugin`).
2. **Extensão do Chrome** (a sessão mostra `tb_remapper.js` injetado) interferindo no carregamento de CSS.
3. **Service Worker / cache da Cloudflare** num edge específico ainda servindo HTML antigo sem a tag `<link rel="stylesheet">`.

## Ações (sem mudança de código)

1. **Hard refresh no seu navegador**: Cmd+Shift+R (Mac) / Ctrl+Shift+F5 (Win) em https://cyryxlabs.com.
2. Se persistir: abrir em **aba anônima** (sem extensões) para confirmar se é cache/extensão.
3. Se persistir mesmo em anônima: **republicar o site** para emitir um novo deploy e invalidar o cache da Cloudflare em todos os edges. Posso disparar o publish quando você confirmar.
4. Como verificação final, posso rodar o Playwright de novo após o republish e te mandar o screenshot do que o site servindo no momento.

## O que NÃO vou fazer

- Não vou mudar componentes/CSS/animação — a página está construída e servida exatamente como aparece no preview; mexer no código agora introduziria regressão sem resolver o problema do seu navegador.
- O aviso de hydration mismatch do GSAP existe mas é cosmético (não causa página em branco); pode ser endereçado depois.

## Próximo passo recomendado

Faça o hard refresh primeiro. Se ainda estiver quebrado, me avise que eu disparo o republish.