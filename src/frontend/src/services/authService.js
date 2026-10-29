export async function login(usuario, contrasena) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ usuario, contrasena }),
  });

  return response.ok;
}

export async function fetchSession() {
  const response = await fetch('/api/auth/session', {
    credentials: 'include',
  });

  return response.ok;
}

export async function fetchSessionData() {
  const response = await fetch('/api/auth/session', {
    credentials: 'include',
  });

  if (!response.ok) {
    return null;
  }

  const body = await response.json();
  return body.data ?? null;
}

export async function logout() {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
}
