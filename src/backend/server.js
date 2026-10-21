const app = require('./app');
const { sequelize, config } = require('./config/database');

async function start() {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error.message);
    process.exit(1);
  }

  app.listen(config.port, () => {
    console.log(`Backend escuchando en el puerto ${config.port}`);
  });
}

start();
