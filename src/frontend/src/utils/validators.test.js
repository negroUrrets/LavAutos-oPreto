import { describe, expect, test } from 'vitest';
import {
  formatPatente,
  isValidEmail,
  isValidPatente,
  onlyDigits,
  onlyLetters,
} from './validators.js';

describe('validators', () => {
  test('isValidEmail acepta un correo válido y rechaza uno inválido', () => {
    expect(isValidEmail('fernando@gmail.com')).toBe(true);
    expect(isValidEmail('fernando@')).toBe(false);
    expect(isValidEmail('fernando')).toBe(false);
  });

  test('formatPatente aplica la máscara', () => {
    expect(formatPatente('ab254mc')).toBe('AB-254-MC');
    expect(formatPatente('AB2')).toBe('AB-2');
    expect(formatPatente('AB254')).toBe('AB-254');
  });

  test('formatPatente descarta el tipo incorrecto', () => {
    expect(formatPatente('A1B254MC')).toBe('AB-254-MC');
    expect(formatPatente('1')).toBe('');
  });

  test('isValidPatente acepta el formato completo y rechaza incompletos', () => {
    expect(isValidPatente('AB-254-MC')).toBe(true);
    expect(isValidPatente('AB-254-M')).toBe(false);
    expect(isValidPatente('A-254-MC')).toBe(false);
  });

  test('onlyDigits conserva solo números', () => {
    expect(onlyDigits('12a3')).toBe('123');
    expect(onlyDigits('a-b c')).toBe('');
  });

  test('onlyLetters conserva solo letras con acentos y ñ', () => {
    expect(onlyLetters('Muñoz 1')).toBe('Muñoz');
    expect(onlyLetters('Ángel')).toBe('Ángel');
    expect(onlyLetters('A1-B')).toBe('AB');
  });
});
