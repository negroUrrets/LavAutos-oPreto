const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MarcaVehiculo = sequelize.define(
  'MarcaVehiculo',
  {
    codigoMarcaVehi: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    marcaVehi: { type: DataTypes.STRING(100), allowNull: false },
    categoriaVehi: { type: DataTypes.BIGINT, allowNull: false },
  },
  { tableName: 'MarcaVehiculo', timestamps: false },
);

module.exports = MarcaVehiculo;
