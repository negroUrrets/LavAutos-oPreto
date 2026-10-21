const request = require('supertest');
const express = require('express');
const app = require('../app');
const errorHandler = require('../middlewares/errorHandler');

describe('app base', () => {
  test('GET /api/health responde 200 con estado ok', async () => {
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: { status: 'ok' } });
  });

  test('ruta inexistente responde 404 con formato de error', async () => {
    const res = await request(app).get('/api/desconocido');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toBeDefined();
  });

  test('error inesperado responde 500 con mensaje seguro', async () => {
    const testApp = express();
    testApp.get('/boom', () => {
      throw new Error('detalle interno secreto');
    });
    testApp.use(errorHandler);

    const res = await request(testApp).get('/boom');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      success: false,
      error: { message: 'Error interno del servidor' },
    });
    expect(JSON.stringify(res.body)).not.toContain('detalle interno secreto');
  });
});
