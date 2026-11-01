const { Op } = require('sequelize');
const { sequelize, Persona, Cliente, Vehiculo, Lavado } = require('../models');
const AppError = require('../utils/AppError');
const { requireFields } = require('../utils/validators');
const { assertSinLavadoActivo } = require('./lavadoActivoService');

const FECHA_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function toClienteResponse(cliente) {
  const plain = cliente.get({ plain: true });
  const persona = plain.persona || {};

  return {
    codigoPersona: plain.codigoPersona,
    nombre: persona.nombre,
    apellido: persona.apellido,
    dni: persona.dni,
    email: persona.email,
    celular: persona.celular,
    estadoCliente: plain.estadoCliente,
  };
}

async function list(query = {}) {
  const personaInclude = { model: Persona, as: 'persona' };
  const term = typeof query.buscar === 'string' ? query.buscar.trim() : '';
  const sinLavadosDesde =
    typeof query.sinLavadosDesde === 'string' ? query.sinLavadosDesde.trim() : '';

  if (term) {
    const like = `%${term}%`;
    personaInclude.where = {
      [Op.or]: [
        { nombre: { [Op.like]: like } },
        { apellido: { [Op.like]: like } },
        sequelize.where(sequelize.cast(sequelize.col('persona.dni'), 'NVARCHAR(20)'), {
          [Op.like]: like,
        }),
      ],
    };
    personaInclude.required = true;
  }

  const where = { estadoCliente: true };

  if (sinLavadosDesde) {
    const excluir = await clientesConLavadosDesde(sinLavadosDesde);
    if (excluir.length > 0) {
      where.codigoPersona = { [Op.notIn]: excluir };
    }
  }

  const clientes = await Cliente.findAll({
    where,
    include: [personaInclude],
  });
  return clientes.map(toClienteResponse);
}

async function clientesConLavadosDesde(valor) {
  if (!FECHA_PATTERN.test(valor)) {
    throw new AppError('La fecha debe tener formato YYYY-MM-DD.', 400);
  }
  const limite = new Date(`${valor}T23:59:59.999`);
  if (Number.isNaN(limite.getTime())) {
    throw new AppError('La fecha no es valida.', 400);
  }

  const lavados = await Lavado.findAll({
    where: { fechaHoraLavado: { [Op.gt]: limite } },
    include: [{ model: Vehiculo, as: 'vehiculo', attributes: ['cliente'] }],
  });

  return [...new Set(lavados.map((lavado) => lavado.vehiculo?.cliente).filter(Boolean))];
}

async function getById(id) {
  const cliente = await Cliente.findByPk(id, {
    include: [{ model: Persona, as: 'persona' }],
  });
  if (!cliente) {
    throw new AppError('Cliente no encontrado.', 404);
  }
  return toClienteResponse(cliente);
}

async function create(payload) {
  requireFields(payload, ['nombre', 'apellido', 'dni']);
  const estadoCliente = payload.estadoCliente === undefined ? true : payload.estadoCliente;

  return sequelize.transaction(async (transaction) => {
    const persona = await Persona.create(
      {
        nombre: payload.nombre,
        apellido: payload.apellido,
        dni: payload.dni,
        email: payload.email ?? null,
        celular: payload.celular ?? null,
      },
      { transaction },
    );

    await Cliente.create({ codigoPersona: persona.codigoPersona, estadoCliente }, { transaction });

    const created = await Cliente.findByPk(persona.codigoPersona, {
      include: [{ model: Persona, as: 'persona' }],
      transaction,
    });
    return toClienteResponse(created);
  });
}

async function update(id, payload) {
  return sequelize.transaction(async (transaction) => {
    const cliente = await Cliente.findByPk(id, { transaction });
    if (!cliente) {
      throw new AppError('Cliente no encontrado.', 404);
    }

    const vehiculosDelCliente = await Vehiculo.findAll({
      where: { cliente: id },
      attributes: ['codigoVehi'],
      transaction,
    });
    await assertSinLavadoActivo(
      vehiculosDelCliente.map((vehiculo) => vehiculo.codigoVehi),
      transaction,
    );

    const persona = await Persona.findByPk(id, { transaction });
    await persona.update(
      {
        nombre: payload.nombre ?? persona.nombre,
        apellido: payload.apellido ?? persona.apellido,
        dni: payload.dni ?? persona.dni,
        email: payload.email !== undefined ? payload.email : persona.email,
        celular: payload.celular !== undefined ? payload.celular : persona.celular,
      },
      { transaction },
    );

    if (payload.estadoCliente !== undefined) {
      await cliente.update({ estadoCliente: payload.estadoCliente }, { transaction });
    }

    const updated = await Cliente.findByPk(id, {
      include: [{ model: Persona, as: 'persona' }],
      transaction,
    });
    return toClienteResponse(updated);
  });
}

async function remove(id) {
  return sequelize.transaction(async (transaction) => {
    const cliente = await Cliente.findByPk(id, { transaction });
    if (!cliente) {
      throw new AppError('Cliente no encontrado.', 404);
    }

    const vehiculos = await Vehiculo.findAll({ where: { cliente: id }, transaction });
    const vehiculoIds = vehiculos.map((vehiculo) => vehiculo.codigoVehi);
    await assertSinLavadoActivo(vehiculoIds, transaction);

    const lavados = vehiculoIds.length
      ? await Lavado.count({ where: { vehi: { [Op.in]: vehiculoIds } }, transaction })
      : 0;

    if (lavados > 0) {
      await cliente.update({ estadoCliente: false }, { transaction });
      await Vehiculo.update({ estadoVehi: false }, { where: { cliente: id }, transaction });
      return;
    }

    await Vehiculo.destroy({ where: { cliente: id }, transaction });
    await cliente.destroy({ transaction });
    await Persona.destroy({ where: { codigoPersona: id }, transaction });
  });
}

module.exports = { list, getById, create, update, remove };
