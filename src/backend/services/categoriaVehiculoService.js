const { CategoriaVehiculo } = require('../models');
const { createCrudService } = require('./crudService');
const { requireFields } = require('../utils/validators');

const categoriaVehiculoService = createCrudService({
  model: CategoriaVehiculo,
  name: 'Categoria de vehiculo',
  fields: ['categoriaVehi'],
  validateCreate: async (payload) => {
    requireFields(payload, ['categoriaVehi']);
  },
});

module.exports = categoriaVehiculoService;
