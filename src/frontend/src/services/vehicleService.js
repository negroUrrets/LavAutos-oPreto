async function listResource(path) {
  const response = await fetch(path, { credentials: 'include' });

  if (!response.ok) {
    return [];
  }

  const body = await response.json();
  return body.data ?? [];
}

export function listCategorias() {
  return listResource('/api/categorias-vehiculo');
}

export function listMarcas() {
  return listResource('/api/marcas-vehiculo');
}

export function listModelos() {
  return listResource('/api/modelos-vehiculo');
}

export function listByCliente(cliente) {
  return listResource(`/api/vehiculos?cliente=${encodeURIComponent(cliente)}`);
}

export function listVehiculos() {
  return listResource('/api/vehiculos');
}

export async function getVehiculo(id) {
  const response = await fetch(`/api/vehiculos/${id}`, { credentials: 'include' });

  if (!response.ok) {
    throw new Error('No se pudo obtener el vehiculo.');
  }

  const body = await response.json();
  return body.data;
}

export async function createVehiculo(vehiculo) {
  const response = await fetch('/api/vehiculos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(vehiculo),
  });

  if (!response.ok) {
    throw new Error('No se pudo crear el vehiculo.');
  }

  const body = await response.json();
  return body.data;
}

export async function updateVehiculo(id, vehiculo) {
  const response = await fetch(`/api/vehiculos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(vehiculo),
  });

  if (!response.ok) {
    throw new Error('No se pudo actualizar el vehiculo.');
  }

  const body = await response.json();
  return body.data;
}

export async function deleteVehiculo(id) {
  const response = await fetch(`/api/vehiculos/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('No se pudo eliminar el vehiculo.');
  }
}
