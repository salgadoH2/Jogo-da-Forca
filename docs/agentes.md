# Agentes de IA do Jogo da Forca (VS Code)

Este repositório tem **9 agentes de IA** prontos para o VS Code (GitHub Copilot Chat). Cada um tem
um papel, um conjunto de ferramentas permitidas e uma definição de pronto. As regras que todos
compartilham — stack, estrutura de pastas, contratos de IDs/classes e regras do jogo — ficam em
[`copilot-instructions.md`](../.github/copilot-instructions.md).

## O que cada agente faz

| Arquivo | Agente | Use quando |
|---|---|---|
| `../.github/agents/tech-lead.agent.md` | **Tech Lead** | Início de cada entrega: planeja, divide tarefas, delega e revisa |
| `../.github/agents/designer-ux.agent.md` | **Designer UX** | Antes de HTML/CSS: paleta, tokens, wireframe, estados, acessibilidade |
| `../.github/agents/dev-html.agent.md` | **Dev HTML** | Estrutura da página, teclado virtual, ARIA, SVG do boneco |
| `../.github/agents/qa-html.agent.md` | **QA HTML** | Depois de mexer no HTML: semântica, foco, contratos de ID |
| `../.github/agents/dev-css.agent.md` | **Dev CSS** | Estilo, layout responsivo, animações do boneco |
| `../.github/agents/qa-css.agent.md` | **QA CSS** | Depois de mexer no CSS: contraste, responsivo, regressão visual |
| `../.github/agents/dev-js.agent.md` | **Dev JS** | Regras do jogo, sorteio de palavras, integração com o DOM |
| `../.github/agents/qa-js.agent.md` | **QA JS** | Depois de mexer em `src/`: testes Vitest, casos de borda |
| `../.github/agents/dev-github.agent.md` | **Dev GitHub** | Fim da entrega: branch, commits, PR, README, `.gitignore` |

Cada agente vem com uma **skill de apoio gratuita, em inglês**, copiada para `.github/skills/`.
Origem, licença e o recorte aplicado a cada uma estão em [skills.md](skills.md).

## Pré-requisitos

- VS Code atualizado com a extensão **GitHub Copilot** e **Copilot Chat** ativas.
- Abra **a pasta raiz deste repositório** no VS Code: os agentes vivem em `.github/agents/` e são
  descobertos automaticamente a partir da raiz do workspace.

## Como usar

1. Abra o Chat (`Ctrl+Alt+I` no Windows/Linux, `⌃⌘I` no macOS).
2. No seletor de agente, no topo do campo de mensagem, escolha o agente (ex.: **Tech Lead**).
   O agente fica ativo até você trocar.
3. Escreva o pedido. Seja específico sobre o resultado esperado e o que não pode mudar.
4. Ao final da resposta, use os **botões de handoff** ("Detalhar o design", "Implementar HTML",
   "Validar o HTML", …) para passar para o próximo agente com o contexto já preenchido.

> Os handoffs e a delegação para subagentes valem no harness **Local**. No harness **Copilot**, esses
> campos são ignorados: nesse caso selecione o próximo agente manualmente no seletor — o conteúdo dos
> arquivos `.agent.md` continua valendo.

## Primeira entrega (sugestão de prompt para o Tech Lead)

```
Crie o jogo da forca do zero, seguindo as regras de .github/copilot-instructions.md.
Comece pela versão mínima jogável: palavra sorteada, teclado virtual A-Z, boneco com 6 partes,
vitória/derrota e botão de novo jogo. Sem login, sem placar online e sem dependências novas.
Planeje e delegue para os agentes especialistas na ordem do fluxo.
```

Ordem padrão do fluxo:

```
Tech Lead → Designer UX → Dev HTML → QA HTML → Dev CSS → QA CSS → Dev JS → QA JS → Dev GitHub
```

## Ajustes comuns

- **Trocar o modelo de um agente:** acrescente `model: ['<id-do-modelo>']` no cabeçalho YAML do arquivo.
  Use o autocompletar do VS Code dentro do `.agent.md` para pegar o identificador válido.
- **Restringir ferramentas:** o campo `tools` já limita o que cada agente pode fazer. QA e Designer não
  alteram código de produção; Dev GitHub não executa `push` sem pedido explícito.
- **Agente só como subagente:** `user-invocable: false` esconde do seletor e mantém disponível para o Tech Lead.
- **Usar em outro projeto:** copie `.github/agents/` e `.github/copilot-instructions.md` e ajuste a stack
  e a estrutura de pastas nas instruções.
- **Criar um agente novo:** `Chat: New Custom Agent` na paleta de comandos (`Ctrl+Shift+P`) ou adicione um
  arquivo `.github/agents/<nome>.agent.md` com o cabeçalho `name`, `description` e `tools`.

## Se um agente não aparecer

1. Confirme que o arquivo está em `.github/agents/` na raiz aberta no VS Code.
2. O nome exibido vem do campo `name:` (ou do nome do arquivo, se omitido); nomes são sensíveis a maiúsculas.
3. Clique com o botão direito no Chat → **Diagnostics** para ver os agentes carregados e os erros de validação.
