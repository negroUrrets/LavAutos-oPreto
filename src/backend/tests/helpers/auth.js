const request = require('supertest');
const { Usuario, Login } = require('../../models');
const { hashPassword } = require('../../utils/password');

const TEST_USER = 'test-auth-user';
const TEST_PASSWORD = 'test-password';

async function createTestUser() {
  await Usuario.destroy({ where: { nombreUsuario: TEST_USER } });
  return Usuario.create({
    nombreUsuario: TEST_USER,
    'contraseña': hashPassword(TEST_PASSWORD),
  });
}

async function loginAgent(app) {
  const user = await createTestUser();
  const agent = request.agent(app);
  const res = await agent
    .post('/api/auth/login')
    .send({ usuario: TEST_USER, contrasena: TEST_PASSWORD });

  if (res.status !== 200) {
    throw new Error(`No se pudo autenticar en pruebas (status ${res.status})`);
  }

  return { agent, user };
}

async function removeTestUser(user) {
  if (!user) {
    return;
  }
  await Login.destroy({ where: { usuario: user.codigoUsuario } });
  await Usuario.destroy({ where: { codigoUsuario: user.codigoUsuario } });
}

module.exports = { createTestUser, loginAgent, removeTestUser, TEST_USER, TEST_PASSWORD };
