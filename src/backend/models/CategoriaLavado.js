const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CategoriaLavado = sequelize.define(
  'CategoriaLavado',
  {
    codigoCategoriaLavado: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    descripcionLavado: { type: DataTypes.STRING(200), allowNull: false },
  },
  { tableName: 'CategoriaLavado', timestamps: false },
);

module.exports = CategoriaLavado;
