const { Op } = require('sequelize');
const { EstadoLavado, Lavado } = require('../models');
const AppError = require('../utils/AppError');

const ESTADOS_BLOQUEANTES = ['En Espera', 'Lavando', 'Terminado'];

async function assertSinLavadoActivo(vehiculoIds, transaction) {
  const ids = (vehiculoIds ?? []).filter((id) => id !== undefined && id !== null);

  if (ids.length === 0) {
    return;
  }

  const estados = await EstadoLavado.findAll({
    where: { descripcionEstado: { [Op.in]: ESTADOS_BLOQUEANTES } },
    attributes: ['codigoEstado'],
    transaction,
  });

  if (estados.length === 0) {
    return;
  }

  const cantidad = await Lavado.count({
    where: {
      vehi: { [Op.in]: ids },
      estado: { [Op.in]: estados.map((estado) => estado.codigoEstado) },
    },
    transaction,
  });

  if (cantidad > 0) {
    throw new AppError('Vehiculo en estado de Lavado.', 409);
  }
}

module.exports = { ESTADOS_BLOQUEANTES, assertSinLavadoActivo };
