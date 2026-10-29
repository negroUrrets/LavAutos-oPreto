import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import NuevoLavadoPage from './NuevoLavadoPage.jsx';

let sessionOk = true;
let utilerias = [];
let categorias = [];
let estados = [];
let postBody = null;

function data(value) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: value }) });
}

function mockFetch(url, options = {}) {
  if (url === '/api/auth/session') {
    return Promise.resolve({
      ok: sessionOk,
      status: sessionOk ? 200 : 401,
      json: () => Promise.resolve({ data: sessionOk ? { codigoLogin: 3 } : null }),
    });
  }
  if (url === '/api/vehiculos/9') {
    return data({ codigoVehi: 9, patenteVehi: 'AC-125-BF', cliente: 5 });
  }
  if (url === '/api/utilerias') {
    return data(utilerias);
  }
  if (url === '/api/categorias-lavado') {
    return data(categorias);
  }
  if (url === '/api/estados-lavado') {
    return data(estados);
  }
  if (typeof url === 'string' && url.startsWith('/api/utilerias/')) {
    return data({ estadoUtileria: true });
  }
  if (url === '/api/lavados' && options.method === 'POST') {
    postBody = JSON.parse(options.body);
    return data({ codigoLavado: 1 });
  }
  return data([]);
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/clientes/5/vehiculos/9/lavar']}>
      <Routes>
        <Route path="/clientes/:id/vehiculos/:vehiculoId/lavar" element={<NuevoLavadoPage />} />
        <Route path="/clientes/:id/info" element={<div>CLIENTE INFO PAGE</div>} />
        <Route path="/login" element={<div>LOGIN PAGE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  sessionOk = true;
  utilerias = [
    { codigoUtileria: 1, descripcionUtileria: 'Auxilio', estadoUtileria: false },
    { codigoUtileria: 2, descripcionUtileria: 'Balizas', estadoUtileria: false },
  ];
  categorias = [
    { codigoCategoriaLavado: 10, descripcionLavado: 'Basico' },
    { codigoCategoriaLavado: 11, descripcionLavado: 'Completo' },
  ];
  estados = [{ codigoEstado: 20, descripcionEstado: 'En Espera' }];
  postBody = null;
  globalThis.fetch = vi.fn(mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('NuevoLavadoPage', () => {
  test('muestra la patente y los catálogos', async () => {
    renderPage();

    expect(await screen.findByText('AC-125-BF')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Auxilio' })).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Basico' })).toBeInTheDocument();
    expect(screen.getByLabelText('Detalles')).toBeInTheDocument();
    expect(screen.getByLabelText('Estado...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrar Lavado' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  test('sin sesión válida redirige al login', async () => {
    sessionOk = false;
    renderPage();

    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();
  });

  test('sólo un toggle de categoría queda encendido', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('AC-125-BF');

    await user.click(screen.getByRole('switch', { name: 'Basico' }));
    expect(screen.getByRole('switch', { name: 'Basico' })).toHaveAttribute('aria-checked', 'true');

    await user.click(screen.getByRole('switch', { name: 'Completo' }));
    expect(screen.getByRole('switch', { name: 'Completo' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('switch', { name: 'Basico' })).toHaveAttribute('aria-checked', 'false');
  });

  test('tildar una utilería actualiza su estado', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('AC-125-BF');

    await user.click(screen.getByRole('checkbox', { name: 'Auxilio' }));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/utilerias/1',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  test('exige categoría, estado y utilería', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('AC-125-BF');

    await user.click(screen.getByRole('button', { name: 'Registrar Lavado' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Seleccione una categoria.');
    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      '/api/lavados',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  test('registra el lavado con confirmación y vuelve a la información', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('AC-125-BF');

    await user.click(screen.getByRole('checkbox', { name: 'Auxilio' }));
    await user.click(screen.getByRole('switch', { name: 'Basico' }));
    await user.selectOptions(screen.getByLabelText('Estado...'), '20');
    await user.type(screen.getByLabelText('Detalles'), 'Lavado 1');

    await user.click(screen.getByRole('button', { name: 'Registrar Lavado' }));

    expect(
      screen.getByText('¿ Desea registrar el lavado del vehiculo "AC-125-BF" ?'),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'ACEPTAR' }));

    expect(postBody).toEqual({
      vehi: '9',
      categoriaLavado: '10',
      estado: '20',
      utileria: '1',
      detallesLavado: 'Lavado 1',
      login: 3,
    });
    expect(await screen.findByText('CLIENTE INFO PAGE')).toBeInTheDocument();
  });

  test('cancelar en el popup restablece el formulario sin registrar', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('AC-125-BF');

    await user.click(screen.getByRole('checkbox', { name: 'Auxilio' }));
    await user.click(screen.getByRole('switch', { name: 'Basico' }));
    await user.selectOptions(screen.getByLabelText('Estado...'), '20');
    await user.type(screen.getByLabelText('Detalles'), 'algo');

    await user.click(screen.getByRole('button', { name: 'Registrar Lavado' }));
    await user.click(screen.getByRole('button', { name: 'CANCELAR' }));

    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      '/api/lavados',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(screen.getByLabelText('Detalles')).toHaveValue('');
    expect(screen.getByLabelText('Estado...')).toHaveValue('');
    expect(screen.getByRole('switch', { name: 'Basico' })).toHaveAttribute('aria-checked', 'false');
  });

  test('Cancelar vuelve a la información sin registrar', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('AC-125-BF');

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(await screen.findByText('CLIENTE INFO PAGE')).toBeInTheDocument();
  });
});
