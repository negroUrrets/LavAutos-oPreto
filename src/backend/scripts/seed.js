const { sequelize, Usuario } = require('../models');
const { hashPassword } = require('../utils/password');

const ADMIN_USER = 'admin';
const ADMIN_PASSWORD = '123456';

async function seed() {
  await sequelize.authenticate();

  const existing = await Usuario.findOne({ where: { nombreUsuario: ADMIN_USER } });
  if (existing) {
    console.log('La cuenta administrador ya existe; no se modifica.');
  } else {
    await Usuario.create({
      nombreUsuario: ADMIN_USER,
      'contraseña': hashPassword(ADMIN_PASSWORD),
    });
    console.log('Cuenta administrador creada.');
  }

  await sequelize.close();
}

seed().catch((error) => {
  console.error('Error en el seed:', error.message);
  process.exit(1);
});
