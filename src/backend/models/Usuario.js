const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Usuario = sequelize.define(
  'Usuario',
  {
    codigoUsuario: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    nombreUsuario: { type: DataTypes.STRING(100), allowNull: false },
    'contraseña': { type: DataTypes.STRING(255), allowNull: false, field: 'contraseña' },
  },
  { tableName: 'Usuario', timestamps: false },
);

module.exports = Usuario;
