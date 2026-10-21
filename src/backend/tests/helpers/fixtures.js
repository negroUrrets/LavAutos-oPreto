const {
  Persona,
  Cliente,
  CategoriaVehiculo,
  MarcaVehiculo,
  ModeloVehiculo,
  CategoriaLavado,
  Usuario,
  Login,
} = require('../../models');

function suffix() {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

async function createBaseFixtures() {
  const tag = suffix();

  const categoria = await CategoriaVehiculo.create({ categoriaVehi: `Categoria ${tag}` });
  const marca = await MarcaVehiculo.create({
    marcaVehi: `Marca ${tag}`,
    categoriaVehi: categoria.codigoCategoriaVehi,
  });
  const modelo = await ModeloVehiculo.create({
    modeloVehi: `Modelo ${tag}`,
    marcaVehi: marca.codigoMarcaVehi,
  });
  const categoriaLavado = await CategoriaLavado.create({ descripcionLavado: `Lavado ${tag}` });

  const persona = await Persona.create({
    nombre: 'Ana',
    apellido: 'Perez',
    dni: 12345678,
    email: `ana-${tag}@example.com`,
    celular: 5551234,
  });
  await Cliente.create({ codigoPersona: persona.codigoPersona, estadoCliente: true });

  const usuario = await Usuario.create({ nombreUsuario: `admin-${tag}`, 'contraseña': 'hash' });
  const login = await Login.create({ usuario: usuario.codigoUsuario });

  return {
    tag,
    categoriaVehiculoId: categoria.codigoCategoriaVehi,
    marcaVehiculoId: marca.codigoMarcaVehi,
    modeloVehiculoId: modelo.codigoModeloVehi,
    categoriaLavadoId: categoriaLavado.codigoCategoriaLavado,
    clienteId: persona.codigoPersona,
    usuarioId: usuario.codigoUsuario,
    loginId: login.codigoLogin,
  };
}

async function removeBaseFixtures(ids) {
  if (!ids) {
    return;
  }

  await Login.destroy({ where: { codigoLogin: ids.loginId } });
  await Usuario.destroy({ where: { codigoUsuario: ids.usuarioId } });
  await CategoriaLavado.destroy({
    where: { codigoCategoriaLavado: ids.categoriaLavadoId },
  });
  await ModeloVehiculo.destroy({ where: { codigoModeloVehi: ids.modeloVehiculoId } });
  await MarcaVehiculo.destroy({ where: { codigoMarcaVehi: ids.marcaVehiculoId } });
  await CategoriaVehiculo.destroy({
    where: { codigoCategoriaVehi: ids.categoriaVehiculoId },
  });
  await Cliente.destroy({ where: { codigoPersona: ids.clienteId } });
  await Persona.destroy({ where: { codigoPersona: ids.clienteId } });
}

module.exports = { createBaseFixtures, removeBaseFixtures, suffix };
