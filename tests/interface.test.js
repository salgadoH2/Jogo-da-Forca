import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { iniciarJogo } from '../src/interface.js';

const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const PARTES = ['cabeca', 'corpo', 'braco-esq', 'braco-dir', 'perna-esq', 'perna-dir'];

let jogo = null;

function montarPagina() {
  document.body.className = 'estado-jogando';
  document.body.innerHTML = `
    <p class="palavra" id="palavra" role="group" aria-label="Palavra secreta"></p>
    <p class="status" id="status" role="status" aria-live="polite">Escolha uma letra para começar.</p>
    <p class="tentativas" id="tentativas">Erros: 0 de 6</p>
    <svg id="boneco" class="boneco">
      ${PARTES.map((parte) => `<line class="boneco__parte" data-parte="${parte}"></line>`).join('')}
    </svg>
    <div class="teclado" id="teclado">
      ${LETRAS.map((letra) => `<button type="button" class="teclado__tecla" data-letra="${letra}">${letra}</button>`).join('')}
    </div>
    <button type="button" id="botao-novo-jogo">Novo jogo</button>
    <button type="button" id="botao-categoria">Trocar categoria</button>
    <strong id="categoria-atual"></strong>
    <p id="estatisticas"></p>
  `;
}

function iniciar(opcoes = {}) {
  jogo = iniciarJogo(document, { random: () => 0, confirmar: () => true, ...opcoes });
  return jogo;
}

function tecla(letra) {
  return document.querySelector(`.teclado__tecla[data-letra="${letra}"]`);
}

function apertar(letra) {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: letra }));
}

beforeEach(() => {
  localStorage.clear();
  montarPagina();
});

afterEach(() => {
  jogo?.destruir();
  jogo = null;
});

describe('inicialização', () => {
  it('começa uma partida com teclado completo e sem letras usadas', () => {
    iniciar();

    expect(document.getElementById('tentativas').textContent).toBe('Erros: 0 de 6');
    expect(document.getElementById('status').textContent).toContain('Nova partida');
    expect(document.body.classList.contains('estado-jogando')).toBe(true);

    const botoes = document.querySelectorAll('.teclado__tecla');
    expect(botoes).toHaveLength(26);
    expect([...botoes].every((botao) => !botao.disabled)).toBe(true);
  });

  it('mostra a categoria atual na página', () => {
    iniciar();

    expect(document.getElementById('categoria-atual').textContent).toBe('Animais');
  });

  it('desenha uma lacuna por letra da palavra', () => {
    iniciar();

    expect(document.querySelectorAll('#palavra .palavra__letra')).toHaveLength(jogo.estado.palavra.length);
    expect(document.querySelectorAll('.palavra__letra--oculta').length).toBeGreaterThan(0);
  });
});

describe('palpites pela tela', () => {
  it('clicar numa tecla acerta a letra, desabilita a tecla e anuncia', () => {
    iniciar();
    const letra = jogo.estado.palavra[0];

    tecla(letra).click();

    expect(tecla(letra).disabled).toBe(true);
    expect(tecla(letra).getAttribute('aria-pressed')).toBe('true');
    expect(tecla(letra).classList.contains('teclado__tecla--certa')).toBe(true);
    expect(jogo.estado.exibida[0]).toBe(letra);
    expect(document.getElementById('status').textContent).toContain(`acertou a letra ${letra}`);
  });

  it('teclado físico produz o mesmo efeito do clique', () => {
    iniciar();
    const letra = jogo.estado.palavra[0];

    apertar(letra.toLowerCase());

    expect(tecla(letra).disabled).toBe(true);
    expect(jogo.estado.exibida[0]).toBe(letra);
  });

  it('letra repetida não conta erro nem altera o placar', () => {
    iniciar();
    const errada = LETRAS.find((letra) => !jogo.estado.palavra.includes(letra));

    tecla(errada).click();
    tecla(errada).click();

    expect(jogo.estado.erros).toBe(1);
    expect(document.getElementById('tentativas').textContent).toBe('Erros: 1 de 6');
  });

  it('erro anuncia as tentativas restantes', () => {
    iniciar();
    const errada = LETRAS.find((letra) => !jogo.estado.palavra.includes(letra));

    tecla(errada).click();

    expect(document.getElementById('status').textContent).toContain('5 tentativas restantes');
    expect(tecla(errada).classList.contains('teclado__tecla--errada')).toBe(true);
  });
});

describe('fim de partida', () => {
  it('vence ao descobrir todas as letras e trava o teclado', () => {
    iniciar();
    const distintas = [...new Set([...jogo.estado.palavra].filter((caractere) => /[A-Z]/.test(caractere)))];

    distintas.forEach((letra) => tecla(letra).click());

    expect(jogo.estado.status).toBe('vitoria');
    expect(document.body.classList.contains('estado-vitoria')).toBe(true);
    expect(document.getElementById('status').textContent).toContain('Você venceu');
    expect([...document.querySelectorAll('.teclado__tecla')].some((botao) => !botao.disabled)).toBe(false);
  });

  it('perde no sexto erro e revela a palavra', () => {
    iniciar();
    const erradas = LETRAS.filter((letra) => !jogo.estado.palavra.includes(letra)).slice(0, 6);

    erradas.forEach((letra) => tecla(letra).click());

    expect(jogo.estado.status).toBe('derrota');
    expect(document.body.classList.contains('estado-derrota')).toBe(true);
    expect(document.getElementById('status').textContent).toContain('Você perdeu');
    expect(document.getElementById('palavra').textContent).not.toContain('_');
    expect([...document.querySelectorAll('.teclado__tecla')].some((botao) => !botao.disabled)).toBe(false);
  });

  it('registra a partida nas estatísticas', () => {
    iniciar();
    const erradas = LETRAS.filter((letra) => !jogo.estado.palavra.includes(letra)).slice(0, 6);

    erradas.forEach((letra) => tecla(letra).click());

    expect(document.getElementById('estatisticas').textContent).toContain('Derrotas: 1');
  });

  it('revela uma parte do boneco por erro', () => {
    iniciar();
    const erradas = LETRAS.filter((letra) => !jogo.estado.palavra.includes(letra)).slice(0, 2);

    erradas.forEach((letra) => tecla(letra).click());

    expect(jogo.estado.erros).toBe(2);
    expect(document.getElementById('boneco').classList.contains('boneco--erro-2')).toBe(true);
  });
});

describe('ações', () => {
  it('novo jogo reinicia quando o jogador confirma', () => {
    iniciar();
    const errada = LETRAS.find((letra) => !jogo.estado.palavra.includes(letra));
    tecla(errada).click();

    document.getElementById('botao-novo-jogo').click();

    expect(jogo.estado.erros).toBe(0);
    expect(jogo.estado.status).toBe('jogando');
  });

  it('novo jogo cancela quando o jogador recusa', () => {
    iniciar({ confirmar: () => false });
    const errada = LETRAS.find((letra) => !jogo.estado.palavra.includes(letra));
    tecla(errada).click();

    document.getElementById('botao-novo-jogo').click();

    expect(jogo.estado.erros).toBe(1);
  });

  it('trocar categoria avança para a próxima e reinicia a partida', () => {
    iniciar();

    document.getElementById('botao-categoria').click();

    expect(jogo.categoria).toBe('frutas');
    expect(document.getElementById('categoria-atual').textContent).toBe('Frutas');
    expect(jogo.estado.erros).toBe(0);
  });
});

describe('resistência', () => {
  it('não quebra quando o localStorage está bloqueado', () => {
    const espiaoLeitura = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });
    const espiaoEscrita = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('bloqueado');
    });

    expect(() => iniciar()).not.toThrow();
    expect(jogo.estado.status).toBe('jogando');

    espiaoLeitura.mockRestore();
    espiaoEscrita.mockRestore();
  });

  it('avisa quando falta um elemento obrigatório no HTML', () => {
    document.getElementById('teclado').remove();

    expect(() => iniciarJogo(document)).toThrow(/teclado/);
  });
});
