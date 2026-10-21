const {
  Persona,
  Cliente,
  CategoriaLavado,
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
      { model: ModeloVehiculo, as: 'modelo' },
    ],
  },
  { model: CategoriaLavado, as: 'categoria' },
];

const lavadoService = createCrudService({
  model: Lavado,
  name: 'Lavado',
  fields: ['fechaHoraLavado', 'estadoLavado', 'vehi', 'categoriaLavado', 'login'],
  include,
  buildListOptions: (query) => {
    if (query.estadoLavado) {
      return { where: { estadoLavado: query.estadoLavado } };
    }
    return {};
  },
  validateCreate: async (payload) => {
    requireFields(payload, [
      'fechaHoraLavado',
      'estadoLavado',
      'vehi',
      'categoriaLavado',
      'login',
    ]);
    await assertExists(Vehiculo, payload.vehi, 'El vehiculo no existe.');
    await assertExists(
      CategoriaLavado,
      payload.categoriaLavado,
      'La categoria de lavado no existe.',
    );
    await assertExists(Login, payload.login, 'El login no existe.');
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
  },
});

module.exports = lavadoService;
