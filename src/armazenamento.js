/**
 * Persistência das estatísticas no localStorage.
 * Toda operação é protegida: modo privado, cota cheia ou storage bloqueado não podem quebrar o jogo.
 */

const CHAVE = 'forca:estatisticas';

const PADRAO = {
  partidas: 0,
  vitorias: 0,
  derrotas: 0
};

export function estatisticasIniciais() {
  return { ...PADRAO };
}

function sanear(valor) {
  const numero = Number(valor);
  return Number.isFinite(numero) && numero >= 0 ? Math.floor(numero) : 0;
}

export function carregarEstatisticas() {
  try {
    const bruto = globalThis.localStorage?.getItem(CHAVE);
    if (!bruto) return estatisticasIniciais();

    const dados = JSON.parse(bruto);
    if (!dados || typeof dados !== 'object') return estatisticasIniciais();

    return {
      partidas: sanear(dados.partidas),
      vitorias: sanear(dados.vitorias),
      derrotas: sanear(dados.derrotas)
    };
  } catch {
    return estatisticasIniciais();
  }
}

export function salvarEstatisticas(estatisticas) {
  try {
    globalThis.localStorage?.setItem(CHAVE, JSON.stringify(estatisticas));
    return true;
  } catch {
    return false;
  }
}

export function registrarPartida(estatisticas, status) {
  const atualizadas = {
    partidas: sanear(estatisticas.partidas) + 1,
    vitorias: sanear(estatisticas.vitorias) + (status === 'vitoria' ? 1 : 0),
    derrotas: sanear(estatisticas.derrotas) + (status === 'derrota' ? 1 : 0)
  };

  salvarEstatisticas(atualizadas);
  return atualizadas;
}
