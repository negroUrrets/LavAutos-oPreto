const app = require('../app');
const { sequelize, Persona, Cliente, Vehiculo, Lavado } = require('../models');
const { createBaseFixtures, removeBaseFixtures } = require('./helpers/fixtures');
const { loginAgent, removeTestUser } = require('./helpers/auth');

const createdClientes = [];
let agent;
let authUser;

beforeAll(async () => {
  await sequelize.authenticate();
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
      .send({ nombre: 'Juan', apellido: 'Diaz', dni: 22222222 });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.nombre).toBe('Juan');
    createdClientes.push(res.body.data.codigoPersona);
  });

  test('POST /api/clientes con datos faltantes responde 400', async () => {
    const res = await agent.post('/api/clientes').send({ nombre: 'SinApellido' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/clientes lista clientes (200)', async () => {
    const create = await agent
      .post('/api/clientes')
      .send({ nombre: 'Lista', apellido: 'Test', dni: 33333333 });
    createdClientes.push(create.body.data.codigoPersona);

    const res = await agent.get('/api/clientes');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/clientes?buscar filtra por nombre, apellido o dni (200)', async () => {
    const create = await agent
      .post('/api/clientes')
      .send({ nombre: 'Buscable', apellido: 'ApellidoUnico', dni: 12345678 });
    createdClientes.push(create.body.data.codigoPersona);

    const porNombre = await agent.get('/api/clientes?buscar=Buscab');
    expect(porNombre.status).toBe(200);
    expect(porNombre.body.data.some((c) => c.nombre === 'Buscable')).toBe(true);

    const porApellido = await agent.get('/api/clientes?buscar=ApellidoUnic');
    expect(porApellido.status).toBe(200);
    expect(porApellido.body.data.some((c) => c.apellido === 'ApellidoUnico')).toBe(true);

    const porDni = await agent.get('/api/clientes?buscar=123456');
    expect(porDni.status).toBe(200);
    expect(porDni.body.data.some((c) => String(c.dni) === '12345678')).toBe(true);
  });

  test('GET /api/clientes?buscar sin coincidencias devuelve lista vacía (200)', async () => {
    const res = await agent.get('/api/clientes?buscar=zzzzzznoexiste');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  test('los clientes inactivos se excluyen del listado y la búsqueda pero se obtienen por id', async () => {
    const create = await agent
      .post('/api/clientes')
      .send({ nombre: 'Inactivo', apellido: 'Test', dni: 88888888 });
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
      .send({ nombre: 'Edit', apellido: 'Me', dni: 44444444 });
    const id = create.body.data.codigoPersona;
    createdClientes.push(id);

    const res = await agent.put(`/api/clientes/${id}`).send({ nombre: 'Editado' });

    expect(res.status).toBe(200);
    expect(res.body.data.nombre).toBe('Editado');
  });

  test('DELETE /api/clientes/:id responde 204', async () => {
    const create = await agent
      .post('/api/clientes')
      .send({ nombre: 'Del', apellido: 'Me', dni: 55555555 });
    const id = create.body.data.codigoPersona;

    const res = await agent.delete(`/api/clientes/${id}`);

    expect(res.status).toBe(204);
  });

  test('DELETE /api/clientes/:id elimina también sus vehículos (204)', async () => {
    const ids = await createBaseFixtures();
    const create = await agent
      .post('/api/clientes')
      .send({ nombre: 'ConVeh', apellido: 'Test', dni: 66666666 });
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
      .send({ nombre: 'ConLavado', apellido: 'Test', dni: 77777777 });
    const clienteId = create.body.data.codigoPersona;

    const vehiculo = await Vehiculo.create({
      patenteVehi: 'YY888YY',
      estadoVehi: true,
      cliente: clienteId,
      modeloVehi: ids.modeloVehiculoId,
    });
    await Lavado.create({
      fechaHoraLavado: new Date(),
      estadoLavado: 'activo',
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
});
