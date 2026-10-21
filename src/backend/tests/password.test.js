const { hashPassword, verifyPassword } = require('../utils/password');

describe('utilidad de hash de contraseñas', () => {
  test('verifica la contraseña correcta', () => {
    const hash = hashPassword('123456');

    expect(hash.startsWith('scrypt$')).toBe(true);
    expect(verifyPassword('123456', hash)).toBe(true);
  });

  test('rechaza la contraseña incorrecta', () => {
    const hash = hashPassword('123456');

    expect(verifyPassword('654321', hash)).toBe(false);
  });

  test('rechaza un valor almacenado inválido', () => {
    expect(verifyPassword('123456', 'texto-plano')).toBe(false);
    expect(verifyPassword('123456', undefined)).toBe(false);
  });
});
