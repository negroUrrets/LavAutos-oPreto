const app = require('../app');
const {
  sequelize,
  Vehiculo,
  Lavado,
  CategoriaVehiculo,
  MarcaVehiculo,
  ModeloVehiculo,
} = require('../models');
const { createBaseFixtures, removeBaseFixtures, suffix } = require('./helpers/fixtures');
const { loginAgent, removeTestUser } = require('./helpers/auth');

let ids;
let agent;
let authUser;
const createdVehiculos = [];
const createdCategorias = [];
const createdMarcas = [];

beforeAll(async () => {
  await sequelize.authenticate();
  ids = await createBaseFixtures();
  ({ agent, user: authUser } = await loginAgent(app));
});

afterEach(async () => {
  while (createdVehiculos.length) {
    const id = createdVehiculos.pop();
    await Lavado.destroy({ where: { vehi: id } });
    await Vehiculo.destroy({ where: { codigoVehi: id } });
  }
  while (createdMarcas.length) {
    const id = createdMarcas.pop();
    await ModeloVehiculo.destroy({ where: { marcaVehi: id } });
    await MarcaVehiculo.destroy({ where: { codigoMarcaVehi: id } });
  }
  while (createdCategorias.length) {
    const id = createdCategorias.pop();
    await MarcaVehiculo.destroy({ where: { categoriaVehi: id } });
    await CategoriaVehiculo.destroy({ where: { codigoCategoriaVehi: id } });
  }
});

afterAll(async () => {
  await removeTestUser(authUser);
  await removeBaseFixtures(ids);
  await sequelize.close();
});

describe('CRUD de vehículos y catálogos', () => {
  test('POST /api/vehiculos crea un vehículo (201)', async () => {
    const res = await agent
      .post('/api/vehiculos')
      .send({ patenteVehi: `P${suffix()}`, estadoVehi: true, cliente: ids.clienteId, modeloVehi: ids.modeloVehiculoId });

    expect(res.status).toBe(201);
    expect(res.body.data.codigoVehi).toBeDefined();
    createdVehiculos.push(res.body.data.codigoVehi);
  });

  test('POST /api/vehiculos con cliente inexistente responde 400', async () => {
    const res = await agent
      .post('/api/vehiculos')
      .send({ patenteVehi: 'BAD001', estadoVehi: true, cliente: 999999999, modeloVehi: ids.modeloVehiculoId });

    expect(res.status).toBe(400);
  });

  test('POST /api/vehiculos con modelo inexistente responde 400', async () => {
    const res = await agent
      .post('/api/vehiculos')
      .send({ patenteVehi: 'BAD002', estadoVehi: true, cliente: ids.clienteId, modeloVehi: 999999999 });

    expect(res.status).toBe(400);
  });

  test('GET /api/vehiculos lista vehículos (200)', async () => {
    const res = await agent.get('/api/vehiculos');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/vehiculos incluye marca y categoría del vehículo', async () => {
    const create = await agent
      .post('/api/vehiculos')
      .send({ patenteVehi: `M${suffix()}`, estadoVehi: true, cliente: ids.clienteId, modeloVehi: ids.modeloVehiculoId });
    createdVehiculos.push(create.body.data.codigoVehi);

    const res = await agent.get('/api/vehiculos');
    const vehiculo = res.body.data.find((v) => v.codigoVehi === create.body.data.codigoVehi);

    expect(vehiculo.modelo).toBeDefined();
    expect(vehiculo.modelo.marca).toBeDefined();
    expect(vehiculo.modelo.marca.categoria).toBeDefined();
  });

  test('GET /api/vehiculos?cliente filtra por cliente', async () => {
    const create = await agent
      .post('/api/vehiculos')
      .send({ patenteVehi: `F${suffix()}`, estadoVehi: true, cliente: ids.clienteId, modeloVehi: ids.modeloVehiculoId });
    createdVehiculos.push(create.body.data.codigoVehi);

    const res = await agent.get(`/api/vehiculos?cliente=${ids.clienteId}`);

    expect(res.status).toBe(200);
    expect(res.body.data.every((v) => v.cliente === ids.clienteId)).toBe(true);
  });

  test('los vehículos inactivos se excluyen del listado pero se obtienen por id', async () => {
    const create = await agent
      .post('/api/vehiculos')
      .send({ patenteVehi: `I${suffix()}`, estadoVehi: true, cliente: ids.clienteId, modeloVehi: ids.modeloVehiculoId });
    const vehiculoId = create.body.data.codigoVehi;
    createdVehiculos.push(vehiculoId);

    await agent.put(`/api/vehiculos/${vehiculoId}`).send({ estadoVehi: false });

    const listado = await agent.get('/api/vehiculos');
    expect(listado.body.data.some((v) => v.codigoVehi === vehiculoId)).toBe(false);

    const porId = await agent.get(`/api/vehiculos/${vehiculoId}`);
    expect(porId.status).toBe(200);
    expect(porId.body.data.codigoVehi).toBe(vehiculoId);
  });

  test('GET /api/vehiculos/:id inexistente responde 404', async () => {
    const res = await agent.get('/api/vehiculos/999999999');

    expect(res.status).toBe(404);
  });

  test('PUT /api/vehiculos/:id actualiza (200)', async () => {
    const create = await agent
      .post('/api/vehiculos')
      .send({ patenteVehi: `E${suffix()}`, estadoVehi: true, cliente: ids.clienteId, modeloVehi: ids.modeloVehiculoId });
    const id = create.body.data.codigoVehi;
    createdVehiculos.push(id);

    const res = await agent.put(`/api/vehiculos/${id}`).send({ patenteVehi: 'NUEVA123' });

    expect(res.status).toBe(200);
    expect(res.body.data.patenteVehi).toBe('NUEVA123');
  });

  test('DELETE /api/vehiculos/:id responde 204', async () => {
    const create = await agent
      .post('/api/vehiculos')
      .send({ patenteVehi: `D${suffix()}`, estadoVehi: true, cliente: ids.clienteId, modeloVehi: ids.modeloVehiculoId });
    const id = create.body.data.codigoVehi;

    const res = await agent.delete(`/api/vehiculos/${id}`);

    expect(res.status).toBe(204);
    expect(await Vehiculo.findByPk(id)).toBeNull();
  });

  test('DELETE /api/vehiculos/:id inexistente responde 404', async () => {
    const res = await agent.delete('/api/vehiculos/999999999');

    expect(res.status).toBe(404);
  });

  test('DELETE /api/vehiculos/:id con lavados asociados aplica baja lógica (204)', async () => {
    const create = await agent
      .post('/api/vehiculos')
      .send({ patenteVehi: `C${suffix()}`, estadoVehi: true, cliente: ids.clienteId, modeloVehi: ids.modeloVehiculoId });
    const vehiculoId = create.body.data.codigoVehi;
    createdVehiculos.push(vehiculoId);

    await Lavado.create({
      fechaHoraLavado: new Date(),
      estado: ids.estadoLavadoId,
      utileria: ids.utileriaId,
      vehi: vehiculoId,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });

    const res = await agent.delete(`/api/vehiculos/${vehiculoId}`);

    expect(res.status).toBe(204);

    const enDb = await Vehiculo.findByPk(vehiculoId);
    expect(enDb).not.toBeNull();
    expect(Boolean(enDb.estadoVehi)).toBe(false);
  });

  test('DELETE /api/vehiculos/:id con lavados en otro estado aplica baja lógica (204)', async () => {
    const create = await agent
      .post('/api/vehiculos')
      .send({ patenteVehi: `N${suffix()}`, estadoVehi: true, cliente: ids.clienteId, modeloVehi: ids.modeloVehiculoId });
    const vehiculoId = create.body.data.codigoVehi;
    createdVehiculos.push(vehiculoId);

    await Lavado.create({
      fechaHoraLavado: new Date(),
      estado: ids.estadoLavadoAltId,
      utileria: ids.utileriaId,
      vehi: vehiculoId,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });

    const res = await agent.delete(`/api/vehiculos/${vehiculoId}`);

    expect(res.status).toBe(204);

    const enDb = await Vehiculo.findByPk(vehiculoId);
    expect(enDb).not.toBeNull();
    expect(Boolean(enDb.estadoVehi)).toBe(false);
  });

  test('POST /api/categorias-vehiculo crea una categoría (201)', async () => {
    const res = await agent
      .post('/api/categorias-vehiculo')
      .send({ categoriaVehi: `Cat ${suffix()}` });

    expect(res.status).toBe(201);
    createdCategorias.push(res.body.data.codigoCategoriaVehi);
  });

  test('POST /api/marcas-vehiculo con categoría inexistente responde 400', async () => {
    const res = await agent
      .post('/api/marcas-vehiculo')
      .send({ marcaVehi: 'MarcaX', categoriaVehi: 999999999 });

    expect(res.status).toBe(400);
  });

  test('POST /api/modelos-vehiculo crea un modelo (201)', async () => {
    const res = await agent
      .post('/api/modelos-vehiculo')
      .send({ modeloVehi: `Modelo ${suffix()}`, marcaVehi: ids.marcaVehiculoId });

    expect(res.status).toBe(201);
    await ModeloVehiculo.destroy({ where: { codigoModeloVehi: res.body.data.codigoModeloVehi } });
  });
});
