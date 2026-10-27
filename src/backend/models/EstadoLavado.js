const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EstadoLavado = sequelize.define(
  'EstadoLavado',
  {
    codigoEstado: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    descripcionEstado: { type: DataTypes.STRING(200), allowNull: false },
    estadoLavado: { type: DataTypes.BOOLEAN, allowNull: false },
  },
  { tableName: 'EstadoLavado', timestamps: false },
);

module.exports = EstadoLavado;
