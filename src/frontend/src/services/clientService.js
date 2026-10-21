export async function searchClientes(texto) {
  const response = await fetch(`/api/clientes?buscar=${encodeURIComponent(texto)}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    return [];
  }

  const body = await response.json();
  return body.data ?? [];
}

export async function getCliente(id) {
  const response = await fetch(`/api/clientes/${id}`, { credentials: 'include' });

  if (!response.ok) {
    return null;
  }

  const body = await response.json();
  return body.data;
}

export async function deleteCliente(id) {
  const response = await fetch(`/api/clientes/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('No se pudo eliminar el cliente.');
  }
}

export async function updateCliente(id, datos) {
  const response = await fetch(`/api/clientes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    throw new Error('No se pudo actualizar el cliente.');
  }

  const body = await response.json();
  return body.data;
}

export async function createCliente(cliente) {
  const response = await fetch('/api/clientes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(cliente),
  });

  if (!response.ok) {
    throw new Error('No se pudo crear el cliente.');
  }

  const body = await response.json();
  return body.data;
}
