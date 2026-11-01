const {
  sequelize,
  Persona,
  Cliente,
  CategoriaVehiculo,
  MarcaVehiculo,
  ModeloVehiculo,
  Vehiculo,
  Lavado,
} = require('../models');
const { createCrudService } = require('./crudService');
const { assertSinLavadoActivo } = require('./lavadoActivoService');
const { requireFields, assertExists } = require('../utils/validators');
const AppError = require('../utils/AppError');

const include = [
  { model: Cliente, as: 'datosCliente', include: [{ model: Persona, as: 'persona' }] },
  {
    model: ModeloVehiculo,
    as: 'modelo',
    include: [
      {
        model: MarcaVehiculo,
        as: 'marca',
        include: [{ model: CategoriaVehiculo, as: 'categoria' }],
      },
    ],
  },
];

const baseVehiculoService = createCrudService({
  model: Vehiculo,
  name: 'Vehiculo',
  fields: ['patenteVehi', 'estadoVehi', 'cliente', 'modeloVehi'],
  include,
  buildListOptions: (query) => {
    const where = { estadoVehi: true };
    if (query.cliente) {
      where.cliente = query.cliente;
    }
    return { where };
  },
  validateCreate: async (payload) => {
    requireFields(payload, ['patenteVehi', 'estadoVehi', 'cliente', 'modeloVehi']);
    await assertExists(Cliente, payload.cliente, 'El cliente no existe.');
    await assertExists(ModeloVehiculo, payload.modeloVehi, 'El modelo de vehiculo no existe.');
  },
  validateUpdate: async (payload) => {
    if (payload.cliente !== undefined) {
      await assertExists(Cliente, payload.cliente, 'El cliente no existe.');
    }
    if (payload.modeloVehi !== undefined) {
      await assertExists(ModeloVehiculo, payload.modeloVehi, 'El modelo de vehiculo no existe.');
    }
  },
});

async function update(id, payload) {
  const vehiculo = await Vehiculo.findByPk(id);
  if (!vehiculo) {
    throw new AppError('Vehiculo no encontrado.', 404);
  }

  await assertSinLavadoActivo([id]);
  return baseVehiculoService.update(id, payload);
}

async function remove(id) {
  return sequelize.transaction(async (transaction) => {
    const vehiculo = await Vehiculo.findByPk(id, { transaction });
    if (!vehiculo) {
      throw new AppError('Vehiculo no encontrado.', 404);
    }

    await assertSinLavadoActivo([id], transaction);

    const lavados = await Lavado.count({ where: { vehi: id }, transaction });

    if (lavados > 0) {
      await vehiculo.update({ estadoVehi: false }, { transaction });
      return;
    }

    await vehiculo.destroy({ transaction });
  });
}

module.exports = { ...baseVehiculoService, update, remove };
