const AppError = require('./AppError');

function isMissing(value) {
  return value === undefined || value === null || value === '';
}

function requireFields(payload, fields) {
  const missing = fields.filter((field) => isMissing(payload[field]));
  if (missing.length > 0) {
    throw new AppError(`Faltan campos obligatorios: ${missing.join(', ')}`, 400);
  }
}

async function assertExists(model, id, message) {
  if (isMissing(id)) {
    throw new AppError(message, 400);
  }
  const found = await model.findByPk(id);
  if (!found) {
    throw new AppError(message, 400);
  }
}

module.exports = { requireFields, assertExists };
