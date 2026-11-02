const { createCrudRouter } = require('./crudRoutes');
const lavadosController = require('../controllers/lavadosController');

module.exports = createCrudRouter(lavadosController, { allowDelete: false });
