const { Usuario, Login } = require('../models');
const AppError = require('../utils/AppError');
const { verifyPassword } = require('../utils/password');

const GENERIC_MESSAGE = 'Usuario o contrasena incorrectos.';

async function login(payload = {}, session) {
  const { usuario, contrasena } = payload;

  if (!usuario || !contrasena) {
    throw new AppError(GENERIC_MESSAGE, 401);
  }

  const user = await Usuario.findOne({ where: { nombreUsuario: usuario } });
  const passwordMatches = user ? verifyPassword(contrasena, user.get('contraseña')) : false;

  if (!user || !passwordMatches) {
    throw new AppError(GENERIC_MESSAGE, 401);
  }

  const loginRecord = await Login.create({ usuario: user.codigoUsuario });

  session.codigoLogin = loginRecord.codigoLogin;
  session.codigoUsuario = user.codigoUsuario;
  session.nombreUsuario = user.nombreUsuario;

  return {
    codigoUsuario: user.codigoUsuario,
    nombreUsuario: user.nombreUsuario,
    codigoLogin: loginRecord.codigoLogin,
  };
}

function logout(session) {
  return new Promise((resolve, reject) => {
    session.destroy((error) => (error ? reject(error) : resolve()));
  });
}

function getSession(session) {
  if (!session || !session.codigoUsuario) {
    throw new AppError('No hay sesion activa.', 401);
  }

  return {
    authenticated: true,
    codigoUsuario: session.codigoUsuario,
    nombreUsuario: session.nombreUsuario,
    codigoLogin: session.codigoLogin,
  };
}

module.exports = { login, logout, getSession };
