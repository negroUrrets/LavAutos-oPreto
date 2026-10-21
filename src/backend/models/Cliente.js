const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cliente = sequelize.define(
  'Cliente',
  {
    codigoPersona: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: false },
    estadoCliente: { type: DataTypes.BOOLEAN, allowNull: false },
  },
  { tableName: 'Cliente', timestamps: false },
);

module.exports = Cliente;
