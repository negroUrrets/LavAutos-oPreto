import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  createVehiculo,
  deleteVehiculo,
  listByCliente,
  listCategorias,
  listMarcas,
  listModelos,
} from './vehicleService.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('vehicleService', () => {
  test('listCategorias consulta GET /api/categorias-vehiculo', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });

    await listCategorias();

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/categorias-vehiculo', {
      credentials: 'include',
    });
  });

  test('listMarcas consulta GET /api/marcas-vehiculo', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });

    await listMarcas();

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/marcas-vehiculo', {
      credentials: 'include',
    });
  });

  test('listModelos consulta GET /api/modelos-vehiculo', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });

    await listModelos();

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/modelos-vehiculo', {
      credentials: 'include',
    });
  });

  test('listByCliente consulta GET /api/vehiculos?cliente=', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: [] }) });

    await listByCliente(5);

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/vehiculos?cliente=5', {
      credentials: 'include',
    });
  });

  test('deleteVehiculo hace DELETE /api/vehiculos/:id con credentials include', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, status: 204 });

    await deleteVehiculo(9);

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/vehiculos/9', {
      method: 'DELETE',
      credentials: 'include',
    });
  });

  test('deleteVehiculo adjunta el estado HTTP al error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 409 });

    await expect(deleteVehiculo(9)).rejects.toMatchObject({ status: 409 });
  });

  test('createVehiculo hace POST /api/vehiculos con credentials include', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { codigoVehi: 3 } }),
    });

    const data = await createVehiculo({ patenteVehi: 'AA123BB' });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/vehiculos',
      expect.objectContaining({ method: 'POST', credentials: 'include' }),
    );
    expect(data).toEqual({ codigoVehi: 3 });
  });

  test('createVehiculo propaga el mensaje y el estado del backend', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: () =>
        Promise.resolve({ success: false, error: { message: 'La patente ya esta registrada.' } }),
    });

    await expect(createVehiculo({ patenteVehi: 'AB123CD' })).rejects.toMatchObject({
      message: 'La patente ya esta registrada.',
      status: 409,
    });
  });
});
