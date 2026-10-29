# Jogo da Forca — contexto do projeto

Este repositório contém um **jogo da forca** (hangman) jogável no navegador, em português do Brasil.
Todos os agentes de `.github/agents/` compartilham as regras definidas aqui. Leia antes de agir.

> **Estado inicial:** os arquivos listados abaixo ainda **não existem**. Eles são criados pelos
> agentes, na ordem do fluxo de trabalho. Nunca assuma um arquivo como existente: leia antes de editar.

## Stack

- HTML5, CSS3 e JavaScript moderno (ES modules). **Sem framework, sem bundler e sem etapa de build.**
- O jogo roda abrindo `index.html` com Live Server, ou com `python -m http.server` na raiz.
- Testes de lógica: Vitest + jsdom. Testes de página: Playwright (somente se já estiver instalado).

## Estrutura de pastas (respeite esta organização)

```
index.html              # única página do jogo
styles/base.css         # reset, tokens (cores, tipografia, espaçamento)
styles/componentes.css  # teclado, palavra, boneco, painel de status
styles/responsivo.css   # media queries e ajustes de layout
src/jogo.js             # regras puras do jogo (sem DOM): estado, palpites, vitória/derrota
src/palavras.js         # acervo de palavras e categorias
src/interface.js        # ligação entre regras e DOM
src/armazenamento.js    # localStorage: estatísticas e preferências
src/main.js             # ponto de entrada: liga os módulos e inicia a partida
tests/                  # testes automatizados
assets/                 # imagens, ícones, sons
```

`index.html` carrega apenas `src/main.js` (como `<script type="module">`), e `main.js` importa os demais módulos.

## Convenções de código

- **JavaScript** (variáveis, funções, constantes): **inglês**.
- **IDs e classes do DOM** (`#palavra`, `#teclado`, `.teclado__tecla`): **pt-BR em BEM**, porque são o
  contrato compartilhado entre HTML, CSS e JS. Nunca renomeie um contrato sem alinhar os três agentes.
- **Custom properties CSS**: inglês (`--color-accent`, `--space-2`).
- Classes BEM com prefixo de bloco: `teclado__tecla`, `palavra__letra`, `boneco__parte`.
- Comentários, documentação e texto visível ao jogador: **pt-BR**.
- Nada de `!important`, estilo inline ou `innerHTML` com dado do jogador (use `textContent` / `createElement`).
- Acessibilidade é requisito, não extra: navegação por teclado, foco visível, contraste mínimo WCAG AA
  (4.5:1 em texto, 3:1 em componentes) e anúncios em `aria-live`.
- Sem dependências novas sem justificativa aprovada pelo Tech Lead.

## Contratos compartilhados (fonte da verdade)

- IDs: `#palavra`, `#teclado`, `#boneco`, `#status`, `#tentativas`, `#botao-novo-jogo`, `#botao-categoria`, `#regras`.
- Classes: `teclado`, `teclado__tecla`, `palavra`, `palavra__letra`, `boneco`, `boneco__parte`, `status`, `painel`.
- Classes de estado no `<body>`: `estado-jogando`, `estado-vitoria`, `estado-derrota`.
- `data-letra` em cada tecla (A–Z, mais C-cedilha quando existir); letras já jogadas recebem `disabled` e `aria-pressed="true"`.
- Cada parte do boneco tem `data-parte` (`cabeca`, `corpo`, `braco-esq`, `braco-dir`, `perna-esq`, `perna-dir`) e nasce oculta.
- Estados de `src/jogo.js`: `'jogando'`, `'vitoria'`, `'derrota'`.
- Eventos: clique em `.teclado__tecla` e `keydown` global com `event.key` de A–Z.

## Regras de jogo (fonte da verdade)

- A palavra secreta é sorteada do acervo da categoria ativa, sem repetição até a categoria esgotar.
- O boneco tem **6 partes**: cada erro revela uma. No **6º erro** o boneco fica completo e a partida
  termina em **derrota**.
- Letras acentuadas são normalizadas (`á` → `a`); `ç` vira `c`. Espaços e hífens já aparecem revelados.
- Acertos e erros são acumulados em estatísticas persistidas no `localStorage`.
- Todo o jogo é jogável sem mouse (teclado físico) e com teclado virtual na tela.

## Skills de apoio

Cada agente tem uma skill gratuita em `.github/skills/` (conteúdo em inglês; origem e licença em
`docs/skills.md`). A skill é referência de ofício, **não** substitui estas regras: em conflito, vale
este arquivo. Skills que falam de landing page, framework ou outra stack precisam ser recortadas para
o escopo do jogo, conforme a instrução no corpo de cada agente.

## Fluxo de trabalho entre agentes

1. **Tech Lead** define o escopo da entrega e distribui as tarefas.
2. **Designer UX** entrega a especificação visual e de interação.
3. **Dev HTML → QA HTML → Dev CSS → QA CSS → Dev JS → QA JS**: cada dev entrega e o QA valida antes do próximo passo.
4. **Dev GitHub** cuida de branch, commits, PR e documentação ao final de cada entrega.

## Definição de pronto (vale para todos)

- O que foi pedido funciona no navegador, sem erro no console.
- Nenhuma regra de jogo ou texto existente foi quebrado.
- Se você mexeu em código, rodou a verificação correspondente e relatou o resultado real (inclusive falhas).
- Arquivos alterados listados na resposta, com caminho relativo à raiz do repositório.
