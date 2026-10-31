import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import EditarLavadoPage from './EditarLavadoPage.jsx';

const ESTADOS = [
  { codigoEstado: 1, descripcionEstado: 'En Espera' },
  { codigoEstado: 2, descripcionEstado: 'Lavando' },
  { codigoEstado: 3, descripcionEstado: 'Terminado' },
  { codigoEstado: 4, descripcionEstado: 'Entregado' },
];

let sessionOk = true;
let lavado = null;
let utilerias = [];
let categorias = [];
let putLavadoBody = null;
let putLavadoOk = true;

function data(value) {
  return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: value }) });
}

function mockFetch(url, options = {}) {
  if (url === '/api/auth/session') {
    return Promise.resolve({
      ok: sessionOk,
      status: sessionOk ? 200 : 401,
      json: () => Promise.resolve({ data: sessionOk ? { codigoLogin: 1 } : null }),
    });
  }
  if (url === '/api/lavados/7' && options.method === 'PUT') {
    putLavadoBody = JSON.parse(options.body);
    return putLavadoOk
      ? data({ codigoLavado: 7 })
      : Promise.resolve({ ok: false, status: 400, json: () => Promise.resolve({}) });
  }
  if (url === '/api/lavados/7') {
    return lavado
      ? data(lavado)
      : Promise.resolve({ ok: false, status: 404, json: () => Promise.resolve({ data: null }) });
  }
  if (url === '/api/utilerias') {
    return data(utilerias);
  }
  if (url === '/api/categorias-lavado') {
    return data(categorias);
  }
  if (url === '/api/estados-lavado') {
    return data(ESTADOS);
  }
  if (typeof url === 'string' && url.startsWith('/api/utilerias/')) {
    return data({ estadoUtileria: true });
  }
  return data([]);
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/lavados/7/editar']}>
      <Routes>
        <Route path="/lavados/:lavadoId/editar" element={<EditarLavadoPage />} />
        <Route path="/lavados" element={<div>LAVADOS PAGE</div>} />
        <Route path="/login" element={<div>LOGIN PAGE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  sessionOk = true;
  putLavadoBody = null;
  putLavadoOk = true;
  lavado = {
    codigoLavado: 7,
    categoriaLavado: 10,
    estado: 1,
    detallesLavado: 'Lavado inicial',
    vehiculo: { patenteVehi: 'AC-125-BF' },
  };
  utilerias = [
    { codigoUtileria: 1, descripcionUtileria: 'Auxilio', estadoUtileria: true },
    { codigoUtileria: 2, descripcionUtileria: 'Balizas', estadoUtileria: false },
  ];
  categorias = [
    { codigoCategoriaLavado: 10, descripcionLavado: 'Basico' },
    { codigoCategoriaLavado: 11, descripcionLavado: 'Completo' },
  ];
  globalThis.fetch = vi.fn(mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('EditarLavadoPage', () => {
  test('muestra el titulo con la patente y precarga los datos del lavado', async () => {
    renderPage();

    expect(
      await screen.findByRole('heading', { name: 'Editar Lavado: AC-125-BF' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Estado...')).toHaveValue('1');
    expect(screen.getByLabelText('Detalles')).toHaveValue('Lavado inicial');
    expect(screen.getByRole('checkbox', { name: 'Auxilio' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Balizas' })).not.toBeChecked();
    expect(screen.getByRole('switch', { name: 'Basico' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('switch', { name: 'Completo' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  test('sin sesion valida redirige al login', async () => {
    sessionOk = false;
    renderPage();

    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();
  });

  test('un lavado inexistente vuelve a la pagina de Lavados', async () => {
    lavado = null;
    renderPage();

    expect(await screen.findByText('LAVADOS PAGE')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Registrar' })).not.toBeInTheDocument();
  });

  test('tildar una utileria actualiza su estado', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('heading', { name: 'Editar Lavado: AC-125-BF' });

    await user.click(screen.getByRole('checkbox', { name: 'Balizas' }));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/utilerias/2',
      expect.objectContaining({ method: 'PUT' }),
    );
    expect(screen.getByRole('checkbox', { name: 'Balizas' })).toBeChecked();
  });

  test('destildar una utileria actualiza su estado', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('heading', { name: 'Editar Lavado: AC-125-BF' });

    await user.click(screen.getByRole('checkbox', { name: 'Auxilio' }));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/utilerias/1',
      expect.objectContaining({ method: 'PUT' }),
    );
    expect(screen.getByRole('checkbox', { name: 'Auxilio' })).not.toBeChecked();
  });

  test('solo un toggle de categoria queda encendido', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('heading', { name: 'Editar Lavado: AC-125-BF' });

    await user.click(screen.getByRole('switch', { name: 'Completo' }));

    expect(screen.getByRole('switch', { name: 'Completo' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    expect(screen.getByRole('switch', { name: 'Basico' })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });

  test('edita el campo Detalles', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('heading', { name: 'Editar Lavado: AC-125-BF' });

    const detalles = screen.getByLabelText('Detalles');
    await user.clear(detalles);
    await user.type(detalles, 'Actualizado');

    expect(detalles).toHaveValue('Actualizado');
  });

  test('el combobox ofrece todos los estados y permite cambiarlo', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('heading', { name: 'Editar Lavado: AC-125-BF' });

    const combo = screen.getByLabelText('Estado...');
    expect(combo.querySelectorAll('option')).toHaveLength(5);

    await user.selectOptions(combo, '3');

    expect(combo).toHaveValue('3');
  });

  test('Registrar guarda los cambios y muestra el popup de exito', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('heading', { name: 'Editar Lavado: AC-125-BF' });

    const detalles = screen.getByLabelText('Detalles');
    await user.clear(detalles);
    await user.type(detalles, 'Actualizado');
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(await screen.findByText('Lavado editado exitosamente')).toBeInTheDocument();
    expect(putLavadoBody).toEqual({
      categoriaLavado: '10',
      estado: '1',
      utileria: '1',
      detallesLavado: 'Actualizado',
    });

    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    expect(await screen.findByText('LAVADOS PAGE')).toBeInTheDocument();
  });

  test('Registrar exige al menos una utileria', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('heading', { name: 'Editar Lavado: AC-125-BF' });

    await user.click(screen.getByRole('checkbox', { name: 'Auxilio' }));
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Seleccione al menos una utileria.');
    expect(putLavadoBody).toBeNull();
  });

  test('un error al guardar permanece en la pagina sin popup de exito', async () => {
    const user = userEvent.setup();
    putLavadoOk = false;
    renderPage();
    await screen.findByRole('heading', { name: 'Editar Lavado: AC-125-BF' });

    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudo editar el lavado.');
    expect(screen.queryByText('Lavado editado exitosamente')).not.toBeInTheDocument();
  });

  test('Cancelar vuelve a la lista sin guardar', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByRole('heading', { name: 'Editar Lavado: AC-125-BF' });

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(await screen.findByText('LAVADOS PAGE')).toBeInTheDocument();
    expect(putLavadoBody).toBeNull();
  });
});
