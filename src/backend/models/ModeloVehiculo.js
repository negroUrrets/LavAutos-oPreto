const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ModeloVehiculo = sequelize.define(
  'ModeloVehiculo',
  {
    codigoModeloVehi: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    modeloVehi: { type: DataTypes.STRING(100), allowNull: false },
    marcaVehi: { type: DataTypes.BIGINT, allowNull: false },
  },
  { tableName: 'ModeloVehiculo', timestamps: false },
);

module.exports = ModeloVehiculo;
