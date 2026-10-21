const { CategoriaLavado } = require('../models');
const { createCrudService } = require('./crudService');
const { requireFields } = require('../utils/validators');

const categoriaLavadoService = createCrudService({
  model: CategoriaLavado,
  name: 'Categoria de lavado',
  fields: ['descripcionLavado'],
  validateCreate: async (payload) => {
    requireFields(payload, ['descripcionLavado']);
  },
});

module.exports = categoriaLavadoService;
