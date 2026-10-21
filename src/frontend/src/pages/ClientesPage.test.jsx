import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import ClientesPage from './ClientesPage.jsx';

let searchResults = [];
let sessionOk = true;

function mockFetch(url) {
  if (typeof url === 'string' && url.startsWith('/api/clientes?buscar=')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ success: true, data: searchResults }),
    });
  }
  if (url === '/api/auth/session') {
    return Promise.resolve({ ok: sessionOk, status: sessionOk ? 200 : 401 });
  }
  return Promise.resolve({ ok: true, status: 204 });
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/clientes']}>
      <Routes>
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/clientes/nuevo" element={<div>NUEVO CLIENTE PAGE</div>} />
        <Route path="/clientes/:id/info" element={<div>CLIENTE INFO PAGE</div>} />
        <Route path="/login" element={<div>LOGIN PAGE</div>} />
        <Route path="/home" element={<div>HOME PAGE</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  searchResults = [];
  sessionOk = true;
  globalThis.fetch = vi.fn(mockFetch);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ClientesPage', () => {
  test('muestra la etiqueta CLIENTES, el buscador, + CLIENTE y Volver', async () => {
    renderPage();

    expect(await screen.findByLabelText('Buscar clientes')).toBeInTheDocument();
    expect(screen.getByText('CLIENTES')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ CLIENTE' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '←' })).toBeInTheDocument();
  });

  test('sin sesión válida redirige al login', async () => {
    sessionOk = false;
    renderPage();

    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();
  });

  test('con menos de 4 caracteres no se consulta', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Buscar clientes');

    await user.type(screen.getByLabelText('Buscar clientes'), 'jua');

    expect(globalThis.fetch).not.toHaveBeenCalledWith(
      expect.stringContaining('/api/clientes?buscar='),
      expect.anything(),
    );
  });

  test('con 4 o más caracteres consulta y muestra resultados', async () => {
    searchResults = [
      { codigoPersona: 1, dni: 28853432, nombre: 'JUAN', apellido: 'alvarez', celular: 28853432 },
    ];
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Buscar clientes');

    await user.type(screen.getByLabelText('Buscar clientes'), 'juan');

    expect(await screen.findByText('alvarez')).toBeInTheDocument();
  });

  test('sin coincidencias muestra "Busqueda sin resultados ..."', async () => {
    searchResults = [];
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Buscar clientes');

    await user.type(screen.getByLabelText('Buscar clientes'), 'zzzz');

    expect(await screen.findByText('Busqueda sin resultados ...')).toBeInTheDocument();
  });

  test('muestra filas alternadas y un botón + info por fila', async () => {
    searchResults = [
      { codigoPersona: 1, dni: 111, nombre: 'A', apellido: 'B', celular: 1 },
      { codigoPersona: 2, dni: 222, nombre: 'C', apellido: 'D', celular: 2 },
    ];
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Buscar clientes');

    await user.type(screen.getByLabelText('Buscar clientes'), 'abcd');

    const rows = await screen.findAllByTestId('cliente-row');
    expect(rows).toHaveLength(2);
    expect(rows[0].style.backgroundColor).toContain('244');
    expect(rows[1].style.backgroundColor).toContain('180');
    expect(screen.getAllByRole('button', { name: '+ info' })).toHaveLength(2);
  });

  test('el botón + info navega a la información del cliente', async () => {
    searchResults = [
      { codigoPersona: 5, dni: 28853432, nombre: 'JUAN', apellido: 'alvarez', celular: 28853432 },
    ];
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Buscar clientes');

    await user.type(screen.getByLabelText('Buscar clientes'), 'juan');
    await user.click(await screen.findByRole('button', { name: '+ info' }));

    expect(await screen.findByText('CLIENTE INFO PAGE')).toBeInTheDocument();
  });

  test('el botón + CLIENTE navega a Nuevo Cliente', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Buscar clientes');

    await user.click(screen.getByRole('button', { name: '+ CLIENTE' }));

    expect(await screen.findByText('NUEVO CLIENTE PAGE')).toBeInTheDocument();
  });

  test('Volver navega al home', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Buscar clientes');

    await user.click(screen.getByRole('button', { name: '←' }));

    expect(await screen.findByText('HOME PAGE')).toBeInTheDocument();
  });

  test('el ícono de usuario abre el popup y CERRAR SESION navega al login', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Buscar clientes');

    await user.click(screen.getByRole('button', { name: /usuario/i }));
    await user.click(screen.getByRole('button', { name: 'CERRAR SESION' }));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/auth/logout',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(await screen.findByText('LOGIN PAGE')).toBeInTheDocument();
  });

  test('la X cierra el popup sin cerrar sesión', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByLabelText('Buscar clientes');

    await user.click(screen.getByRole('button', { name: /usuario/i }));
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByRole('button', { name: 'CERRAR SESION' })).not.toBeInTheDocument();
  });
});
