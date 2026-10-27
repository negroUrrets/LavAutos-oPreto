const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Utileria = sequelize.define(
  'Utileria',
  {
    codigoUtileria: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    descripcionUtileria: { type: DataTypes.STRING(200), allowNull: false },
    estadoUtileria: { type: DataTypes.BOOLEAN, allowNull: false },
  },
  { tableName: 'Utileria', timestamps: false },
);

module.exports = Utileria;
