const { createCrudController } = require('../controllers/crudController');
const { createCrudRouter } = require('./crudRoutes');
const modeloVehiculoService = require('../services/modeloVehiculoService');

module.exports = createCrudRouter(createCrudController(modeloVehiculoService));
