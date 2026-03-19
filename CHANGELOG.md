# Changelog

<!-- O histórico de versões do Tá Preenchido. -->

## [1.3.0] - Março de 2026

Essa versão chegou com uma das atualizações mais pesadas pro núcleo da extensão. O *Tá Preenchido* ficou bem mais inteligente pra entender formulários complexos e menos invasivo com as páginas e as regras do Google.

### Novidades Brutas

* **Suporte Completo a Selects, Checkboxes e Radios:** A extensão finalmente parou de ignorar os menus dropdown! Agora ela escolhe Estados e Cidades direitinho no `<select>`. Para checkboxes, ela procura por palavras como "Termos", "Contrato" e "Aceito" pra marcar sozinha, e pra `radios` ela sorteia entre as opções disponíveis do mesmo `name`.
* **Novo Modo 100% Mock (Opt-out da BrasilAPI):** Adicionado um switch na tela de *Suas Configurações* para você desligar o motor de requisições de CEP real. Se desativado, ele injeta endereços falsos localmente gerados pelo próprio computador, perfeito pra não bater limite de requisições da API de graça.
* **O Retorno do Regex (Reconhecimento Aprimorado):** A antiga engine de busca (`indexOf`) aposentou. Agora os robôs procuram pelas palavras-chave usando os delimitadores literais de regex e blindagem total para os placeholders! (Por exemplo, `joao@empresa.com` não vai mais ativar acidentalmente a regra de "Empresa" da customização, o script virou ninja nisso).
* **Modal de Aviso Legal:** Adicionado um belo modal de "Termos & Aviso Legal (Disclaimer)" na página de Opções para proteger o dev e alertar devidamente os testadores QA de que nenhum dado trafega pra nuvem e tudo é offline e matematicamente falso. Redação muito mais direta e fluída nas Opções.

### Consertos e Adendos Menores

* **Silence nas Regras de Permissão:** Adicionado um `try...catch` bloqueando um erro clássico (e feio) no console que quebrava o popup quando ele era ativado numa página sagrada do Google (ex: `chrome://extensions/` e Web Store).
* **Mais Dados:** Entraram mais exemplos de profissões raiz (`Pedreiro`, `Encanador`, `Ajudante Geral`) no DB das categorias iniciais e a querida bandeira da **Diners Club** nos geradores de cartão.


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
