const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Lavado = sequelize.define(
  'Lavado',
  {
    codigoLavado: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    fechaHoraLavado: { type: DataTypes.DATE, allowNull: false },
    fechaHoraLavadoTerminado: { type: DataTypes.DATE, allowNull: false },
    vehi: { type: DataTypes.BIGINT, allowNull: false },
    categoriaLavado: { type: DataTypes.BIGINT, allowNull: false },
    login: { type: DataTypes.BIGINT, allowNull: false },
    estado: { type: DataTypes.BIGINT, allowNull: false },
    utileria: { type: DataTypes.BIGINT, allowNull: false },
    detallesLavado: { type: DataTypes.STRING(255), allowNull: true },
  },
  { tableName: 'Lavado', timestamps: false },
);

Lavado.addHook('beforeValidate', (lavado) => {
  if (lavado.isNewRecord) {
    const marca = new Date();
    lavado.fechaHoraLavado = marca;
    lavado.fechaHoraLavadoTerminado = marca;
  }
});

Lavado.addHook('beforeUpdate', (lavado) => {
  if (lavado.changed('estado')) {
    lavado.fechaHoraLavadoTerminado = new Date();
  }
});

module.exports = Lavado;
