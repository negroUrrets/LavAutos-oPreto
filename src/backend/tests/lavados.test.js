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
      estado: ids.estadoLavadoId,
      utileria: ids.utileriaId,
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
      estado: ids.estadoLavadoId,
      utileria: ids.utileriaId,
      vehi: 999999999,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });

    expect(res.status).toBe(400);
  });

  test('POST /api/lavados con estado inexistente responde 400', async () => {
    const res = await agent.post('/api/lavados').send({
      fechaHoraLavado: new Date().toISOString(),
      estado: 999999999,
      utileria: ids.utileriaId,
      vehi: vehiculoId,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });

    expect(res.status).toBe(400);
  });

  test('POST /api/lavados con utilería inexistente responde 400', async () => {
    const res = await agent.post('/api/lavados').send({
      fechaHoraLavado: new Date().toISOString(),
      estado: ids.estadoLavadoId,
      utileria: 999999999,
      vehi: vehiculoId,
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

  test('GET /api/lavados?estado=<codigo> filtra por estado (200)', async () => {
    const create = await agent.post('/api/lavados').send({
      fechaHoraLavado: new Date().toISOString(),
      estado: ids.estadoLavadoId,
      utileria: ids.utileriaId,
      vehi: vehiculoId,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });
    createdLavados.push(create.body.data.codigoLavado);

    const res = await agent.get(`/api/lavados?estado=${ids.estadoLavadoId}`);

    expect(res.status).toBe(200);
    expect(
      res.body.data.every((lavado) => String(lavado.estado) === String(ids.estadoLavadoId)),
    ).toBe(true);
  });

  test('GET /api/lavados/:id inexistente responde 404', async () => {
    const res = await agent.get('/api/lavados/999999999');

    expect(res.status).toBe(404);
  });

  test('PUT /api/lavados/:id actualiza el estado (200)', async () => {
    const create = await agent.post('/api/lavados').send({
      fechaHoraLavado: new Date().toISOString(),
      estado: ids.estadoLavadoId,
      utileria: ids.utileriaId,
      vehi: vehiculoId,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });
    const id = create.body.data.codigoLavado;
    createdLavados.push(id);

    const res = await agent
      .put(`/api/lavados/${id}`)
      .send({ estado: ids.estadoLavadoAltId });

    expect(res.status).toBe(200);
    expect(String(res.body.data.estado)).toBe(String(ids.estadoLavadoAltId));
  });

  test('DELETE /api/lavados/:id no está permitido (405) y el lavado permanece', async () => {
    const create = await agent.post('/api/lavados').send({
      fechaHoraLavado: new Date().toISOString(),
      estado: ids.estadoLavadoId,
      utileria: ids.utileriaId,
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
      estado: ids.estadoLavadoId,
      utileria: ids.utileriaId,
      vehi: vehiculoId,
      categoriaLavado: categoriaId,
      login: ids.loginId,
    });
    createdLavados.push(create.body.data.codigoLavado);

    const res = await agent.delete(`/api/categorias-lavado/${categoriaId}`);

    expect(res.status).toBe(409);
  });
});

describe('marcas de tiempo del lavado', () => {
  function crearLavado(extra = {}) {
    return agent.post('/api/lavados').send({
      estado: ids.estadoLavadoId,
      utileria: ids.utileriaId,
      vehi: vehiculoId,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
      ...extra,
    });
  }

  test('el backend genera fechaHoraLavado y fechaHoraLavadoTerminado', async () => {
    const res = await crearLavado();
    createdLavados.push(res.body.data.codigoLavado);

    expect(res.status).toBe(201);
    expect(res.body.data.fechaHoraLavado).toBeDefined();
    expect(res.body.data.fechaHoraLavadoTerminado).toBeDefined();
    expect(res.body.data.fechaHoraLavadoTerminado).toBe(res.body.data.fechaHoraLavado);
  });

  test('ignora las marcas enviadas por el cliente', async () => {
    const res = await crearLavado({
      fechaHoraLavado: '2000-01-01T00:00:00.000Z',
      fechaHoraLavadoTerminado: '2000-01-01T00:00:00.000Z',
    });
    createdLavados.push(res.body.data.codigoLavado);

    expect(res.status).toBe(201);
    expect(res.body.data.fechaHoraLavado).not.toBe('2000-01-01T00:00:00.000Z');
    expect(res.body.data.fechaHoraLavadoTerminado).not.toBe('2000-01-01T00:00:00.000Z');
  });

  test('cambiar el estado actualiza fechaHoraLavadoTerminado y conserva fechaHoraLavado', async () => {
    const create = await crearLavado();
    const id = create.body.data.codigoLavado;
    createdLavados.push(id);

    await new Promise((resolve) => setTimeout(resolve, 20));

    const res = await agent.put(`/api/lavados/${id}`).send({ estado: ids.estadoLavadoAltId });

    expect(res.status).toBe(200);
    expect(res.body.data.fechaHoraLavado).toBe(create.body.data.fechaHoraLavado);
    expect(new Date(res.body.data.fechaHoraLavadoTerminado).getTime()).toBeGreaterThan(
      new Date(create.body.data.fechaHoraLavadoTerminado).getTime(),
    );
  });

  test('actualizar sin cambiar el estado conserva fechaHoraLavadoTerminado', async () => {
    const create = await crearLavado();
    const id = create.body.data.codigoLavado;
    createdLavados.push(id);

    await new Promise((resolve) => setTimeout(resolve, 20));

    const res = await agent
      .put(`/api/lavados/${id}`)
      .send({ detallesLavado: 'sin cambio de estado' });

    expect(res.status).toBe(200);
    expect(res.body.data.fechaHoraLavado).toBe(create.body.data.fechaHoraLavado);
    expect(res.body.data.fechaHoraLavadoTerminado).toBe(
      create.body.data.fechaHoraLavadoTerminado,
    );
  });
});
