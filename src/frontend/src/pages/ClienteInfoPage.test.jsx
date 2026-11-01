import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import ClienteInfoPage from './ClienteInfoPage.jsx';

let sessionOk = true;
let lavadosVehiculo = [];
let deleteStatus = 204;

const cliente = {
  codigoPersona: 5,
  dni: 28853432,
  nombre: 'Juan',
  apellido: 'Perez',
  celular: 5493516699031,
  email: 'juan@gmail.com',
};

let vehiculos = [];

function baseVehiculos() {
  return [
    {
      codigoVehi: 9,
      patenteVehi: 'AC-123-DF',
      modelo: {
        codigoModeloVehi: 100,
        modeloVehi: 'Fuego',
        marca: {
          codigoMarcaVehi: 10,
          marcaVehi: 'Renault',
          categoria: { codigoCategoriaVehi: 1, categoriaVehi: 'Sedan' },
        },
      },
    },
  ];
}

function mockFetch(url, options = {}) {
  if (url === '/api/auth/session') {
    return Promise.resolve({ ok: sessionOk, status: sessionOk ? 200 : 401 });
  }
  if (url === '/api/clientes/5' && options.method === 'DELETE') {
    return Promise.resolve({ ok: deleteStatus < 400, status: deleteStatus });
  }
  if (url === '/api/clientes/5') {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: cliente }) });
  }
  if (url === '/api/vehiculos/9' && options.method === 'DELETE') {
    if (deleteStatus < 400) {
      vehiculos = vehiculos.filter((vehiculo) => vehiculo.codigoVehi !== 9);
    }
    return Promise.resolve({ ok: deleteStatus < 400, status: deleteStatus });
  }
  if (url === '/api/vehiculos?cliente=5') {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: vehiculos }) });
  }
  if (url === '/api/lavados?vehi=9') {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: lavadosVehiculo }) });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) });
}

function renderPage(entry = '/clientes/5/info') {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/clientes/:id/info" element={<ClienteInfoPage />} />
        <Route path="/dashboard" element={<div>DASHBOARD PAGE</div>} />
        <Route path="/clientes/:id/editar" element={<div>EDITAR CLIENTE PAGE</div>} />
        <Route path="/clientes/:id/vehiculos/nuevo" element={<div>NUEVO VEHICULO PAGE</div>} />
        <Route
          path="/clientes/:id/vehiculos/:vehiculoId/editar"
          element={<div>EDITAR VEHICULO PAGE</div>}
        />
        <Route
          path="/clientes/:id/vehiculos/:vehiculoId/lavar"
          element={<div>NUEVO LAVADO PAGE</div>}
        />
        <Route path="/clientes" element={<div>CLIENTES PAGE</div>} />
        <Route path="/login" element={<div>LOGIN PAGE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  sessionOk = true;
  vehiculos = baseVehiculos();
  lavadosVehiculo = [];
  deleteStatus = 204;
  globalThis.fetch = vi.fn(mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ClienteInfoPage', () => {
  test('muestra el encabezado y la card del cliente', async () => {
    renderPage();

    expect(await screen.findByText('LavAutos oPreto')).toBeInTheDocument();
    expect(screen.getByText('28853432')).toBeInTheDocument();
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Perez')).toBeInTheDocument();
    expect(screen.getByText('juan@gmail.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ VEHICULO' })).toBeInTheDocument();
  });

  test('el botón Eliminar abre el popup y ACEPTAR elimina y navega a Clientes', async () => {
    const user = userEvent.setup();
    renderPage();

    const clienteCard = await screen.findByTestId('cliente-card');
    await user.click(within(clienteCard).getByRole('button', { name: 'Eliminar' }));

    expect(
      screen.getByText('¿ Desea eliminar al cliente "Juan Perez" ?'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'ACEPTAR' }));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/clientes/5',
      expect.objectContaining({ method: 'DELETE' }),
    );
    expect(await screen.findByText('CLIENTES PAGE')).toBeInTheDocument();
  });

  test('CANCELAR cierra el popup sin eliminar', async () => {
    const user = userEvent.setup();
    renderPage();

    const clienteCard = await screen.findByTestId('cliente-card');
    await user.click(within(clienteCard).getByRole('button', { name: 'Eliminar' }));
    await user.click(screen.getByRole('button', { name: 'CANCELAR' }));

    expect(screen.queryByRole('button', { name: 'ACEPTAR' })).not.toBeInTheDocument();
    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      '/api/clientes/5',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  test('Eliminar de la card de vehículo abre el popup y ACEPTAR elimina y actualiza la lista', async () => {
    const user = userEvent.setup();
    renderPage();

    const vehiculoCard = await screen.findByTestId('vehiculo-card');
    await user.click(within(vehiculoCard).getByRole('button', { name: 'Eliminar' }));

    expect(
      screen.getByText('¿ Desea eliminar el vehiculo "AC-123-DF" ?'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'ACEPTAR' }));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/vehiculos/9',
      expect.objectContaining({ method: 'DELETE' }),
    );
    await waitFor(() => expect(screen.queryByTestId('vehiculo-card')).not.toBeInTheDocument());
  });

  test('CANCELAR cierra el popup de vehículo sin eliminar', async () => {
    const user = userEvent.setup();
    renderPage();

    const vehiculoCard = await screen.findByTestId('vehiculo-card');
    await user.click(within(vehiculoCard).getByRole('button', { name: 'Eliminar' }));
    await user.click(screen.getByRole('button', { name: 'CANCELAR' }));

    expect(screen.queryByRole('button', { name: 'ACEPTAR' })).not.toBeInTheDocument();
    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      '/api/vehiculos/9',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  test('el botón + VEHICULO navega a la página Agregar Vehiculo', async () => {
    const user = userEvent.setup();
    renderPage();

    const clienteCard = await screen.findByTestId('cliente-card');
    await user.click(within(clienteCard).getByRole('button', { name: '+ VEHICULO' }));

    expect(await screen.findByText('NUEVO VEHICULO PAGE')).toBeInTheDocument();
  });

  test('LAVAR navega a Nuevo Lavado si el vehículo no tiene lavado en curso', async () => {
    const user = userEvent.setup();
    renderPage();

    const vehiculoCard = await screen.findByTestId('vehiculo-card');
    await user.click(within(vehiculoCard).getByRole('button', { name: 'LAVAR' }));

    expect(await screen.findByText('NUEVO LAVADO PAGE')).toBeInTheDocument();
  });

  test('LAVAR avisa si el vehículo ya tiene un lavado en curso', async () => {
    lavadosVehiculo = [{ codigoLavado: 1, datosEstado: { descripcionEstado: 'Lavando' } }];
    const user = userEvent.setup();
    renderPage();

    const vehiculoCard = await screen.findByTestId('vehiculo-card');
    await user.click(within(vehiculoCard).getByRole('button', { name: 'LAVAR' }));

    expect(
      await screen.findByText('El vehiculo ya tiene un lavado en curso.'),
    ).toBeInTheDocument();
    expect(screen.queryByText('NUEVO LAVADO PAGE')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(
      screen.queryByText('El vehiculo ya tiene un lavado en curso.'),
    ).not.toBeInTheDocument();
  });

  test('el botón Editar de la card de vehículo navega a la edición', async () => {
    const user = userEvent.setup();
    renderPage();

    const vehiculoCard = await screen.findByTestId('vehiculo-card');
    await user.click(within(vehiculoCard).getByRole('button', { name: 'Editar' }));

    expect(await screen.findByText('EDITAR VEHICULO PAGE')).toBeInTheDocument();
  });

  test('vuelve a solicitar los vehículos al montarse', async () => {
    renderPage();

    await screen.findByTestId('vehiculo-card');

    expect(globalThis.fetch).toHaveBeenCalledWith('/api/vehiculos?cliente=5', {
      credentials: 'include',
    });
  });

  test('el botón Editar de la card del cliente navega a la edición', async () => {
    const user = userEvent.setup();
    renderPage();

    const clienteCard = await screen.findByTestId('cliente-card');
    await user.click(within(clienteCard).getByRole('button', { name: 'Editar' }));

    expect(await screen.findByText('EDITAR CLIENTE PAGE')).toBeInTheDocument();
  });

  test('muestra una card por vehículo con categoría, marca, modelo y patente', async () => {
    renderPage();

    expect(await screen.findByTestId('vehiculo-card')).toBeInTheDocument();
    expect(screen.getByText('Sedan')).toBeInTheDocument();
    expect(screen.getByText('Renault')).toBeInTheDocument();
    expect(screen.getByText('Fuego')).toBeInTheDocument();
    expect(screen.getByText('AC-123-DF')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'LAVAR' })).toBeInTheDocument();
  });

  test('el hover adelanta la card señalada y retrasa las demás', async () => {
    const user = userEvent.setup();
    renderPage();

    const clienteCard = await screen.findByTestId('cliente-card');
    const vehiculoCard = await screen.findByTestId('vehiculo-card');

    await user.hover(clienteCard);

    expect(clienteCard.className).toContain('scale-105');
    expect(vehiculoCard.className).toContain('scale-95');
  });

  test('Volver navega a Clientes', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('LavAutos oPreto');

    await user.click(screen.getByRole('button', { name: '←' }));

    expect(await screen.findByText('CLIENTES PAGE')).toBeInTheDocument();
  });

  test('Volver regresa al origen cuando se abrio desde otra pantalla', async () => {
    const user = userEvent.setup();
    renderPage({
      pathname: '/clientes/5/info',
      state: { from: '/dashboard?modo=clientes&fecha=2026-05-01' },
    });
    await screen.findByText('LavAutos oPreto');

    await user.click(screen.getByRole('button', { name: '←' }));

    expect(await screen.findByText('DASHBOARD PAGE')).toBeInTheDocument();
  });

  test('Editar cliente con lavado activo muestra el aviso y no navega', async () => {
    const user = userEvent.setup();
    lavadosVehiculo = [{ datosEstado: { descripcionEstado: 'En Espera' } }];
    renderPage();

    const clienteCard = await screen.findByTestId('cliente-card');
    await user.click(within(clienteCard).getByRole('button', { name: 'Editar' }));

    expect(
      await screen.findByText('Edicion / Eliminacion cancelada...Vehiculo en estado de Lavado'),
    ).toBeInTheDocument();
    expect(screen.queryByText('EDITAR CLIENTE PAGE')).not.toBeInTheDocument();
  });

  test('Eliminar cliente con lavado activo muestra el aviso y no abre la confirmación', async () => {
    const user = userEvent.setup();
    lavadosVehiculo = [{ datosEstado: { descripcionEstado: 'Lavando' } }];
    renderPage();

    const clienteCard = await screen.findByTestId('cliente-card');
    await user.click(within(clienteCard).getByRole('button', { name: 'Eliminar' }));

    expect(
      await screen.findByText('Edicion / Eliminacion cancelada...Vehiculo en estado de Lavado'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ACEPTAR' })).not.toBeInTheDocument();
  });

  test('Editar vehiculo con lavado activo muestra el aviso y no navega', async () => {
    const user = userEvent.setup();
    lavadosVehiculo = [{ datosEstado: { descripcionEstado: 'Terminado' } }];
    renderPage();

    const vehiculoCard = await screen.findByTestId('vehiculo-card');
    await user.click(within(vehiculoCard).getByRole('button', { name: 'Editar' }));

    expect(
      await screen.findByText('Edicion / Eliminacion cancelada...Vehiculo en estado de Lavado'),
    ).toBeInTheDocument();
    expect(screen.queryByText('EDITAR VEHICULO PAGE')).not.toBeInTheDocument();
  });

  test('Eliminar vehiculo con lavado activo muestra el aviso y no abre la confirmación', async () => {
    const user = userEvent.setup();
    lavadosVehiculo = [{ datosEstado: { descripcionEstado: 'En Espera' } }];
    renderPage();

    const vehiculoCard = await screen.findByTestId('vehiculo-card');
    await user.click(within(vehiculoCard).getByRole('button', { name: 'Eliminar' }));

    expect(
      await screen.findByText('Edicion / Eliminacion cancelada...Vehiculo en estado de Lavado'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ACEPTAR' })).not.toBeInTheDocument();
  });

  test('ACEPTAR con 409 muestra el aviso y no navega', async () => {
    const user = userEvent.setup();
    deleteStatus = 409;
    renderPage();

    const clienteCard = await screen.findByTestId('cliente-card');
    await user.click(within(clienteCard).getByRole('button', { name: 'Eliminar' }));
    await user.click(screen.getByRole('button', { name: 'ACEPTAR' }));

    expect(
      await screen.findByText('Edicion / Eliminacion cancelada...Vehiculo en estado de Lavado'),
    ).toBeInTheDocument();
    expect(screen.queryByText('CLIENTES PAGE')).not.toBeInTheDocument();
  });

  test('sin sesión válida redirige al login', async () => {
    sessionOk = false;
    renderPage();

    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();
  });
});
