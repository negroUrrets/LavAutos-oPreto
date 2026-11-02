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
const { createCrudService, pickFields } = require('./crudService');
const { assertSinLavadoActivo } = require('./lavadoActivoService');
const { requireFields, assertExists } = require('../utils/validators');
const { normalizarPatente, clavePatente } = require('../utils/normalizers');
const AppError = require('../utils/AppError');

const FIELDS = ['patenteVehi', 'estadoVehi', 'cliente', 'modeloVehi'];
const PATENTE_DUPLICADA = 'La patente ya esta registrada.';

function esErrorUnico(error) {
  return Boolean(error) && error.name === 'SequelizeUniqueConstraintError';
}

function whereClavePatente(clave) {
  return sequelize.where(
    sequelize.fn(
      'UPPER',
      sequelize.fn(
        'REPLACE',
        sequelize.fn('REPLACE', sequelize.col('patenteVehi'), '-', ''),
        ' ',
        '',
      ),
    ),
    clave,
  );
}

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

async function validarCreacion(data, transaction) {
  requireFields(data, ['patenteVehi', 'estadoVehi', 'cliente', 'modeloVehi']);
  await assertExists(Cliente, data.cliente, 'El cliente no existe.', transaction);
  await assertExists(
    ModeloVehiculo,
    data.modeloVehi,
    'El modelo de vehiculo no existe.',
    transaction,
  );
}

async function validarActualizacion(data) {
  if (data.cliente !== undefined) {
    await assertExists(Cliente, data.cliente, 'El cliente no existe.');
  }
  if (data.modeloVehi !== undefined) {
    await assertExists(ModeloVehiculo, data.modeloVehi, 'El modelo de vehiculo no existe.');
  }
}

const baseVehiculoService = createCrudService({
  model: Vehiculo,
  name: 'Vehiculo',
  fields: FIELDS,
  include,
  buildListOptions: (query) => {
    const where = { estadoVehi: true };
    if (query.cliente) {
      where.cliente = query.cliente;
    }
    return { where };
  },
  validateCreate: validarCreacion,
  validateUpdate: validarActualizacion,
});

async function crearEnTransaccion(payload, transaction) {
  const data = {
    ...pickFields(payload, FIELDS),
    patenteVehi: normalizarPatente(payload.patenteVehi),
  };
  await validarCreacion(data, transaction);
  const clave = clavePatente(data.patenteVehi);

  const existente = await Vehiculo.findOne({
    where: whereClavePatente(clave),
    transaction,
  });

  if (existente) {
    if (existente.estadoVehi) {
      throw new AppError(PATENTE_DUPLICADA, 409);
    }

    await existente.update(
      {
        patenteVehi: data.patenteVehi,
        estadoVehi: true,
        cliente: data.cliente,
        modeloVehi: data.modeloVehi,
      },
      { transaction },
    );

    return Vehiculo.findByPk(existente.codigoVehi, { include, transaction });
  }

  return Vehiculo.create(data, { transaction });
}

async function create(payload) {
  try {
    return await sequelize.transaction((transaction) =>
      crearEnTransaccion(payload, transaction),
    );
  } catch (error) {
    if (esErrorUnico(error)) {
      throw new AppError(PATENTE_DUPLICADA, 409);
    }
    throw error;
  }
}

async function update(id, payload) {
  const vehiculo = await Vehiculo.findByPk(id);
  if (!vehiculo) {
    throw new AppError('Vehiculo no encontrado.', 404);
  }

  await assertSinLavadoActivo([id]);

  const data = pickFields(payload, FIELDS);
  if (data.patenteVehi !== undefined) {
    data.patenteVehi = normalizarPatente(data.patenteVehi);
    if (!data.patenteVehi) {
      throw new AppError('La patente es obligatoria.', 400);
    }
    await validarActualizacion(data);

    const existente = await Vehiculo.findOne({
      where: whereClavePatente(clavePatente(data.patenteVehi)),
    });
    if (existente && String(existente.codigoVehi) !== String(id)) {
      throw new AppError(PATENTE_DUPLICADA, 409);
    }
  }

  try {
    return await baseVehiculoService.update(id, data);
  } catch (error) {
    if (esErrorUnico(error)) {
      throw new AppError(PATENTE_DUPLICADA, 409);
    }
    throw error;
  }
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

module.exports = {
  ...baseVehiculoService,
  create,
  update,
  remove,
  crearEnTransaccion,
  PATENTE_DUPLICADA,
};
