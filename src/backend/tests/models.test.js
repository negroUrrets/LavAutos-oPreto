const { sequelize, Persona, Cliente, Usuario, Vehiculo, Lavado } = require('../models');
const { createBaseFixtures, removeBaseFixtures } = require('./helpers/fixtures');

beforeAll(async () => {
  await sequelize.authenticate();
});

afterAll(async () => {
  await sequelize.close();
});

describe('modelos Sequelize', () => {
  test('mapea tabla y columnas de Persona', async () => {
    const persona = await Persona.create({
      nombre: 'Luis',
      apellido: 'Gomez',
      dni: 111,
      email: null,
      celular: null,
    });

    expect(Persona.tableName).toBe('Persona');
    expect(persona.codigoPersona).toBeDefined();
    expect(persona.get('nombre')).toBe('Luis');

    await persona.destroy();
  });

  test('mapea la columna [contraseña] de Usuario', async () => {
    const usuario = await Usuario.create({ nombreUsuario: `u-${Date.now()}`, 'contraseña': 'hash' });
    const fetched = await Usuario.findByPk(usuario.codigoUsuario);

    expect(fetched.get('contraseña')).toBe('hash');

    await usuario.destroy();
  });

  test('navega Lavado -> Vehiculo -> Cliente y Cliente -> Persona', async () => {
    const ids = await createBaseFixtures();
    let vehiculo;
    let lavado;

    try {
      vehiculo = await Vehiculo.create({
        patenteVehi: 'AA123BB',
        estadoVehi: true,
        cliente: ids.clienteId,
        modeloVehi: ids.modeloVehiculoId,
      });

      lavado = await Lavado.create({
        fechaHoraLavado: new Date(),
        estadoLavado: 'activo',
        vehi: vehiculo.codigoVehi,
        categoriaLavado: ids.categoriaLavadoId,
        login: ids.loginId,
      });

      const found = await Lavado.findByPk(lavado.codigoLavado, {
        include: [
          {
            model: Vehiculo,
            as: 'vehiculo',
            include: [
              { model: Cliente, as: 'datosCliente', include: [{ model: Persona, as: 'persona' }] },
            ],
          },
        ],
      });

      expect(found.vehiculo.datosCliente.persona.nombre).toBe('Ana');

      const cliente = await Cliente.findByPk(ids.clienteId, {
        include: [{ model: Persona, as: 'persona' }],
      });
      expect(cliente.persona.nombre).toBe('Ana');
    } finally {
      if (lavado) {
        await lavado.destroy();
      }
      if (vehiculo) {
        await vehiculo.destroy();
      }
      await removeBaseFixtures(ids);
    }
  });

  test('Lavado no declara asociación directa hacia Cliente', () => {
    const targets = Object.values(Lavado.associations).map((assoc) => assoc.target.name);
    const aliases = Object.keys(Lavado.associations);

    expect(targets).not.toContain('Cliente');
    expect(aliases).toEqual(expect.arrayContaining(['vehiculo', 'categoria', 'datosLogin']));
  });
});
