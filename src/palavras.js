/**
 * Acervo de palavras por categoria.
 * Palavras são guardadas do jeito natural em pt-BR (com acento, espaço e hífen);
 * a normalização acontece em jogo.js.
 */

export const PALAVRAS = {
  animais: [
    'JACARÉ',
    'TARTARUGA',
    'BALEIA',
    'FORMIGA',
    'GIRAFA',
    'PEIXE-ESPADA',
    'MORCEGO',
    'CAPIVARA',
    'TUCANO',
    'JIBOIA',
    'LOBISOMEM',
    'BORBOLETA',
    'CAMELO',
    'POLVO',
    'TAMANDUÁ'
  ],
  frutas: [
    'AÇAÍ',
    'GOIABA',
    'MARACUJÁ',
    'JABUTICABA',
    'MORANGO',
    'ABACAXI',
    'CAJU',
    'PITANGA',
    'MANGA',
    'LARANJA',
    'BANANA',
    'UVA'
  ],
  paises: [
    'BRASIL',
    'PORTUGAL',
    'JAPÃO',
    'CANADÁ',
    'ARGENTINA',
    'EGITO',
    'AUSTRÁLIA',
    'FRANÇA',
    'ITÁLIA',
    'MÉXICO',
    'ÍNDIA',
    'COSTA DO MARFIM'
  ]
};

export const CATEGORIAS = Object.keys(PALAVRAS);

export const NOMES_CATEGORIAS = {
  animais: 'Animais',
  frutas: 'Frutas',
  paises: 'Países'
};

/**
 * Sorteia uma palavra da categoria evitando as já usadas nesta sessão.
 * Quando todas já foram usadas, recomeça o ciclo.
 *
 * @param {string} categoria
 * @param {string[]} usadas palavras já jogadas na categoria
 * @param {() => number} random gerador em [0, 1)
 * @returns {string} palavra sorteada ou '' se a categoria não existir
 */
export function sortearPalavra(categoria, usadas = [], random = Math.random) {
  const lista = PALAVRAS[categoria] ?? [];
  if (lista.length === 0) return '';

  const restantes = lista.filter((palavra) => !usadas.includes(palavra));
  const disponiveis = restantes.length > 0 ? restantes : lista;
  const indice = Math.floor(random() * disponiveis.length);

  return disponiveis[Math.min(indice, disponiveis.length - 1)];
}

export function totalDePalavras(categoria) {
  return (PALAVRAS[categoria] ?? []).length;
}
