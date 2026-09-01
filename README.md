<img width="888" height="307" alt="Novo Projeto" src="https://github.com/user-attachments/assets/ed54b3e3-3e10-4006-beea-14cc3a2f2fc8" />

# Tá Preenchido

Uma extensão de Chrome pra preencher formulários web automaticamente com dados fictícios. Fizemos isso pra quem testa software e já não aguenta mais digitar "Teste Silva" e ficar buscando gerador de CPF no Google toda vez.

## O que a extensão faz

- Bate o olho nos inputs (`name`, `id`, `placeholder`) e deduz o que precisa entrar lá, inclusive em `select`s nativos.
- Gera pessoa, empresa, endereço e pagamento de forma **coerente** por execução: o CNPJ, a razão social, o e-mail e o responsável da empresa batem entre si, e o nome do cartão bate com o da pessoa gerada.
- Gera CPFs, CNPJs e cartões de crédito que passam nas validações de front-end.
- Busca endereços reais a partir de CEP via [BrasilAPI](https://brasilapi.com.br/).
- Dá a liberdade de criar categorias customizadas na aba de Opções. Crie a palavra-chave (ex: `cargo`) e ele injeta um dos valores que você cadastrou.
- Nada sai da sua máquina. O processamento ocorre no próprio navegador sem enviar seus inputs de form pra backends alheios.

## Setup

1. Baixe os arquivos do projeto.
2. No seu Chrome, vai em `chrome://extensions/`.
3. Vira a chavinha do "Modo do desenvolvedor" lá no canto.
4. Clica em "Carregar sem compactação" e aponta pra pasta.

## Como utilizar

### Preencher a página inteira

Toda vez que uma página com inputs carregar, a extensão joga um botão discreto no canto pra você preencher tudo de uma vez. Dá também pra usar no teclado: manda um `Ctrl + Shift + F` que a mágica acontece.

Clicando no botão flutuante (sem soltar em preencher direto) você abre um **painel de ações rápidas** ali mesmo na página, com atalhos pra preencher o formulário ou copiar CPF, CNPJ, nome, empresa, endereço e cartão sem sair de onde você está.

### Gerador rápido no popup

Clica no ícone da extensão pra abrir o popup: lá tem botões one-click pra copiar CPF, CNPJ, nome, e-mail, telefone, empresa, endereço e cartão (número ou pacote completo) direto pra área de transferência, com feedback visual no próprio botão.

### Menu de contexto por campo

Clique com o botão direito em qualquer campo editável da página pra ver o menu **Tá Preenchido**, com opções pra preencher só aquele campo (nome, e-mail, telefone, CPF, CNPJ, CEP, empresa ou cartão).

### Personalizando

Se precisar alterar os atalhos, botar palavras novas na roleta de categorias customizadas, ou escolher quais botões aparecem no popup e no menu de contexto, clica no ícone da extensão lá no menu do navegador e vai em "Personalizar".

## Gerar ZIP para Chrome Web Store

Para gerar um pacote publicável localmente:

```bash
bash scripts/package-extension.sh
```

O arquivo sai em `dist/ta-preenchido-vX.Y.Z.zip`, com `manifest.json` na raiz e apenas os arquivos necessários da extensão.

Também existe a workflow **Gerar pacote da extensão**, que pode ser executada manualmente no GitHub Actions ou por tags `v*`. Ela publica o ZIP como artifact.
