const { Op } = require('sequelize');
const { EstadoLavado, Lavado } = require('../models');
const AppError = require('../utils/AppError');

const ESTADOS_BLOQUEANTES = ['En Espera', 'Lavando', 'Terminado'];

async function estadosBloqueantes(transaction) {
  return EstadoLavado.findAll({
    where: { descripcionEstado: { [Op.in]: ESTADOS_BLOQUEANTES } },
    attributes: ['codigoEstado'],
    transaction,
  });
}

async function esEstadoBloqueante(codigoEstado, transaction) {
  if (codigoEstado === undefined || codigoEstado === null) {
    return false;
  }

  const estados = await estadosBloqueantes(transaction);
  return estados.some((estado) => String(estado.codigoEstado) === String(codigoEstado));
}

async function assertSinLavadoActivo(vehiculoIds, transaction, { excluirLavadoId } = {}) {
  const ids = (vehiculoIds ?? []).filter((id) => id !== undefined && id !== null);

  if (ids.length === 0) {
    return;
  }

  const estados = await estadosBloqueantes(transaction);

  if (estados.length === 0) {
    return;
  }

  const where = {
    vehi: { [Op.in]: ids },
    estado: { [Op.in]: estados.map((estado) => estado.codigoEstado) },
  };

  if (excluirLavadoId !== undefined && excluirLavadoId !== null) {
    where.codigoLavado = { [Op.ne]: excluirLavadoId };
  }

  const cantidad = await Lavado.count({ where, transaction });

  if (cantidad > 0) {
    throw new AppError('Vehiculo en estado de Lavado.', 409);
  }
}

module.exports = { ESTADOS_BLOQUEANTES, esEstadoBloqueante, assertSinLavadoActivo };
