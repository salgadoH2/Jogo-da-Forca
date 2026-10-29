/**
 * Ponte entre as regras (src/jogo.js) e o DOM.
 * Toda escrita no DOM usa textContent/createElement; nunca innerHTML com dado do jogador.
 */

import { MAX_ERRORS, createGame, guessLetter, letrasRestantes } from './jogo.js';
import { CATEGORIAS, NOMES_CATEGORIAS, sortearPalavra, totalDePalavras } from './palavras.js';
import { carregarEstatisticas, registrarPartida } from './armazenamento.js';

const ESTADOS = ['estado-jogando', 'estado-vitoria', 'estado-derrota'];

function buscarElementos(doc) {
  return {
    palavra: doc.getElementById('palavra'),
    teclado: doc.getElementById('teclado'),
    status: doc.getElementById('status'),
    tentativas: doc.getElementById('tentativas'),
    boneco: doc.getElementById('boneco'),
    botaoNovoJogo: doc.getElementById('botao-novo-jogo'),
    botaoCategoria: doc.getElementById('botao-categoria'),
    categoria: doc.getElementById('categoria-atual'),
    estatisticas: doc.getElementById('estatisticas')
  };
}

function textoDaPalavra(exibida) {
  return [...exibida]
    .map((caractere) => {
      if (caractere === '_') return 'oculta';
      if (caractere === ' ') return 'espaço';
      if (caractere === '-') return 'hífen';
      return caractere;
    })
    .join(' ');
}

/**
 * Inicia o jogo na página atual.
 *
 * @param {Document} doc
 * @param {{ random?: () => number, confirmar?: (mensagem: string) => boolean }} [opcoes]
 */
export function iniciarJogo(doc = document, opcoes = {}) {
  const random = opcoes.random ?? Math.random;
  const confirmar = opcoes.confirmar ?? ((mensagem) => doc.defaultView.confirm(mensagem));

  const elementos = buscarElementos(doc);
  const ausentes = Object.entries(elementos)
    .filter(([, elemento]) => !elemento)
    .map(([nome]) => nome);

  if (ausentes.length > 0) {
    throw new Error(`Elementos obrigatórios ausentes no HTML: ${ausentes.join(', ')}`);
  }

  const teclas = new Map();
  for (const botao of elementos.teclado.querySelectorAll('.teclado__tecla')) {
    if (botao.dataset.letra) teclas.set(botao.dataset.letra, botao);
  }

  let categoria = CATEGORIAS[0];
  const usadasPorCategoria = new Map(CATEGORIAS.map((nome) => [nome, []]));
  let estatisticas = carregarEstatisticas();
  let estado = null;

  // ---------- sorteio ----------

  function sortearPalavraAtual() {
    const usadas = usadasPorCategoria.get(categoria) ?? [];
    const palavra = sortearPalavra(categoria, usadas, random);

    usadas.push(palavra);
    usadasPorCategoria.set(
      categoria,
      usadas.length >= totalDePalavras(categoria) ? [] : usadas
    );

    return palavra;
  }

  // ---------- renderização ----------

  function desenharPalavra() {
    const fimDeJogo = estado.status === 'derrota';
    const exibida = fimDeJogo ? estado.palavra : estado.exibida;

    elementos.palavra.textContent = '';

    for (const caractere of exibida) {
      const letra = doc.createElement('span');
      letra.classList.add('palavra__letra');

      if (caractere === '_') {
        letra.classList.add('palavra__letra--oculta');
        letra.textContent = '_';
      } else if (caractere === ' ' || caractere === '-') {
        letra.classList.add('palavra__letra--separador');
        letra.textContent = caractere === ' ' ? '\u00a0' : caractere;
      } else {
        letra.classList.add('palavra__letra--revelada');
        if (fimDeJogo && !estado.letrasCertas.includes(caractere)) {
          letra.classList.add('palavra__letra--perdida');
        }
        letra.textContent = caractere;
      }

      elementos.palavra.append(letra);
    }

    elementos.palavra.setAttribute('aria-label', `Palavra: ${textoDaPalavra(exibida)}`);
  }

  function desenharTeclado() {
    for (const [letra, botao] of teclas) {
      const certa = estado.letrasCertas.includes(letra);
      const errada = estado.letrasErradas.includes(letra);
      const usada = certa || errada;

      botao.classList.toggle('teclado__tecla--certa', certa);
      botao.classList.toggle('teclado__tecla--errada', errada);
      botao.disabled = usada || estado.status !== 'jogando';
      botao.setAttribute('aria-pressed', String(usada));
    }
  }

  function desenharBoneco() {
    for (let indice = 1; indice <= MAX_ERRORS; indice += 1) {
      const classe = `boneco--erro-${indice}`;
      const ativa = indice === estado.erros;
      elementos.boneco.classList.toggle(classe, ativa);
    }
  }

  function desenharEstatisticas() {
    elementos.estatisticas.textContent =
      `Partidas: ${estatisticas.partidas} · Vitórias: ${estatisticas.vitorias} · Derrotas: ${estatisticas.derrotas}`;
  }

  function renderizar() {
    desenharPalavra();
    desenharTeclado();
    desenharBoneco();
    desenharEstatisticas();

    elementos.tentativas.textContent = `Erros: ${estado.erros} de ${MAX_ERRORS}`;
    elementos.categoria.textContent = NOMES_CATEGORIAS[estado.categoria] ?? estado.categoria;

    doc.body.classList.remove(...ESTADOS);
    doc.body.classList.add(`estado-${estado.status}`);
  }

  function anunciar(texto) {
    elementos.status.textContent = texto;
  }

  // ---------- ações ----------

  function registrarFimDeJogo() {
    estatisticas = registrarPartida(estatisticas, estado.status);
    desenharEstatisticas();
    elementos.botaoNovoJogo.focus();
  }

  function iniciarPartida() {
    estado = createGame(sortearPalavraAtual(), categoria);
    renderizar();

    const totalDeLetras = [...estado.palavra].filter((caractere) => /[A-Z]/.test(caractere)).length;
    anunciar(
      `Nova partida na categoria ${NOMES_CATEGORIAS[categoria]}. A palavra tem ${totalDeLetras} letras. Escolha uma letra.`
    );
  }

  function temPartidaEmAndamento() {
    if (!estado || estado.status !== 'jogando') return false;
    return estado.erros > 0 || estado.letrasCertas.length > 0;
  }

  function jogarLetra(letra) {
    if (!estado || estado.status !== 'jogando') return estado;

    const anterior = estado;
    estado = guessLetter(estado, letra);

    const acertou = estado.letrasCertas.length > anterior.letrasCertas.length;
    const errou = estado.erros > anterior.erros;

    if (!acertou && !errou) return estado;

    renderizar();

    if (acertou) {
      const letraCerta = estado.letrasCertas[estado.letrasCertas.length - 1];

      if (estado.status === 'vitoria') {
        anunciar(`Você acertou a letra ${letraCerta}. Você venceu! A palavra era ${estado.palavra}.`);
      } else {
        anunciar(
          `Você acertou a letra ${letraCerta}. Restam ${letrasRestantes(estado)} letras e ${MAX_ERRORS - estado.erros} tentativas.`
        );
      }
    } else if (estado.status === 'derrota') {
      anunciar(`A letra ${estado.letrasErradas[estado.letrasErradas.length - 1]} não está na palavra. Você perdeu! A palavra era ${estado.palavra}.`);
    } else {
      const restantes = MAX_ERRORS - estado.erros;
      const plural = restantes === 1 ? 'tentativa restante' : 'tentativas restantes';
      anunciar(`A letra ${estado.letrasErradas[estado.letrasErradas.length - 1]} não está na palavra. ${restantes} ${plural}.`);
    }

    if (estado.status !== 'jogando') registrarFimDeJogo();

    return estado;
  }

  function novoJogo() {
    if (temPartidaEmAndamento() && !confirmar('Começar um novo jogo encerra a partida atual. Continuar?')) {
      return estado;
    }

    iniciarPartida();
    return estado;
  }

  function trocarCategoria() {
    if (temPartidaEmAndamento() && !confirmar('Trocar de categoria encerra a partida atual. Continuar?')) {
      return estado;
    }

    const indice = CATEGORIAS.indexOf(categoria);
    categoria = CATEGORIAS[(indice + 1) % CATEGORIAS.length];
    iniciarPartida();

    return estado;
  }

  // ---------- eventos ----------

  function aoClicarNoTeclado(evento) {
    const botao = evento.target instanceof doc.defaultView.Element
      ? evento.target.closest('.teclado__tecla')
      : null;

    if (!botao || botao.disabled) return;
    jogarLetra(botao.dataset.letra);
  }

  function aoTeclar(evento) {
    if (evento.altKey || evento.ctrlKey || evento.metaKey) return;

    const alvo = evento.target;
    const digitando = alvo instanceof doc.defaultView.HTMLInputElement
      || alvo instanceof doc.defaultView.HTMLTextAreaElement
      || alvo?.isContentEditable;

    if (digitando) return;

    jogarLetra(evento.key);
  }

  const aoClicarEmNovoJogo = () => novoJogo();
  const aoClicarEmTrocarCategoria = () => trocarCategoria();

  elementos.teclado.addEventListener('click', aoClicarNoTeclado);
  doc.addEventListener('keydown', aoTeclar);
  elementos.botaoNovoJogo.addEventListener('click', aoClicarEmNovoJogo);
  elementos.botaoCategoria.addEventListener('click', aoClicarEmTrocarCategoria);

  function destruir() {
    elementos.teclado.removeEventListener('click', aoClicarNoTeclado);
    doc.removeEventListener('keydown', aoTeclar);
    elementos.botaoNovoJogo.removeEventListener('click', aoClicarEmNovoJogo);
    elementos.botaoCategoria.removeEventListener('click', aoClicarEmTrocarCategoria);
  }

  iniciarPartida();

  return {
    get estado() {
      return estado;
    },
    get categoria() {
      return categoria;
    },
    jogarLetra,
    novoJogo,
    trocarCategoria,
    destruir
  };
}
