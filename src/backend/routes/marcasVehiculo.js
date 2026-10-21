const { createCrudController } = require('../controllers/crudController');
const { createCrudRouter } = require('./crudRoutes');
const marcaVehiculoService = require('../services/marcaVehiculoService');

module.exports = createCrudRouter(createCrudController(marcaVehiculoService));
