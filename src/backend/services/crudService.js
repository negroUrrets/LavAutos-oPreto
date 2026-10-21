const AppError = require('../utils/AppError');

function pickFields(payload, fields) {
  if (!fields) {
    return payload;
  }

  return fields.reduce((acc, field) => {
    if (payload[field] !== undefined) {
      acc[field] = payload[field];
    }
    return acc;
  }, {});
}

function createCrudService({
  model,
  name,
  fields,
  validateCreate,
  validateUpdate,
  buildListOptions,
  include,
}) {
  const baseOptions = () => (include ? { include } : {});

  async function list(query = {}) {
    const listOptions = { ...baseOptions(), ...(buildListOptions ? buildListOptions(query) : {}) };
    return model.findAll(listOptions);
  }

  async function getById(id) {
    const record = await model.findByPk(id, baseOptions());
    if (!record) {
      throw new AppError(`${name} no encontrado.`, 404);
    }
    return record;
  }

  async function create(payload) {
    const data = pickFields(payload, fields);
    if (validateCreate) {
      await validateCreate(data);
    }
    return model.create(data);
  }

  async function update(id, payload) {
    const record = await getById(id);
    const data = pickFields(payload, fields);
    if (validateUpdate) {
      await validateUpdate(data);
    }
    await record.update(data);
    return record;
  }

  async function remove(id) {
    const record = await getById(id);
    await record.destroy();
  }

  return { list, getById, create, update, remove };
}

module.exports = { createCrudService, pickFields };
