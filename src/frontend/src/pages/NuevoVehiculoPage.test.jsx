import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import NuevoVehiculoPage from './NuevoVehiculoPage.jsx';

let sessionOk = true;
let categorias = [];
let marcas = [];
let modelos = [];
let vehiculos = [];
let postOk = true;
let postBody = null;

function data(value) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: value }) });
}

function mockFetch(url, options = {}) {
  if (url === '/api/auth/session') {
    return Promise.resolve({ ok: sessionOk, status: sessionOk ? 200 : 401 });
  }
  if (url === '/api/categorias-vehiculo') {
    return data(categorias);
  }
  if (url === '/api/marcas-vehiculo') {
    return data(marcas);
  }
  if (url === '/api/modelos-vehiculo') {
    return data(modelos);
  }
  if (url === '/api/vehiculos' && options.method === 'POST') {
    postBody = JSON.parse(options.body);
    return Promise.resolve(
      postOk
        ? { ok: true, status: 201, json: () => Promise.resolve({ data: { codigoVehi: 9 } }) }
        : { ok: false, status: 400 },
    );
  }
  if (url === '/api/vehiculos') {
    return data(vehiculos);
  }
  return data([]);
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/clientes/5/vehiculos/nuevo']}>
      <Routes>
        <Route path="/clientes/:id/vehiculos/nuevo" element={<NuevoVehiculoPage />} />
        <Route path="/clientes/:id/info" element={<div>CLIENTE INFO PAGE</div>} />
        <Route path="/login" element={<div>LOGIN PAGE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fillForm(user, overrides = {}) {
  const values = { patente: 'AA123BB', ...overrides };

  await user.selectOptions(screen.getByLabelText('Vehiculo'), '1');
  await user.selectOptions(screen.getByLabelText('Marca'), '10');
  await user.selectOptions(screen.getByLabelText('Modelo'), '100');
  await user.type(screen.getByLabelText('Patente'), values.patente);
}

beforeEach(() => {
  sessionOk = true;
  categorias = [{ codigoCategoriaVehi: 1, categoriaVehi: 'Auto' }];
  marcas = [{ codigoMarcaVehi: 10, marcaVehi: 'Fiat', categoriaVehi: 1 }];
  modelos = [{ codigoModeloVehi: 100, modeloVehi: 'Uno', marcaVehi: 10 }];
  vehiculos = [];
  postOk = true;
  postBody = null;
  globalThis.fetch = vi.fn(mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('NuevoVehiculoPage', () => {
  test('muestra el título, los campos y los botones', async () => {
    renderPage();

    expect(await screen.findByText('Nuevo Vehiculo')).toBeInTheDocument();
    expect(screen.getByLabelText('Vehiculo')).toBeInTheDocument();
    expect(screen.getByLabelText('Marca')).toBeInTheDocument();
    expect(screen.getByLabelText('Modelo')).toBeInTheDocument();
    expect(screen.getByLabelText('Patente')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  test('las marcas dependen del vehículo y los modelos de la marca', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nuevo Vehiculo');

    expect(screen.queryByRole('option', { name: 'Fiat' })).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Vehiculo'), '1');
    expect(screen.getByRole('option', { name: 'Fiat' })).toBeInTheDocument();

    expect(screen.queryByRole('option', { name: 'Uno' })).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Marca'), '10');
    expect(screen.getByRole('option', { name: 'Uno' })).toBeInTheDocument();
  });

  test('con un campo vacío advierte y no registra', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nuevo Vehiculo');

    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Todos los campos son obligatorios.');
    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      '/api/vehiculos',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  test('con patente inválida advierte y no registra', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nuevo Vehiculo');

    await fillForm(user, { patente: 'AB254M' });
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'La patente debe tener el formato AA-123-AA.',
    );
    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      '/api/vehiculos',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  test('con patente ya registrada muestra el popup y limpia el formulario', async () => {
    vehiculos = [{ codigoVehi: 1, patenteVehi: 'AA-123-BB' }];
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nuevo Vehiculo');

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(await screen.findByText('Vehiculo ya registrado :/')).toBeInTheDocument();
    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      '/api/vehiculos',
      expect.objectContaining({ method: 'POST' }),
    );

    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    expect(screen.getByLabelText('Vehiculo')).toHaveValue('');
    expect(screen.getByLabelText('Marca')).toHaveValue('');
    expect(screen.getByLabelText('Modelo')).toHaveValue('');
    expect(screen.getByLabelText('Patente')).toHaveValue('');
  });

  test('registra el vehículo, muestra el popup y vuelve a la información', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nuevo Vehiculo');

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(await screen.findByText('Vehiculo agregado satisfactoriamente.')).toBeInTheDocument();
    expect(postBody).toEqual({
      patenteVehi: 'AA-123-BB',
      estadoVehi: true,
      cliente: '5',
      modeloVehi: '100',
    });

    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('CLIENTE INFO PAGE')).toBeInTheDocument();
  });

  test('ante un error de registro advierte y no navega', async () => {
    postOk = false;
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nuevo Vehiculo');

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No se pudo registrar el vehiculo.',
    );
    expect(screen.queryByText('CLIENTE INFO PAGE')).not.toBeInTheDocument();
  });

  test('Cancelar vuelve a la información del cliente sin registrar', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nuevo Vehiculo');

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(await screen.findByText('CLIENTE INFO PAGE')).toBeInTheDocument();
    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      '/api/vehiculos',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  test('la patente se formatea mientras se tipea', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nuevo Vehiculo');

    await user.type(screen.getByLabelText('Patente'), 'ab254mc');

    expect(screen.getByLabelText('Patente')).toHaveValue('AB-254-MC');
  });

  test('sin sesión válida redirige al login', async () => {
    sessionOk = false;
    renderPage();

    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();
  });
});
