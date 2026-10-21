const { createCrudController } = require('../controllers/crudController');
const { createCrudRouter } = require('./crudRoutes');
const categoriaLavadoService = require('../services/categoriaLavadoService');

module.exports = createCrudRouter(createCrudController(categoriaLavadoService));
