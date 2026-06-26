Vou corrigir especificamente o fundo branco que ficou preso dentro da letra “B” em “Labs”.

Plano:
1. Inspecionar o SVG/asset atual usado pela logo para localizar o preenchimento branco dentro da letra B.
2. Remover somente esse preenchimento branco, preservando o restante da logo, cores, proporção e alinhamento.
3. Gerar/substituir o asset transparente corrigido e manter o componente da logo apontando para a versão limpa.
4. Validar visualmente no desktop em fundo escuro e em outras seções para garantir que não exista quadrado, borda ou fundo branco restante.

Detalhe técnico: se o branco estiver como path/fill dentro do SVG, vou editar/remover esse elemento; se estiver rasterizado no asset, vou limpar a área e republicar a imagem transparente.