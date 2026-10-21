const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Persona = sequelize.define(
  'Persona',
  {
    codigoPersona: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    apellido: { type: DataTypes.STRING(100), allowNull: false },
    dni: { type: DataTypes.BIGINT, allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: true },
    celular: { type: DataTypes.BIGINT, allowNull: true },
  },
  { tableName: 'Persona', timestamps: false },
);

module.exports = Persona;
