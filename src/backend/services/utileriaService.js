const { Utileria } = require('../models');
const { createCrudService } = require('./crudService');

const utileriaService = createCrudService({
  model: Utileria,
  name: 'Utileria',
  fields: ['descripcionUtileria', 'estadoUtileria'],
});

module.exports = utileriaService;
