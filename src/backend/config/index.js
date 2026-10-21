require('dotenv').config();

const REQUIRED_ENV = ['DB_SERVER', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'SESSION_SECRET'];

function toBoolean(value, fallback) {
  if (value === undefined || value === '') {
    return fallback;
  }
  return value === 'true';
}

function loadConfig() {
  const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Faltan variables de entorno requeridas: ${missing.join(', ')}`);
  }

  return {
    port: Number(process.env.PORT || 3000),
    db: {
      server: process.env.DB_SERVER,
      instance: process.env.DB_INSTANCE || undefined,
      name: process.env.DB_NAME,
      dialect: process.env.DB_DIALECT || 'mssql',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
      authType: (process.env.DB_AUTH_TYPE || 'default').toLowerCase(),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      domain: process.env.DB_DOMAIN || undefined,
      encrypt: toBoolean(process.env.DB_ENCRYPT, true),
      trustServerCertificate: toBoolean(process.env.DB_TRUST_SERVER_CERTIFICATE, true),
    },
    session: {
      secret: process.env.SESSION_SECRET,
      cookieSecure: toBoolean(process.env.SESSION_COOKIE_SECURE, false),
    },
  };
}

module.exports = { loadConfig };
