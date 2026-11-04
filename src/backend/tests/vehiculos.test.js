const app = require('../app');
const {
  sequelize,
  Persona,
  Cliente,
  Vehiculo,
  Lavado,
  EstadoLavado,
  DetalleUtileria,
  CategoriaVehiculo,
  MarcaVehiculo,
  ModeloVehiculo,
} = require('../models');
const { ensureLavadoCatalogs } = require('../services/catalogSeedService');
const { createBaseFixtures, removeBaseFixtures, suffix } = require('./helpers/fixtures');
const { loginAgent, removeTestUser } = require('./helpers/auth');

async function crearLavadoConUtileria(data) {
  const { utileria, ...lavadoData } = data;
  const lavado = await Lavado.create(lavadoData);
  await DetalleUtileria.create({
    codigoLavado: lavado.codigoLavado,
    codigoUtileria: utileria,
  });
  return lavado;
}

let ids;
let agent;
let authUser;
let estadoEnEsperaId;
let estadoEntregadoId;
const createdVehiculos = [];
const createdCategorias = [];
const createdMarcas = [];

beforeAll(async () => {
  await sequelize.authenticate();
  ids = await createBaseFixtures();
  await ensureLavadoCatalogs();
  estadoEnEsperaId = (
    await EstadoLavado.findOne({ where: { descripcionEstado: 'En Espera' } })
  ).codigoEstado;
  estadoEntregadoId = (
    await EstadoLavado.findOne({ where: { descripcionEstado: 'Entregado' } })
  ).codigoEstado;
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

    await crearLavadoConUtileria({
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

    await crearLavadoConUtileria({
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

  test('PUT /api/vehiculos/:id con lavado activo responde 409 y no modifica', async () => {
    const create = await agent
      .post('/api/vehiculos')
      .send({ patenteVehi: `B${suffix()}`, estadoVehi: true, cliente: ids.clienteId, modeloVehi: ids.modeloVehiculoId });
    const vehiculoId = create.body.data.codigoVehi;
    createdVehiculos.push(vehiculoId);

    await crearLavadoConUtileria({
      estado: estadoEnEsperaId,
      utileria: ids.utileriaId,
      vehi: vehiculoId,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });

    const res = await agent.put(`/api/vehiculos/${vehiculoId}`).send({ patenteVehi: 'CAMBIO01' });

    expect(res.status).toBe(409);
    const enDb = await Vehiculo.findByPk(vehiculoId);
    expect(enDb.patenteVehi).not.toBe('CAMBIO01');
  });

  test('DELETE /api/vehiculos/:id con lavado activo responde 409 y no da de baja', async () => {
    const create = await agent
      .post('/api/vehiculos')
      .send({ patenteVehi: `L${suffix()}`, estadoVehi: true, cliente: ids.clienteId, modeloVehi: ids.modeloVehiculoId });
    const vehiculoId = create.body.data.codigoVehi;
    createdVehiculos.push(vehiculoId);

    await crearLavadoConUtileria({
      estado: estadoEnEsperaId,
      utileria: ids.utileriaId,
      vehi: vehiculoId,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });

    const res = await agent.delete(`/api/vehiculos/${vehiculoId}`);

    expect(res.status).toBe(409);
    const enDb = await Vehiculo.findByPk(vehiculoId);
    expect(enDb).not.toBeNull();
    expect(Boolean(enDb.estadoVehi)).toBe(true);
  });

  test('DELETE /api/vehiculos/:id con lavado entregado aplica baja lógica (204)', async () => {
    const create = await agent
      .post('/api/vehiculos')
      .send({ patenteVehi: `T${suffix()}`, estadoVehi: true, cliente: ids.clienteId, modeloVehi: ids.modeloVehiculoId });
    const vehiculoId = create.body.data.codigoVehi;
    createdVehiculos.push(vehiculoId);

    await crearLavadoConUtileria({
      estado: estadoEntregadoId,
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

  let patenteSeq = Math.floor(Math.random() * 800) + 100;

  function patenteUnica() {
    patenteSeq = patenteSeq >= 999 ? 100 : patenteSeq + 1;
    return `AB${patenteSeq}CD`;
  }

  function dniUnico() {
    return Number(`9${String(Date.now()).slice(-8)}${Math.floor(Math.random() * 90 + 10)}`);
  }

  function patenteCanonica(patente) {
    return `${patente.slice(0, 2)}-${patente.slice(2, 5)}-${patente.slice(5)}`;
  }

  async function crearVehiculoConPatente(patente, cliente = ids.clienteId) {
    const res = await agent.post('/api/vehiculos').send({
      patenteVehi: patente,
      estadoVehi: true,
      cliente,
      modeloVehi: ids.modeloVehiculoId,
    });
    if (res.status === 201) {
      createdVehiculos.push(res.body.data.codigoVehi);
    }
    return res;
  }

  test('el alta normaliza la patente', async () => {
    const patente = patenteUnica();
    const res = await crearVehiculoConPatente(patente.toLowerCase());

    expect(res.status).toBe(201);
    const enDb = await Vehiculo.findByPk(res.body.data.codigoVehi);
    expect(enDb.patenteVehi).toBe(patenteCanonica(patente));
  });

  test('dos vehiculos con la misma patente normalizada responde 409', async () => {
    const patente = patenteUnica();
    const primera = await crearVehiculoConPatente(patente);
    const segunda = await crearVehiculoConPatente(
      `${patente.slice(0, 2).toLowerCase()}-${patente.slice(2, 5)}-${patente.slice(5).toLowerCase()}`,
    );

    expect(primera.status).toBe(201);
    expect(segunda.status).toBe(409);
    expect(segunda.body.error.message).toBe('La patente ya esta registrada.');
    expect(await Vehiculo.count({ where: { patenteVehi: patenteCanonica(patente) } })).toBe(1);
  });

  test('el alta con la patente de un vehiculo dado de baja lo reactiva', async () => {
    const patente = patenteUnica();
    const primera = await crearVehiculoConPatente(patente);
    const id = primera.body.data.codigoVehi;

    await Vehiculo.update({ estadoVehi: false }, { where: { codigoVehi: id } });

    const segunda = await crearVehiculoConPatente(patente);

    expect(segunda.status).toBe(201);
    expect(segunda.body.data.codigoVehi).toBe(id);
    const enDb = await Vehiculo.findByPk(id);
    expect(Boolean(enDb.estadoVehi)).toBe(true);
  });

  test('la reactivacion puede asignar el vehiculo a un cliente distinto', async () => {
    const patente = patenteUnica();
    const primera = await crearVehiculoConPatente(patente);
    const vehiculoId = primera.body.data.codigoVehi;

    await Vehiculo.update({ estadoVehi: false }, { where: { codigoVehi: vehiculoId } });

    const cliente = await agent
      .post('/api/clientes')
      .send({ nombre: 'Otro', apellido: 'Cliente', dni: dniUnico() });
    const otroClienteId = cliente.body.data.codigoPersona;

    const segunda = await crearVehiculoConPatente(patente.toLowerCase(), otroClienteId);

    expect(segunda.status).toBe(201);
    expect(segunda.body.data.codigoVehi).toBe(vehiculoId);
    const enDb = await Vehiculo.findByPk(vehiculoId);
    expect(String(enDb.cliente)).toBe(String(otroClienteId));

    await Lavado.destroy({ where: { vehi: vehiculoId } });
    await Vehiculo.destroy({ where: { codigoVehi: vehiculoId } });
    await Cliente.destroy({ where: { codigoPersona: otroClienteId } });
    await Persona.destroy({ where: { codigoPersona: otroClienteId } });
  });

  test('PUT con la patente de otro vehiculo responde 409', async () => {
    const patenteA = patenteUnica();
    const patenteB = patenteUnica();
    const a = await crearVehiculoConPatente(patenteA);
    await crearVehiculoConPatente(patenteB);

    const res = await agent
      .put(`/api/vehiculos/${a.body.data.codigoVehi}`)
      .send({ patenteVehi: patenteB });

    expect(res.status).toBe(409);
    const enDb = await Vehiculo.findByPk(a.body.data.codigoVehi);
    expect(enDb.patenteVehi).toBe(patenteCanonica(patenteA));
  });

  test('PUT con su misma patente responde 200', async () => {
    const patente = patenteUnica();
    const creado = await crearVehiculoConPatente(patente);

    const res = await agent
      .put(`/api/vehiculos/${creado.body.data.codigoVehi}`)
      .send({ patenteVehi: patente });

    expect(res.status).toBe(200);
  });
});
