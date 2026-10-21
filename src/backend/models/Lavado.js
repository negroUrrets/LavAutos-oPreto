const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Lavado = sequelize.define(
  'Lavado',
  {
    codigoLavado: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    fechaHoraLavado: { type: DataTypes.DATE, allowNull: false },
    estadoLavado: { type: DataTypes.STRING(50), allowNull: false },
    vehi: { type: DataTypes.BIGINT, allowNull: false },
    categoriaLavado: { type: DataTypes.BIGINT, allowNull: false },
    login: { type: DataTypes.BIGINT, allowNull: false },
  },
  { tableName: 'Lavado', timestamps: false },
);

module.exports = Lavado;
