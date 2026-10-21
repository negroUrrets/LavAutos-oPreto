const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CategoriaVehiculo = sequelize.define(
  'CategoriaVehiculo',
  {
    codigoCategoriaVehi: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    categoriaVehi: { type: DataTypes.STRING(100), allowNull: false },
  },
  { tableName: 'CategoriaVehiculo', timestamps: false },
);

module.exports = CategoriaVehiculo;
