const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DetalleUtileria = sequelize.define(
  'DetalleUtileria',
  {
    codigoLavado: { type: DataTypes.BIGINT, primaryKey: true },
    codigoUtileria: { type: DataTypes.BIGINT, primaryKey: true },
  },
  { tableName: 'DetalleUtileria', timestamps: false },
);

module.exports = DetalleUtileria;
