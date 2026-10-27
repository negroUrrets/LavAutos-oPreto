const { Usuario } = require('../models');
const { hashPassword } = require('../utils/password');

const DEFAULT_ADMIN_USER = 'admin';
const DEFAULT_ADMIN_PASSWORD = '123456';

async function ensureDefaultAdmin({
  nombreUsuario = DEFAULT_ADMIN_USER,
  contrasena = DEFAULT_ADMIN_PASSWORD,
} = {}) {
  const existing = await Usuario.findOne({ where: { nombreUsuario } });
  if (existing) {
    return { created: false, codigoUsuario: existing.codigoUsuario };
  }

  const created = await Usuario.create({
    nombreUsuario,
    'contraseña': hashPassword(contrasena),
  });

  return { created: true, codigoUsuario: created.codigoUsuario };
}

module.exports = { ensureDefaultAdmin, DEFAULT_ADMIN_USER, DEFAULT_ADMIN_PASSWORD };
