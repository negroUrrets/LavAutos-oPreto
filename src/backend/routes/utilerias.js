const { Router } = require('express');
const { createCrudController } = require('../controllers/crudController');
const utileriaService = require('../services/utileriaService');

const controller = createCrudController(utileriaService);
const router = Router();

router.get('/', controller.list);
router.put('/:id', controller.update);

module.exports = router;
