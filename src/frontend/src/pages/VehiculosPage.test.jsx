import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import VehiculosPage from './VehiculosPage.jsx';

let sessionOk = true;
let vehiculos = [];

function baseVehiculos() {
  return [
    {
      codigoVehi: 1,
      patenteVehi: 'AB-122-FC',
      modelo: {
        modeloVehi: 'Picasso',
        marca: { marcaVehi: 'Citroen', categoria: { categoriaVehi: 'Automovil' } },
      },
    },
    {
      codigoVehi: 2,
      patenteVehi: 'XY-999-ZZ',
      modelo: {
        modeloVehi: 'Corolla',
        marca: { marcaVehi: 'Toyota', categoria: { categoriaVehi: 'Automovil' } },
      },
    },
  ];
}

function mockFetch(url) {
  if (url === '/api/auth/session') {
    return Promise.resolve({ ok: sessionOk, status: sessionOk ? 200 : 401 });
  }
  if (url === '/api/vehiculos') {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: vehiculos }) });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) });
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/vehiculos']}>
      <Routes>
        <Route path="/vehiculos" element={<VehiculosPage />} />
        <Route path="/vehiculos/:vehiculoId/info" element={<div>VEHICULO INFO PAGE</div>} />
        <Route path="/clientes" element={<div>CLIENTES PAGE</div>} />
        <Route path="/home" element={<div>HOME PAGE</div>} />
        <Route path="/login" element={<div>LOGIN PAGE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  sessionOk = true;
  vehiculos = baseVehiculos();
  globalThis.fetch = vi.fn(mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('VehiculosPage', () => {
  test('muestra el pill, el buscador y la tabla', async () => {
    renderPage();

    expect(await screen.findByLabelText('Buscar vehiculos')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Patente...')).toBeInTheDocument();
    expect(screen.getByText('VEHICULOS')).toBeInTheDocument();
    expect(screen.getByText('TIPO')).toBeInTheDocument();
    expect(screen.getByText('MARCA')).toBeInTheDocument();
    expect(screen.getByText('MODELO')).toBeInTheDocument();
    expect(screen.getByText('PATENTE')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '← Volver' })).toBeInTheDocument();
  });

  test('sin sesión válida redirige al login', async () => {
    sessionOk = false;
    renderPage();

    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();
  });

  test('sin parámetros no muestra vehículos', async () => {
    renderPage();
    await screen.findByLabelText('Buscar vehiculos');

    expect(screen.queryAllByTestId('vehiculo-row')).toHaveLength(0);
    expect(screen.getByText('Busqueda sin resultados ...')).toBeInTheDocument();
  });

  test('busca por parte de la patente', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Buscar vehiculos');

    await user.type(screen.getByLabelText('Buscar vehiculos'), '122');

    expect(await screen.findByText('AB-122-FC')).toBeInTheDocument();
    expect(screen.queryByText('XY-999-ZZ')).not.toBeInTheDocument();
  });

  test('busca por parte del modelo', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Buscar vehiculos');

    await user.type(screen.getByLabelText('Buscar vehiculos'), 'corolla');

    expect(await screen.findByText('XY-999-ZZ')).toBeInTheDocument();
    expect(screen.queryByText('AB-122-FC')).not.toBeInTheDocument();
  });

  test('sin coincidencias muestra "Busqueda sin resultados ..."', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Buscar vehiculos');

    await user.type(screen.getByLabelText('Buscar vehiculos'), 'zzz');

    expect(screen.getByText('Busqueda sin resultados ...')).toBeInTheDocument();
  });

  test('muestra filas alternadas y un botón + info por fila', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Buscar vehiculos');

    await user.type(screen.getByLabelText('Buscar vehiculos'), 'o');

    const rows = await screen.findAllByTestId('vehiculo-row');
    expect(rows).toHaveLength(2);
    expect(rows[0].style.backgroundColor).toContain('244');
    expect(rows[1].style.backgroundColor).toContain('180');
    expect(screen.getAllByRole('button', { name: '+ info' })).toHaveLength(2);
  });

  test('+ info navega a la página del vehículo', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Buscar vehiculos');

    await user.type(screen.getByLabelText('Buscar vehiculos'), '122');
    await user.click(await screen.findByRole('button', { name: '+ info' }));

    expect(await screen.findByText('VEHICULO INFO PAGE')).toBeInTheDocument();
  });

  test('+ Vehiculo navega a la página de Clientes', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Buscar vehiculos');

    await user.click(screen.getByRole('button', { name: '+ Vehiculo' }));

    expect(await screen.findByText('CLIENTES PAGE')).toBeInTheDocument();
  });
  test('Volver navega al home', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Buscar vehiculos');

    await user.click(screen.getByRole('button', { name: '← Volver' }));

    expect(await screen.findByText('HOME PAGE')).toBeInTheDocument();
  });
});
