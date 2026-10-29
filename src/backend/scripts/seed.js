const { sequelize } = require('../models');
const { ensureDefaultAdmin } = require('../services/adminService');
const { ensureLavadoCatalogs } = require('../services/catalogSeedService');

async function seed() {
  await sequelize.authenticate();

  const { created } = await ensureDefaultAdmin();
  if (created) {
    console.log('Cuenta administrador creada.');
  } else {
    console.log('La cuenta administrador ya existe; no se modifica.');
  }

  const catalogosCreados = await ensureLavadoCatalogs();
  console.log(`Catalogos de lavado creados: ${catalogosCreados}.`);

  await sequelize.close();
}

seed().catch((error) => {
  console.error('Error en el seed:', error.message);
  process.exit(1);
});
