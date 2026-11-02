const app = require('../app');
const { sequelize, Persona, Cliente, Vehiculo, Lavado, EstadoLavado } = require('../models');
const { ensureLavadoCatalogs } = require('../services/catalogSeedService');
const { createBaseFixtures, removeBaseFixtures, suffix } = require('./helpers/fixtures');
const { loginAgent, removeTestUser } = require('./helpers/auth');

const createdClientes = [];
let agent;
let authUser;
let estadoEnEsperaId;
let estadoEntregadoId;

beforeAll(async () => {
  await sequelize.authenticate();
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
  while (createdClientes.length) {
    const id = createdClientes.pop();
    await Vehiculo.destroy({ where: { cliente: id } });
    await Cliente.destroy({ where: { codigoPersona: id } });
    await Persona.destroy({ where: { codigoPersona: id } });
  }
});

afterAll(async () => {
  await removeTestUser(authUser);
  await sequelize.close();
});

describe('CRUD de clientes', () => {
  test('POST /api/clientes crea un cliente (201)', async () => {
    const res = await agent
      .post('/api/clientes')
      .send({ nombre: 'Juan', apellido: 'Diaz', dni: dniUnico() });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.nombre).toBe('Juan');
    createdClientes.push(res.body.data.codigoPersona);
  });

  test('POST /api/clientes con vehiculo crea cliente y vehiculo (201)', async () => {
    const ids = await createBaseFixtures();
    const dni = dniUnico();
    const patente = `P${suffix()}`;

    const res = await agent.post('/api/clientes').send({
      nombre: 'Con',
      apellido: 'Vehiculo',
      dni,
      vehiculo: { patenteVehi: patente, modeloVehi: ids.modeloVehiculoId },
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.vehiculo).toBeDefined();
    expect(res.body.data.vehiculo.cliente).toBe(res.body.data.codigoPersona);
    expect(res.body.data.vehiculo.patenteVehi).toBe(patente);

    const persona = await Persona.findOne({ where: { dni } });
    const cliente = await Cliente.findByPk(persona.codigoPersona);
    const vehiculo = await Vehiculo.findByPk(res.body.data.vehiculo.codigoVehi);

    expect(persona).not.toBeNull();
    expect(cliente).not.toBeNull();
    expect(vehiculo).not.toBeNull();
    expect(vehiculo.cliente).toBe(persona.codigoPersona);
    expect(vehiculo.modeloVehi).toBe(ids.modeloVehiculoId);

    await Vehiculo.destroy({ where: { codigoVehi: vehiculo.codigoVehi } });
    await Cliente.destroy({ where: { codigoPersona: persona.codigoPersona } });
    await Persona.destroy({ where: { codigoPersona: persona.codigoPersona } });
    await removeBaseFixtures(ids);
  });

  test('POST /api/clientes con vehiculo y patente activa revierte todo (409)', async () => {
    const ids = await createBaseFixtures();
    const dni = dniUnico();
    const patente = `P${suffix()}`;

    const existente = await Vehiculo.create({
      patenteVehi: patente,
      estadoVehi: true,
      cliente: ids.clienteId,
      modeloVehi: ids.modeloVehiculoId,
    });

    const res = await agent.post('/api/clientes').send({
      nombre: 'Parcial',
      apellido: 'Rollback',
      dni,
      vehiculo: { patenteVehi: patente, modeloVehi: ids.modeloVehiculoId },
    });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toBe('La patente ya esta registrada.');
    expect(await Persona.findOne({ where: { dni } })).toBeNull();
    expect(await Vehiculo.count({ where: { patenteVehi: patente } })).toBe(1);

    await Vehiculo.destroy({ where: { codigoVehi: existente.codigoVehi } });
    await removeBaseFixtures(ids);
  });

  test('POST /api/clientes con datos faltantes responde 400', async () => {
    const res = await agent.post('/api/clientes').send({ nombre: 'SinApellido' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/clientes lista clientes (200)', async () => {
    const create = await agent
      .post('/api/clientes')
      .send({ nombre: 'Lista', apellido: 'Test', dni: dniUnico() });
    createdClientes.push(create.body.data.codigoPersona);

    const res = await agent.get('/api/clientes');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/clientes?buscar filtra por nombre, apellido o dni (200)', async () => {
    const dni = dniUnico();
    const create = await agent
      .post('/api/clientes')
      .send({ nombre: 'Buscable', apellido: 'ApellidoUnico', dni });
    createdClientes.push(create.body.data.codigoPersona);

    const porNombre = await agent.get('/api/clientes?buscar=Buscab');
    expect(porNombre.status).toBe(200);
    expect(porNombre.body.data.some((c) => c.nombre === 'Buscable')).toBe(true);

    const porApellido = await agent.get('/api/clientes?buscar=ApellidoUnic');
    expect(porApellido.status).toBe(200);
    expect(porApellido.body.data.some((c) => c.apellido === 'ApellidoUnico')).toBe(true);

    const porDni = await agent.get(`/api/clientes?buscar=${String(dni).slice(0, 6)}`);
    expect(porDni.status).toBe(200);
    expect(porDni.body.data.some((c) => String(c.dni) === String(dni))).toBe(true);
  });

  test('GET /api/clientes?buscar sin coincidencias devuelve lista vacía (200)', async () => {
    const res = await agent.get('/api/clientes?buscar=zzzzzznoexiste');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  test('los clientes inactivos se excluyen del listado y la búsqueda pero se obtienen por id', async () => {
    const create = await agent
      .post('/api/clientes')
      .send({ nombre: 'Inactivo', apellido: 'Test', dni: dniUnico() });
    const clienteId = create.body.data.codigoPersona;
    createdClientes.push(clienteId);

    await agent.put(`/api/clientes/${clienteId}`).send({ estadoCliente: false });

    const listado = await agent.get('/api/clientes');
    expect(listado.body.data.some((c) => c.codigoPersona === clienteId)).toBe(false);

    const busqueda = await agent.get('/api/clientes?buscar=88888888');
    expect(busqueda.body.data.some((c) => c.codigoPersona === clienteId)).toBe(false);

    const porId = await agent.get(`/api/clientes/${clienteId}`);
    expect(porId.status).toBe(200);
    expect(porId.body.data.codigoPersona).toBe(clienteId);
  });

  test('GET /api/clientes/:id inexistente responde 404', async () => {
    const res = await agent.get('/api/clientes/999999999');

    expect(res.status).toBe(404);
  });

  test('PUT /api/clientes/:id actualiza el cliente (200)', async () => {
    const create = await agent
      .post('/api/clientes')
      .send({ nombre: 'Edit', apellido: 'Me', dni: dniUnico() });
    const id = create.body.data.codigoPersona;
    createdClientes.push(id);

    const res = await agent.put(`/api/clientes/${id}`).send({ nombre: 'Editado' });

    expect(res.status).toBe(200);
    expect(res.body.data.nombre).toBe('Editado');
  });

  test('DELETE /api/clientes/:id responde 204', async () => {
    const create = await agent
      .post('/api/clientes')
      .send({ nombre: 'Del', apellido: 'Me', dni: dniUnico() });
    const id = create.body.data.codigoPersona;

    const res = await agent.delete(`/api/clientes/${id}`);

    expect(res.status).toBe(204);
  });

  test('DELETE /api/clientes/:id elimina también sus vehículos (204)', async () => {
    const ids = await createBaseFixtures();
    const create = await agent
      .post('/api/clientes')
      .send({ nombre: 'ConVeh', apellido: 'Test', dni: dniUnico() });
    const clienteId = create.body.data.codigoPersona;

    await Vehiculo.create({
      patenteVehi: 'ZZ999ZZ',
      estadoVehi: true,
      cliente: clienteId,
      modeloVehi: ids.modeloVehiculoId,
    });

    const res = await agent.delete(`/api/clientes/${clienteId}`);

    expect(res.status).toBe(204);
    expect(await Vehiculo.count({ where: { cliente: clienteId } })).toBe(0);

    await removeBaseFixtures(ids);
  });

  test('DELETE /api/clientes/:id con vehículos con lavados aplica baja lógica (204)', async () => {
    const ids = await createBaseFixtures();
    const create = await agent
      .post('/api/clientes')
      .send({ nombre: 'ConLavado', apellido: 'Test', dni: dniUnico() });
    const clienteId = create.body.data.codigoPersona;

    const vehiculo = await Vehiculo.create({
      patenteVehi: 'YY888YY',
      estadoVehi: true,
      cliente: clienteId,
      modeloVehi: ids.modeloVehiculoId,
    });
    await Lavado.create({
      fechaHoraLavado: new Date(),
      estado: ids.estadoLavadoId,
      utileria: ids.utileriaId,
      vehi: vehiculo.codigoVehi,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });

    const res = await agent.delete(`/api/clientes/${clienteId}`);

    expect(res.status).toBe(204);

    const clienteDb = await Cliente.findByPk(clienteId);
    const vehiculoDb = await Vehiculo.findByPk(vehiculo.codigoVehi);
    expect(clienteDb).not.toBeNull();
    expect(Boolean(clienteDb.estadoCliente)).toBe(false);
    expect(vehiculoDb).not.toBeNull();
    expect(Boolean(vehiculoDb.estadoVehi)).toBe(false);

    await Lavado.destroy({ where: { vehi: vehiculo.codigoVehi } });
    await Vehiculo.destroy({ where: { codigoVehi: vehiculo.codigoVehi } });
    await Cliente.destroy({ where: { codigoPersona: clienteId } });
    await Persona.destroy({ where: { codigoPersona: clienteId } });
    await removeBaseFixtures(ids);
  });

  test('DELETE /api/clientes/:id con lavados en otro estado aplica baja lógica (204)', async () => {
    const ids = await createBaseFixtures();
    const create = await agent
      .post('/api/clientes')
      .send({ nombre: 'ConLavadoAlt', apellido: 'Test', dni: dniUnico() });
    const clienteId = create.body.data.codigoPersona;

    const vehiculo = await Vehiculo.create({
      patenteVehi: 'ZZ777ZZ',
      estadoVehi: true,
      cliente: clienteId,
      modeloVehi: ids.modeloVehiculoId,
    });
    await Lavado.create({
      fechaHoraLavado: new Date(),
      estado: ids.estadoLavadoAltId,
      utileria: ids.utileriaId,
      vehi: vehiculo.codigoVehi,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });

    const res = await agent.delete(`/api/clientes/${clienteId}`);

    expect(res.status).toBe(204);

    const clienteDb = await Cliente.findByPk(clienteId);
    const vehiculoDb = await Vehiculo.findByPk(vehiculo.codigoVehi);
    expect(clienteDb).not.toBeNull();
    expect(Boolean(clienteDb.estadoCliente)).toBe(false);
    expect(vehiculoDb).not.toBeNull();
    expect(Boolean(vehiculoDb.estadoVehi)).toBe(false);

    await Lavado.destroy({ where: { vehi: vehiculo.codigoVehi } });
    await Vehiculo.destroy({ where: { codigoVehi: vehiculo.codigoVehi } });
    await Cliente.destroy({ where: { codigoPersona: clienteId } });
    await Persona.destroy({ where: { codigoPersona: clienteId } });
    await removeBaseFixtures(ids);
  });

  test('GET /api/clientes?sinLavadosDesde excluye clientes con lavados posteriores (200)', async () => {
    const ids = await createBaseFixtures();

    const conLavado = await agent
      .post('/api/clientes')
      .send({ nombre: 'Vuelve', apellido: 'Tarde', dni: dniUnico() });
    const sinLavado = await agent
      .post('/api/clientes')
      .send({ nombre: 'NoVuelve', apellido: 'Nunca', dni: dniUnico() });
    const conLavadoId = conLavado.body.data.codigoPersona;
    const sinLavadoId = sinLavado.body.data.codigoPersona;

    const vehiculo = await Vehiculo.create({
      patenteVehi: 'SD123SD',
      estadoVehi: true,
      cliente: conLavadoId,
      modeloVehi: ids.modeloVehiculoId,
    });
    const lavado = await Lavado.create({
      estado: ids.estadoLavadoId,
      utileria: ids.utileriaId,
      vehi: vehiculo.codigoVehi,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });
    await lavado.update({ fechaHoraLavado: new Date('2026-05-10T10:00:00') });

    const res = await agent.get('/api/clientes?sinLavadosDesde=2026-05-01');

    expect(res.status).toBe(200);
    const codigos = res.body.data.map((cliente) => cliente.codigoPersona);
    expect(codigos).toContain(sinLavadoId);
    expect(codigos).not.toContain(conLavadoId);

    await Lavado.destroy({ where: { vehi: vehiculo.codigoVehi } });
    await Vehiculo.destroy({ where: { codigoVehi: vehiculo.codigoVehi } });
    await Cliente.destroy({ where: { codigoPersona: conLavadoId } });
    await Persona.destroy({ where: { codigoPersona: conLavadoId } });
    await Cliente.destroy({ where: { codigoPersona: sinLavadoId } });
    await Persona.destroy({ where: { codigoPersona: sinLavadoId } });
    await removeBaseFixtures(ids);
  });

  test('PUT /api/clientes/:id con vehiculo en lavado activo responde 409', async () => {
    const ids = await createBaseFixtures();
    const create = await agent
      .post('/api/clientes')
      .send({ nombre: 'Bloq', apellido: 'Edit', dni: dniUnico() });
    const clienteId = create.body.data.codigoPersona;

    const vehiculo = await Vehiculo.create({
      patenteVehi: 'BE123BE',
      estadoVehi: true,
      cliente: clienteId,
      modeloVehi: ids.modeloVehiculoId,
    });
    await Lavado.create({
      estado: estadoEnEsperaId,
      utileria: ids.utileriaId,
      vehi: vehiculo.codigoVehi,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });

    const res = await agent.put(`/api/clientes/${clienteId}`).send({ nombre: 'Cambiado' });

    expect(res.status).toBe(409);
    const enDb = await Persona.findByPk(clienteId);
    expect(enDb.nombre).toBe('Bloq');

    await Lavado.destroy({ where: { vehi: vehiculo.codigoVehi } });
    await Vehiculo.destroy({ where: { codigoVehi: vehiculo.codigoVehi } });
    await Cliente.destroy({ where: { codigoPersona: clienteId } });
    await Persona.destroy({ where: { codigoPersona: clienteId } });
    await removeBaseFixtures(ids);
  });

  test('DELETE /api/clientes/:id con vehiculo en lavado activo responde 409', async () => {
    const ids = await createBaseFixtures();
    const create = await agent
      .post('/api/clientes')
      .send({ nombre: 'Bloq', apellido: 'Baja', dni: dniUnico() });
    const clienteId = create.body.data.codigoPersona;

    const vehiculo = await Vehiculo.create({
      patenteVehi: 'BB456BB',
      estadoVehi: true,
      cliente: clienteId,
      modeloVehi: ids.modeloVehiculoId,
    });
    await Lavado.create({
      estado: estadoEnEsperaId,
      utileria: ids.utileriaId,
      vehi: vehiculo.codigoVehi,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });

    const res = await agent.delete(`/api/clientes/${clienteId}`);

    expect(res.status).toBe(409);
    const clienteDb = await Cliente.findByPk(clienteId);
    expect(Boolean(clienteDb.estadoCliente)).toBe(true);
    const vehiculoDb = await Vehiculo.findByPk(vehiculo.codigoVehi);
    expect(Boolean(vehiculoDb.estadoVehi)).toBe(true);

    await Lavado.destroy({ where: { vehi: vehiculo.codigoVehi } });
    await Vehiculo.destroy({ where: { codigoVehi: vehiculo.codigoVehi } });
    await Cliente.destroy({ where: { codigoPersona: clienteId } });
    await Persona.destroy({ where: { codigoPersona: clienteId } });
    await removeBaseFixtures(ids);
  });

  test('DELETE /api/clientes/:id con lavado entregado aplica baja logica (204)', async () => {
    const ids = await createBaseFixtures();
    const create = await agent
      .post('/api/clientes')
      .send({ nombre: 'Entregado', apellido: 'Baja', dni: dniUnico() });
    const clienteId = create.body.data.codigoPersona;

    const vehiculo = await Vehiculo.create({
      patenteVehi: 'EE789EE',
      estadoVehi: true,
      cliente: clienteId,
      modeloVehi: ids.modeloVehiculoId,
    });
    await Lavado.create({
      estado: estadoEntregadoId,
      utileria: ids.utileriaId,
      vehi: vehiculo.codigoVehi,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });

    const res = await agent.delete(`/api/clientes/${clienteId}`);

    expect(res.status).toBe(204);
    const clienteDb = await Cliente.findByPk(clienteId);
    expect(clienteDb).not.toBeNull();
    expect(Boolean(clienteDb.estadoCliente)).toBe(false);

    await Lavado.destroy({ where: { vehi: vehiculo.codigoVehi } });
    await Vehiculo.destroy({ where: { codigoVehi: vehiculo.codigoVehi } });
    await Cliente.destroy({ where: { codigoPersona: clienteId } });
    await Persona.destroy({ where: { codigoPersona: clienteId } });
    await removeBaseFixtures(ids);
  });

  function dniUnico() {
    return Number(`9${String(Date.now()).slice(-8)}${Math.floor(Math.random() * 90 + 10)}`);
  }

  test('POST /api/clientes con un DNI activo responde 409', async () => {
    const dni = dniUnico();
    const primera = await agent
      .post('/api/clientes')
      .send({ nombre: 'Uno', apellido: 'Dni', dni });
    const clienteId = primera.body.data.codigoPersona;
    createdClientes.push(clienteId);

    const segunda = await agent
      .post('/api/clientes')
      .send({ nombre: 'Dos', apellido: 'Dni', dni });

    expect(primera.status).toBe(201);
    expect(segunda.status).toBe(409);
    expect(segunda.body.error.message).toBe('El DNI ya esta registrado.');
    expect(await Persona.count({ where: { dni } })).toBe(1);
  });

  test('POST /api/clientes con el DNI de un cliente dado de baja lo reactiva', async () => {
    const dni = dniUnico();
    const primera = await agent
      .post('/api/clientes')
      .send({ nombre: 'Baja', apellido: 'Dni', dni });
    const clienteId = primera.body.data.codigoPersona;
    createdClientes.push(clienteId);

    await Cliente.update({ estadoCliente: false }, { where: { codigoPersona: clienteId } });

    const segunda = await agent
      .post('/api/clientes')
      .send({ nombre: 'Reactivado', apellido: 'Dni', dni });

    expect(segunda.status).toBe(201);
    expect(segunda.body.data.codigoPersona).toBe(clienteId);
    expect(segunda.body.data.nombre).toBe('Reactivado');
    expect(Boolean(segunda.body.data.estadoCliente)).toBe(true);
    expect(await Persona.count({ where: { dni } })).toBe(1);
  });

  test('PUT /api/clientes/:id con el DNI de otro cliente responde 409', async () => {
    const primera = await agent
      .post('/api/clientes')
      .send({ nombre: 'Propio', apellido: 'Dni', dni: dniUnico() });
    const otra = await agent
      .post('/api/clientes')
      .send({ nombre: 'Ajeno', apellido: 'Dni', dni: dniUnico() });
    const propiaId = primera.body.data.codigoPersona;
    const ajenaId = otra.body.data.codigoPersona;
    createdClientes.push(propiaId, ajenaId);

    const res = await agent.put(`/api/clientes/${propiaId}`).send({ dni: otra.body.data.dni });

    expect(res.status).toBe(409);
    const enDb = await Persona.findByPk(propiaId);
    expect(String(enDb.dni)).toBe(String(primera.body.data.dni));
  });

  test('PUT /api/clientes/:id con el DNI de un cliente dado de baja responde 409', async () => {
    const primera = await agent
      .post('/api/clientes')
      .send({ nombre: 'Activo', apellido: 'Dni', dni: dniUnico() });
    const otra = await agent
      .post('/api/clientes')
      .send({ nombre: 'Baja', apellido: 'Dni', dni: dniUnico() });
    const propiaId = primera.body.data.codigoPersona;
    const ajenaId = otra.body.data.codigoPersona;
    createdClientes.push(propiaId, ajenaId);

    await Cliente.update({ estadoCliente: false }, { where: { codigoPersona: ajenaId } });

    const res = await agent.put(`/api/clientes/${propiaId}`).send({ dni: otra.body.data.dni });

    expect(res.status).toBe(409);
  });

  test('PUT /api/clientes/:id con su mismo DNI responde 200', async () => {
    const creado = await agent
      .post('/api/clientes')
      .send({ nombre: 'Mismo', apellido: 'Dni', dni: dniUnico() });
    const clienteId = creado.body.data.codigoPersona;
    createdClientes.push(clienteId);

    const res = await agent
      .put(`/api/clientes/${clienteId}`)
      .send({ dni: creado.body.data.dni, nombre: 'Editado' });

    expect(res.status).toBe(200);
    expect(res.body.data.nombre).toBe('Editado');
  });
});
