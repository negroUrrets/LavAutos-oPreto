const { Op } = require('sequelize');
const {
  Persona,
  Cliente,
  CategoriaLavado,
  EstadoLavado,
  Utileria,
  MarcaVehiculo,
  ModeloVehiculo,
  Vehiculo,
  Lavado,
  Login,
} = require('../models');
const { createCrudService } = require('./crudService');
const { requireFields, assertExists } = require('../utils/validators');
const AppError = require('../utils/AppError');

const FECHA_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function parseFecha(valor, finDelDia = false) {
  if (!FECHA_PATTERN.test(String(valor))) {
    throw new AppError('La fecha debe tener formato YYYY-MM-DD.', 400);
  }
  const hora = finDelDia ? '23:59:59.999' : '00:00:00.000';
  const fecha = new Date(`${valor}T${hora}`);
  if (Number.isNaN(fecha.getTime())) {
    throw new AppError('La fecha no es valida.', 400);
  }
  return fecha;
}

const include = [
  {
    model: Vehiculo,
    as: 'vehiculo',
    include: [
      { model: Cliente, as: 'datosCliente', include: [{ model: Persona, as: 'persona' }] },
      {
        model: ModeloVehiculo,
        as: 'modelo',
        include: [{ model: MarcaVehiculo, as: 'marca' }],
      },
    ],
  },
  { model: CategoriaLavado, as: 'categoria' },
  { model: EstadoLavado, as: 'datosEstado' },
  { model: Utileria, as: 'datosUtileria' },
];

const lavadoService = createCrudService({
  model: Lavado,
  name: 'Lavado',
  fields: ['estado', 'vehi', 'categoriaLavado', 'login', 'utileria', 'detallesLavado'],
  include,
  buildListOptions: (query) => {
    const where = {};
    if (query.estado) {
      where.estado = query.estado;
    }
    if (query.vehi) {
      where.vehi = query.vehi;
    }
    if (query.desde || query.hasta) {
      where.fechaHoraLavadoTerminado = {};
      if (query.desde) {
        where.fechaHoraLavadoTerminado[Op.gte] = parseFecha(query.desde);
      }
      if (query.hasta) {
        where.fechaHoraLavadoTerminado[Op.lte] = parseFecha(query.hasta, true);
      }
    }
    return { where };
  },
  validateCreate: async (payload) => {
    requireFields(payload, ['estado', 'vehi', 'categoriaLavado', 'login', 'utileria']);
    await assertExists(Vehiculo, payload.vehi, 'El vehiculo no existe.');
    await assertExists(
      CategoriaLavado,
      payload.categoriaLavado,
      'La categoria de lavado no existe.',
    );
    await assertExists(Login, payload.login, 'El login no existe.');
    await assertExists(EstadoLavado, payload.estado, 'El estado no existe.');
    await assertExists(Utileria, payload.utileria, 'La utileria no existe.');
  },
  validateUpdate: async (payload) => {
    if (payload.vehi !== undefined) {
      await assertExists(Vehiculo, payload.vehi, 'El vehiculo no existe.');
    }
    if (payload.categoriaLavado !== undefined) {
      await assertExists(
        CategoriaLavado,
        payload.categoriaLavado,
        'La categoria de lavado no existe.',
      );
    }
    if (payload.login !== undefined) {
      await assertExists(Login, payload.login, 'El login no existe.');
    }
    if (payload.estado !== undefined) {
      await assertExists(EstadoLavado, payload.estado, 'El estado no existe.');
    }
    if (payload.utileria !== undefined) {
      await assertExists(Utileria, payload.utileria, 'La utileria no existe.');
    }
  },
});

module.exports = lavadoService;
