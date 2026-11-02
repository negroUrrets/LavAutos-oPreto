import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import EditarClientePage from './EditarClientePage.jsx';
import ClienteInfoPage from './ClienteInfoPage.jsx';

let sessionOk = true;
let searchDuplicado = [];
let putError = null;
let clienteActual = {
  codigoPersona: 5,
  dni: 28853432,
  nombre: 'Juan',
  apellido: 'Perez',
  celular: 555,
  email: 'juan@gmail.com',
};

function mockFetch(url, options = {}) {
  if (url === '/api/auth/session') {
    return Promise.resolve({ ok: sessionOk, status: sessionOk ? 200 : 401 });
  }
  if (url === '/api/clientes/5' && options.method === 'PUT') {
    if (putError) {
      return Promise.resolve({
        ok: false,
        status: putError.status,
        json: () => Promise.resolve({ success: false, error: { message: putError.message } }),
      });
    }
    clienteActual = { ...clienteActual, ...JSON.parse(options.body) };
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: clienteActual }) });
  }
  if (url === '/api/clientes/5') {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: clienteActual }) });
  }
  if (typeof url === 'string' && url.startsWith('/api/clientes?buscar=')) {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: searchDuplicado }) });
  }
  if (url === '/api/vehiculos?cliente=5') {
    return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) });
}

function renderPage({ realInfo = false } = {}) {
  return render(
    <MemoryRouter initialEntries={['/clientes/5/editar']}>
      <Routes>
        <Route path="/clientes/:id/editar" element={<EditarClientePage />} />
        <Route
          path="/clientes/:id/info"
          element={realInfo ? <ClienteInfoPage /> : <div>INFO PAGE</div>}
        />
        <Route path="/login" element={<div>LOGIN PAGE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  sessionOk = true;
  searchDuplicado = [];
  putError = null;
  clienteActual = {
    codigoPersona: 5,
    dni: 28853432,
    nombre: 'Juan',
    apellido: 'Perez',
    celular: 555,
    email: 'juan@gmail.com',
  };
  globalThis.fetch = vi.fn(mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('EditarClientePage', () => {
  test('precarga los datos del cliente en el formulario', async () => {
    renderPage();

    expect(await screen.findByText('Editar Cliente')).toBeInTheDocument();
    expect(screen.getByLabelText('DNI')).toHaveValue('28853432');
    expect(screen.getByLabelText('Nombre')).toHaveValue('Juan');
    expect(screen.getByLabelText('Apellido')).toHaveValue('Perez');
    expect(screen.getByLabelText('Celular')).toHaveValue('555');
    expect(screen.getByLabelText('e-m@il')).toHaveValue('juan@gmail.com');
  });

  test('sin sesión válida redirige al login', async () => {
    sessionOk = false;
    renderPage();

    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();
  });

  test('mantiene los tipos de datos (solo números)', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Editar Cliente');

    await user.clear(screen.getByLabelText('DNI'));
    await user.type(screen.getByLabelText('DNI'), '12a3');

    expect(screen.getByLabelText('DNI')).toHaveValue('123');
  });

  test('con e-mail inválido advierte y no guarda', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Editar Cliente');

    await user.clear(screen.getByLabelText('e-m@il'));
    await user.type(screen.getByLabelText('e-m@il'), 'juan@');
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(screen.getByRole('alert')).toHaveTextContent('El e-mail no tiene un formato válido.');
    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      '/api/clientes/5',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  test('Registrar guarda, muestra el popup y vuelve a la información', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Editar Cliente');

    await user.clear(screen.getByLabelText('Nombre'));
    await user.type(screen.getByLabelText('Nombre'), 'Editado');
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(
      await screen.findByText('La edición de datos se efectuó satisfactoriamente.'),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    expect(await screen.findByText('INFO PAGE')).toBeInTheDocument();
  });

  test('Cancelar vuelve a la información sin guardar', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Editar Cliente');

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(await screen.findByText('INFO PAGE')).toBeInTheDocument();
    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      '/api/clientes/5',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  test('con el dni de otro cliente muestra el popup y restablece los datos originales', async () => {
    searchDuplicado = [{ codigoPersona: 99, dni: 28853432 }];
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Editar Cliente');

    await user.clear(screen.getByLabelText('Nombre'));
    await user.type(screen.getByLabelText('Nombre'), 'Otro');
    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(await screen.findByText('Ese cliente ya se encuentra registrado.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    expect(screen.getByLabelText('Nombre')).toHaveValue('Juan');
    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      '/api/clientes/5',
      expect.objectContaining({ method: 'PUT' }),
    );
  });

  test('tras editar y volver, la información muestra los datos actualizados', async () => {
    const user = userEvent.setup();
    renderPage({ realInfo: true });
    await screen.findByText('Editar Cliente');

    await user.clear(screen.getByLabelText('Nombre'));
    await user.type(screen.getByLabelText('Nombre'), 'Editado');
    await user.click(screen.getByRole('button', { name: 'Registrar' }));
    await screen.findByText('La edición de datos se efectuó satisfactoriamente.');
    await user.click(screen.getByRole('button', { name: 'Aceptar' }));

    expect(await screen.findByText('Editado')).toBeInTheDocument();
  });

  test('muestra el mensaje del backend al rechazar un dato duplicado', async () => {
    putError = { status: 409, message: 'El DNI ya esta registrado.' };
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Editar Cliente');

    await user.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('El DNI ya esta registrado.');
  });
});
