const { sequelize, CategoriaLavado, EstadoLavado, Utileria } = require('../models');
const {
  ensureLavadoCatalogs,
  CATEGORIAS,
  ESTADOS,
  UTILERIAS,
} = require('../services/catalogSeedService');

beforeAll(async () => {
  await sequelize.authenticate();
});

afterAll(async () => {
  await sequelize.close();
});

describe('seed de catalogos de lavado', () => {
  test('crea los catalogos base si faltan', async () => {
    await ensureLavadoCatalogs();

    expect(await CategoriaLavado.count()).toBeGreaterThanOrEqual(CATEGORIAS.length);
    expect(await EstadoLavado.count()).toBeGreaterThanOrEqual(ESTADOS.length);
    expect(await Utileria.count()).toBeGreaterThanOrEqual(UTILERIAS.length);
  });

  test('es idempotente', async () => {
    const created = await ensureLavadoCatalogs();

    expect(created).toBe(0);
  });
});
