const { createCrudController } = require('../controllers/crudController');
const { createCrudRouter } = require('./crudRoutes');
const clienteService = require('../services/clienteService');

module.exports = createCrudRouter(createCrudController(clienteService));
