const asyncHandler = require('../utils/asyncHandler');

function createCrudController(service) {
  return {
    list: asyncHandler(async (req, res) => {
      const data = await service.list(req.query);
      res.status(200).json({ success: true, data });
    }),

    getById: asyncHandler(async (req, res) => {
      const data = await service.getById(req.params.id);
      res.status(200).json({ success: true, data });
    }),

    create: asyncHandler(async (req, res) => {
      const data = await service.create(req.body);
      res.status(201).json({ success: true, data });
    }),

    update: asyncHandler(async (req, res) => {
      const data = await service.update(req.params.id, req.body);
      res.status(200).json({ success: true, data });
    }),

    remove: asyncHandler(async (req, res) => {
      await service.remove(req.params.id);
      res.status(204).send();
    }),
  };
}

module.exports = { createCrudController };
