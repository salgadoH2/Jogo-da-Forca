import { describe, expect, it } from 'vitest';
import {
  MAX_ERRORS,
  createGame,
  guessLetter,
  letrasRestantes,
  normalizeLetter,
  normalizeWord,
  renderWord
} from '../src/jogo.js';

const ERRADAS = ['B', 'D', 'E', 'F', 'G', 'H'];

describe('normalização', () => {
  it('remove acentos e cedilha da palavra', () => {
    expect(normalizeWord('Ação')).toBe('ACAO');
    expect(normalizeWord('AÇAÍ')).toBe('ACAI');
    expect(normalizeWord('japão')).toBe('JAPAO');
  });

  it('aceita letra com ou sem acento e em qualquer caixa', () => {
    expect(normalizeLetter('a')).toBe('A');
    expect(normalizeLetter('Ç')).toBe('C');
    expect(normalizeLetter('ã')).toBe('A');
  });

  it('rejeita entrada que não é uma letra', () => {
    for (const entrada of ['', '1', '@', 'AB', null, undefined, 42, {}]) {
      expect(normalizeLetter(entrada)).toBe('');
    }
  });
});

describe('renderWord', () => {
  it('esconde letras ainda não descobertas', () => {
    expect(renderWord('CASA', [])).toBe('____');
    expect(renderWord('CASA', ['C', 'A'])).toBe('CA_A');
  });

  it('mantém espaço e hífen revelados', () => {
    expect(renderWord('PEIXE-ESPADA', [])).toBe('_____-______');
    expect(renderWord('COSTA DO MARFIM', [])).toBe('_____ __ ______');
  });
});

describe('createGame', () => {
  it('começa jogando, sem erros e com a palavra normalizada', () => {
    const estado = createGame('Açaí', 'frutas');

    expect(estado.palavra).toBe('ACAI');
    expect(estado.categoria).toBe('frutas');
    expect(estado.exibida).toBe('____');
    expect(estado.erros).toBe(0);
    expect(estado.status).toBe('jogando');
    expect(estado.letrasCertas).toEqual([]);
    expect(estado.letrasErradas).toEqual([]);
  });
});

describe('guessLetter', () => {
  it('vence quando a última letra é descoberta', () => {
    let estado = createGame('CASA');

    estado = guessLetter(estado, 'C');
    expect(estado.exibida).toBe('C___');
    estado = guessLetter(estado, 'A');
    expect(estado.exibida).toBe('CA_A');
    estado = guessLetter(estado, 'S');

    expect(estado.exibida).toBe('CASA');
    expect(estado.status).toBe('vitoria');
  });

  it('perde no sexto erro', () => {
    let estado = createGame('CASA');

    ERRADAS.slice(0, 5).forEach((letra) => {
      estado = guessLetter(estado, letra);
    });

    expect(estado.erros).toBe(5);
    expect(estado.status).toBe('jogando');

    estado = guessLetter(estado, ERRADAS[5]);

    expect(estado.erros).toBe(MAX_ERRORS);
    expect(estado.status).toBe('derrota');
  });

  it('ignora letra repetida sem contar erro', () => {
    const inicio = createGame('CASA');
    const primeiro = guessLetter(inicio, 'B');
    const repetido = guessLetter(primeiro, 'b');

    expect(repetido.erros).toBe(1);
    expect(repetido.letrasErradas).toEqual(['B']);
  });

  it('trata maiúscula e minúscula como o mesmo palpite', () => {
    const estado = guessLetter(createGame('CASA'), 'c');

    expect(estado.letrasCertas).toEqual(['C']);
    expect(estado.exibida).toBe('C___');
  });

  it('aceita a letra sem acento quando a palavra é acentuada', () => {
    let estado = createGame('AÇAÍ');

    estado = guessLetter(estado, 'a');
    expect(estado.exibida).toBe('A_A_');

    estado = guessLetter(estado, 'i');
    expect(estado.exibida).toBe('A_AI');

    estado = guessLetter(estado, 'C');
    expect(estado.status).toBe('vitoria');
  });

  it('ignora entrada inválida sem lançar exceção', () => {
    const estado = createGame('CASA');

    for (const entrada of ['', '1', '@', null, undefined, 'AB']) {
      const resultado = guessLetter(estado, entrada);
      expect(resultado.erros).toBe(0);
      expect(resultado.letrasCertas).toEqual([]);
      expect(resultado.letrasErradas).toEqual([]);
    }
  });

  it('não muta o estado recebido', () => {
    const estado = createGame('CASA');
    Object.freeze(estado.letrasCertas);
    Object.freeze(estado.letrasErradas);
    Object.freeze(estado);

    expect(() => guessLetter(estado, 'C')).not.toThrow();
    expect(estado.exibida).toBe('____');
    expect(estado.letrasCertas).toEqual([]);
  });

  it('não aceita palpite depois do fim da partida', () => {
    let estado = createGame('CASA');
    ERRADAS.forEach((letra) => {
      estado = guessLetter(estado, letra);
    });

    const depois = guessLetter(estado, 'C');

    expect(depois.status).toBe('derrota');
    expect(depois.letrasCertas).toEqual([]);
  });
});

describe('letrasRestantes', () => {
  it('conta letras distintas que ainda faltam', () => {
    const estado = guessLetter(createGame('BANANA'), 'A');

    expect(letrasRestantes(estado)).toBe(2);
  });
});
