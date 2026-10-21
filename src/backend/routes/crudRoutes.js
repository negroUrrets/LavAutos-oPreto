const { Router } = require('express');

function createCrudRouter(controller, { allowDelete = true } = {}) {
  const router = Router();

  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);

  if (allowDelete) {
    router.delete('/:id', controller.remove);
  } else {
    router.delete('/:id', (req, res) => {
      res.status(405).json({
        success: false,
        error: { message: 'No se permite eliminar este recurso.' },
      });
    });
  }

  return router;
}

module.exports = { createCrudRouter };
