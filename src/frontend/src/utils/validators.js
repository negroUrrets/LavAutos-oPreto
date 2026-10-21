const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PATENTE_PATTERN = /^[A-Z]{2}-\d{3}-[A-Z]{2}$/;
const PATENTE_TYPES = ['L', 'L', 'N', 'N', 'N', 'L', 'L'];

export function isValidEmail(texto) {
  return EMAIL_PATTERN.test(String(texto).trim());
}

export function isValidPatente(texto) {
  return PATENTE_PATTERN.test(String(texto).trim());
}

export function formatPatente(texto) {
  const raw = String(texto)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

  let value = '';
  let index = 0;

  for (const char of raw) {
    if (index >= PATENTE_TYPES.length) {
      break;
    }

    const expected = PATENTE_TYPES[index];
    const isLetter = char >= 'A' && char <= 'Z';
    const isNumber = char >= '0' && char <= '9';

    if ((expected === 'L' && isLetter) || (expected === 'N' && isNumber)) {
      value += char;
      index += 1;
    }
  }

  const letters1 = value.slice(0, 2);
  const numbers = value.slice(2, 5);
  const letters2 = value.slice(5, 7);

  let formatted = letters1;
  if (value.length > 2) {
    formatted += `-${numbers}`;
  }
  if (value.length > 5) {
    formatted += `-${letters2}`;
  }

  return formatted;
}

export function onlyDigits(texto) {
  return String(texto).replace(/\D/g, '');
}

export function onlyLetters(texto) {
  return String(texto).replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, '');
}
