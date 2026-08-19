# Contribuindo com o Tá Preenchido

O **Tá Preenchido** é uma extensão de Chrome para preencher formulários web com dados brasileiros fictícios. A ideia é facilitar a vida de quem desenvolve, testa ou valida telas de cadastro sem precisar digitar CPF, CNPJ, telefone, endereço e cartão na mão toda hora.

O projeto é simples de rodar: não tem build, não tem framework e não tem dependência externa obrigatória. A extensão usa JavaScript puro, Manifest V3, APIs do Chrome e uma integração opcional com a BrasilAPI para buscar CEPs reais.

Este guia existe para manter as contribuições organizadas, principalmente quando uma melhoria grande for quebrada em várias entregas menores.

## Antes de mexer

Toda mudança precisa nascer de uma issue. Se for uma ideia nova, melhoria visual, automação, refactor planejado ou evolução do produto, use o template de feature request. Se for problema reproduzível ou regressão, use o template de bug report.

Antes de abrir uma branch, confira:

- [ ] existe uma issue descrevendo a mudança;
- [ ] a issue tem escopo claro;
- [ ] a issue está atribuída a quem vai tocar;
- [ ] se for feature, ela está com `enhancement` e `type: feature`;
- [ ] se fizer parte de uma saga, ela está vinculada à issue pai.

Enquanto o repositório não tiver GitHub Issue Types configurado, a label `type: feature` é o nosso jeito de marcar que a issue é uma feature.

## Sagas

Quando a mudança for grande demais para um PR só, abra uma saga. A saga é uma issue pai que guarda o contexto maior e aponta para as subissues.

Uma boa saga explica o que estamos tentando melhorar, por que isso importa e quais entregas menores fazem parte do caminho. Cada subissue deve atacar uma parte específica do problema, como geração contextual, popup, menu de contexto, selects ou empacotamento da extensão.

Checklist de saga:

- [ ] a issue pai explica o objetivo geral;
- [ ] as subissues estão vinculadas à issue pai;
- [ ] cada subissue tem um escopo independente;
- [ ] a ordem sugerida de execução está clara;
- [ ] existe uma branch da saga vinculada no painel **Development**.

## Branches

Use nomes normalizados. Nada de espaço, acento, barra, underscore ou símbolo. Só letras, números e hífen.

Formato:

```txt
[numero-issue]-[tipo]-[descricao-normalizada]
```

Exemplos:

```txt
2-saga-melhorias-geracao-contextual-distribuicao
3-feature-organizar-padroes-github
9-feature-empacotamento-chrome-web-store
```

Checklist de branch:

- [ ] a branch da saga saiu de `main`;
- [ ] a branch da subissue saiu da branch da saga;
- [ ] a branch está vinculada à issue no painel **Development**;
- [ ] a branch contém apenas o trabalho daquela issue.

## Codando

O repositório é uma extensão vanilla, então prefira soluções diretas e fáceis de revisar. Evite criar complexidade de build sem necessidade. Se uma mudança começar a crescer demais, quebre em outra issue.

Antes de considerar uma subissue pronta:

- [ ] o escopo da issue foi atendido;
- [ ] nada fora do escopo entrou junto;
- [ ] o `CHANGELOG.md` foi atualizado;
- [ ] a extensão foi validada manualmente quando aplicável;
- [ ] o diff foi revisado antes do commit.

Quando a mudança envolver UI, confira também:

- [ ] o popup ou painel continua legível em tamanho pequeno;
- [ ] os textos estão claros;
- [ ] os botões têm feedback;
- [ ] a alteração não atrapalha páginas onde a extensão roda.

Quando a mudança envolver preenchimento de formulário, confira:

- [ ] inputs recebem valor corretamente;
- [ ] selects escolhem opções existentes;
- [ ] checkboxes e radios continuam funcionando;
- [ ] eventos `input` e `change` são disparados;
- [ ] páginas com React, Vue ou Angular continuam reconhecendo a mudança quando possível.

## Commits

Commits devem ser pequenos, claros e escritos em inglês.

Formato:

```txt
#[numero-issue] - [action]: [short english description]
```

Actions comuns:

```txt
feat
fix
chore
lint
refactor
```

Exemplos:

```txt
#3 - docs: add contribution guide
#4 - feat: add contextual data generator
#9 - chore: add extension packaging workflow
```

## Pull requests

Todo PR deve usar `.github/pull_request_template.md`.

PR de subissue deve apontar para a branch da saga, não direto para `main`. A branch da saga funciona como uma main temporária enquanto a iniciativa ainda está em andamento.

Checklist antes de abrir PR:

- [ ] o PR aponta para a branch correta;
- [ ] o campo **Related Issue** usa `Closes #numero` quando aplicável;
- [ ] a descrição explica o que mudou;
- [ ] a motivação está clara;
- [ ] a validação foi descrita;
- [ ] o checklist do template foi preenchido;
- [ ] o `CHANGELOG.md` foi atualizado.

## Changelog

Toda subissue implementada deve atualizar o `CHANGELOG.md`.

Mudanças ainda não lançadas entram sempre no topo:

```md
## [UNRELEASED]
```

Agrupe por tipo:

```md
### Adicionado
### Alterado
### Corrigido
### Removido
```

Cada entrada principal começa com a issue:

```md
* [#3](https://github.com/JohnAndante/ta-preenchido/issues/3) - Organizar padrões de contribuição do projeto
  * Adicionado `CONTRIBUTING.md` com o fluxo de issues, branches, commits, PRs e changelog.
```

## Publicação da extensão

Para publicar na Chrome Web Store, o pacote final deve ser um `.zip` com o `manifest.json` na raiz.

Antes de gerar o pacote, confira:

- [ ] `manifest.json` está na raiz do ZIP;
- [ ] `.git` não entrou no pacote;
- [ ] `.github` não entrou no pacote;
- [ ] arquivos temporários locais ficaram de fora;
- [ ] artefatos antigos de build ficaram de fora;
- [ ] a versão do `manifest.json` está correta.

Quando existir script ou action de empacotamento, documente o comando aqui ou no README.
