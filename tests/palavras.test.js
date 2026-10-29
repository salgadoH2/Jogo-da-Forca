import { describe, expect, it } from 'vitest';
import { CATEGORIAS, NOMES_CATEGORIAS, PALAVRAS, sortearPalavra, totalDePalavras } from '../src/palavras.js';
import { normalizeWord } from '../src/jogo.js';

describe('acervo', () => {
  it('tem pelo menos três categorias, todas nomeadas', () => {
    expect(CATEGORIAS.length).toBeGreaterThanOrEqual(3);

    for (const categoria of CATEGORIAS) {
      expect(NOMES_CATEGORIAS[categoria]).toBeTruthy();
      expect(totalDePalavras(categoria)).toBeGreaterThan(0);
    }
  });

  it('só usa letras, espaço e hífen depois da normalização', () => {
    for (const categoria of CATEGORIAS) {
      for (const palavra of PALAVRAS[categoria]) {
        expect(normalizeWord(palavra)).toMatch(/^[A-Z]+(?:[ -][A-Z]+)*$/);
      }
    }
  });

  it('não repete palavra dentro da mesma categoria', () => {
    for (const categoria of CATEGORIAS) {
      const normalizadas = PALAVRAS[categoria].map(normalizeWord);
      expect(new Set(normalizadas).size).toBe(normalizadas.length);
    }
  });
});

describe('sortearPalavra', () => {
  it('evita repetir até esgotar a categoria', () => {
    const usadas = [];
    const sorteadas = [];

    for (let indice = 0; indice < totalDePalavras('animais'); indice += 1) {
      const palavra = sortearPalavra('animais', usadas, () => 0);
      sorteadas.push(palavra);
      usadas.push(palavra);
    }

    expect(new Set(sorteadas).size).toBe(sorteadas.length);
  });

  it('recomeça o ciclo quando todas já foram usadas', () => {
    const todas = PALAVRAS.animais.map(normalizeWord);

    expect(todas).toContain(normalizeWord(sortearPalavra('animais', PALAVRAS.animais, () => 0)));
  });

  it('devolve string vazia para categoria inexistente', () => {
    expect(sortearPalavra('inexistente', [], () => 0)).toBe('');
  });
});
