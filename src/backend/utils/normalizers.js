const PATENTE_PATTERN = /^[A-Z]{2}\d{3}[A-Z]{2}$/;

function normalizarDni(valor) {
  return String(valor ?? '').trim();
}

function normalizarPatente(valor) {
  const base = String(valor ?? '')
    .replace(/\s+/g, '')
    .toUpperCase();

  if (PATENTE_PATTERN.test(base)) {
    return `${base.slice(0, 2)}-${base.slice(2, 5)}-${base.slice(5)}`;
  }

  return base;
}

function clavePatente(valor) {
  return normalizarPatente(valor).replace(/[^A-Z0-9]/g, '');
}

module.exports = { normalizarDni, normalizarPatente, clavePatente };
