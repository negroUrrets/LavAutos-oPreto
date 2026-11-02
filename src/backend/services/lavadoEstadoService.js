const { EstadoLavado } = require('../models');
const AppError = require('../utils/AppError');

const ESTADOS_INICIALES = ['En Espera', 'Lavando', 'Terminado'];

const TRANSICIONES = {
  'En Espera': ['Lavando'],
  Lavando: ['En Espera', 'Terminado'],
  Terminado: ['Lavando', 'Entregado'],
  Entregado: [],
};

async function descripcionDe(codigoEstado, transaction) {
  const estado = await EstadoLavado.findByPk(codigoEstado, {
    attributes: ['codigoEstado', 'descripcionEstado'],
    transaction,
  });
  return estado ? estado.descripcionEstado : null;
}

async function assertEstadoInicialPermitido(codigoEstado, transaction) {
  const descripcion = await descripcionDe(codigoEstado, transaction);

  if (!ESTADOS_INICIALES.includes(descripcion)) {
    throw new AppError('Estado inicial no permitido.', 400);
  }
}

async function assertTransicionPermitida(codigoActual, codigoNuevo, transaction) {
  if (String(codigoActual) === String(codigoNuevo)) {
    return;
  }

  const actual = await descripcionDe(codigoActual, transaction);
  const nuevo = await descripcionDe(codigoNuevo, transaction);
  const permitidos = TRANSICIONES[actual] ?? [];

  if (!permitidos.includes(nuevo)) {
    throw new AppError('Transicion de estado no permitida.', 409);
  }
}

module.exports = {
  ESTADOS_INICIALES,
  TRANSICIONES,
  assertEstadoInicialPermitido,
  assertTransicionPermitida,
};
