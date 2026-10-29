# Skills de apoio — gratuitas e em inglês

Cada agente tem uma **Agent Skill** pronta, de código aberto, copiada para `.github/skills/`.
O texto é o original em inglês (padrão Agent Skills); os agentes traduzem o comportamento para o
projeto em pt-BR, e as regras de [.github/copilot-instructions.md](../.github/copilot-instructions.md)
sempre têm prioridade sobre a skill.

## Mapa agente → skill

| Agente | Skill instalada | O que ela ensina | Origem | Licença |
|---|---|---|---|---|
| **Tech Lead** | `ai-team-orchestration` | brief de projeto, plano de entrega, coordenação de time multiagente, preservação de contexto | [github/awesome-copilot](https://github.com/github/awesome-copilot/tree/main/skills/ai-team-orchestration) | MIT |
| **Designer UX** | `frontend-design` | direção visual intencional: paleta, tipografia, hierarquia, evitar layout "de template" | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Apache-2.0 |
| **Dev HTML** | `accessibility-wcag` | WCAG 2.1 AA: HTML semântico, ARIA, teclado, contraste, alternativas textuais | [Hack23/homepage](https://github.com/Hack23/homepage/tree/master/.github/skills/quality/accessibility-wcag) | Apache-2.0 |
| **QA HTML** | `webapp-testing` | Playwright: abrir a página local, inspecionar DOM, console e screenshots | [anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/webapp-testing) | Apache-2.0 |
| **Dev CSS** | `premium-frontend-ui` | tipografia, movimento, textura e performance no CSS | [github/awesome-copilot](https://github.com/github/awesome-copilot/tree/main/skills/premium-frontend-ui) | MIT |
| **QA CSS** | `web-design-reviewer` | inspeção visual guiada: responsivo, contraste, consistência, checklist visual | [github/awesome-copilot](https://github.com/github/awesome-copilot/tree/main/skills/web-design-reviewer) | MIT |
| **Dev JS** | `test-driven-development` | ciclo vermelho/verde/refatorar e boas práticas de teste | [obra/superpowers](https://github.com/obra/superpowers/tree/main/skills/test-driven-development) | MIT |
| **QA JS** | `test-gap-audit` | auditoria de lacunas de cobertura, script de mapa de cobertura | [github/awesome-copilot](https://github.com/github/awesome-copilot/tree/main/skills/test-gap-audit) | MIT |
| **Dev GitHub** | `conventional-commit` | fluxo e validação de mensagens Conventional Commits | [github/awesome-copilot](https://github.com/github/awesome-copilot/tree/main/skills/conventional-commit) | MIT |

Arquivos de licença copiados junto: `LICENSE.txt` dentro de `accessibility-wcag/` e `webapp-testing/`,
`LICENSE.txt` em `frontend-design/`, e `LICENSE-awesome-copilot.txt` / `LICENSE-superpowers.txt` na raiz de `.github/skills/`.
Conteúdo copiado sem alterações em 2026-10-28.

## Escopo reduzido de propósito

Duas skills foram escritas para landing pages de agência e não para um jogo simples. Os agentes
correspondentes já têm a instrução de recorte no corpo:

- **Dev CSS** usa `premium-frontend-ui` só para tipografia, espaçamento, movimento e performance —
  nada de preloader, hero de tela cheia, parallax ou 3D.
- **Designer UX** usa `frontend-design` só para decisões de paleta, tipografia e hierarquia.
- **QA CSS** ignora `references/framework-fixes.md` (o projeto é HTML/CSS puro).
- **QA JS** adapta os comandos de `test-gap-audit` para Vitest + jsdom.

## Como o VS Code carrega isso

- Skills de projeto ficam em `.github/skills/<nome>/SKILL.md`; `name` precisa ser igual ao nome da pasta.
- O carregamento é progressivo: o agente lê nome e descrição, e só traz o corpo do `SKILL.md` quando a
  tarefa combina. Arquivos de apoio (`references/`, `scripts/`, `examples/`) vêm depois, sob demanda.
- No seletor `/` do chat a skill aparece pelo nome (`/accessibility-wcag`, `/test-gap-audit`, …).
- O campo `skills: [...]` no cabeçalho dos agentes é usado pelo harness **Copilot**. No harness **Local**
  a descoberta é automática pela descrição — por isso cada agente também cita o caminho da skill no corpo.

## Atualizar uma skill

```bash
# manual: baixe a versão atual e substitua a pasta
curl -sL https://raw.githubusercontent.com/github/awesome-copilot/main/skills/test-gap-audit/SKILL.md \
  -o .github/skills/test-gap-audit/SKILL.md

# ou, com GitHub CLI 2.90+
gh skills install github/awesome-copilot test-gap-audit
```

Revise o diff antes de commitar: uma skill atualizada pode trazer instruções que conflitam com as
regras deste projeto. Nesse caso, ajuste o recorte no agente correspondente.
