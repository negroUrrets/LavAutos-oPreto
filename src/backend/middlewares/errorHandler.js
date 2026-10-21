const AppError = require('../utils/AppError');

function normalizeError(err) {
  if (err instanceof AppError) {
    return err;
  }

  switch (err.name) {
    case 'SequelizeValidationError':
      return new AppError('Datos invalidos.', 400);
    case 'SequelizeUniqueConstraintError':
      return new AppError('El recurso ya existe.', 409);
    case 'SequelizeForeignKeyConstraintError':
      return new AppError('No se puede completar la operacion por dependencias existentes.', 409);
    default:
      return null;
  }
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const normalized = normalizeError(err);
  const statusCode = normalized ? normalized.statusCode : 500;
  const message = normalized ? normalized.message : 'Error interno del servidor';

  res.status(statusCode).json({ success: false, error: { message } });
}

module.exports = errorHandler;
