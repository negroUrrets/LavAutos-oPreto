import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import VehiculoInfoPage from './VehiculoInfoPage.jsx';

let sessionOk = true;
let lavadosVehiculo = [];
let vehiculosCliente = [];
let deleteStatus = 204;

const vehiculo = {
  codigoVehi: 9,
  patenteVehi: 'AB-122-FC',
  cliente: 5,
  modelo: {
    codigoModeloVehi: 100,
    modeloVehi: 'Picasso',
    marca: {
      codigoMarcaVehi: 10,
      marcaVehi: 'Citroen',
      categoria: { codigoCategoriaVehi: 1, categoriaVehi: 'Automovil' },
    },
  },
  datosCliente: {
    codigoPersona: 5,
    estadoCliente: true,
    persona: {
      dni: 28853432,
      nombre: 'Juan',
      apellido: 'Perez',
      celular: 555,
      email: 'juan@gmail.com',
    },
  },
};

function mockFetch(url, options = {}) {
  if (url === '/api/auth/session') {
    return Promise.resolve({ ok: sessionOk, status: sessionOk ? 200 : 401 });
  }
  if (url === '/api/vehiculos/9' && options.method === 'DELETE') {
    return Promise.resolve({ ok: deleteStatus < 400, status: deleteStatus });
  }
  if (url === '/api/clientes/5' && options.method === 'DELETE') {
    return Promise.resolve({ ok: deleteStatus < 400, status: deleteStatus });
  }
  if (url === '/api/vehiculos?cliente=5') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: vehiculosCliente }),
    });
  }
  if (url === '/api/lavados?vehi=9') {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ data: lavadosVehiculo }),
    });
  }
  if (url === '/api/vehiculos/9') {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: vehiculo }) });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) });
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/vehiculos/9/info']}>
      <Routes>
        <Route path="/vehiculos/:vehiculoId/info" element={<VehiculoInfoPage />} />
        <Route path="/vehiculos" element={<div>VEHICULOS PAGE</div>} />
        <Route path="/clientes" element={<div>CLIENTES PAGE</div>} />
        <Route path="/clientes/:id/editar" element={<div>EDITAR CLIENTE PAGE</div>} />
        <Route
          path="/clientes/:id/vehiculos/:vehiculoId/editar"
          element={<div>EDITAR VEHICULO PAGE</div>}
        />
        <Route path="/clientes/:id/vehiculos/nuevo" element={<div>NUEVO VEHICULO PAGE</div>} />
        <Route path="/login" element={<div>LOGIN PAGE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  sessionOk = true;
  lavadosVehiculo = [];
  vehiculosCliente = [];
  deleteStatus = 204;
  globalThis.fetch = vi.fn(mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('VehiculoInfoPage', () => {
  test('muestra el vehículo y los datos de su cliente', async () => {
    renderPage();

    expect(await screen.findByText('LavAutos oPreto')).toBeInTheDocument();
    expect(screen.getByText('28853432')).toBeInTheDocument();
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Perez')).toBeInTheDocument();
    expect(screen.getByText('juan@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('Automovil')).toBeInTheDocument();
    expect(screen.getByText('Citroen')).toBeInTheDocument();
    expect(screen.getByText('Picasso')).toBeInTheDocument();
    expect(screen.getByText('AB-122-FC')).toBeInTheDocument();
  });

  test('muestra sólo el vehículo encontrado', async () => {
    renderPage();

    await screen.findByTestId('vehiculo-card');

    expect(screen.getAllByTestId('vehiculo-card')).toHaveLength(1);
  });

  test('sin sesión válida redirige al login', async () => {
    sessionOk = false;
    renderPage();

    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();
  });

  test('Volver navega a Vehiculos', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('LavAutos oPreto');

    await user.click(screen.getByRole('button', { name: '←' }));

    expect(await screen.findByText('VEHICULOS PAGE')).toBeInTheDocument();
  });

  test('+ VEHICULO navega al alta de vehículo del cliente', async () => {
    const user = userEvent.setup();
    renderPage();

    const card = await screen.findByTestId('cliente-card');
    await user.click(within(card).getByRole('button', { name: '+ VEHICULO' }));

    expect(await screen.findByText('NUEVO VEHICULO PAGE')).toBeInTheDocument();
  });

  test('Editar del cliente navega a la edición del cliente', async () => {
    const user = userEvent.setup();
    renderPage();

    const card = await screen.findByTestId('cliente-card');
    await user.click(within(card).getByRole('button', { name: 'Editar' }));

    expect(await screen.findByText('EDITAR CLIENTE PAGE')).toBeInTheDocument();
  });

  test('Editar del vehículo navega a la edición del vehículo', async () => {
    const user = userEvent.setup();
    renderPage();

    const card = await screen.findByTestId('vehiculo-card');
    await user.click(within(card).getByRole('button', { name: 'Editar' }));

    expect(await screen.findByText('EDITAR VEHICULO PAGE')).toBeInTheDocument();
  });

  test('Eliminar el vehículo confirma y vuelve a Vehiculos', async () => {
    const user = userEvent.setup();
    renderPage();

    const card = await screen.findByTestId('vehiculo-card');
    await user.click(within(card).getByRole('button', { name: 'Eliminar' }));

    expect(screen.getByText('¿ Desea eliminar el vehiculo "AB-122-FC" ?')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'ACEPTAR' }));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/vehiculos/9',
      expect.objectContaining({ method: 'DELETE' }),
    );
    expect(await screen.findByText('VEHICULOS PAGE')).toBeInTheDocument();
  });

  test('Editar del vehículo con lavado activo muestra el aviso y no navega', async () => {
    const user = userEvent.setup();
    lavadosVehiculo = [{ datosEstado: { descripcionEstado: 'En Espera' } }];
    renderPage();

    const card = await screen.findByTestId('vehiculo-card');
    await user.click(within(card).getByRole('button', { name: 'Editar' }));

    expect(
      await screen.findByText('Edicion / Eliminacion cancelada...Vehiculo en estado de Lavado'),
    ).toBeInTheDocument();
    expect(screen.queryByText('EDITAR VEHICULO PAGE')).not.toBeInTheDocument();
  });

  test('Eliminar el vehículo con lavado activo muestra el aviso y no abre la confirmación', async () => {
    const user = userEvent.setup();
    lavadosVehiculo = [{ datosEstado: { descripcionEstado: 'Lavando' } }];
    renderPage();

    const card = await screen.findByTestId('vehiculo-card');
    await user.click(within(card).getByRole('button', { name: 'Eliminar' }));

    expect(
      await screen.findByText('Edicion / Eliminacion cancelada...Vehiculo en estado de Lavado'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ACEPTAR' })).not.toBeInTheDocument();
  });

  test('Editar del cliente con un vehículo en lavado activo muestra el aviso y no navega', async () => {
    const user = userEvent.setup();
    vehiculosCliente = [{ codigoVehi: 9 }];
    lavadosVehiculo = [{ datosEstado: { descripcionEstado: 'Terminado' } }];
    renderPage();

    const card = await screen.findByTestId('cliente-card');
    await user.click(within(card).getByRole('button', { name: 'Editar' }));

    expect(
      await screen.findByText('Edicion / Eliminacion cancelada...Vehiculo en estado de Lavado'),
    ).toBeInTheDocument();
    expect(screen.queryByText('EDITAR CLIENTE PAGE')).not.toBeInTheDocument();
  });

  test('Eliminar el cliente con un vehículo en lavado activo muestra el aviso y no abre la confirmación', async () => {
    const user = userEvent.setup();
    vehiculosCliente = [{ codigoVehi: 9 }];
    lavadosVehiculo = [{ datosEstado: { descripcionEstado: 'En Espera' } }];
    renderPage();

    const card = await screen.findByTestId('cliente-card');
    await user.click(within(card).getByRole('button', { name: 'Eliminar' }));

    expect(
      await screen.findByText('Edicion / Eliminacion cancelada...Vehiculo en estado de Lavado'),
    ).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ACEPTAR' })).not.toBeInTheDocument();
  });

  test('ACEPTAR con 409 muestra el aviso y no navega', async () => {
    const user = userEvent.setup();
    deleteStatus = 409;
    renderPage();

    const card = await screen.findByTestId('vehiculo-card');
    await user.click(within(card).getByRole('button', { name: 'Eliminar' }));
    await user.click(screen.getByRole('button', { name: 'ACEPTAR' }));

    expect(
      await screen.findByText('Edicion / Eliminacion cancelada...Vehiculo en estado de Lavado'),
    ).toBeInTheDocument();
    expect(screen.queryByText('VEHICULOS PAGE')).not.toBeInTheDocument();
  });
});
