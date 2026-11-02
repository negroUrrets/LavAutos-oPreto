const asyncHandler = require('../utils/asyncHandler');
const { createCrudController } = require('./crudController');
const lavadoService = require('../services/lavadoService');

const base = createCrudController(lavadoService);

const create = asyncHandler(async (req, res) => {
  const data = await lavadoService.create({
    ...req.body,
    login: req.session.codigoLogin,
  });
  res.status(201).json({ success: true, data });
});

module.exports = { ...base, create };
