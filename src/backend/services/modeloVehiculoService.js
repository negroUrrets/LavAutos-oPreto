const { MarcaVehiculo, ModeloVehiculo } = require('../models');
const { createCrudService } = require('./crudService');
const { requireFields, assertExists } = require('../utils/validators');

const modeloVehiculoService = createCrudService({
  model: ModeloVehiculo,
  name: 'Modelo de vehiculo',
  fields: ['modeloVehi', 'marcaVehi'],
  validateCreate: async (payload) => {
    requireFields(payload, ['modeloVehi', 'marcaVehi']);
    await assertExists(MarcaVehiculo, payload.marcaVehi, 'La marca de vehiculo no existe.');
  },
  validateUpdate: async (payload) => {
    if (payload.marcaVehi !== undefined) {
      await assertExists(MarcaVehiculo, payload.marcaVehi, 'La marca de vehiculo no existe.');
    }
  },
});

module.exports = modeloVehiculoService;
