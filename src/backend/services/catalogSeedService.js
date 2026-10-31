const { CategoriaLavado, EstadoLavado, Utileria } = require('../models');

const CATEGORIAS = ['Basico', 'Completo', 'Premium'];
const ESTADOS = ['En Espera', 'Lavando', 'Terminado', 'Entregado'];
const UTILERIAS = ['Auxilio', 'Balizas', 'Matafuegos'];

async function ensureRow(model, where, defaults) {
  const existing = await model.findOne({ where });
  if (existing) {
    return false;
  }
  await model.create({ ...where, ...defaults });
  return true;
}

async function ensureLavadoCatalogs() {
  let created = 0;

  for (const descripcionLavado of CATEGORIAS) {
    if (await ensureRow(CategoriaLavado, { descripcionLavado })) {
      created += 1;
    }
  }

  for (const descripcionEstado of ESTADOS) {
    if (await ensureRow(EstadoLavado, { descripcionEstado }, { estadoLavado: true })) {
      created += 1;
    }
  }

  for (const descripcionUtileria of UTILERIAS) {
    if (await ensureRow(Utileria, { descripcionUtileria }, { estadoUtileria: false })) {
      created += 1;
    }
  }

  return created;
}

module.exports = { ensureLavadoCatalogs, CATEGORIAS, ESTADOS, UTILERIAS };
