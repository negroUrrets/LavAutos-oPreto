const { createCrudController } = require('../controllers/crudController');
const { createCrudRouter } = require('./crudRoutes');
const categoriaVehiculoService = require('../services/categoriaVehiculoService');

module.exports = createCrudRouter(createCrudController(categoriaVehiculoService));
