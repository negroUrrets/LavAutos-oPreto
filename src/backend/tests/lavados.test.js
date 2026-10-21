const app = require('../app');
const { sequelize, Vehiculo, Lavado, CategoriaLavado } = require('../models');
const { createBaseFixtures, removeBaseFixtures, suffix } = require('./helpers/fixtures');
const { loginAgent, removeTestUser } = require('./helpers/auth');

let ids;
let vehiculoId;
let agent;
let authUser;
const createdLavados = [];
const createdCategoriasLavado = [];

beforeAll(async () => {
  await sequelize.authenticate();
  ids = await createBaseFixtures();
  const vehiculo = await Vehiculo.create({
    patenteVehi: 'LL001AA',
    estadoVehi: true,
    cliente: ids.clienteId,
    modeloVehi: ids.modeloVehiculoId,
  });
  vehiculoId = vehiculo.codigoVehi;
  ({ agent, user: authUser } = await loginAgent(app));
});

afterEach(async () => {
  while (createdLavados.length) {
    const id = createdLavados.pop();
    await Lavado.destroy({ where: { codigoLavado: id } });
  }
  while (createdCategoriasLavado.length) {
    const id = createdCategoriasLavado.pop();
    await Lavado.destroy({ where: { categoriaLavado: id } });
    await CategoriaLavado.destroy({ where: { codigoCategoriaLavado: id } });
  }
});

afterAll(async () => {
  await Lavado.destroy({ where: { vehi: vehiculoId } });
  await Vehiculo.destroy({ where: { codigoVehi: vehiculoId } });
  await removeTestUser(authUser);
  await removeBaseFixtures(ids);
  await sequelize.close();
});

describe('CRUD de lavados y categoría de lavado', () => {
  test('POST /api/lavados crea un lavado (201) sin cliente directo', async () => {
    const res = await agent.post('/api/lavados').send({
      fechaHoraLavado: new Date().toISOString(),
      estadoLavado: 'activo',
      vehi: vehiculoId,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });

    expect(res.status).toBe(201);
    expect(res.body.data.codigoLavado).toBeDefined();
    expect(res.body.data.cliente).toBeUndefined();
    createdLavados.push(res.body.data.codigoLavado);
  });

  test('POST /api/lavados con vehículo inexistente responde 400', async () => {
    const res = await agent.post('/api/lavados').send({
      fechaHoraLavado: new Date().toISOString(),
      estadoLavado: 'activo',
      vehi: 999999999,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });

    expect(res.status).toBe(400);
  });

  test('GET /api/lavados lista lavados (200)', async () => {
    const res = await agent.get('/api/lavados');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/lavados?estadoLavado=activo filtra por estado (200)', async () => {
    const create = await agent.post('/api/lavados').send({
      fechaHoraLavado: new Date().toISOString(),
      estadoLavado: 'activo',
      vehi: vehiculoId,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });
    createdLavados.push(create.body.data.codigoLavado);

    const res = await agent.get('/api/lavados?estadoLavado=activo');

    expect(res.status).toBe(200);
    expect(res.body.data.every((lavado) => lavado.estadoLavado === 'activo')).toBe(true);
  });

  test('GET /api/lavados/:id inexistente responde 404', async () => {
    const res = await agent.get('/api/lavados/999999999');

    expect(res.status).toBe(404);
  });

  test('PUT /api/lavados/:id actualiza el estado (200)', async () => {
    const create = await agent.post('/api/lavados').send({
      fechaHoraLavado: new Date().toISOString(),
      estadoLavado: 'activo',
      vehi: vehiculoId,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });
    const id = create.body.data.codigoLavado;
    createdLavados.push(id);

    const res = await agent.put(`/api/lavados/${id}`).send({ estadoLavado: 'finalizado' });

    expect(res.status).toBe(200);
    expect(res.body.data.estadoLavado).toBe('finalizado');
  });

  test('DELETE /api/lavados/:id no está permitido (405) y el lavado permanece', async () => {
    const create = await agent.post('/api/lavados').send({
      fechaHoraLavado: new Date().toISOString(),
      estadoLavado: 'activo',
      vehi: vehiculoId,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });
    const id = create.body.data.codigoLavado;
    createdLavados.push(id);

    const res = await agent.delete(`/api/lavados/${id}`);

    expect(res.status).toBe(405);
    expect(await Lavado.findByPk(id)).not.toBeNull();
  });

  test('POST /api/categorias-lavado crea una categoría (201)', async () => {
    const res = await agent
      .post('/api/categorias-lavado')
      .send({ descripcionLavado: `Lavado ${suffix()}` });

    expect(res.status).toBe(201);
    createdCategoriasLavado.push(res.body.data.codigoCategoriaLavado);
  });

  test('DELETE /api/categorias-lavado/:id con lavados asociados responde 409', async () => {
    const categoria = await agent
      .post('/api/categorias-lavado')
      .send({ descripcionLavado: `ConLavado ${suffix()}` });
    const categoriaId = categoria.body.data.codigoCategoriaLavado;
    createdCategoriasLavado.push(categoriaId);

    const create = await agent.post('/api/lavados').send({
      fechaHoraLavado: new Date().toISOString(),
      estadoLavado: 'activo',
      vehi: vehiculoId,
      categoriaLavado: categoriaId,
      login: ids.loginId,
    });
    createdLavados.push(create.body.data.codigoLavado);

    const res = await agent.delete(`/api/categorias-lavado/${categoriaId}`);

    expect(res.status).toBe(409);
  });
});
