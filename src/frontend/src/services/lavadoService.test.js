import { afterEach, describe, expect, test, vi } from 'vitest';
import {
  createLavado,
  listByVehiculo,
  listCategoriasLavado,
  listEstadosLavado,
  listLavados,
  listUtileria,
  updateLavado,
  updateUtileria,
} from './lavadoService.js';

function mockJson(data) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data }),
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('lavadoService', () => {
  test('listByVehiculo consulta GET /api/lavados?vehi=', async () => {
    mockJson([]);

    await listByVehiculo(9);

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/lavados?vehi=9', {
      credentials: 'include',
    });
  });

  test('listLavados consulta GET /api/lavados', async () => {
    mockJson([]);

    await listLavados();

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/lavados', { credentials: 'include' });
  });

  test('updateLavado hace PUT /api/lavados/:id', async () => {
    mockJson({ codigoLavado: 4, estado: 3 });

    await updateLavado(4, { estado: 3 });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/lavados/4',
      expect.objectContaining({ method: 'PUT', credentials: 'include' }),
    );
  });

  test('lista los catálogos de lavado', async () => {
    mockJson([]);

    await listUtileria();
    await listCategoriasLavado();
    await listEstadosLavado();

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/utilerias', { credentials: 'include' });
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/categorias-lavado', {
      credentials: 'include',
    });
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/estados-lavado', {
      credentials: 'include',
    });
  });

  test('createLavado hace POST /api/lavados con credentials include', async () => {
    mockJson({ codigoLavado: 1 });

    const data = await createLavado({ vehi: 9 });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/lavados',
      expect.objectContaining({ method: 'POST', credentials: 'include' }),
    );
    expect(data).toEqual({ codigoLavado: 1 });
  });

  test('updateUtileria hace PUT /api/utilerias/:id', async () => {
    mockJson({ estadoUtileria: true });

    await updateUtileria(1, { estadoUtileria: true });

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/utilerias/1',
      expect.objectContaining({ method: 'PUT', credentials: 'include' }),
    );
  });
});
