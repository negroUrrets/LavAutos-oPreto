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

export function listLavados() {
  return listResource('/api/lavados');
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
