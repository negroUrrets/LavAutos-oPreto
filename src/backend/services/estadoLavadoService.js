const { EstadoLavado } = require('../models');
const { createCrudService } = require('./crudService');

const estadoLavadoService = createCrudService({
  model: EstadoLavado,
  name: 'Estado de lavado',
  fields: ['descripcionEstado', 'estadoLavado'],
});

module.exports = estadoLavadoService;
