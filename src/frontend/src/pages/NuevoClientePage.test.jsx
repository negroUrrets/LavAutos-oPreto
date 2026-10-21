import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import NuevoClientePage from './NuevoClientePage.jsx';

let sessionOk = true;
let categorias = [];
let marcas = [];
let modelos = [];
let searchResult = [];

function mockFetch(url) {
  if (url === '/api/auth/session') {
    return Promise.resolve({ ok: sessionOk, status: sessionOk ? 200 : 401 });
  }
  if (url === '/api/categorias-vehiculo') {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: categorias }) });
  }
  if (url === '/api/marcas-vehiculo') {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: marcas }) });
  }
  if (url === '/api/modelos-vehiculo') {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: modelos }) });
  }
  if (typeof url === 'string' && url.startsWith('/api/clientes?buscar=')) {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: searchResult }) });
  }
  if (url === '/api/clientes') {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: { codigoPersona: 5 } }) });
  }
  if (url === '/api/vehiculos') {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: { codigoVehi: 9 } }) });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) });
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/clientes/nuevo']}>
      <Routes>
        <Route path="/clientes/nuevo" element={<NuevoClientePage />} />
        <Route path="/clientes" element={<div>CLIENTES PAGE</div>} />
        <Route path="/login" element={<div>LOGIN PAGE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

async function fillForm(user, overrides = {}) {
  const values = {
    dni: '12345678',
    nombre: 'Juan',
    apellido: 'Perez',
    celular: '5551234',
    email: 'juan@example.com',
    patente: 'AA123BB',
    ...overrides,
  };

  await user.type(screen.getByLabelText('DNI'), values.dni);
  await user.type(screen.getByLabelText('Nombre'), values.nombre);
  await user.type(screen.getByLabelText('Apellido'), values.apellido);
  await user.type(screen.getByLabelText('Celular'), values.celular);
  await user.type(screen.getByLabelText('e-mail'), values.email);
  await user.selectOptions(screen.getByLabelText('Tipo Vehiculo'), '1');
  await user.selectOptions(screen.getByLabelText('Marca Vehiculo'), '10');
  await user.selectOptions(screen.getByLabelText('Modelo Vehiculo'), '100');
  await user.type(screen.getByLabelText('Patente'), values.patente);
}

beforeEach(() => {
  sessionOk = true;
  categorias = [{ codigoCategoriaVehi: 1, categoriaVehi: 'Auto' }];
  marcas = [{ codigoMarcaVehi: 10, marcaVehi: 'Fiat', categoriaVehi: 1 }];
  modelos = [{ codigoModeloVehi: 100, modeloVehi: 'Uno', marcaVehi: 10 }];
  searchResult = [];
  globalThis.fetch = vi.fn(mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('NuevoClientePage', () => {
  test('muestra el título, los campos y los botones', async () => {
    renderPage();

    expect(await screen.findByText('Nuevo Cliente')).toBeInTheDocument();
    expect(screen.getByLabelText('DNI')).toBeInTheDocument();
    expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
    expect(screen.getByLabelText('Apellido')).toBeInTheDocument();
    expect(screen.getByLabelText('Celular')).toBeInTheDocument();
    expect(screen.getByLabelText('e-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo Vehiculo')).toBeInTheDocument();
    expect(screen.getByLabelText('Marca Vehiculo')).toBeInTheDocument();
    expect(screen.getByLabelText('Modelo Vehiculo')).toBeInTheDocument();
    expect(screen.getByLabelText('Patente')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  test('con un campo vacío advierte y no registra', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nuevo Cliente');

    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(globalThis.fetch).not.toHaveBeenCalledWith('/api/clientes', expect.anything());
  });

  test('las marcas dependen del tipo y los modelos de la marca', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nuevo Cliente');

    expect(screen.queryByRole('option', { name: 'Fiat' })).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Tipo Vehiculo'), '1');
    expect(screen.getByRole('option', { name: 'Fiat' })).toBeInTheDocument();

    expect(screen.queryByRole('option', { name: 'Uno' })).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Marca Vehiculo'), '10');
    expect(screen.getByRole('option', { name: 'Uno' })).toBeInTheDocument();
  });

  test('con dni ya registrado muestra el popup y limpia el formulario', async () => {
    searchResult = [{ codigoPersona: 1, dni: 12345678, nombre: 'Juan' }];
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nuevo Cliente');

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(await screen.findByText('Ese cliente ya se encuentra registrado.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    expect(screen.getByLabelText('DNI')).toHaveValue('');
    expect(globalThis.fetch).not.toHaveBeenCalledWith('/api/clientes', expect.anything());
  });

  test('registra el cliente y el vehículo y muestra Bienvenido', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nuevo Cliente');

    await fillForm(user);
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(await screen.findByText('Bienvenido Juan')).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/clientes',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/vehiculos',
      expect.objectContaining({ method: 'POST' }),
    );

    await user.click(screen.getByRole('button', { name: 'Aceptar' }));
    expect(await screen.findByText('CLIENTES PAGE')).toBeInTheDocument();
  });

  test('Cancelar navega a la página de Clientes', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nuevo Cliente');

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(await screen.findByText('CLIENTES PAGE')).toBeInTheDocument();
  });

  test('la patente se formatea mientras se tipea', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nuevo Cliente');

    await user.type(screen.getByLabelText('Patente'), 'ab254mc');

    expect(screen.getByLabelText('Patente')).toHaveValue('AB-254-MC');
  });

  test('DNI y Celular aceptan solo números', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nuevo Cliente');

    await user.type(screen.getByLabelText('DNI'), '12a3');
    await user.type(screen.getByLabelText('Celular'), '55b5');

    expect(screen.getByLabelText('DNI')).toHaveValue('123');
    expect(screen.getByLabelText('Celular')).toHaveValue('555');
  });

  test('Nombre y Apellido aceptan solo letras (con acentos y ñ)', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nuevo Cliente');

    await user.type(screen.getByLabelText('Nombre'), 'Muñoz1');
    await user.type(screen.getByLabelText('Apellido'), 'Pérez2');

    expect(screen.getByLabelText('Nombre')).toHaveValue('Muñoz');
    expect(screen.getByLabelText('Apellido')).toHaveValue('Pérez');
  });

  test('con e-mail inválido advierte y no registra', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nuevo Cliente');

    await fillForm(user, { email: 'juan@' });
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(screen.getByRole('alert')).toHaveTextContent('El e-mail no tiene un formato válido.');
    expect(globalThis.fetch).not.toHaveBeenCalledWith('/api/clientes', expect.anything());
  });

  test('con patente inválida advierte y no registra', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nuevo Cliente');

    await fillForm(user, { patente: 'AB254M' });
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'La patente debe tener el formato AA-123-AA.',
    );
    expect(globalThis.fetch).not.toHaveBeenCalledWith('/api/clientes', expect.anything());
  });

  test('sin sesión válida redirige al login', async () => {
    sessionOk = false;
    renderPage();

    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();
  });
});
