## Plano

1. **Consentimento no formulário `#contact`**
   - Adicionar um checkbox obrigatório de consentimento antes do botão de envio.
   - Texto claro e globalmente seguro: o usuário confirma que aceita ser contatado sobre a solicitação e reconhece a Política de Privacidade.
   - Incluir validação client-side com mensagem de erro específica quando o checkbox não estiver marcado.
   - Enviar o consentimento também para a validação server-side, sem aceitar submissões sem consentimento.

2. **Link e página de Política de Privacidade**
   - Criar uma rota pública `/privacy` com uma política objetiva e conservadora para uso global/EUA: informações coletadas, finalidade do contato, base de consentimento, compartilhamento limitado, retenção, direitos do usuário, cookies/analytics em termos genéricos e contato por email.
   - Usar o mesmo visual premium da landing page, header/footer existentes e metadados próprios.
   - Linkar o checkbox para `/privacy`, abrindo em nova aba para não perder o preenchimento do formulário.

3. **Corrigir scroll automático ao recarregar/acessar**
   - Garantir que a página inicial sempre carregue no topo quando acessada/recarregada, mesmo se a URL vier com hash como `/#contact` ou se o navegador tentar restaurar a posição anterior.
   - Definir `history.scrollRestoration = "manual"` no shell do app.
   - Adicionar um controlador leve no route root/home para forçar `window.scrollTo(0, 0)` no carregamento inicial, sem bloquear scrolls iniciados pelo usuário depois.
   - Manter o scroll por clique nos CTAs para `#contact` funcionando normalmente após a página já estar carregada.

4. **Revisar CTAs relacionados ao contato**
   - Corrigir o CTA do menu mobile que ainda aponta para `#cta`, passando para `#contact`.
   - Preservar o offset consistente do header fixa para cliques manuais nos CTAs.

5. **Validação rápida pós-implementação**
   - Verificar que submissão sem consentimento mostra erro e não envia.
   - Verificar que submissão válida mantém sucesso/toast.
   - Verificar que reload/acesso direto abre no topo, enquanto cliques em `Start a Project`, `Request Access` e `Request Early Access` continuam levando ao formulário.