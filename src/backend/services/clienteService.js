const { Op } = require('sequelize');
const { sequelize, Persona, Cliente, Vehiculo, Lavado } = require('../models');
const AppError = require('../utils/AppError');
const { requireFields } = require('../utils/validators');
const { normalizarDni } = require('../utils/normalizers');
const { assertSinLavadoActivo } = require('./lavadoActivoService');
const {
  crearEnTransaccion: crearVehiculoEnTransaccion,
  PATENTE_DUPLICADA,
} = require('./vehiculoService');

const FECHA_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DNI_DUPLICADO = 'El DNI ya esta registrado.';

function esErrorUnico(error) {
  return Boolean(error) && error.name === 'SequelizeUniqueConstraintError';
}

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

function toVehiculoResponse(vehiculo) {
  const plain = vehiculo.get({ plain: true });

  return {
    codigoVehi: plain.codigoVehi,
    patenteVehi: plain.patenteVehi,
    estadoVehi: plain.estadoVehi,
    cliente: plain.cliente,
    modeloVehi: plain.modeloVehi,
  };
}

function mapearErrorUnico(error) {
  if (!esErrorUnico(error)) {
    return null;
  }

  const detalle = [
    error.parent?.constraint,
    error.parent?.message,
    error.original?.constraint,
    error.message,
    ...(Array.isArray(error.fields) ? error.fields : []),
    ...(error.fields && !Array.isArray(error.fields) ? Object.keys(error.fields) : []),
  ]
    .filter(Boolean)
    .join(' ');

  return /patente/i.test(detalle)
    ? new AppError(PATENTE_DUPLICADA, 409)
    : new AppError(DNI_DUPLICADO, 409);
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
  const dni = normalizarDni(payload.dni);
  const estadoCliente = payload.estadoCliente === undefined ? true : payload.estadoCliente;
  const vehiculo = payload.vehiculo;

  try {
    return await sequelize.transaction(async (transaction) => {
      const existente = await Persona.findOne({
        where: { dni },
        include: [{ model: Cliente, as: 'cliente' }],
        transaction,
      });

      let codigoPersona;

      if (existente) {
        const clienteExistente = existente.cliente;

        if (!clienteExistente || clienteExistente.estadoCliente) {
          throw new AppError(DNI_DUPLICADO, 409);
        }

        await existente.update(
          {
            nombre: payload.nombre,
            apellido: payload.apellido,
            dni,
            email: payload.email ?? null,
            celular: payload.celular ?? null,
          },
          { transaction },
        );
        await clienteExistente.update({ estadoCliente: true }, { transaction });
        codigoPersona = existente.codigoPersona;
      } else {
        const persona = await Persona.create(
          {
            nombre: payload.nombre,
            apellido: payload.apellido,
            dni,
            email: payload.email ?? null,
            celular: payload.celular ?? null,
          },
          { transaction },
        );

        await Cliente.create(
          { codigoPersona: persona.codigoPersona, estadoCliente },
          { transaction },
        );
        codigoPersona = persona.codigoPersona;
      }

      const cliente = await Cliente.findByPk(codigoPersona, {
        include: [{ model: Persona, as: 'persona' }],
        transaction,
      });
      const response = toClienteResponse(cliente);

      if (vehiculo) {
        const creado = await crearVehiculoEnTransaccion(
          {
            ...vehiculo,
            cliente: codigoPersona,
            estadoVehi: true,
          },
          transaction,
        );
        response.vehiculo = toVehiculoResponse(creado);
      }

      return response;
    });
  } catch (error) {
    const mapeado = mapearErrorUnico(error);
    if (mapeado) {
      throw mapeado;
    }
    throw error;
  }
}

async function update(id, payload) {
  const dni =
    payload.dni !== undefined && String(payload.dni).trim() !== ''
      ? normalizarDni(payload.dni)
      : undefined;

  try {
    return await sequelize.transaction(async (transaction) => {
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

      if (dni !== undefined) {
        const existente = await Persona.findOne({ where: { dni }, transaction });
        if (existente && String(existente.codigoPersona) !== String(id)) {
          throw new AppError(DNI_DUPLICADO, 409);
        }
      }

      const persona = await Persona.findByPk(id, { transaction });
      await persona.update(
        {
          nombre: payload.nombre ?? persona.nombre,
          apellido: payload.apellido ?? persona.apellido,
          dni: dni ?? persona.dni,
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
  } catch (error) {
    if (esErrorUnico(error)) {
      throw new AppError(DNI_DUPLICADO, 409);
    }
    throw error;
  }
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
