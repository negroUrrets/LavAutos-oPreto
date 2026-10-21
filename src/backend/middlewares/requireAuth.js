const AppError = require('../utils/AppError');

function requireAuth(req, res, next) {
  if (!req.session || !req.session.codigoUsuario) {
    return next(new AppError('No autenticado.', 401));
  }
  return next();
}

module.exports = requireAuth;
