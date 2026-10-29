# Jogo da Forca

Jogo da forca em português do Brasil, feito com **HTML, CSS e JavaScript puro** — sem framework,
sem bundler e sem etapa de build. Funciona com mouse ou teclado e foi construído para leitores de tela.

## Como jogar

1. Abra o jogo no navegador.
2. Escolha uma letra no teclado da tela ou digite no teclado do computador.
3. Cada erro desenha uma parte do boneco. São **seis erros**: no sexto, a partida termina.
4. Acentos não importam (`C` também vale para `Ç`) e espaços/hífens já aparecem revelados.
5. Vença descobrindo a palavra antes de completar o boneco.

## Como rodar

O jogo usa ES modules, então precisa ser servido por HTTP (abrir o arquivo direto com `file://` não funciona).

```bash
# opção 1 — Python
python3 -m http.server 5173        # no Windows, se precisar: python -m http.server 5173

# opção 2 — VS Code
# instale a extensão Live Server e clique em "Go Live" com o index.html aberto
```

Depois abra <http://localhost:5173>.

## Como rodar os testes

```bash
npm install
npm test
```

Os testes usam **Vitest + jsdom** e cobrem as regras puras (`tests/jogo.test.js`), a integridade do
acervo (`tests/palavras.test.js`) e a integração com o DOM (`tests/interface.test.js`).

## Estrutura

```
index.html              # página única do jogo
styles/base.css         # reset, tokens de design, foco e link de salto
styles/componentes.css  # painéis, palavra, teclado, boneco, botões
styles/responsivo.css   # refinamentos a partir de 600px e 900px
src/jogo.js             # regras puras: estado, palpites, vitória/derrota
src/palavras.js         # acervo por categoria e sorteio sem repetição
src/interface.js        # ligação entre regras e DOM
src/armazenamento.js    # estatísticas no localStorage (com fallback)
src/main.js             # ponto de entrada
tests/                  # testes automatizados
```

## Decisões de implementação

- **Estado imutável**: `guessLetter(estado, letra)` devolve sempre um estado novo; letra repetida,
  inválida ou fora de `'jogando'` é ignorada sem lançar exceção.
- **Acessibilidade**: regiões `aria-live` para acerto/erro, `aria-pressed` nas teclas usadas,
  foco visível, alvo de toque de 44px, contraste AA e respeito a `prefers-reduced-motion`.
- **Persistência tolerante a falhas**: modo privado ou storage bloqueado não quebram o jogo.
- **Sem dependências de runtime**: só `vitest` e `jsdom` como dependências de desenvolvimento.
