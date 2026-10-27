const { sequelize } = require('../config/database');
const Persona = require('./Persona');
const Cliente = require('./Cliente');
const CategoriaVehiculo = require('./CategoriaVehiculo');
const MarcaVehiculo = require('./MarcaVehiculo');
const ModeloVehiculo = require('./ModeloVehiculo');
const Vehiculo = require('./Vehiculo');
const CategoriaLavado = require('./CategoriaLavado');
const EstadoLavado = require('./EstadoLavado');
const Utileria = require('./Utileria');
const Lavado = require('./Lavado');
const Usuario = require('./Usuario');
const Login = require('./Login');

// Herencia Cliente/Persona (tabla por tipo, clave compartida codigoPersona)
Persona.hasOne(Cliente, { foreignKey: 'codigoPersona', as: 'cliente' });
Cliente.belongsTo(Persona, { foreignKey: 'codigoPersona', as: 'persona' });

// Catalogo y vehiculos
CategoriaVehiculo.hasMany(MarcaVehiculo, { foreignKey: 'categoriaVehi', as: 'marcas' });
MarcaVehiculo.belongsTo(CategoriaVehiculo, { foreignKey: 'categoriaVehi', as: 'categoria' });

MarcaVehiculo.hasMany(ModeloVehiculo, { foreignKey: 'marcaVehi', as: 'modelos' });
ModeloVehiculo.belongsTo(MarcaVehiculo, { foreignKey: 'marcaVehi', as: 'marca' });

Cliente.hasMany(Vehiculo, { foreignKey: 'cliente', as: 'vehiculos' });
Vehiculo.belongsTo(Cliente, { foreignKey: 'cliente', as: 'datosCliente' });

ModeloVehiculo.hasMany(Vehiculo, { foreignKey: 'modeloVehi', as: 'vehiculos' });
Vehiculo.belongsTo(ModeloVehiculo, { foreignKey: 'modeloVehi', as: 'modelo' });

// Lavados
Vehiculo.hasMany(Lavado, { foreignKey: 'vehi', as: 'lavados' });
Lavado.belongsTo(Vehiculo, { foreignKey: 'vehi', as: 'vehiculo' });

CategoriaLavado.hasMany(Lavado, { foreignKey: 'categoriaLavado', as: 'lavados' });
Lavado.belongsTo(CategoriaLavado, { foreignKey: 'categoriaLavado', as: 'categoria' });

EstadoLavado.hasMany(Lavado, { foreignKey: 'estado', as: 'lavados' });
Lavado.belongsTo(EstadoLavado, { foreignKey: 'estado', as: 'datosEstado' });

Utileria.hasMany(Lavado, { foreignKey: 'utileria', as: 'lavados' });
Lavado.belongsTo(Utileria, { foreignKey: 'utileria', as: 'datosUtileria' });

// Usuario y Login
Usuario.hasMany(Login, { foreignKey: 'usuario', as: 'logins' });
Login.belongsTo(Usuario, { foreignKey: 'usuario', as: 'datosUsuario' });

Login.hasMany(Lavado, { foreignKey: 'login', as: 'lavados' });
Lavado.belongsTo(Login, { foreignKey: 'login', as: 'datosLogin' });

module.exports = {
  sequelize,
  Persona,
  Cliente,
  CategoriaVehiculo,
  MarcaVehiculo,
  ModeloVehiculo,
  Vehiculo,
  CategoriaLavado,
  EstadoLavado,
  Utileria,
  Lavado,
  Usuario,
  Login,
};
