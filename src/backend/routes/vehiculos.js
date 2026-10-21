const { createCrudController } = require('../controllers/crudController');
const { createCrudRouter } = require('./crudRoutes');
const vehiculoService = require('../services/vehiculoService');

module.exports = createCrudRouter(createCrudController(vehiculoService));
