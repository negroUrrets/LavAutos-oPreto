const ESTADOS_BLOQUEANTES = ['en espera', 'lavando', 'terminado'];

export const MENSAJE_LAVADO_ACTIVO =
  'Edicion / Eliminacion cancelada...Vehiculo en estado de Lavado';

function normalizarEstado(texto) {
  return String(texto ?? '')
    .trim()
    .toLowerCase();
}

async function listResource(path) {
  const response = await fetch(path, { credentials: 'include' });

  if (!response.ok) {
    return [];
  }

  const body = await response.json();
  return body.data ?? [];
}

export function listByVehiculo(vehi) {
  return listResource(`/api/lavados?vehi=${encodeURIComponent(vehi)}`);
}

export async function tieneLavadoActivo(vehiculoIds = []) {
  const ids = vehiculoIds.filter((id) => id !== undefined && id !== null);

  if (ids.length === 0) {
    return false;
  }

  const listas = await Promise.all(ids.map((id) => listByVehiculo(id)));

  return listas.some((lavados) =>
    lavados.some((lavado) =>
      ESTADOS_BLOQUEANTES.includes(normalizarEstado(lavado.datosEstado?.descripcionEstado)),
    ),
  );
}

export function listLavados(filtros = {}) {
  const params = new URLSearchParams();
  ['estado', 'vehi', 'desde', 'hasta'].forEach((campo) => {
    if (filtros[campo] !== undefined && filtros[campo] !== null && filtros[campo] !== '') {
      params.set(campo, filtros[campo]);
    }
  });
  const query = params.toString();
  return listResource(query ? `/api/lavados?${query}` : '/api/lavados');
}

export function listUtileria() {
  return listResource('/api/utilerias');
}

export function listCategoriasLavado() {
  return listResource('/api/categorias-lavado');
}

export function listEstadosLavado() {
  return listResource('/api/estados-lavado');
}

export async function getLavado(id) {
  const response = await fetch(`/api/lavados/${id}`, { credentials: 'include' });

  if (!response.ok) {
    return null;
  }

  const body = await response.json();
  return body.data ?? null;
}

export async function createLavado(lavado) {
  const response = await fetch('/api/lavados', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(lavado),
  });

  if (!response.ok) {
    throw new Error('No se pudo registrar el lavado.');
  }

  const body = await response.json();
  return body.data;
}

export async function updateLavado(id, cambios) {
  const response = await fetch(`/api/lavados/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(cambios),
  });

  if (!response.ok) {
    throw new Error('No se pudo actualizar el lavado.');
  }

  const body = await response.json();
  return body.data;
}

export async function updateUtileria(id, cambios) {
  const response = await fetch(`/api/utilerias/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(cambios),
  });

  if (!response.ok) {
    throw new Error('No se pudo actualizar la utileria.');
  }

  const body = await response.json();
  return body.data;
}
