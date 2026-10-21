const crypto = require('crypto');

const KEY_LENGTH = 64;
const PREFIX = 'scrypt';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${PREFIX}$${salt}$${derived}`;
}

function verifyPassword(password, stored) {
  if (typeof stored !== 'string') {
    return false;
  }

  const parts = stored.split('$');
  if (parts.length !== 3 || parts[0] !== PREFIX) {
    return false;
  }

  const [, salt, hash] = parts;
  const derived = crypto.scryptSync(password, salt, KEY_LENGTH).toString('hex');
  const expected = Buffer.from(hash, 'hex');
  const actual = Buffer.from(derived, 'hex');

  if (expected.length !== actual.length) {
    return false;
  }

  return crypto.timingSafeEqual(expected, actual);
}

module.exports = { hashPassword, verifyPassword };
