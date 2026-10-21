const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Vehiculo = sequelize.define(
  'Vehiculo',
  {
    codigoVehi: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    patenteVehi: { type: DataTypes.STRING(20), allowNull: false },
    estadoVehi: { type: DataTypes.BOOLEAN, allowNull: false },
    cliente: { type: DataTypes.BIGINT, allowNull: false },
    modeloVehi: { type: DataTypes.BIGINT, allowNull: false },
  },
  { tableName: 'Vehiculo', timestamps: false },
);

module.exports = Vehiculo;
