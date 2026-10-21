require('dotenv').config();

function setDefault(key, value) {
  if (process.env[key] === undefined) {
    process.env[key] = value;
  }
}

setDefault('DB_SERVER', 'localhost');
setDefault('DB_NAME', 'DataBaseLavadero');
setDefault('DB_USER', 'test');
setDefault('DB_PASSWORD', 'test');
setDefault('DB_AUTH_TYPE', 'default');
setDefault('DB_INSTANCE', 'SQLEXPRESS01');
setDefault('SESSION_SECRET', 'test-session-secret');
setDefault('PORT', '0');
