const { Router } = require('express');
const { createCrudController } = require('../controllers/crudController');
const estadoLavadoService = require('../services/estadoLavadoService');

const controller = createCrudController(estadoLavadoService);
const router = Router();

router.get('/', controller.list);

module.exports = router;
