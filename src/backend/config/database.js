const { Sequelize } = require('sequelize');
const { loadConfig } = require('./index');

const config = loadConfig();

function buildDialectOptions() {
  const options = {
    encrypt: config.db.encrypt,
    trustServerCertificate: config.db.trustServerCertificate,
  };

  if (config.db.instance) {
    options.instanceName = config.db.instance;
  }

  const dialectOptions = { options };

  if (config.db.authType === 'ntlm') {
    dialectOptions.authentication = {
      type: 'ntlm',
      options: {
        domain: config.db.domain,
        userName: config.db.user,
        password: config.db.password,
      },
    };
  }

  return dialectOptions;
}

const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
  host: config.db.server,
  port: config.db.instance ? undefined : config.db.port || 1433,
  dialect: config.db.dialect,
  dialectOptions: buildDialectOptions(),
  logging: false,
});

module.exports = { sequelize, config };
