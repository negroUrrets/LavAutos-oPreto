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
