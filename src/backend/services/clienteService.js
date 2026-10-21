const { Op } = require('sequelize');
const { sequelize, Persona, Cliente, Vehiculo, Lavado } = require('../models');
const AppError = require('../utils/AppError');
const { requireFields } = require('../utils/validators');

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

  const clientes = await Cliente.findAll({
    where: { estadoCliente: true },
    include: [personaInclude],
  });
  return clientes.map(toClienteResponse);
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
