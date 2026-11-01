import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  createCliente,
  deleteCliente,
  getCliente,
  listClientesSinLavados,
  searchClientes,
  updateCliente,
} from './clientService.js';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('clientService', () => {
  test('searchClientes consulta GET /api/clientes?buscar= con credentials include', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [{ codigoPersona: 1 }] }),
    });

    const data = await searchClientes('juan');

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/clientes?buscar=juan', {
      credentials: 'include',
    });
    expect(data).toEqual([{ codigoPersona: 1 }]);
  });

  test('listClientesSinLavados consulta GET /api/clientes?sinLavadosDesde=', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: [{ codigoPersona: 1 }] }),
    });

    const data = await listClientesSinLavados('2026-05-01');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/clientes?sinLavadosDesde=2026-05-01',
      { credentials: 'include' },
    );
    expect(data).toEqual([{ codigoPersona: 1 }]);
  });

  test('getCliente hace GET /api/clientes/:id con credentials include', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { codigoPersona: 5 } }),
    });

    const data = await getCliente(5);

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/clientes/5', { credentials: 'include' });
    expect(data).toEqual({ codigoPersona: 5 });
  });

  test('deleteCliente hace DELETE /api/clientes/:id con credentials include', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, status: 204 });

    await deleteCliente(5);

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/clientes/5', {
      method: 'DELETE',
      credentials: 'include',
    });
  });

  test('deleteCliente adjunta el estado HTTP al error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 409 });

    await expect(deleteCliente(5)).rejects.toMatchObject({ status: 409 });
  });

  test('updateCliente hace PUT /api/clientes/:id con credentials include', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { codigoPersona: 5 } }),
    });

    await updateCliente(5, { nombre: 'A' });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/clientes/5',
      expect.objectContaining({ method: 'PUT', credentials: 'include' }),
    );
  });

  test('createCliente hace POST /api/clientes con credentials include', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: { codigoPersona: 7 } }),
    });

    const data = await createCliente({ nombre: 'A' });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/clientes',
      expect.objectContaining({ method: 'POST', credentials: 'include' }),
    );
    expect(data).toEqual({ codigoPersona: 7 });
  });
});
