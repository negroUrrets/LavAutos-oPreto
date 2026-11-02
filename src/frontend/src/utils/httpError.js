export async function crearErrorHttp(response, mensajePorDefecto) {
  let mensaje = mensajePorDefecto;

  try {
    const body = await response.json();
    mensaje = body?.error?.message ?? mensajePorDefecto;
  } catch {
    mensaje = mensajePorDefecto;
  }

  const error = new Error(mensaje);
  error.status = response.status;
  return error;
}
