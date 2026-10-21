const { CategoriaVehiculo, MarcaVehiculo } = require('../models');
const { createCrudService } = require('./crudService');
const { requireFields, assertExists } = require('../utils/validators');

const marcaVehiculoService = createCrudService({
  model: MarcaVehiculo,
  name: 'Marca de vehiculo',
  fields: ['marcaVehi', 'categoriaVehi'],
  validateCreate: async (payload) => {
    requireFields(payload, ['marcaVehi', 'categoriaVehi']);
    await assertExists(CategoriaVehiculo, payload.categoriaVehi, 'La categoria de vehiculo no existe.');
  },
  validateUpdate: async (payload) => {
    if (payload.categoriaVehi !== undefined) {
      await assertExists(
        CategoriaVehiculo,
        payload.categoriaVehi,
        'La categoria de vehiculo no existe.',
      );
    }
  },
});

module.exports = marcaVehiculoService;
