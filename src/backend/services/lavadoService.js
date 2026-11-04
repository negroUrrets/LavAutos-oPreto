const { Op } = require('sequelize');
const {
  sequelize,
  Persona,
  Cliente,
  CategoriaLavado,
  EstadoLavado,
  Utileria,
  MarcaVehiculo,
  ModeloVehiculo,
  Vehiculo,
  Lavado,
  Login,
} = require('../models');
const { createCrudService, pickFields } = require('./crudService');
const { esEstadoBloqueante, assertSinLavadoActivo } = require('./lavadoActivoService');
const {
  assertEstadoInicialPermitido,
  assertTransicionPermitida,
} = require('./lavadoEstadoService');
const { requireFields, assertExists } = require('../utils/validators');
const AppError = require('../utils/AppError');

const FECHA_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const CREATE_FIELDS = ['estado', 'vehi', 'categoriaLavado', 'login', 'detallesLavado'];
const UPDATE_FIELDS = ['estado', 'vehi', 'categoriaLavado', 'detallesLavado'];

function parseFecha(valor, finDelDia = false) {
  if (!FECHA_PATTERN.test(String(valor))) {
    throw new AppError('La fecha debe tener formato YYYY-MM-DD.', 400);
  }
  const hora = finDelDia ? '23:59:59.999' : '00:00:00.000';
  const fecha = new Date(`${valor}T${hora}`);
  if (Number.isNaN(fecha.getTime())) {
    throw new AppError('La fecha no es valida.', 400);
  }
  return fecha;
}

const include = [
  {
    model: Vehiculo,
    as: 'vehiculo',
    include: [
      { model: Cliente, as: 'datosCliente', include: [{ model: Persona, as: 'persona' }] },
      {
        model: ModeloVehiculo,
        as: 'modelo',
        include: [{ model: MarcaVehiculo, as: 'marca' }],
      },
    ],
  },
  { model: CategoriaLavado, as: 'categoria' },
  { model: EstadoLavado, as: 'datosEstado' },
  { model: Utileria, as: 'utilerias', through: { attributes: [] } },
];

async function validarCreacion(data) {
  requireFields(data, ['estado', 'vehi', 'categoriaLavado', 'login']);
  await assertExists(Vehiculo, data.vehi, 'El vehiculo no existe.');
  await assertExists(
    CategoriaLavado,
    data.categoriaLavado,
    'La categoria de lavado no existe.',
  );
  await assertExists(Login, data.login, 'El login no existe.');
  await assertExists(EstadoLavado, data.estado, 'El estado no existe.');
}

function normalizarUtilerias(valor) {
  if (!Array.isArray(valor)) {
    throw new AppError('Las utilerias deben ser un arreglo.', 400);
  }

  const ids = [...new Set(valor.map((id) => String(id)).filter((id) => id !== ''))];

  if (ids.length === 0) {
    throw new AppError('Seleccione al menos una utileria.', 400);
  }

  return ids;
}

async function assertUtilidadesExisten(ids, transaction) {
  const filas = await Utileria.findAll({
    where: { codigoUtileria: { [Op.in]: ids } },
    attributes: ['codigoUtileria'],
    transaction,
  });

  if (filas.length !== ids.length) {
    throw new AppError('La utileria no existe.', 400);
  }

  return ids;
}

async function validarActualizacion(data) {
  if (data.vehi !== undefined) {
    await assertExists(Vehiculo, data.vehi, 'El vehiculo no existe.');
  }
  if (data.categoriaLavado !== undefined) {
    await assertExists(
      CategoriaLavado,
      data.categoriaLavado,
      'La categoria de lavado no existe.',
    );
  }
  if (data.login !== undefined) {
    await assertExists(Login, data.login, 'El login no existe.');
  }
  if (data.estado !== undefined) {
    await assertExists(EstadoLavado, data.estado, 'El estado no existe.');
  }
}

const baseLavadoService = createCrudService({
  model: Lavado,
  name: 'Lavado',
  fields: CREATE_FIELDS,
  include,
  buildListOptions: (query) => {
    const where = {};
    if (query.estado) {
      where.estado = query.estado;
    }
    if (query.vehi) {
      where.vehi = query.vehi;
    }
    if (query.desde || query.hasta) {
      where.fechaHoraLavadoTerminado = {};
      if (query.desde) {
        where.fechaHoraLavadoTerminado[Op.gte] = parseFecha(query.desde);
      }
      if (query.hasta) {
        where.fechaHoraLavadoTerminado[Op.lte] = parseFecha(query.hasta, true);
      }
    }
    return { where };
  },
  validateCreate: validarCreacion,
  validateUpdate: validarActualizacion,
});

async function bloquearVehiculos(vehiculoIds, transaction) {
  const ids = [...new Set((vehiculoIds ?? []).filter((id) => id !== undefined && id !== null))]
    .sort((a, b) => Number(a) - Number(b));

  for (const vehi of ids) {
    await sequelize.query(
      'SELECT codigoVehi FROM dbo.Vehiculo WITH (UPDLOCK, ROWLOCK) WHERE codigoVehi = :vehi',
      { replacements: { vehi }, transaction },
    );
  }
}

async function create(payload) {
  const data = pickFields(payload, CREATE_FIELDS);
  const utilerias = normalizarUtilerias(payload.utilerias);
  await validarCreacion(data);

  return sequelize.transaction(async (transaction) => {
    const ids = await assertUtilidadesExisten(utilerias, transaction);
    await bloquearVehiculos([data.vehi], transaction);
    await assertEstadoInicialPermitido(data.estado, transaction);

    if (await esEstadoBloqueante(data.estado, transaction)) {
      await assertSinLavadoActivo([data.vehi], transaction);
    }

    const lavado = await Lavado.create(data, { transaction });
    await lavado.setUtilerias(ids, { transaction });

    return Lavado.findByPk(lavado.codigoLavado, { include, transaction });
  });
}

async function update(id, payload) {
  const data = pickFields(payload, UPDATE_FIELDS);
  const utilerias =
    payload.utilerias === undefined ? null : normalizarUtilerias(payload.utilerias);
  await validarActualizacion(data);

  return sequelize.transaction(async (transaction) => {
    const lavado = await Lavado.findByPk(id, { transaction });
    if (!lavado) {
      throw new AppError('Lavado no encontrado.', 404);
    }

    if (data.estado !== undefined) {
      await assertTransicionPermitida(lavado.estado, data.estado, transaction);
    }

    const vehiFinal = data.vehi ?? lavado.vehi;
    const estadoFinal = data.estado ?? lavado.estado;

    await bloquearVehiculos([lavado.vehi, vehiFinal], transaction);

    if (await esEstadoBloqueante(estadoFinal, transaction)) {
      await assertSinLavadoActivo([vehiFinal], transaction, { excluirLavadoId: id });
    }

    await lavado.update(data, { transaction });

    if (utilerias) {
      const ids = await assertUtilidadesExisten(utilerias, transaction);
      await lavado.setUtilerias(ids, { transaction });
    }

    return Lavado.findByPk(id, { include, transaction });
  });
}

module.exports = { ...baseLavadoService, create, update };
