import { describe, expect, test } from 'vitest';
import { formatDate, formatTime } from './formatDateTime.js';

describe('formatDateTime', () => {
  // 2026-09-08T01:20:00Z -> 2026-09-07 22:20 en Buenos Aires (UTC-03:00)
  const date = new Date('2026-09-08T01:20:00Z');

  test('formatea la fecha en UTC-03:00 con el día capitalizado', () => {
    expect(formatDate(date)).toBe('Lunes 07/09/2026');
  });

  test('formatea la hora en 12 horas con am/pm sin puntos', () => {
    expect(formatTime(date)).toEqual({ hour: '10', minute: '20', period: 'pm' });
  });

  test('usa la zona horaria de Buenos Aires (no la del navegador)', () => {
    const morning = new Date('2026-09-07T13:05:00Z'); // 10:05 en Buenos Aires
    expect(formatTime(morning)).toEqual({ hour: '10', minute: '05', period: 'am' });
  });
});
