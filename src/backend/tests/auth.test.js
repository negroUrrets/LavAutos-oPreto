const request = require('supertest');
const app = require('../app');
const { sequelize, Usuario, Login } = require('../models');
const { hashPassword } = require('../utils/password');

const USER = `auth-user-${Date.now()}`;
const PASSWORD = 'secret123';
let userId;

beforeAll(async () => {
  await sequelize.authenticate();
  const user = await Usuario.create({
    nombreUsuario: USER,
    'contraseña': hashPassword(PASSWORD),
  });
  userId = user.codigoUsuario;
});

afterAll(async () => {
  await Login.destroy({ where: { usuario: userId } });
  await Usuario.destroy({ where: { codigoUsuario: userId } });
  await sequelize.close();
});

describe('autenticacion', () => {
  test('login valido responde 200 con cookie HttpOnly y sin contraseña', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ usuario: USER, contrasena: PASSWORD });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.nombreUsuario).toBe(USER);
    expect(res.body.data.codigoLogin).toBeDefined();
    expect(JSON.stringify(res.body)).not.toContain(PASSWORD);

    const cookie = (res.headers['set-cookie'] || []).join(';');
    expect(cookie).toContain('HttpOnly');
  });

  test('login con usuario inexistente responde 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ usuario: 'usuario-inexistente', contrasena: 'x' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test('login con contraseña incorrecta responde 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ usuario: USER, contrasena: 'incorrecta' });

    expect(res.status).toBe(401);
  });

  test('no se crea sesion ante credenciales invalidas', async () => {
    const agent = request.agent(app);
    const login = await agent
      .post('/api/auth/login')
      .send({ usuario: USER, contrasena: 'incorrecta' });
    expect(login.status).toBe(401);

    const sessionRes = await agent.get('/api/auth/session');
    expect(sessionRes.status).toBe(401);
  });

  test('session responde 401 sin sesion y 200 con sesion', async () => {
    const agent = request.agent(app);

    const before = await agent.get('/api/auth/session');
    expect(before.status).toBe(401);

    await agent.post('/api/auth/login').send({ usuario: USER, contrasena: PASSWORD });
    const after = await agent.get('/api/auth/session');

    expect(after.status).toBe(200);
    expect(after.body.data.authenticated).toBe(true);
    expect(JSON.stringify(after.body)).not.toContain(PASSWORD);
  });

  test('logout responde 204 y luego el endpoint protegido responde 401', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/login').send({ usuario: USER, contrasena: PASSWORD });

    const logout = await agent.post('/api/auth/logout');
    expect(logout.status).toBe(204);

    const protectedRes = await agent.get('/api/clientes');
    expect(protectedRes.status).toBe(401);
  });

  test('un endpoint CRUD sin sesion responde 401', async () => {
    const res = await request(app).get('/api/clientes');
    expect(res.status).toBe(401);
  });
});
