const request = require('supertest');
const app = require('../app');
const {
  sequelize,
  Vehiculo,
  Lavado,
  CategoriaLavado,
  EstadoLavado,
  Usuario,
  Login,
} = require('../models');
const { hashPassword } = require('../utils/password');
const { ensureLavadoCatalogs } = require('../services/catalogSeedService');
const { createBaseFixtures, removeBaseFixtures, suffix } = require('./helpers/fixtures');
const { loginAgent, removeTestUser } = require('./helpers/auth');

let ids;
let vehiculoId;
let agent;
let authUser;
let estadoEnEsperaId;
let estadoLavandoId;
let estadoTerminadoId;
let estadoEntregadoId;
const createdLavados = [];
const createdCategoriasLavado = [];
const vehiculosExtra = [];

beforeAll(async () => {
  await sequelize.authenticate();
  ids = await createBaseFixtures();
  await ensureLavadoCatalogs();
  estadoEnEsperaId = (
    await EstadoLavado.findOne({ where: { descripcionEstado: 'En Espera' } })
  ).codigoEstado;
  estadoLavandoId = (
    await EstadoLavado.findOne({ where: { descripcionEstado: 'Lavando' } })
  ).codigoEstado;
  estadoTerminadoId = (
    await EstadoLavado.findOne({ where: { descripcionEstado: 'Terminado' } })
  ).codigoEstado;
  estadoEntregadoId = (
    await EstadoLavado.findOne({ where: { descripcionEstado: 'Entregado' } })
  ).codigoEstado;
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
  while (vehiculosExtra.length) {
    const id = vehiculosExtra.pop();
    await Lavado.destroy({ where: { vehi: id } });
    await Vehiculo.destroy({ where: { codigoVehi: id } });
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
      estado: estadoEnEsperaId,
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
      estado: estadoEnEsperaId,
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
      estado: estadoEnEsperaId,
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
      estado: estadoEnEsperaId,
      utileria: ids.utileriaId,
      vehi: vehiculoId,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });
    createdLavados.push(create.body.data.codigoLavado);

    const res = await agent.get(`/api/lavados?estado=${estadoEnEsperaId}`);

    expect(res.status).toBe(200);
    expect(
      res.body.data.every((lavado) => String(lavado.estado) === String(estadoEnEsperaId)),
    ).toBe(true);
  });

  test('GET /api/lavados?vehi=<codigo> filtra por vehículo (200)', async () => {
    const create = await agent.post('/api/lavados').send({
      estado: estadoEnEsperaId,
      utileria: ids.utileriaId,
      vehi: vehiculoId,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });
    createdLavados.push(create.body.data.codigoLavado);

    const res = await agent.get(`/api/lavados?vehi=${vehiculoId}`);

    expect(res.status).toBe(200);
    expect(res.body.data.every((lavado) => String(lavado.vehi) === String(vehiculoId))).toBe(true);
  });

  test('GET /api/lavados/:id inexistente responde 404', async () => {
    const res = await agent.get('/api/lavados/999999999');

    expect(res.status).toBe(404);
  });

  test('PUT /api/lavados/:id actualiza el estado (200)', async () => {
    const create = await agent.post('/api/lavados').send({
      fechaHoraLavado: new Date().toISOString(),
      estado: estadoEnEsperaId,
      utileria: ids.utileriaId,
      vehi: vehiculoId,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });
    const id = create.body.data.codigoLavado;
    createdLavados.push(id);

    const res = await agent
      .put(`/api/lavados/${id}`)
      .send({ estado: estadoLavandoId });

    expect(res.status).toBe(200);
    expect(String(res.body.data.estado)).toBe(String(estadoLavandoId));
  });

  test('DELETE /api/lavados/:id no está permitido (405) y el lavado permanece', async () => {
    const create = await agent.post('/api/lavados').send({
      fechaHoraLavado: new Date().toISOString(),
      estado: estadoEnEsperaId,
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
      estado: estadoEnEsperaId,
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
      estado: estadoEnEsperaId,
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

    const res = await agent.put(`/api/lavados/${id}`).send({ estado: estadoLavandoId });

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

describe('filtros por fecha de entrega', () => {
  function crearLavado() {
    return Lavado.create({
      estado: estadoEnEsperaId,
      utileria: ids.utileriaId,
      vehi: vehiculoId,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });
  }

  async function fijarEntrega(id, fecha) {
    const lavado = await Lavado.findByPk(id);
    await lavado.update({ fechaHoraLavadoTerminado: new Date(fecha) });
  }

  test('GET /api/lavados?desde&hasta filtra por fecha de entrega (200)', async () => {
    const dentro = await crearLavado();
    const fuera = await crearLavado();
    createdLavados.push(dentro.codigoLavado, fuera.codigoLavado);

    await fijarEntrega(dentro.codigoLavado, '2026-01-15T10:00:00');
    await fijarEntrega(fuera.codigoLavado, '2026-03-20T10:00:00');

    const res = await agent.get(
      `/api/lavados?vehi=${vehiculoId}&desde=2026-01-01&hasta=2026-01-31`,
    );

    expect(res.status).toBe(200);
    const codigos = res.body.data.map((lavado) => lavado.codigoLavado);
    expect(codigos).toContain(dentro.codigoLavado);
    expect(codigos).not.toContain(fuera.codigoLavado);
  });

  test('GET /api/lavados con fecha invalida responde 400', async () => {
    const res = await agent.get('/api/lavados?desde=no-es-fecha');

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('un solo lavado activo por vehiculo', () => {
  function crearLavado(extra = {}, vehiculo = vehiculoId) {
    return agent.post('/api/lavados').send({
      estado: estadoEnEsperaId,
      utileria: ids.utileriaId,
      vehi: vehiculo,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
      ...extra,
    });
  }

  async function contarActivos(vehiculo = vehiculoId) {
    return Lavado.count({ where: { vehi: vehiculo, estado: estadoEnEsperaId } });
  }

  async function crearVehiculoExtra() {
    const vehiculo = await Vehiculo.create({
      patenteVehi: `V${suffix()}`,
      estadoVehi: true,
      cliente: ids.clienteId,
      modeloVehi: ids.modeloVehiculoId,
    });
    vehiculosExtra.push(vehiculo.codigoVehi);
    return vehiculo;
  }

  test('el alta normal crea un lavado activo (201)', async () => {
    const res = await crearLavado();
    createdLavados.push(res.body.data.codigoLavado);

    expect(res.status).toBe(201);
    expect(await contarActivos()).toBe(1);
  });

  test('la segunda alta sobre el mismo vehiculo responde 409', async () => {
    const primera = await crearLavado();
    createdLavados.push(primera.body.data.codigoLavado);

    const segunda = await crearLavado();

    expect(primera.status).toBe(201);
    expect(segunda.status).toBe(409);
    expect(await contarActivos()).toBe(1);
  });

  test('dos altas simultaneas dejan un solo lavado activo', async () => {
    const [a, b] = await Promise.all([crearLavado(), crearLavado()]);

    [a, b]
      .filter((res) => res.status === 201)
      .forEach((res) => createdLavados.push(res.body.data.codigoLavado));

    expect([a.status, b.status].sort()).toEqual([201, 409]);
    expect(await contarActivos()).toBe(1);
  });

  test('actualizar a un vehiculo con lavado activo responde 409', async () => {
    const primera = await crearLavado();
    createdLavados.push(primera.body.data.codigoLavado);

    const vehiculoB = await crearVehiculoExtra();
    const segunda = await crearLavado({}, vehiculoB.codigoVehi);
    createdLavados.push(segunda.body.data.codigoLavado);

    const res = await agent
      .put(`/api/lavados/${segunda.body.data.codigoLavado}`)
      .send({ vehi: vehiculoId });

    expect(res.status).toBe(409);
    const enDb = await Lavado.findByPk(segunda.body.data.codigoLavado);
    expect(String(enDb.vehi)).toBe(String(vehiculoB.codigoVehi));

    await Lavado.destroy({ where: { vehi: vehiculoB.codigoVehi } });
    await Vehiculo.destroy({ where: { codigoVehi: vehiculoB.codigoVehi } });
  });

  test('cambiar el estado del mismo lavado activo responde 200', async () => {
    const creada = await crearLavado();
    const id = creada.body.data.codigoLavado;
    createdLavados.push(id);

    const res = await agent.put(`/api/lavados/${id}`).send({ estado: estadoLavandoId });

    expect(res.status).toBe(200);
    expect(String(res.body.data.estado)).toBe(String(estadoLavandoId));
  });

  test('un lavado entregado puede quedar en un vehiculo con lavado activo (200)', async () => {
    const primera = await crearLavado();
    createdLavados.push(primera.body.data.codigoLavado);

    const vehiculoB = await crearVehiculoExtra();
    const segunda = await Lavado.create({
      estado: estadoEntregadoId,
      utileria: ids.utileriaId,
      vehi: vehiculoB.codigoVehi,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
    });
    createdLavados.push(segunda.codigoLavado);

    const res = await agent
      .put(`/api/lavados/${segunda.codigoLavado}`)
      .send({ vehi: vehiculoId });

    expect(res.status).toBe(200);
    expect(String(res.body.data.vehi)).toBe(String(vehiculoId));
  });
});

describe('transiciones de estado y login de la sesion', () => {
  function crearLavado(extra = {}) {
    return agent.post('/api/lavados').send({
      estado: estadoEnEsperaId,
      utileria: ids.utileriaId,
      vehi: vehiculoId,
      categoriaLavado: ids.categoriaLavadoId,
      login: ids.loginId,
      ...extra,
    });
  }

  async function crearYRegistrar(extra = {}) {
    const res = await crearLavado(extra);
    if (res.status === 201) {
      createdLavados.push(res.body.data.codigoLavado);
    }
    return res;
  }

  function cambiarEstado(id, estado) {
    return agent.put(`/api/lavados/${id}`).send({ estado });
  }

  test('el alta acepta En Espera, Lavando y Terminado (201)', async () => {
    for (const estado of [estadoEnEsperaId, estadoLavandoId, estadoTerminadoId]) {
      const res = await crearLavado({ estado });
      expect(res.status).toBe(201);
      await Lavado.destroy({ where: { codigoLavado: res.body.data.codigoLavado } });
    }
  });

  test('el alta con Entregado responde 400', async () => {
    const res = await crearLavado({ estado: estadoEntregadoId });

    expect(res.status).toBe(400);
  });

  test('permite el avance completo y el mismo estado (200)', async () => {
    const creada = await crearYRegistrar();
    const id = creada.body.data.codigoLavado;

    expect((await cambiarEstado(id, estadoLavandoId)).status).toBe(200);
    expect((await cambiarEstado(id, estadoTerminadoId)).status).toBe(200);
    expect((await cambiarEstado(id, estadoEntregadoId)).status).toBe(200);
    expect((await cambiarEstado(id, estadoEntregadoId)).status).toBe(200);
  });

  test('permite el retroceso de un paso (200)', async () => {
    const creada = await crearYRegistrar();
    const id = creada.body.data.codigoLavado;

    await cambiarEstado(id, estadoLavandoId);
    expect((await cambiarEstado(id, estadoEnEsperaId)).status).toBe(200);
    await cambiarEstado(id, estadoLavandoId);
    await cambiarEstado(id, estadoTerminadoId);
    expect((await cambiarEstado(id, estadoLavandoId)).status).toBe(200);
  });

  test('rechaza transiciones invalidas (409)', async () => {
    const creada = await crearYRegistrar();
    const id = creada.body.data.codigoLavado;

    expect((await cambiarEstado(id, estadoTerminadoId)).status).toBe(409);
    expect((await cambiarEstado(id, estadoEntregadoId)).status).toBe(409);

    await cambiarEstado(id, estadoLavandoId);
    expect((await cambiarEstado(id, estadoEntregadoId)).status).toBe(409);
  });

  test('Entregado es terminal (409 al volver a Terminado)', async () => {
    const creada = await crearYRegistrar();
    const id = creada.body.data.codigoLavado;

    await cambiarEstado(id, estadoLavandoId);
    await cambiarEstado(id, estadoTerminadoId);
    await cambiarEstado(id, estadoEntregadoId);

    const res = await cambiarEstado(id, estadoTerminadoId);

    expect(res.status).toBe(409);
    const enDb = await Lavado.findByPk(id);
    expect(String(enDb.estado)).toBe(String(estadoEntregadoId));
  });

  test('usa el login de la sesion e ignora el de otra sesion', async () => {
    const otroNombre = `otro-${suffix()}`;
    const otroUsuario = await Usuario.create({
      nombreUsuario: otroNombre,
      'contraseña': hashPassword('otra-clave'),
    });
    const otroAgent = request.agent(app);
    const otroLogin = await otroAgent
      .post('/api/auth/login')
      .send({ usuario: otroNombre, contrasena: 'otra-clave' });
    const loginAjeno = otroLogin.body.data.codigoLogin;

    const sesion = await agent.get('/api/auth/session');
    const loginPropio = sesion.body.data.codigoLogin;

    const res = await crearYRegistrar({ login: loginAjeno });

    expect(res.status).toBe(201);
    expect(String(res.body.data.login)).toBe(String(loginPropio));

    await Login.destroy({ where: { codigoLogin: loginAjeno } });
    await Usuario.destroy({ where: { codigoUsuario: otroUsuario.codigoUsuario } });
  });

  test('la actualizacion ignora el login del cuerpo', async () => {
    const creada = await crearYRegistrar();
    const id = creada.body.data.codigoLavado;
    const original = creada.body.data.login;

    const res = await agent
      .put(`/api/lavados/${id}`)
      .send({ login: 999999, detallesLavado: 'sin cambio de login' });

    expect(res.status).toBe(200);
    expect(String(res.body.data.login)).toBe(String(original));
  });
});
