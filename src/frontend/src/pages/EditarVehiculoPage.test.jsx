import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import EditarVehiculoPage from './EditarVehiculoPage.jsx';

let sessionOk = true;
let categorias = [];
let marcas = [];
let modelos = [];
let vehiculos = [];
let putOk = true;
let putBody = null;
let vehiculoActual = null;

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
  if (url === '/api/vehiculos/9' && options.method === 'PUT') {
    putBody = JSON.parse(options.body);
    return Promise.resolve(
      putOk
        ? { ok: true, json: () => Promise.resolve({ data: { ...vehiculoActual, ...putBody } }) }
        : { ok: false, status: 400 },
    );
  }
  if (url === '/api/vehiculos/9') {
    return data(vehiculoActual);
  }
  if (url === '/api/vehiculos') {
    return data(vehiculos);
  }
  return data([]);
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/clientes/5/vehiculos/9/editar']}>
      <Routes>
        <Route path="/clientes/:id/vehiculos/:vehiculoId/editar" element={<EditarVehiculoPage />} />
        <Route path="/clientes/:id/info" element={<div>INFO PAGE</div>} />
        <Route path="/login" element={<div>LOGIN PAGE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  sessionOk = true;
  categorias = [{ codigoCategoriaVehi: 1, categoriaVehi: 'Sedan' }];
  marcas = [{ codigoMarcaVehi: 10, marcaVehi: 'Renault', categoriaVehi: 1 }];
  modelos = [{ codigoModeloVehi: 100, modeloVehi: 'Fuego', marcaVehi: 10 }];
  vehiculos = [{ codigoVehi: 9, patenteVehi: 'AC-123-DF' }];
  putOk = true;
  putBody = null;
  vehiculoActual = {
    codigoVehi: 9,
    patenteVehi: 'AC-123-DF',
    cliente: 5,
    modelo: {
      codigoModeloVehi: 100,
      modeloVehi: 'Fuego',
      marca: {
        codigoMarcaVehi: 10,
        marcaVehi: 'Renault',
        categoria: { codigoCategoriaVehi: 1, categoriaVehi: 'Sedan' },
      },
    },
  };
  globalThis.fetch = vi.fn(mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('EditarVehiculoPage', () => {
  test('precarga los datos del vehículo', async () => {
    renderPage();

    expect(await screen.findByText('Editar Vehiculo')).toBeInTheDocument();
    await screen.findByRole('option', { name: 'Sedan' });
    expect(screen.getByLabelText('Vehiculo')).toHaveValue('1');
    expect(screen.getByLabelText('Marca')).toHaveValue('10');
    expect(screen.getByLabelText('Modelo')).toHaveValue('100');
    expect(screen.getByLabelText('Patente')).toHaveValue('AC-123-DF');
    expect(screen.getByRole('button', { name: 'Registrar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  test('sin sesión válida redirige al login', async () => {
    sessionOk = false;
    renderPage();

    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();
  });

  test('las marcas dependen del vehículo y los modelos de la marca', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Editar Vehiculo');
    await screen.findByRole('option', { name: 'Renault' });

    expect(screen.getByRole('option', { name: 'Fuego' })).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Vehiculo'), '');
    expect(screen.queryByRole('option', { name: 'Renault' })).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Vehiculo'), '1');
    expect(screen.getByRole('option', { name: 'Renault' })).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Marca'), '10');
    expect(screen.getByRole('option', { name: 'Fuego' })).toBeInTheDocument();
  });

  test('con patente inválida advierte y no guarda', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Editar Vehiculo');

    await user.clear(screen.getByLabelText('Patente'));
    await user.type(screen.getByLabelText('Patente'), 'ab254m');
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'La patente debe tener el formato AA-123-AA.',
    );
    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      '/api/vehiculos/9',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  test('con patente de otro vehículo muestra el popup y restablece los datos', async () => {
    vehiculos = [
      { codigoVehi: 9, patenteVehi: 'AC-123-DF' },
      { codigoVehi: 1, patenteVehi: 'AB-123-CD' },
    ];
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Editar Vehiculo');

    await user.clear(screen.getByLabelText('Patente'));
    await user.type(screen.getByLabelText('Patente'), 'ab123cd');
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(await screen.findByText('Error: vehiculo ya registrado')).toBeInTheDocument();
    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      '/api/vehiculos/9',
      expect.objectContaining({ method: 'PUT' }),
    );

    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    expect(screen.getByLabelText('Patente')).toHaveValue('AC-123-DF');
  });

  test('registra la edición, muestra el popup y vuelve a la información', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Editar Vehiculo');

    await user.clear(screen.getByLabelText('Patente'));
    await user.type(screen.getByLabelText('Patente'), 'ab123ef');
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(
      await screen.findByText('El vehiculo se edito correctamente.'),
    ).toBeInTheDocument();
    expect(putBody).toEqual({
      patenteVehi: 'AB-123-EF',
      estadoVehi: true,
      cliente: '5',
      modeloVehi: '100',
    });

    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('INFO PAGE')).toBeInTheDocument();
  });

  test('acepta la propia patente sin marcarla como duplicada', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Editar Vehiculo');

    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(
      await screen.findByText('El vehiculo se edito correctamente.'),
    ).toBeInTheDocument();
    expect(putBody).toEqual({
      patenteVehi: 'AC-123-DF',
      estadoVehi: true,
      cliente: '5',
      modeloVehi: '100',
    });
  });

  test('ante un error de guardado advierte y no navega', async () => {
    putOk = false;
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Editar Vehiculo');

    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo guardar la edición.');
    expect(screen.queryByText('INFO PAGE')).not.toBeInTheDocument();
  });

  test('Cancelar vuelve a la información sin guardar', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Editar Vehiculo');

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(await screen.findByText('INFO PAGE')).toBeInTheDocument();
    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      '/api/vehiculos/9',
      expect.objectContaining({ method: 'PUT' }),
    );
  });
});
