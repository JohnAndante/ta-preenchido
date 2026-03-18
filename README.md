<img width="888" height="307" alt="Novo Projeto" src="https://github.com/user-attachments/assets/ed54b3e3-3e10-4006-beea-14cc3a2f2fc8" />

# Tá Preenchido

Uma extensão de Chrome pra preencher formulários web automaticamente com dados fictícios. Fizemos isso pra quem testa software e já não aguenta mais digitar "Teste Silva" e ficar buscando gerador de CPF no Google toda vez.

## O que tem de bom

- Bate o olho nos inputs (`name`, `id`, `placeholder`) e deduz o que precisa entrar lá.
- Gera CPFs, CNPJs e cartões de crédito que passam nas validações de front-end.
- Busca endereços reais a partir de CEP via [BrasilAPI](https://brasilapi.com.br/).
- Dá a liberdade de criar categorias customizadas na aba de Opções. Cê cria a palavra-chave (ex: `cargo`) e ele injeta um dos valores que você cadastrou.
- Nada sai da sua máquina. O processamento ocorre no próprio navegador sem enviar seus inputs de form pra backends alheios.

## Como colocar pra rodar

1. Baixe os arquivos do projeto.
2. No seu Chrome, vai em `chrome://extensions/`.
3. Vira a chavinha do "Modo do desenvolvedor" lá no canto.
4. Clica em "Carregar sem compactação" e aponta pra pasta.

## Como usar

Toda vez que uma página com inputs carregar, a extensão joga um botão discreto no canto pra você preencher tudo de uma vez. Dá também pra usar no teclado: manda um `Ctrl + Shift + F` que a mágica acontece.

Se precisar alterar os atalhos ou botar palavras novas na roleta, clica no ícone da extensão lá no menu do navegador e vai em "Personalizar".
