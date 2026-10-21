const { createCrudController } = require('../controllers/crudController');
const { createCrudRouter } = require('./crudRoutes');
const lavadoService = require('../services/lavadoService');

module.exports = createCrudRouter(createCrudController(lavadoService), { allowDelete: false });
