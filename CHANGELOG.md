# Changelog

<!-- O histórico de versões do Tá Preenchido. -->

## [1.2.0] - Março de 2026

Neste ciclo, decidi focar na limpeza da casa. A interface tava bem carregada e com aquela cara clássica de "gerado por inteligência artificial". Agora tá mais crua e funcional. Também trouxe o controle dos gatilhos pro próprio usuário.

### O que entrou
- **Página de Opções (`options.html`):** Uma tela dedicada pra gerenciar os cadastros e atalhos globais, salvando tudo no `chrome.storage.local`.
- **Regras Customizadas:** O usuário finalmente pode ditar o que a extensão entende. Cria uma regra pra "Vaga", põe uma lista de posições, e o bot resolve na hora de injetar.
- **De cara pro QA:** O plugin já carrega uns exemplos iniciais pra ninguém começar na tela em branco (Empresas falsas, Descrições lorem ipsum).
- **Atalho no lugar certo:** Tirei a caixa de configurar atalhos do popup espremido e mandei pra tela de Opções geral.
- **Transições em CSS:** Troquei os brutais `display: none` por transições decentes de opacidade e escala no painel e nos botões.
- A base do `LEGAL_PUBLISHING.md` deixada pronta pro dia que rolar ânimo de encarar a burocracia da Chrome Web Store.

### O que mudou
- Refatoração do `popup.html`. Cortei a paleta vibrante e os emojis desnecessários pra deixar mais clean e com pegada de developer tools. 
- O arquivo `content.js` parou de rodar com dados fixos apenas e agora mescla os padrões da extensão com o que você salvar lá na página de Opções.

### O que corrigiu
- Removi as funções HTML do tipo `onclick=` que as regras de Content Security Policy do Chrome simplesmente obliteram no Manifest V3. Agora o código do editor de categorias ouve puramente por Event Delegation.
- O popup da extensão não vai mais capotar com o temido console error de nulo quando você clica num botão, fruto de restos de listeners de JS que estavam caçando inputs que já foram apagados do DOM.

## [1.0.0] - Lançamento Inicial

- Engine base de parsear nomes, placeholders e classlists na web para forçar spoof de formulários.
- Funções pesadas de validação nativa de CPFs, CNPJs, data de nascimento e Cartões Luhn.
- Adicionado polling que contorna validações síncronas de frameworks como React Hook Form, Vue e Angular Forms.
