const request = require('supertest');
const app = require('../app');
const { sequelize, Usuario, Login } = require('../models');
const { ensureDefaultAdmin } = require('../services/adminService');
const { verifyPassword } = require('../utils/password');

const TEST_ADMIN_USER = `admin-test-${Date.now()}`;
const TEST_ADMIN_PASSWORD = 'bootstrap-pass';

async function cleanup() {
  const user = await Usuario.findOne({ where: { nombreUsuario: TEST_ADMIN_USER } });
  if (!user) {
    return;
  }
  await Login.destroy({ where: { usuario: user.codigoUsuario } });
  await Usuario.destroy({ where: { codigoUsuario: user.codigoUsuario } });
}

beforeAll(async () => {
  await sequelize.authenticate();
  await cleanup();
});

afterAll(async () => {
  await cleanup();
  await sequelize.close();
});

describe('bootstrap de la cuenta administrador', () => {
  test('crea la cuenta si no existe, con hash, y permite el login', async () => {
    const result = await ensureDefaultAdmin({
      nombreUsuario: TEST_ADMIN_USER,
      contrasena: TEST_ADMIN_PASSWORD,
    });

    expect(result.created).toBe(true);

    const user = await Usuario.findOne({ where: { nombreUsuario: TEST_ADMIN_USER } });
    expect(user).not.toBeNull();
    expect(user.get('contraseña')).not.toBe(TEST_ADMIN_PASSWORD);
    expect(verifyPassword(TEST_ADMIN_PASSWORD, user.get('contraseña'))).toBe(true);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ usuario: TEST_ADMIN_USER, contrasena: TEST_ADMIN_PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body.data.nombreUsuario).toBe(TEST_ADMIN_USER);
    expect(JSON.stringify(res.body)).not.toContain(TEST_ADMIN_PASSWORD);
  });

  test('no duplica ni sobrescribe si la cuenta ya existe', async () => {
    const result = await ensureDefaultAdmin({
      nombreUsuario: TEST_ADMIN_USER,
      contrasena: 'otra-clave',
    });

    expect(result.created).toBe(false);

    const count = await Usuario.count({ where: { nombreUsuario: TEST_ADMIN_USER } });
    expect(count).toBe(1);

    const user = await Usuario.findOne({ where: { nombreUsuario: TEST_ADMIN_USER } });
    expect(verifyPassword(TEST_ADMIN_PASSWORD, user.get('contraseña'))).toBe(true);
    expect(verifyPassword('otra-clave', user.get('contraseña'))).toBe(false);
  });
});
