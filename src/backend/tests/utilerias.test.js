const app = require('../app');
const { sequelize, Utileria } = require('../models');
const { createBaseFixtures, removeBaseFixtures } = require('./helpers/fixtures');
const { loginAgent, removeTestUser } = require('./helpers/auth');

let ids;
let agent;
let authUser;

beforeAll(async () => {
  await sequelize.authenticate();
  ids = await createBaseFixtures();
  ({ agent, user: authUser } = await loginAgent(app));
});

afterAll(async () => {
  await removeTestUser(authUser);
  await removeBaseFixtures(ids);
  await sequelize.close();
});

describe('utilerias', () => {
  test('GET /api/utilerias lista las utilerias (200)', async () => {
    const res = await agent.get('/api/utilerias');

    expect(res.status).toBe(200);
    expect(
      res.body.data.some((utileria) => String(utileria.codigoUtileria) === String(ids.utileriaId)),
    ).toBe(true);
  });

  test('PUT /api/utilerias/:id actualiza estadoUtileria (200)', async () => {
    const res = await agent
      .put(`/api/utilerias/${ids.utileriaId}`)
      .send({ estadoUtileria: false });

    expect(res.status).toBe(200);
    expect(Boolean(res.body.data.estadoUtileria)).toBe(false);

    const enDb = await Utileria.findByPk(ids.utileriaId);
    expect(Boolean(enDb.estadoUtileria)).toBe(false);
  });

  test('PUT /api/utilerias/:id inexistente responde 404', async () => {
    const res = await agent.put('/api/utilerias/999999999').send({ estadoUtileria: true });

    expect(res.status).toBe(404);
  });
});
