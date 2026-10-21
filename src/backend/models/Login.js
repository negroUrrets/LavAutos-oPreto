const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Login = sequelize.define(
  'Login',
  {
    codigoLogin: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    usuario: { type: DataTypes.BIGINT, allowNull: false },
  },
  { tableName: 'Login', timestamps: false },
);

module.exports = Login;
