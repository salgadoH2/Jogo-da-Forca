/**
 * Regras puras do jogo da forca.
 * Este módulo não toca no DOM nem no localStorage: recebe dados, devolve estado novo.
 */

export const MAX_ERRORS = 6;

const DIACRITICS = /[\u0300-\u036f]/g;
const ISLETTER = /[A-Z]/;

/**
 * Deixa a palavra em maiúsculas, sem acentos e sem cedilha.
 * "Ação" -> "ACAO"
 */
export function normalizeWord(word) {
  return String(word ?? '')
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .toUpperCase();
}

/**
 * Normaliza um palpite. Retorna '' quando não é uma única letra A-Z.
 */
export function normalizeLetter(letter) {
  if (typeof letter !== 'string') return '';

  const letra = letter
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .trim()
    .toUpperCase();

  return letra.length === 1 && ISLETTER.test(letra) ? letra : '';
}

/**
 * Monta a palavra exibida: letras não descobertas viram "_",
 * separadores (espaço e hífen) aparecem como estão.
 */
export function renderWord(word, letrasCertas = []) {
  const certas = new Set(letrasCertas);

  return [...word]
    .map((caractere) => {
      if (!ISLETTER.test(caractere)) return caractere;
      return certas.has(caractere) ? caractere : '_';
    })
    .join('');
}

/**
 * Estado inicial de uma partida.
 */
export function createGame(word, category = 'animais') {
  const palavra = normalizeWord(word);

  return {
    palavra,
    categoria: category,
    exibida: renderWord(palavra, []),
    letrasCertas: [],
    letrasErradas: [],
    erros: 0,
    status: 'jogando'
  };
}

/**
 * Aplica um palpite e devolve um estado novo (nunca muta o recebido).
 * Palpite repetido, inválido ou fora de 'jogando' é ignorado.
 */
export function guessLetter(state, letter) {
  const letra = normalizeLetter(letter);

  if (!letra || state.status !== 'jogando') return { ...state };
  if (state.letrasCertas.includes(letra) || state.letrasErradas.includes(letra)) {
    return { ...state };
  }

  if (state.palavra.includes(letra)) {
    const letrasCertas = [...state.letrasCertas, letra];
    const exibida = renderWord(state.palavra, letrasCertas);
    const faltamLetras = exibida.includes('_');

    return {
      ...state,
      letrasCertas,
      exibida,
      status: faltamLetras ? 'jogando' : 'vitoria'
    };
  }

  const letrasErradas = [...state.letrasErradas, letra];
  const erros = state.erros + 1;

  return {
    ...state,
    letrasErradas,
    erros,
    status: erros >= MAX_ERRORS ? 'derrota' : 'jogando'
  };
}

/**
 * Quantas letras distintas faltam para ganhar — usado nos anúncios de acessibilidade.
 */
export function letrasRestantes(state) {
  return new Set([...state.palavra].filter((caractere) => ISLETTER.test(caractere) && !state.letrasCertas.includes(caractere))).size;
}
